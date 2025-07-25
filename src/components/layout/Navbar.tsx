import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MessageCircle, BarChart3, Users, LogOut, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navigationItems = [
  { path: '/chat-history', label: 'Chat History', icon: MessageCircle },
  { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { path: '/lead-tracking', label: 'Lead Tracking', icon: Users },
];

export const Navbar = () => {
  const { user, logout } = useAuthStore();
  const location = useLocation();

  if (!user) return null;

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="bg-secondary border-b border-white/10 shadow-lg sticky top-0 z-50 backdrop-blur-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <Link to="/dashboard" className="flex items-center space-x-3 hover-lift">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <img 
                src="/lovable-uploads/582c88f8-0549-4bc4-9e32-51c836850bb7.png" 
                alt="LITS Manager" 
                className="w-6 h-6 object-contain"
              />
            </div>
            <span className="text-xl font-bold text-white">LITS Manager</span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-1">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <Link key={item.path} to={item.path}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="ghost"
                      className={`
                        flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300
                        ${isActive 
                          ? 'bg-primary text-white shadow-glow' 
                          : 'text-white/80 hover:text-white hover:bg-white/10'
                        }
                      `}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{item.label}</span>
                    </Button>
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-9 w-9 border-2 border-white/20">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-primary text-white font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </motion.div>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="end" className="w-56 bg-card border border-border/50 shadow-elegant">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium text-sm text-foreground">{user.name}</p>
                  <p className="w-[200px] truncate text-xs text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer hover:bg-muted">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="cursor-pointer hover:bg-destructive/10 text-destructive focus:text-destructive"
                onClick={logout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  );
};