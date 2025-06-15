
import { useState, useEffect, useCallback, useRef } from 'react';

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

  const { 
    threshold = 0.1, 
    rootMargin = '0px', 
    once = false,
    delay = 0,
    disabled = false
  } = options;

  const elementRef = useCallback((node: Element | null) => {
    setElement(node);
  }, []);

  useEffect(() => {
    if (!element || disabled) return;

    const observer = new IntersectionObserver(
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
        if (once && isCurrentlyIntersecting) {
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [element, threshold, rootMargin, once, delay, disabled]);

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

// Hook for preloading images
export const useImagePreload = (src: string, enabled = true) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!src || !enabled) return;

    const img = new Image();
    img.onload = () => setLoaded(true);
    img.onerror = () => setError(true);
    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, enabled]);

  return { loaded, error };
};

// Hook for lazy loading with viewport percentage
export const useViewportLazyLoading = (viewportPercentage = 0.1) => {
  return useLazyLoading({
    threshold: viewportPercentage,
    rootMargin: '50px',
    once: true
  });
};
