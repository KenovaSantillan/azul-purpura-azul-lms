import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LMSProvider } from "@/contexts/LMSContext";
import { UserProvider, useUser } from "@/contexts/UserContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import AuthPage from "./pages/AuthPage";
import SignUpPage from "./pages/SignUpPage";
import PendingApprovalPage from "./pages/PendingApprovalPage";
import InactiveAccountPage from "./pages/InactiveAccountPage";
import React from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

const AppProviders = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <UserProvider>
          <LMSProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              {children}
            </TooltipProvider>
          </LMSProvider>
        </UserProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

const AppRoutes = () => {
  const { session, loading: authLoading } = useAuth();
  const { currentUser, loadingCurrentUser } = useUser();

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
      <Route path="/signup" element={!session ? <SignUpPage /> : <Navigate to="/" replace />} />
      <Route path="/" element={session ? <Index /> : <Navigate to="/auth" replace />} />
      <Route path="/index.html" element={<Navigate to="/" replace />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <HashRouter>
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  </HashRouter>
);

export default App;
