
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';

interface AnalyticsSectionProps {
  isVisible: boolean;
}

const AnalyticsSection = ({ isVisible }: AnalyticsSectionProps) => {
  if (!isVisible) return null;

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Analytics del Portal
        </CardTitle>
        <CardDescription>
          Métricas detalladas y estadísticas del sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AnalyticsDashboard />
      </CardContent>
    </Card>
  );
};

export default AnalyticsSection;
