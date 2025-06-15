
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, BarChart3 } from 'lucide-react';
import { User } from '@/types/lms';

interface WelcomeBannerProps {
  currentUser: User;
}

const WelcomeBanner = ({ currentUser }: WelcomeBannerProps) => {
  const getInitials = (name: string) => {
    if (!name) return "";
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <Card className="bg-gradient-to-r from-primary/10 to-card animate-fade-in">
      <CardContent className="p-6 flex flex-col sm:flex-row items-center sm:justify-between text-center sm:text-left gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">¡Bienvenido, {currentUser.name}!</h1>
          <p className="text-muted-foreground">Aquí tienes un resumen de tu actividad reciente y métricas importantes.</p>
          <div className="flex gap-2 mt-3">
            <Button size="sm" variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Ver Calendario
            </Button>
            <Button size="sm" variant="outline">
              <BarChart3 className="mr-2 h-4 w-4" />
              Reportes
            </Button>
          </div>
        </div>
        <Avatar className="h-16 w-16 border-2 border-primary">
          <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
          <AvatarFallback className="text-2xl bg-primary/20">
            {getInitials(currentUser.name)}
          </AvatarFallback>
        </Avatar>
      </CardContent>
    </Card>
  );
};

export default WelcomeBanner;
