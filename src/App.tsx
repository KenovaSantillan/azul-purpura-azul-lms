
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LMSProvider, useLMS } from "@/contexts/LMSContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import AuthPage from "./pages/AuthPage";
import PendingApprovalPage from "./pages/PendingApprovalPage";
import InactiveAccountPage from "./pages/InactiveAccountPage";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { session, loading: authLoading } = useAuth();
  const { currentUser, loadingCurrentUser } = useLMS();

  if (authLoading || (session && loadingCurrentUser)) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <p className="text-foreground">Cargando Portal Kenova...</p>
      </div>
    );
  }

  if (session && currentUser) {
    if (currentUser.status === 'pending') {
      return (
        <Routes>
          {/* Redirect all paths to pending page, but allow auth page for logout */}
          <Route path="/auth" element={<AuthPage />} />
          <Route path="*" element={<PendingApprovalPage />} />
        </Routes>
      );
    }
    if (currentUser.status === 'inactive') {
      return (
        <Routes>
           {/* Redirect all paths to inactive page, but allow auth page for logout */}
          <Route path="/auth" element={<AuthPage />} />
          <Route path="*" element={<InactiveAccountPage />} />
        </Routes>
      );
    }
  }

  return (
    <Routes>
      <Route path="/auth" element={!session ? <AuthPage /> : <Navigate to="/" replace />} />
      <Route path="/" element={session ? <Index /> : <Navigate to="/auth" replace />} />
      <Route path="/index.html" element={<Navigate to="/" replace />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <LMSProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </TooltipProvider>
        </LMSProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
