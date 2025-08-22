import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  FileText, 
  Megaphone, 
  Store, 
  Users, 
  LogOut,
  UserCircle,
  Bell,
  Settings,
  Menu,
  Shield
} from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  const { user, signOut } = useAuth();
  const { isAdmin } = useUserRole();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully."
    });
  };

  const handleAdminClick = () => {
    navigate('/admin');
  };

  const navItems = [
    { id: "reports", label: "Reports", icon: FileText },
    { id: "announcements", label: "Announcements", icon: Megaphone },
    { id: "vendors", label: "Services", icon: Store },
    { id: "community", label: "Community", icon: Users },
  ];

  return (
    <nav className="nav-professional sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Professional Logo & Brand */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-10 h-10 bg-trust-gradient rounded-xl flex items-center justify-center shadow-elegant">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h1 className="text-xl font-heading font-bold text-foreground">CommUnity</h1>
              <p className="text-xs text-muted-foreground font-medium">Professional Platform</p>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => onTabChange(item.id)}
                  className={`nav-item ${isActive ? 'nav-item-active' : ''} relative group`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></div>
                  )}
                </Button>
              );
            })}
          </div>

          {/* Admin & User Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            {isAdmin && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleAdminClick}
                className="btn-secondary border-2 hover:border-primary/30 hover:bg-primary/5"
              >
                <Settings className="w-4 h-4 mr-2" />
                Admin Portal
                <Shield className="w-3 h-3 ml-2 text-primary" />
              </Button>
            )}
            
            {user && (
              <div className="flex items-center space-x-3 pl-4 border-l border-border">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
                    <UserCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-foreground truncate max-w-[120px]">
                      {user.email?.split('@')[0] || 'User'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {isAdmin ? 'Administrator' : 'Community Member'}
                    </div>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleSignOut}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="lg:hidden flex items-center space-x-2">
            {user && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSignOut}
                className="text-muted-foreground hover:text-destructive"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            )}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[320px] bg-card">
                <div className="flex flex-col space-y-6 mt-6">
                  {/* Mobile Header */}
                  <div className="flex items-center space-x-4 pb-6 border-b border-border">
                    <div className="w-12 h-12 bg-trust-gradient rounded-xl flex items-center justify-center shadow-elegant">
                      <span className="text-white font-bold text-xl">C</span>
                    </div>
                    <div>
                      <h2 className="text-lg font-heading font-bold">CommUnity</h2>
                      <p className="text-sm text-muted-foreground">Professional Platform</p>
                    </div>
                  </div>
                  
                  {/* User Info */}
                  {user && (
                    <div className="pb-4 border-b border-border">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
                          <UserCircle className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">
                            {user.email?.split('@')[0] || 'User'}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {user.email}
                          </div>
                        </div>
                      </div>
                      {isAdmin && (
                        <Badge variant="secondary" className="mt-3 bg-primary/10 text-primary border-primary/20">
                          <Shield className="w-3 h-3 mr-1" />
                          Administrator
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  {/* Navigation Items */}
                  <div className="space-y-2">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <Button
                          key={item.id}
                          variant="ghost"
                          className={`w-full justify-start h-12 ${isActive ? 'bg-primary/10 text-primary border border-primary/20' : 'hover:bg-muted'}`}
                          onClick={() => onTabChange(item.id)}
                        >
                          <Icon className="w-5 h-5 mr-3" />
                          {item.label}
                        </Button>
                      );
                    })}
                    
                    {isAdmin && (
                      <Button
                        variant="outline"
                        className="w-full justify-start h-12 mt-4 btn-secondary"
                        onClick={handleAdminClick}
                      >
                        <Settings className="w-5 h-5 mr-3" />
                        Admin Portal
                        <Shield className="w-4 h-4 ml-auto text-primary" />
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;