import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  FileText, 
  Store, 
  Megaphone,
  Settings,
  BarChart3,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import AdminReportsManager from './AdminReportsManager';
import AdminVendorsManager from './AdminVendorsManager';
import AdminAnnouncementsManager from './AdminAnnouncementsManager';
import AdminPostsManager from './AdminPostsManager';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    {
      title: 'Total Reports',
      value: '48',
      description: 'Community reports submitted',
      icon: FileText,
      color: 'bg-primary'
    },
    {
      title: 'Active Vendors',
      value: '23',
      description: 'Registered service providers',
      icon: Store,
      color: 'bg-success'
    },
    {
      title: 'Announcements',
      value: '12',
      description: 'Published announcements',
      icon: Megaphone,
      color: 'bg-accent'
    },
    {
      title: 'Community Members',
      value: '156',
      description: 'Registered users',
      icon: Users,
      color: 'bg-secondary'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'report',
      title: 'New report: Broken streetlight on Main St',
      status: 'pending',
      time: '2 hours ago'
    },
    {
      id: 2,
      type: 'vendor',
      title: 'New vendor registration: Green Cleaning Co',
      status: 'approved',
      time: '4 hours ago'
    },
    {
      id: 3,
      type: 'announcement',
      title: 'Published: Road closure notice',
      status: 'published',
      time: '1 day ago'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-warning" />;
      case 'approved':
      case 'published':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'secondary',
      approved: 'default',
      published: 'default',
      rejected: 'destructive'
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-trust-gradient rounded-lg flex items-center justify-center">
                <Settings className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">Manage your community platform</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="overflow-x-auto">
              <TabsList className="grid w-full min-w-fit grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
                <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
                <TabsTrigger value="reports" className="text-xs sm:text-sm">Reports</TabsTrigger>
                <TabsTrigger value="vendors" className="text-xs sm:text-sm">Vendors</TabsTrigger>
                <TabsTrigger value="announcements" className="text-xs sm:text-sm">Announcements</TabsTrigger>
                <TabsTrigger value="posts" className="text-xs sm:text-sm">Posts</TabsTrigger>
              </TabsList>
            </div>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <div className={`p-2 rounded-md ${stat.color}`}>
                      <stat.icon className="h-4 w-4 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Recent Activity</span>
                </CardTitle>
                <CardDescription>
                  Latest updates and activities across the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(activity.status)}
                        <div>
                          <p className="font-medium">{activity.title}</p>
                          <p className="text-sm text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                      {getStatusBadge(activity.status)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <AdminReportsManager />
          </TabsContent>

          <TabsContent value="vendors">
            <AdminVendorsManager />
          </TabsContent>

          <TabsContent value="announcements">
            <AdminAnnouncementsManager />
          </TabsContent>

          <TabsContent value="posts">
            <AdminPostsManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;