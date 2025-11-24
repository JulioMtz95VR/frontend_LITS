import { createContext, useContext, useEffect, useState } from "react";

// Interfaz del usuario
interface User {
  email: string;
  name: string;
  picture: string;
  _id: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // IMPORTANTE esta es la variable de entorno del backend
  const BACKEND_URL = "http://localhost:8001"; 

  const signIn = () => {
    window.location.href = `${BACKEND_URL}/v1/google/login`;
  };

  const signOut = async () => {
    try {
      await fetch(`${BACKEND_URL}/v1/gogole/logout`, { method: "POST"});
    } catch (error) {
      console.error("Error dutante logout", error);
    } finally {
      setUser(null);
      window.location.href = "/";
    }
  };

  useEffect(() => {
    // Esta función se ejecuta AUTOMÁTICAMENTE al cargar la página
    console.log("🔄 AuthProvider montado. Iniciando verificación...");

    const checkUser = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/v1/google/me`, {
            method: "GET",
            credentials: "include", // <--- LA CLAVE
            headers: { "Content-Type": "application/json" }
        });

        console.log("📡 Estatus respuesta:", response.status);

        if (response.ok) {
            const userData = await response.json();
            console.log("✅ Usuario detectado:", userData);
            setUser(userData);
        } else {
            console.warn("⛔ Backend respondió error (401/403). Sin sesión.");
            setUser(null);
        }
      } catch (error) {
        console.error("❌ Error de red fatal:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth error");
  return context;
};