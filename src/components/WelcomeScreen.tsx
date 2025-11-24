import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
// 1. Eliminamos BarChart3 de las importaciones
import { MessageCircle, Users, Database, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: MessageCircle,
    title: 'Chat History',
    description: 'WhatsApp-style conversation tracking with real-time messaging',
    path: '/chat-history',
    color: 'text-primary',
    bgColor: 'bg-primary/10'
  },
  // 2. Eliminamos el objeto de Analytics Dashboard de aquí
  {
    icon: Users,
    title: 'Lead Management',
    description: 'Track leads with conversion probability and Odoo integration',
    path: '/lead-tracking',
    color: 'text-warning',
    bgColor: 'bg-warning/10'
  }
];


export const WelcomeScreen = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-12 px-4">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center space-y-6 max-w-4xl mx-auto"
      >
        <div className="flex items-center justify-center space-x-4 mb-8">
          <motion.div
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-elegant"
          >
            <img 
              src="/lovable-uploads/582c88f8-0549-4bc4-9e32-51c836850bb7.png" 
              alt="LITS Manager Logo" 
              className="w-12 h-12 object-contain"
            />
          </motion.div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
              Welcome to <span className="text-gradient">LITS Manager</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Your complete lead administration and conversation tracking solution
            </p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2 font-medium">
            <Database className="w-4 h-4 mr-2" />
            MongoDB Atlas Ready
          </Badge>
          <Badge className="bg-secondary/10 text-secondary border-secondary/20 px-4 py-2 font-medium">
            <Sparkles className="w-4 h-4 mr-2" />
            Modern UI/UX
          </Badge>
        </motion.div>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        // 3. AQUÍ OCURRE LA MAGIA DEL CENTRADO:
        // Cambiamos 'md:grid-cols-3' a 'md:grid-cols-2'
        // Cambiamos 'max-w-6xl' a 'max-w-4xl' para que se vean más juntas y estéticas
        className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto w-full"
      >
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group"
            >
              <Link to={feature.path}>
                <Card className="card-elegant hover-lift h-full cursor-pointer group-hover:shadow-glow transition-all duration-300">
                  <CardContent className="p-8 text-center space-y-6">
                    <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center ${feature.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-8 h-8 ${feature.color}`} />
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full group-hover:border-primary group-hover:text-primary transition-colors duration-300"
                    >
                      Explore Feature
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Quick Stats - Limpiado para quitar referencias a Analytics */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="text-center space-y-4"
      >
        <h3 className="text-lg font-semibold text-muted-foreground">
          Ready to manage your leads efficiently?
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span>Real-time Chat Tracking</span>
          </div>
          {/* Eliminada la estadística de Visual Analytics */}
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-warning rounded-full animate-pulse"></div>
            <span>Odoo Integration</span>
          </div>
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        {/* Actualizado para ir a Chat History en lugar de Dashboard */}
        <Link to="/chat-history">
          <Button size="lg" className="btn-primary px-8 py-4 text-lg font-semibold shadow-glow">
            Get Started
          </Button>
        </Link>
      </motion.div>
    </div>
  );
};