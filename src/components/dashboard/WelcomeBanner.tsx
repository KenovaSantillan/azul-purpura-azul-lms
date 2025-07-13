
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
    <Card className="bg-gradient-hero border-0 shadow-large animate-fade-in hover:shadow-large transition-all duration-300 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-primary opacity-5 animate-pulse-soft"></div>
      <CardContent className="p-6 flex flex-col sm:flex-row items-center sm:justify-between text-center sm:text-left gap-4 relative z-10">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground mb-2 animate-bounce-gentle">
            ¡Bienvenido, {currentUser.name}! 🎉
          </h1>
          <p className="text-muted-foreground text-lg mb-4">
            Aquí tienes un resumen de tu actividad reciente y métricas importantes.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <Button size="sm" variant="glass" className="group">
              <Calendar className="mr-2 h-4 w-4 group-hover:animate-bounce-gentle" />
              Ver Calendario
            </Button>
            <Button size="sm" variant="gradient" className="group animate-glow">
              <BarChart3 className="mr-2 h-4 w-4 group-hover:animate-bounce-gentle" />
              Reportes
            </Button>
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse-soft"></div>
          <Avatar className="h-20 w-20 border-4 border-primary/30 shadow-large relative z-10 hover:scale-105 transition-transform duration-300">
            <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
            <AvatarFallback className="text-3xl bg-gradient-primary text-white font-bold">
              {getInitials(currentUser.name)}
            </AvatarFallback>
          </Avatar>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeBanner;
