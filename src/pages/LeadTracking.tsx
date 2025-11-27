import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow  } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Search, Users, ExternalLink, Filter, MoreVertical, TrendingUp, Mail, Phone, Loader2, MessageSquare, ArrowLeft, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

// URL DEL BACKEND para mostrar las convcersaciones
const API_URL = 'http://localhost:8002';

// Interfaz para la vista 
interface Lead {
  id: string; // Será el sessionId
  name: string;
  email: string;
  phone: string;
  company: string;
  avatar: string;
  status: 'hot' | 'warm' | 'cold' | 'new';
  conversionProbability: number;
  source: string;
  // lastActivity: Date; // Opcional si el backend no lo manda
}

const statusColors: any = {
  hot: 'bg-primary text-white',
  warm: 'bg-warning text-white',
  cold: 'bg-muted text-muted-foreground',
  new: 'bg-blue-500 text-white'
};

const probabilityColors = (probability: number) => {
  if (probability >= 80) return 'text-green-600';
  if (probability >= 50) return 'text-yellow-600';
  return 'text-muted-foreground';
};

export default function LeadTracking() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const { toast } = useToast();

  // Paginación
  const [page, setPage] = useState(1);
  
  useEffect(() => {
    fetchLeads(page);
  }, [page]);

  const fetchLeads = async (pageNum: number) => {
    setIsLoading(true);
    try {
      // Llamamos al mismo endpoint /sessions porque los chats son leads interesados
      const response = await fetch(`${API_URL}/sessions?page=${pageNum}&limit=10`);
      
      if (response.ok) {
        const data = await response.json();
        
        // ADAPTADOR: Convertimos Session -> Lead
        const adaptedLeads: Lead[] = data.map((session: any) => ({
            id: session.sessionId,
            name: session.name !== "Desconocido" ? session.name : `Lead ${session.sessionId.substring(5,10)}`,
            email: session.contact_info || "Sin correo",
            phone: "Sin teléfono",  
            company: "N/A",
            avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${session.name}`,
            status: 'new', // Default
            conversionProbability: Math.floor(Math.random() * 100), // Simulado por ahora
            source: 'Chatbot',
        }));
        
        setLeads(adaptedLeads);
      }
    } catch (error) {
      console.error("Error cargando leads:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredLeads = leads.filter(lead => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
        lead.name.toLowerCase().includes(searchLower) ||
        lead.email.toLowerCase().includes(searchLower);
    
    const matchesFilter = filterStatus === 'all' || lead.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-foreground mb-2">Lead Tracking</h1>
        <p className="text-muted-foreground">Monitorea y gestiona tu pipeline de leads desde Chatbot</p>
      </motion.div>

      {/* --- STATS (Simulados visualmente) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="card-elegant hover-lift">
            <CardContent className="p-6 flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Activos</p>
                    <p className="text-2xl font-bold text-foreground">{leads.length}</p>
                </div>
                <Users className="w-8 h-8 text-primary" />
            </CardContent>
        </Card>
        <Card className="card-elegant hover-lift">
            <CardContent className="p-6 flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Probabilidad promedio</p>
                    <p className="text-2xl font-bold text-foreground">65%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-success" />
            </CardContent>
        </Card>
      </div>

      {/* --- FILTROS --- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="card-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Lead Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar por nombre o correo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Filtrar: {filterStatus}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setFilterStatus('all')}>All</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('new')}>New</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* --- TABLA --- */}
            <div className="rounded-lg border border-border overflow-hidden">
              {isLoading ? (
                  <div className="flex justify-center p-12"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>
              ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Lead</TableHead>
                    <TableHead>Información de Contacto</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Probabilidad</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.map((lead, index) => (
                    <motion.tr
                      key={lead.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-10 h-10 border-2 border-white">
                            <AvatarImage src={lead.avatar} />
                            <AvatarFallback className="bg-primary text-white">
                              {lead.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-foreground">{lead.name}</p>
                            <p className="text-sm text-muted-foreground">{lead.company}</p>
                            <p className="text-xs text-muted-foreground">via {lead.source}</p>
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-3 h-3 text-muted-foreground" />
                            <span className="text-foreground">{lead.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <Badge className={`${statusColors[lead.status]} font-medium capitalize`}>
                          {lead.status}
                        </Badge>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold ${probabilityColors(lead.conversionProbability)}`}>
                            {lead.conversionProbability}%
                          </span>
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-500 ${
                                lead.conversionProbability >= 80 ? 'bg-success' : 'bg-warning'
                              }`}
                              style={{ width: `${lead.conversionProbability}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {/* BOTÓN CHAT: Redirige al historial */}
                          <Link to="/chat-history">
                             <Button variant="ghost" size="icon" className="text-blue-500 hover:bg-blue-50">
                                <MessageSquare className="w-4 h-4" />
                             </Button>
                          </Link>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Ver Detalles</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">Eliminar</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
              )}
            </div>

            {/* --- PAGINACIÓN --- */}
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                disabled={page === 1 || isLoading}
                >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
                </Button>
                <span className="text-sm text-muted-foreground">Página {page}</span>
                <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(prev => prev + 1)}
                disabled={leads.length < 10 || isLoading}
                >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </div>

          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}