import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, MessageCircle, Send, ArrowLeft, Bot, User, Loader2 } from 'lucide-react';

// URL del backend para acceder a el
const API_URL = 'http://localhost:8002'; 

// Interfaces de TypeScript con atributos de la base de datos de MongoDB
interface MessageData {
  content: string;
  additional_kwargs?: any;
}

interface Message {
  type: string; // "human" o "ai"
  data: MessageData; // Aqui es donde de almacenan el tenxto de los mensajes
  timestamp?: string; 
}

interface Session {
  sessionId: string;
}

export default function ChatHistory() {
  // Estados de Datos
  const [sessions, setSessions] = useState<Session[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  
  // Estados de UI
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [isLoadingChat, setIsLoadingChat] = useState(false);

  // Estados de Paginación
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // 1. Carga inicial
  useEffect(() => {
    // Creamos un "retraso" para no buscar en cada letra
    const delayDebounce = setTimeout(() => {
      setPage(1); // Resetear a página 1 al buscar
      fetchSessions(1, searchTerm);
    }, 500); // 500ms de espera

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  // Función para traer sessions (Paginada)
const fetchSessions = async (pageNum: number, searchQuery: string = '') => {
    if (pageNum === 1) setIsLoadingList(true);
    else setIsLoadingMore(true);

    try {
      // Esto le dice al backend: "Solo dame 20, no me des los 883"
      const url = `${API_URL}/sessions?page=${pageNum}&limit=20&search=${searchQuery}`;
      const response = await fetch(url);
      
      if (response.ok) {
        const newSessions = await response.json();
        
        // Si llegan menos de 20, apagamos el botón de "Cargar más"
        if (newSessions.length < 20) setHasMore(false);
        else setHasMore(true);

        if (pageNum === 1) {
          setSessions(newSessions);
        } else {
          setSessions(prev => {
             const existingIds = new Set(prev.map(s => s.sessionId));
             const uniqueNew = newSessions.filter((s: Session) => !existingIds.has(s.sessionId));
             return [...prev, ...uniqueNew];
          });
        }
        setPage(pageNum);
      }
    } catch (error) {
      console.error("Error cargando sesiones:", error);
    } finally {
      setIsLoadingList(false);
      setIsLoadingMore(false);
    }
  };

  // Función del botón "Cargar más"
const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      // Pasamos el término de búsqueda actual
      fetchSessions(page + 1, searchTerm); 
    }
  };

  // Seleccionar un chat y traer sus mensajes
  const handleSelectSession = async (sessionId: string) => {
    setSelectedChatId(sessionId);
    setIsLoadingChat(true);
    try {
      const response = await fetch(`${API_URL}/mensajes/${sessionId}`);
      if (response.ok) {
        const document = await response.json();
        
        // El array está dentro de la propiedad 'messages'
        if (document && Array.isArray(document.messages)) {
            setMessages(document.messages);
        } else {
            setMessages([]);
        }
      }
    } catch (error) {
      console.error("Error cargando conversación:", error);
      setMessages([]);
    } finally {
      setIsLoadingChat(false);
    }
  };

  // Filtrado local para la búsqueda
  const filteredSessions = sessions.filter(session =>
    session.sessionId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-none"
      >
        <h1 className="text-3xl font-bold text-foreground mb-1">Historial de Chats</h1>
        <p className="text-muted-foreground">Revisa las interacciones del Agente Comercial</p>
      </motion.div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        
        {/* --- COLUMNA IZQUIERDA: LISTA DE SESIONES --- */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`lg:col-span-1 h-full flex flex-col ${selectedChatId ? 'hidden lg:flex' : 'flex'}`}
        >
          <Card className="h-full flex flex-col border-border/50 shadow-sm bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4 space-y-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageCircle className="w-5 h-5 text-primary" />
                Conversaciones ({filteredSessions.length})
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar ID de sesión..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background/50"
                />
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 p-0 overflow-hidden">
              <ScrollArea className="h-full px-4">
                <div className="space-y-2 pb-4">
                  {isLoadingList ? (
                    <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary" /></div>
                  ) : filteredSessions.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No se encontraron sesiones</p>
                  ) : (
                    <>
                        {filteredSessions.map((session) => (
                        <motion.div
                            key={session.sessionId}
                            layoutId={session.sessionId}
                            onClick={() => handleSelectSession(session.sessionId)}
                            className={`
                            group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 border
                            ${selectedChatId === session.sessionId 
                                ? 'bg-primary/10 border-primary/20 shadow-sm' 
                                : 'bg-transparent border-transparent hover:bg-muted/50 hover:border-border'
                            }
                            `}
                        >
                            <Avatar className="h-10 w-10 border border-border bg-background">
                            <AvatarImage src={`https://api.dicebear.com/7.x/identicon/svg?seed=${session.sessionId}`} />
                            <AvatarFallback>ID</AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline mb-1">
                                <span className={`font-medium truncate ${selectedChatId === session.sessionId ? 'text-primary' : 'text-foreground'}`}>
                                Sesión: {session.sessionId.substring(0, 12)}...
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-[10px] h-5 px-1 bg-background/50">
                                Activo
                                </Badge>
                                <span className="text-xs text-muted-foreground truncate">
                                ID Completo: {session.sessionId}
                                </span>
                            </div>
                            </div>
                        </motion.div>
                        ))}

                        {/* BOTÓN CARGAR MÁS */}
                        <div className="pt-4 pb-2 flex justify-center">
                            {hasMore ? (
                                <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={handleLoadMore}
                                disabled={isLoadingMore}
                                className="w-full text-xs"
                                >
                                {isLoadingMore ? (
                                    <>
                                    <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                                    Cargando...
                                    </>
                                ) : (
                                    "Cargar más conversaciones"
                                )}
                                </Button>
                            ) : (
                                <p className="text-[10px] text-muted-foreground">Fin del historial</p>
                            )}
                        </div>
                    </>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>

        {/* --- COLUMNA DERECHA: CHAT PRINCIPAL --- */}
        <motion.div
          layout
          className={`lg:col-span-2 h-full flex flex-col ${!selectedChatId ? 'hidden lg:flex' : 'flex'}`}
        >
          <Card className="h-full flex flex-col border-border/50 shadow-md overflow-hidden bg-card">
            {selectedChatId ? (
              <>
                {/* Encabezado del Chat */}
                <div className="flex-none p-4 border-b border-border flex items-center gap-3 bg-muted/20">
                  <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSelectedChatId(null)}>
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                  <Avatar className="h-10 w-10 border border-border">
                    <AvatarImage src={`https://api.dicebear.com/7.x/identicon/svg?seed=${selectedChatId}`} />
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-sm">Sesión: {selectedChatId}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse" />
                      Historial sincronizado
                    </p>
                  </div>
                </div>

                {/* Área de Mensajes */}
                <ScrollArea className="flex-1 p-4 bg-slate-50/50 dark:bg-slate-950/50">
                  <div className="space-y-4 max-w-3xl mx-auto">
                    {isLoadingChat ? (
                       <div className="flex justify-center p-10"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>
                    ) : messages.length === 0 ? (
                      <div className="text-center py-20 text-muted-foreground">
                        <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>No hay mensajes en esta sesión.</p>
                      </div>
                    ) : (
                      messages.map((msg, index) => {
                        // Determinar quién envía el mensaje
                        const isUser = msg.type === 'human';
                        
                        return (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            key={index}
                            className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                          >
                            {/* Icono del BOT */}
                            {!isUser && (
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-none">
                                <Bot className="w-4 h-4 text-primary" />
                              </div>
                            )}
                            
                            {/* Burbuja de Texto */}
                            <div className={`
                              max-w-[80%] rounded-2xl px-4 py-3 shadow-sm text-sm
                              ${isUser 
                                ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                                : 'bg-white dark:bg-slate-800 border border-border rounded-tl-sm'
                              }
                            `}>
                              <p className="whitespace-pre-wrap">
                                {/* AQUÍ LEEMOS EL CONTENIDO DE MANERA SEGURA */}
                                {msg.data?.content || "..."}
                              </p>
                              
                              {msg.timestamp && (
                                <p className={`text-[10px] mt-1 text-right opacity-70`}>
                                   {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </p>
                              )}
                            </div>

                            {/* Icono del USUARIO */}
                            {isUser && (
                              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-none">
                                <User className="w-4 h-4 text-muted-foreground" />
                              </div>
                            )}
                          </motion.div>
                        );
                      })
                    )}
                  </div>
                </ScrollArea>

                {/* Input (Visual) */}
                <div className="p-4 bg-background border-t border-border">
                  <div className="flex gap-2 max-w-3xl mx-auto">
                    <Input 
                      placeholder="Nota: Solo lectura (historial)" 
                      disabled
                      className="rounded-full bg-muted/50"
                    />
                    <Button size="icon" disabled className="rounded-full w-10 h-10 shrink-0 shadow-sm">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              // Estado vacío (Sin chat seleccionado)
              <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground bg-muted/10 p-6 text-center">
                <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mb-6 animate-pulse">
                   <MessageCircle className="w-10 h-10 text-primary/40" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Selecciona una conversación</h3>
                <p className="max-w-md mx-auto">
                  Elige una sesión del menú lateral para ver el historial completo.
                </p>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}