
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';
import { formatName } from '@/lib/string-utils';
import { Link } from 'react-router-dom';

export default function AuthPage() {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const [signupFirstName, setSignupFirstName] = useState('');
  const [signupLastName, setSignupLastName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  
  // Recovery states
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryFirstName, setRecoveryFirstName] = useState('');
  const [recoveryLastName, setRecoveryLastName] = useState('');
  const [showRecoveryDialog, setShowRecoveryDialog] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPassword });
    if (error) {
      toast({
        title: 'Error al iniciar sesión',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Inicio de sesión exitoso',
        description: 'Bienvenido de nuevo a Portal Kenova.',
      });
    }
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: signupEmail,
      password: signupPassword,
      options: {
        data: {
          first_name: signupFirstName,
          last_name: signupLastName,
          role: 'student', // Default role for new signups is 'student'
        },
        emailRedirectTo: `${window.location.origin}/`,
      },
    });
    if (error) {
      toast({
        title: 'Error al registrarse',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Registro exitoso',
        description: 'Tu cuenta está pendiente de aprobación. Recibirás un correo cuando sea activada.',
      });
    }
    setLoading(false);
  };

  const handleTabChange = () => {
    setLoginEmail('');
    setLoginPassword('');
    setSignupFirstName('');
    setSignupLastName('');
    setSignupEmail('');
    setSignupPassword('');
    setShowLoginPassword(false);
    setShowSignupPassword(false);
  };

  const handlePasswordRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.auth.resetPasswordForEmail(recoveryEmail, {
      redirectTo: `${window.location.origin}/auth`,
    });
    
    if (error) {
      toast({
        title: 'Error al recuperar contraseña',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Correo enviado',
        description: 'Revisa tu correo electrónico para restablecer tu contraseña.',
      });
      setShowRecoveryDialog(false);
      setRecoveryEmail('');
      setRecoveryFirstName('');
      setRecoveryLastName('');
    }
    setLoading(false);
  };

  const handleUsernameRecovery = async () => {
    if (!recoveryFirstName || !recoveryLastName) {
      toast({
        title: 'Campos requeridos',
        description: 'Por favor ingresa tu nombre y apellidos.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    
    // Query the profiles table to find matching user
    const { data, error } = await supabase
      .from('profiles')
      .select('email')
      .ilike('first_name', recoveryFirstName.trim())
      .ilike('last_name', recoveryLastName.trim())
      .single();

    if (error || !data) {
      toast({
        title: 'Usuario no encontrado',
        description: 'No se encontró ningún usuario con ese nombre y apellidos.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Usuario encontrado',
        description: `Tu correo electrónico es: ${data.email}`,
      });
      setRecoveryEmail(data.email);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background animate-fade-in">
      <div className="w-full max-w-md p-4">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-primary">🎓 Portal Kenova</h1>
        </div>
        <Tabs defaultValue="login" className="w-full" onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
            <TabsTrigger value="signup">Registrarse</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Iniciar Sesión</CardTitle>
                <CardDescription>Accede a tu cuenta de Portal Kenova.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Correo Electrónico</Label>
                    <Input id="login-email" type="email" placeholder="tu@email.com" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Contraseña</Label>
                    <div className="relative">
                      <Input 
                        id="login-password" 
                        type={showLoginPassword ? 'text' : 'password'} 
                        value={loginPassword} 
                        onChange={(e) => setLoginPassword(e.target.value)} 
                        required 
                        minLength={8}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-0 flex items-center justify-center w-10 text-muted-foreground focus:outline-none"
                        aria-label={showLoginPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      >
                        {showLoginPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Iniciando...' : 'Iniciar Sesión'}
                  </Button>
                  
                  <Dialog open={showRecoveryDialog} onOpenChange={setShowRecoveryDialog}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" className="w-full text-sm text-muted-foreground hover:text-primary">
                        ¿Olvidaste tu usuario o contraseña?
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Recuperar Cuenta</DialogTitle>
                        <DialogDescription>
                          Recupera tu usuario o restablece tu contraseña.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handlePasswordRecovery} className="space-y-4">
                        <div className="space-y-4">
                          <div className="text-sm font-medium">1. Recuperar Usuario</div>
                          <div className="space-y-2">
                            <Label htmlFor="recovery-first-name">Nombre(s)</Label>
                            <Input 
                              id="recovery-first-name" 
                              type="text" 
                              placeholder="Tu nombre(s)" 
                              value={recoveryFirstName} 
                              onChange={(e) => setRecoveryFirstName(formatName(e.target.value))} 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="recovery-last-name">Apellidos</Label>
                            <Input 
                              id="recovery-last-name" 
                              type="text" 
                              placeholder="Tus apellidos" 
                              value={recoveryLastName} 
                              onChange={(e) => setRecoveryLastName(formatName(e.target.value))} 
                            />
                          </div>
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={handleUsernameRecovery}
                            disabled={loading || !recoveryFirstName || !recoveryLastName}
                            className="w-full"
                          >
                            {loading ? 'Buscando...' : 'Buscar Usuario'}
                          </Button>
                          
                          <div className="text-sm font-medium mt-4">2. Restablecer Contraseña</div>
                          <div className="space-y-2">
                            <Label htmlFor="recovery-email">Correo Electrónico</Label>
                            <Input 
                              id="recovery-email" 
                              type="email" 
                              placeholder="tu@email.com" 
                              value={recoveryEmail} 
                              onChange={(e) => setRecoveryEmail(e.target.value)} 
                              required 
                            />
                          </div>
                          <Button 
                            type="submit" 
                            className="w-full" 
                            disabled={loading || !recoveryEmail}
                          >
                            {loading ? 'Enviando...' : 'Enviar Correo de Recuperación'}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Registrarse</CardTitle>
                <CardDescription>Crea una nueva cuenta en Portal Kenova.</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="mb-4">¿No tienes una cuenta?</p>
                <Link to="/signup">
                  <Button className="w-full">Ir a la página de registro</Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
