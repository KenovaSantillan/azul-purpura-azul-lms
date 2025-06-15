import React, { useMemo } from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  onNavigate?: (href: string) => void;
  maxItems?: number;
  showHome?: boolean;
}

const Breadcrumbs = ({ 
  items: customItems, 
  onNavigate, 
  maxItems = 5,
  showHome = true 
}: BreadcrumbsProps) => {
  const location = useLocation();

  // Auto-generate breadcrumbs from current route if no custom items provided
  const autoItems = useMemo(() => {
    if (customItems) return customItems;

    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    pathSegments.forEach((segment, index) => {
      const href = '/' + pathSegments.slice(0, index + 1).join('/');
      let label = segment.charAt(0).toUpperCase() + segment.slice(1);

      // Customize labels for known routes
      switch (segment) {
        case 'groups':
          label = 'Grupos';
          break;
        case 'students':
          label = 'Estudiantes';
          break;
        case 'tasks':
          label = 'Tareas';
          break;
        case 'announcements':
          label = 'Anuncios';
          break;
        case 'progress':
          label = 'Progreso';
          break;
        case 'library':
          label = 'Biblioteca';
          break;
        case 'admin':
          label = 'Administración';
          break;
        case 'customization':
          label = 'Personalización';
          break;
        default:
          // Keep the capitalized version
          break;
      }

      breadcrumbs.push({
        label,
        href: index === pathSegments.length - 1 ? undefined : href
      });
    });

    return breadcrumbs;
  }, [location.pathname, customItems]);

  // Truncate items if they exceed maxItems
  const displayItems = useMemo(() => {
    if (autoItems.length <= maxItems) return autoItems;

    const firstItem = autoItems[0];
    const lastItems = autoItems.slice(-2);
    
    return [
      firstItem,
      { label: '...', href: undefined },
      ...lastItems
    ];
  }, [autoItems, maxItems]);

  const handleClick = (href: string) => {
    if (onNavigate && href) {
      onNavigate(href);
    }
  };

  // Don't render if we're on home and no custom items
  if (location.pathname === '/' && !customItems && autoItems.length === 0) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-4" aria-label="Breadcrumb">
      {showHome && (
        <>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 hover:bg-accent"
            onClick={() => handleClick('/')}
            aria-label="Ir al inicio"
          >
            <Home className="h-4 w-4" />
          </Button>
          {displayItems.length > 0 && <ChevronRight className="h-4 w-4" />}
        </>
      )}
      
      {displayItems.map((item, index) => (
        <React.Fragment key={`${item.label}-${index}`}>
          {index > 0 && <ChevronRight className="h-4 w-4" />}
          <Button
            variant="ghost"
            size="sm"
            className={`h-8 px-2 ${
              index === displayItems.length - 1 
                ? 'text-foreground font-medium cursor-default' 
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
            onClick={() => item.href && handleClick(item.href)}
            disabled={!item.href || index === displayItems.length - 1 || item.label === '...'}
            aria-current={index === displayItems.length - 1 ? 'page' : undefined}
          >
            {item.icon && <span className="mr-1">{item.icon}</span>}
            {item.label}
          </Button>
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
