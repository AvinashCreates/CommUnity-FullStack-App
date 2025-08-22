import { useState } from "react";
import { Navigate } from "react-router-dom";
import Navigation from "@/components/ui/navigation";
import HeroSection from "@/components/sections/HeroSection";
import ReportSection from "@/components/sections/ReportSection";
import AnnouncementsSection from "@/components/sections/AnnouncementsSection";
import VendorsSection from "@/components/sections/VendorsSection";
import CommunitySection from "@/components/sections/CommunitySection";
import { useUserRole } from "@/hooks/useUserRole";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("reports");
  const { user, loading } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();

  // Show loading while checking authentication
  if (loading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading platform...</p>
        </div>
      </div>
    );
  }

  // Redirect to auth if not logged in
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "reports":
        return <ReportSection />;
      case "announcements":
        return <AnnouncementsSection />;
      case "vendors":
        return <VendorsSection />;
      case "community":
        return <CommunitySection />;
      case "admin":
        return isAdmin ? <Navigate to="/admin" replace /> : <ReportSection />;
      default:
        return <ReportSection />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="animate-fade-in-up">
        {renderContent()}
      </main>
      
      {/* Professional Footer */}
      <footer className="bg-card border-t border-border mt-16">
        <div className="container-custom py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-trust-gradient rounded-xl flex items-center justify-center shadow-elegant">
                  <span className="text-white font-bold text-lg">C</span>
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg">CommUnity</h3>
                  <p className="text-xs text-muted-foreground">Professional Platform</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Enterprise-grade community management platform empowering civic engagement and local commerce.
              </p>
            </div>

            {/* Platform Links */}
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Platform</h4>
              <div className="space-y-2">
                <button onClick={() => setActiveTab("reports")} className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                  Report Issues
                </button>
                <button onClick={() => setActiveTab("announcements")} className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                  Announcements
                </button>
                <button onClick={() => setActiveTab("vendors")} className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                  Local Services
                </button>
                <button onClick={() => setActiveTab("community")} className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                  Community Hub
                </button>
              </div>
            </div>

            {/* Support */}
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Support</h4>
              <div className="space-y-2">
                <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                  Help Center
                </a>
                <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contact Support
                </a>
                <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                  System Status
                </a>
                <a href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                  Documentation
                </a>
              </div>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Connect</h4>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Professional community management solutions for modern municipalities.
                </p>
                <div className="flex space-x-2 pt-2">
                  <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center hover:bg-primary/10 transition-colors cursor-pointer">
                    <span className="text-xs font-medium">L</span>
                  </div>
                  <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center hover:bg-primary/10 transition-colors cursor-pointer">
                    <span className="text-xs font-medium">T</span>
                  </div>
                  <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center hover:bg-primary/10 transition-colors cursor-pointer">
                    <span className="text-xs font-medium">G</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © 2024 CommUnity Platform. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Accessibility
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;