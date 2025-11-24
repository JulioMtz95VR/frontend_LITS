import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { LoginForm } from "@/components/LoginForm"; 
import { WelcomeScreen } from "@/components/WelcomeScreen"; 
import Dashboard from "./pages/Dashboard";
import ChatHistory from "./pages/ChatHistory";
import LeadTracking from "./pages/LeadTracking";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// SEMÁFORO 
const Home = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div className="h-screen flex items-center justify-center">Cargando...</div>;

  // SI HAY USUARIO: Redirige a /welcome para que se cargue dentro del Layout con Navbar
  if (user) {
    return <Navigate to="/welcome" replace />;
  }

  // SI NO: Muestra el Login (Sin Navbar, porque el Layout lo oculta si no hay user)
  return <LoginForm />;
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, isLoading } = useAuth();
    if (isLoading) return <div>Cargando...</div>;
    if (!user) return <Navigate to="/" replace />;
    return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
      <AuthProvider>
        <Layout>
          <Routes>
            {/* Ruta Raíz: Decide si Login o Redirigir */}
            <Route path="/" element={<Home />} />
            
            {/* Ruta Welcome: Aquí es donde aterrizas y SÍ se verá el Navbar */}
            <Route 
                path="/welcome" 
                element={
                    <ProtectedRoute>
                        <WelcomeScreen />
                    </ProtectedRoute>
                } 
            />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/chat-history" element={<ProtectedRoute><ChatHistory /></ProtectedRoute>} />
            <Route path="/lead-tracking" element={<ProtectedRoute><LeadTracking /></ProtectedRoute>} />
            {/* Atrapa el error 404 y lo manda al inicio */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;