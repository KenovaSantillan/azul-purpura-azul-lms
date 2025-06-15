
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';
import { Group } from '@/types/lms';

interface RecentGroupsProps {
  groups: Group[];
  onHover: () => void;
}

const RecentGroups = ({ groups, onHover }: RecentGroupsProps) => {
  return (
    <Card 
      className="animate-fade-in hover:shadow-md transition-shadow" 
      style={{animationDelay: '400ms'}}
      onMouseEnter={onHover}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Grupos Recientes
        </CardTitle>
        <CardDescription>Últimos grupos creados</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {groups.slice(0, 3).map((group) => (
            <div key={group.id} className="flex items-center justify-between p-3 bg-accent/50 rounded-lg hover:bg-accent/70 transition-colors">
              <div>
                <p className="font-medium">{group.name}</p>
                <p className="text-sm text-muted-foreground">
                  {group.specialty} - {group.shift}
                </p>
              </div>
              <Badge variant="secondary" className="shrink-0">
                {group.students.length} estudiantes
              </Badge>
            </div>
          ))}
          {groups.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">No hay grupos recientes.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentGroups;
