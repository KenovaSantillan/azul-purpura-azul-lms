
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { LogOut } from 'lucide-react';

export default function InactiveAccountPage() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-4 animate-fade-in">
      <h1 className="text-3xl font-bold mb-4 text-primary">🎓 Portal Kenova</h1>
      <div className="max-w-md w-full bg-card p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-2">Tu cuenta ha sido desactivada</h2>
        <p className="text-muted-foreground mb-6">
          Por favor, contacta a un administrador para más información.
        </p>
        <Button onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );
}
