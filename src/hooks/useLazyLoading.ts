
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

interface UseLazyLoadingOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
  delay?: number;
  disabled?: boolean;
}

export const useLazyLoading = (options: UseLazyLoadingOptions = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const [element, setElement] = useState<Element | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const observerRef = useRef<IntersectionObserver>();

  const { 
    threshold = 0.1, 
    rootMargin = '0px', 
    once = false,
    delay = 0,
    disabled = false
  } = options;

  // Memoize observer options to prevent recreation
  const observerOptions = useMemo(() => ({
    threshold,
    rootMargin
  }), [threshold, rootMargin]);

  const elementRef = useCallback((node: Element | null) => {
    setElement(node);
  }, []);

  useEffect(() => {
    if (!element || disabled) return;

    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        const isCurrentlyIntersecting = entry.isIntersecting;
        
        if (delay > 0) {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          
          timeoutRef.current = setTimeout(() => {
            setIsIntersecting(isCurrentlyIntersecting);
            if (isCurrentlyIntersecting) {
              setHasIntersected(true);
            }
          }, delay);
        } else {
          setIsIntersecting(isCurrentlyIntersecting);
          if (isCurrentlyIntersecting) {
            setHasIntersected(true);
          }
        }

        // If 'once' is true and element has intersected, disconnect observer
        if (once && isCurrentlyIntersecting && observerRef.current) {
          observerRef.current.disconnect();
        }
      },
      observerOptions
    );

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [element, observerOptions, once, delay, disabled]);

  const reset = useCallback(() => {
    setIsIntersecting(false);
    setHasIntersected(false);
  }, []);

  return { 
    isIntersecting: disabled ? true : isIntersecting, 
    hasIntersected: disabled ? true : hasIntersected,
    elementRef,
    reset
  };
};

// Hook for preloading images with better performance
export const useImagePreload = (src: string, enabled = true) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imageRef = useRef<HTMLImageElement>();

  useEffect(() => {
    if (!src || !enabled) return;

    // Reuse existing image element if possible
    if (!imageRef.current) {
      imageRef.current = new Image();
    }

    const img = imageRef.current;
    
    const handleLoad = () => setLoaded(true);
    const handleError = () => setError(true);

    img.addEventListener('load', handleLoad);
    img.addEventListener('error', handleError);
    img.src = src;

    return () => {
      img.removeEventListener('load', handleLoad);
      img.removeEventListener('error', handleError);
    };
  }, [src, enabled]);

  return { loaded, error };
};

// Hook for lazy loading with optimized viewport percentage
export const useViewportLazyLoading = (viewportPercentage = 0.1) => {
  return useLazyLoading({
    threshold: viewportPercentage,
    rootMargin: '50px',
    once: true
  });
};
