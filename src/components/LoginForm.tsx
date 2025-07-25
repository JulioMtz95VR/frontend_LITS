import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { GoogleSignInButton } from './GoogleSignInButton';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

export const LoginForm = () => {
  const [isGoogleMode, setIsGoogleMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { simulateEmailLogin } = useAuthStore();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      simulateEmailLogin(email, password);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary via-secondary/90 to-primary/20 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="card-elegant backdrop-blur-lg border border-border bg-white">
          <CardHeader className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-lg"
            >
              <img 
                src="/lovable-uploads/582c88f8-0549-4bc4-9e32-51c836850bb7.png" 
                alt="LITS Manager Logo" 
                className="w-12 h-12 object-contain"
              />
            </motion.div>
            <div>
              <CardTitle className="text-2xl font-bold text-foreground">
                Welcome to LITS Manager
              </CardTitle>
              <CardDescription className="text-foreground/80 mt-2">
                Lead administration and conversation tracking
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Authentication Mode Toggle */}
            <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-foreground/80" />
                <span className="text-foreground font-medium">
                  {isGoogleMode ? 'Google Sign-In' : 'Email & Password'}
                </span>
              </div>
              <Switch
                checked={isGoogleMode}
                onCheckedChange={setIsGoogleMode}
                className="data-[state=checked]:bg-primary"
              />
            </div>

            {/* Login Methods */}
            <motion.div
              key={isGoogleMode ? 'google' : 'email'}
              initial={{ opacity: 0, x: isGoogleMode ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {isGoogleMode ? (
                <GoogleSignInButton />
              ) : (
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-foreground">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-primary"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading || !email || !password}
                    className="w-full btn-primary h-12 font-medium"
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>
              )}
            </motion.div>

            <div className="text-center">
              <p className="text-foreground/70 text-sm">
                Don't have an account?{' '}
                <button className="text-primary hover:underline font-medium">
                  Contact Admin
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};