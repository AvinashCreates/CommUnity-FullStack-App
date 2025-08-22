import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Shield, Lock, Mail, User, Eye, EyeOff } from 'lucide-react';

const AdminAuth = () => {
  const { user, loading, signIn, signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading admin portal...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/admin" replace />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Handle default admin credentials
    if (formData.email === 'admin@community.local' && formData.password === 'admin123') {
      // Try to sign in with default credentials, create if doesn't exist
      let { error } = await signIn(formData.email, formData.password);
      
      if (error) {
        // If sign in fails, try to create the default admin account
        const signUpResult = await signUp(formData.email, formData.password, 'System Administrator');
        if (!signUpResult.error) {
          // After creating, try to sign in again
          await signIn(formData.email, formData.password);
        }
      }
    } else {
      await signIn(formData.email, formData.password);
    }
    
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // For admin signup, we'll add metadata to identify this as an admin request
    const { error } = await signUp(formData.email, formData.password, formData.name);
    
    if (!error) {
      console.log('Admin account created - awaiting approval');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-hero-gradient p-4">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Professional Admin Login Card */}
      <Card className="w-full max-w-md card-elevated relative z-10 animate-fade-in-scale">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="mx-auto">
            <div className="w-16 h-16 bg-trust-gradient rounded-2xl flex items-center justify-center shadow-elegant mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-headline font-heading">Admin Portal</CardTitle>
            <CardDescription className="text-body-small">
              Secure access for platform administrators
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted/50">
              <TabsTrigger value="signin" className="font-medium">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="font-medium">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin" className="mt-6">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="form-group">
                  <Label htmlFor="admin-signin-email" className="form-label">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Admin Email
                  </Label>
                  <Input
                    id="admin-signin-email"
                    name="email"
                    type="email"
                    placeholder="admin@company.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <Label htmlFor="admin-signin-password" className="form-label">
                    <Lock className="w-4 h-4 inline mr-2" />
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="admin-signin-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter secure password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="form-input pr-12"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full btn-primary h-12 font-semibold" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-4 w-4" />
                      Access Admin Portal
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup" className="mt-6">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="form-group">
                  <Label htmlFor="admin-signup-name" className="form-label">
                    <User className="w-4 h-4 inline mr-2" />
                    Full Name
                  </Label>
                  <Input
                    id="admin-signup-name"
                    name="name"
                    type="text"
                    placeholder="Administrator Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <Label htmlFor="admin-signup-email" className="form-label">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Official Email
                  </Label>
                  <Input
                    id="admin-signup-email"
                    name="email"
                    type="email"
                    placeholder="admin@organization.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <Label htmlFor="admin-signup-password" className="form-label">
                    <Lock className="w-4 h-4 inline mr-2" />
                    Secure Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="admin-signup-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create strong password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="form-input pr-12"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full btn-primary h-12 font-semibold" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <User className="mr-2 h-4 w-4" />
                      Request Admin Access
                    </>
                  )}
                </Button>
                
                <p className="text-xs text-muted-foreground text-center bg-muted/30 p-3 rounded-lg">
                  <Shield className="w-3 h-3 inline mr-1" />
                  Admin accounts require approval before activation
                </p>
              </form>
            </TabsContent>
          </Tabs>
          
          {/* Default Credentials Info */}
          <div className="mt-6 space-y-4">
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <Shield className="w-4 h-4 text-primary" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-primary">Default Admin Credentials</p>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p><strong>Email:</strong> admin@community.local</p>
                    <p><strong>Password:</strong> admin123</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Change these credentials immediately after first login
                  </p>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Looking for user access?{' '}
                <a href="/auth" className="text-primary hover:text-primary-hover font-medium transition-colors">
                  Community Login →
                </a>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAuth;