import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTheme, ColorTheme } from '@/contexts/ThemeContext';
import { useUser } from '@/contexts/UserContext';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useQueryClient } from '@tanstack/react-query';

const colorThemes: { name: string; value: ColorTheme; color: string }[] = [
  { name: 'Púrpura (Por defecto)', value: 'default', color: '#9b87f5' },
  { name: 'Azul', value: 'blue', color: '#3b82f6' },
  { name: 'Verde', value: 'green', color: '#10b981' },
  { name: 'Naranja', value: 'orange', color: '#f97316' },
  { name: 'Rojo', value: 'red', color: '#ef4444' },
  { name: 'Rosa', value: 'pink', color: '#ec4899' },
  { name: 'Índigo', value: 'indigo', color: '#6366f1' },
  { name: 'Verde Azulado', value: 'teal', color: '#14b8a6' },
  { name: 'Amarillo', value: 'yellow', color: '#eab308' },
  { name: 'Cian', value: 'cyan', color: '#06b6d4' },
  { name: 'Pizarra', value: 'slate', color: '#64748b' },
  { name: 'Lima', value: 'lime', color: '#84cc16' },
  { name: 'Violeta', value: 'violet', color: '#8b5cf6' },
  { name: 'Fucsia', value: 'fuchsia', color: '#d946ef' },
  { name: 'Rosado', value: 'rose', color: '#f43f5e' },
];

const avatarOptions = [
  { name: 'Mujer con laptop', url: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=200&h=200&fit=crop&crop=faces' },
  { name: 'Mujer programando', url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&h=200&fit=crop&crop=faces' },
  { name: 'Gatito', url: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=200&h=200&fit=crop&crop=faces' },
  { name: 'Mono con banana', url: 'https://images.unsplash.com/photo-1501286353178-1ec881214838?w=200&h=200&fit=crop&crop=faces' },
  { name: 'Robot', url: 'https://robohash.org/kenova-robot.png?size=200x200' },
  { name: 'Monstruo', url: 'https://robohash.org/kenova-monster.png?size=200x200&set=set2' },
  { name: 'Gato robot', url: 'https://robohash.org/kenova-cat.png?size=200x200&set=set4' },
];

export function ThemeCustomizer() {
  const { theme, colorTheme, setColorTheme, toggleTheme } = useTheme();
  const { currentUser, updateUser } = useUser();
  const queryClient = useQueryClient();

  const handleAvatarSelect = async (url: string) => {
    if (!currentUser) return;
    try {
      await updateUser(currentUser.id, { avatar: url });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile', currentUser.id] });
      toast.success('Avatar actualizado exitosamente.');
    } catch (error) {
      toast.error('No se pudo actualizar el avatar.');
      console.error('Error updating avatar:', error);
    }
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Personalización de Temas</CardTitle>
        <CardDescription>
          Personaliza los colores y el modo de visualización del LMS
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Dark/Light Mode Toggle */}
        <div>
          <h3 className="text-lg font-medium mb-3">Modo de Visualización</h3>
          <div className="flex gap-3">
            <Button
              variant={theme === 'light' ? 'default' : 'outline'}
              onClick={() => theme !== 'light' && toggleTheme()}
              className="flex-1"
            >
              ☀️ Modo Claro
            </Button>
            <Button
              variant={theme === 'dark' ? 'default' : 'outline'}
              onClick={() => theme !== 'dark' && toggleTheme()}
              className="flex-1"
            >
              🌙 Modo Oscuro
            </Button>
          </div>
        </div>

        {/* Color Theme Selection */}
        <div>
          <h3 className="text-lg font-medium mb-3">Esquema de Colores</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {colorThemes.map((theme) => (
              <Button
                key={theme.value}
                variant={colorTheme === theme.value ? 'default' : 'outline'}
                onClick={() => setColorTheme(theme.value)}
                className="flex flex-col items-center gap-2 h-auto p-3"
              >
                <div
                  className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: theme.color }}
                />
                <span className="text-xs text-center leading-tight">
                  {theme.name}
                </span>
              </Button>
            ))}
          </div>
        </div>

        {/* Avatar Selection - only for students and teachers */}
        {(currentUser?.role === 'student' || currentUser?.role === 'teacher') && (
          <div>
            <h3 className="text-lg font-medium mb-3">Avatar para la Plataforma</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Elige un avatar que te representará en la plataforma.
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {avatarOptions.map((avatar) => (
                <button
                  key={avatar.url}
                  onClick={() => handleAvatarSelect(avatar.url)}
                  className={`flex flex-col items-center gap-2 h-auto p-2 rounded-lg border-2 ${currentUser?.avatar === avatar.url ? 'border-primary' : 'border-transparent'} hover:border-primary/50 transition-all`}
                  title={avatar.name}
                >
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={avatar.url} alt={avatar.name} />
                    <AvatarFallback>{avatar.name.substring(0,2)}</AvatarFallback>
                  </Avatar>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Preview */}
        <div>
          <h3 className="text-lg font-medium mb-3">Vista Previa</h3>
          <div className="p-4 border rounded-lg bg-accent/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">
                A
              </div>
              <div>
                <p className="font-medium text-foreground">Ejemplo de Usuario</p>
                <p className="text-sm text-muted-foreground">Estudiante • 1° A Programación</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm">Botón Primario</Button>
              <Button size="sm" variant="outline">Botón Secundario</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
