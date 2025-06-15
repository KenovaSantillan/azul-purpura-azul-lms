
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { LogOut } from 'lucide-react';

export default function PendingApprovalPage() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-4 animate-fade-in">
      <h1 className="text-3xl font-bold mb-4 text-primary">🎓 Portal Kenova</h1>
      <div className="max-w-md w-full bg-card p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-2">Tu cuenta está pendiente de aprobación</h2>
        <p className="text-muted-foreground mb-6">
          Un administrador necesita revisar y aprobar tu registro antes de que puedas acceder al portal.
          Recibirás una notificación por correo electrónico una vez que tu cuenta haya sido activada.
        </p>
        <Button onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );
}
