
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTheme, ColorTheme } from '@/contexts/ThemeContext';

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
];

export function ThemeCustomizer() {
  const { theme, colorTheme, setColorTheme, toggleTheme } = useTheme();

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
