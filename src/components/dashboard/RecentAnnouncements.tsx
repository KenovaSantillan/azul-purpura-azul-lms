
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { List } from 'lucide-react';
import { Announcement } from '@/types/lms';

interface RecentAnnouncementsProps {
  announcements: Announcement[];
  onHover: () => void;
}

const RecentAnnouncements = ({ announcements, onHover }: RecentAnnouncementsProps) => {
  const recentAnnouncements = announcements.slice(0, 3);

  return (
    <Card 
      className="animate-fade-in hover:shadow-md transition-shadow" 
      style={{animationDelay: '500ms'}}
      onMouseEnter={onHover}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <List className="h-5 w-5" />
          Anuncios Recientes
        </CardTitle>
        <CardDescription>Últimas notificaciones importantes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentAnnouncements.map((announcement) => (
            <div key={announcement.id} className="p-3 bg-accent/50 rounded-lg hover:bg-accent/70 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium line-clamp-1">{announcement.title}</h4>
                <Badge 
                  variant={announcement.priority === 'high' ? 'destructive' : announcement.priority === 'medium' ? 'default' : 'secondary'}
                  className="shrink-0 ml-2"
                >
                  {announcement.priority}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {announcement.content}
              </p>
            </div>
          ))}
          {recentAnnouncements.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">No hay anuncios recientes.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentAnnouncements;
