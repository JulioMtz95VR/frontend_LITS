// import { useAuthStore } from '@/store/authStore';
import { Navbar } from './Navbar';
import { LoginForm } from '../LoginForm';

// Agregarmos el nuevo contexto
import { useAuth } from '@/context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  // Usamos el contexto nuevo
   const { user, isLoading } = useAuth();
   
   // Si esta cargando la sesion, mostramos nada
  if (isLoading) {
    return <div className="min-h-screen bg-background"></div>;
  }

  if (!user) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-background">
      {user && <Navbar />}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};