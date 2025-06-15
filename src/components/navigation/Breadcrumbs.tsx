
import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigate?: (href: string) => void;
}

const Breadcrumbs = ({ items, onNavigate }: BreadcrumbsProps) => {
  const handleClick = (href: string) => {
    if (onNavigate && href) {
      onNavigate(href);
    }
  };

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-4">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 px-2"
        onClick={() => handleClick('/')}
      >
        <Home className="h-4 w-4" />
      </Button>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="h-4 w-4" />
          <Button
            variant="ghost"
            size="sm"
            className={`h-8 px-2 ${
              index === items.length - 1 
                ? 'text-foreground font-medium' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
            onClick={() => item.href && handleClick(item.href)}
            disabled={!item.href || index === items.length - 1}
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
