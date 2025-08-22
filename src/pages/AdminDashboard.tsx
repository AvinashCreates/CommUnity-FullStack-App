import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { Loader2 } from "lucide-react";

const AdminDashboardPage = () => {
  const { user, loading } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();

  // Show loading while checking authentication
  if (loading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Redirect to admin auth if not logged in
  if (!user) {
    return <Navigate to="/admin-auth" replace />;
  }

  // Redirect to main app if not admin
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <AdminDashboard />;
};

export default AdminDashboardPage;