import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Search, 
  Users, 
  ExternalLink, 
  Filter, 
  MoreVertical, 
  Clock,
  TrendingUp,
  Mail,
  Phone
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

// Mock data - will be replaced with real MongoDB data
const mockLeads = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice.johnson@techcorp.com',
    phone: '+1 (555) 123-4567',
    company: 'TechCorp',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150',
    initialContact: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: 'hot',
    conversionProbability: 85,
    source: 'Website Form',
    notes: 'Interested in enterprise solution, ready to schedule demo'
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob.smith@innovate.io',
    phone: '+1 (555) 987-6543',
    company: 'Innovate.io',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    initialContact: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    lastActivity: new Date(Date.now() - 8 * 60 * 60 * 1000),
    status: 'warm',
    conversionProbability: 65,
    source: 'LinkedIn',
    notes: 'Requested pricing information, comparing solutions'
  },
  {
    id: '3',
    name: 'Carol Williams',
    email: 'carol@startupxyz.com',
    phone: '+1 (555) 456-7890',
    company: 'StartupXYZ',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    initialContact: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    lastActivity: new Date(Date.now() - 24 * 60 * 60 * 1000),
    status: 'cold',
    conversionProbability: 35,
    source: 'Referral',
    notes: 'Early stage startup, budget constraints mentioned'
  },
  {
    id: '4',
    name: 'David Brown',
    email: 'david.brown@megacorp.com',
    phone: '+1 (555) 321-0987',
    company: 'MegaCorp',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    initialContact: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    lastActivity: new Date(Date.now() - 30 * 60 * 1000),
    status: 'hot',
    conversionProbability: 92,
    source: 'Trade Show',
    notes: 'Decision maker, urgent need, budget approved'
  }
];

const statusColors = {
  hot: 'bg-primary text-white',
  warm: 'bg-warning text-white',
  cold: 'bg-muted text-muted-foreground'
};

const probabilityColors = (probability: number) => {
  if (probability >= 80) return 'text-success';
  if (probability >= 50) return 'text-warning';
  return 'text-muted-foreground';
};

export default function LeadTracking() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const { toast } = useToast();

  const filteredLeads = mockLeads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || lead.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const handleSendToOdoo = (leadId: string, leadName: string) => {
    // Here you would integrate with Odoo API
    console.log('Sending lead to Odoo:', leadId);
    
    toast({
      title: "Lead Sent to Odoo",
      description: `${leadName} has been successfully exported to Odoo CRM.`,
    });
  };

  const stats = [
    { 
      label: 'Total Leads', 
      value: mockLeads.length.toString(),
      icon: Users,
      color: 'text-primary'
    },
    { 
      label: 'Hot Leads', 
      value: mockLeads.filter(l => l.status === 'hot').length.toString(),
      icon: TrendingUp,
      color: 'text-success'
    },
    { 
      label: 'Avg. Time to Contact', 
      value: '2.4h',
      icon: Clock,
      color: 'text-warning'
    }
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-foreground mb-2">Lead Tracking</h1>
        <p className="text-muted-foreground">Monitor and manage your lead pipeline</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="card-elegant hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        {stat.value}
                      </p>
                    </div>
                    <Icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Filters and Search */}
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
                  placeholder="Search leads by name, company, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Filter: {filterStatus === 'all' ? 'All' : filterStatus}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setFilterStatus('all')}>
                    All Leads
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('hot')}>
                    Hot Leads
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('warm')}>
                    Warm Leads
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('cold')}>
                    Cold Leads
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Leads Table */}
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Lead</TableHead>
                    <TableHead>Contact Info</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Probability</TableHead>
                    <TableHead>Time Since Contact</TableHead>
                    <TableHead>Actions</TableHead>
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
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-3 h-3 text-muted-foreground" />
                            <span className="text-foreground">{lead.phone}</span>
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <Badge className={`${statusColors[lead.status]} font-medium`}>
                          {lead.status.toUpperCase()}
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
                                lead.conversionProbability >= 80 ? 'bg-success' :
                                lead.conversionProbability >= 50 ? 'bg-warning' : 'bg-muted-foreground'
                              }`}
                              style={{ width: `${lead.conversionProbability}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm text-foreground">
                            {formatDistanceToNow(lead.initialContact, { addSuffix: true })}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Last activity: {formatDistanceToNow(lead.lastActivity, { addSuffix: true })}
                          </p>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => handleSendToOdoo(lead.id, lead.name)}
                            className="btn-primary text-xs px-3 py-1 h-8"
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Send to Odoo
                          </Button>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Edit Lead</DropdownMenuItem>
                              <DropdownMenuItem>Add Note</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                Delete Lead
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}