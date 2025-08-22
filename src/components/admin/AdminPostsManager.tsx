import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, MessageSquare, Trash2, Eye, Search, Calendar, Tag, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Post {
  id: string;
  content: string;
  type: string;
  likes_count: number;
  comments_count: number;
  tags: string[] | null;
  created_at: string;
  user_id: string;
  profiles?: {
    name: string;
    email: string;
  };
}

const AdminPostsManager = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      // First get all posts
      const { data: postsData, error: postsError } = await supabase
        .from('community_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (postsError) throw postsError;

      // Then get profile data for each user
      const postsWithProfiles = await Promise.all(
        (postsData || []).map(async (post) => {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('name, email')
            .eq('user_id', post.user_id)
            .maybeSingle();

          return {
            ...post,
            profiles: profileData || undefined
          };
        })
      );

      setPosts(postsWithProfiles);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch posts",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (postId: string) => {
    setDeleting(postId);
    try {
      const { error } = await supabase.rpc('delete_community_post', {
        post_id: postId
      });

      if (error) throw error;

      setPosts(posts.filter(post => post.id !== postId));
      toast({
        title: "Success",
        description: "Post deleted successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete post",
        variant: "destructive"
      });
    } finally {
      setDeleting(null);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'announcement':
        return <MessageSquare className="h-4 w-4" />;
      case 'discussion':
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const variants = {
      text: 'secondary',
      announcement: 'default',
      discussion: 'outline'
    } as const;

    return (
      <Badge variant={variants[type as keyof typeof variants] || 'secondary'}>
        {type}
      </Badge>
    );
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.profiles?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = filterType === 'all' || post.type === filterType;
    
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Community Posts Management</h2>
        <p className="text-muted-foreground">
          Monitor and manage all community posts and discussions
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts, users, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 border border-input rounded-md bg-background text-sm"
        >
          <option value="all">All Types</option>
          <option value="text">Text Posts</option>
          <option value="announcement">Announcements</option>
          <option value="discussion">Discussions</option>
        </select>
      </div>

      {/* Posts Grid */}
      <div className="grid gap-4">
        {filteredPosts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No posts found</h3>
              <p className="text-muted-foreground text-center">
                {searchTerm || filterType !== 'all' ? 
                  'Try adjusting your search or filter criteria.' :
                  'No community posts have been created yet.'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex items-start space-x-3 min-w-0 flex-1">
                    <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                      {getTypeIcon(post.type)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <User className="h-3 w-3 mr-1" />
                          {post.profiles?.name || 'Unknown User'}
                        </div>
                        {getTypeBadge(post.type)}
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedPost(post)}
                      className="flex items-center gap-1"
                    >
                      <Eye className="h-3 w-3" />
                      <span className="hidden sm:inline">View</span>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={deleting === post.id}
                          className="flex items-center gap-1"
                        >
                          {deleting === post.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Trash2 className="h-3 w-3" />
                          )}
                          <span className="hidden sm:inline">Delete</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Post</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this post? This action cannot be undone and will also remove all associated likes and comments.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deletePost(post.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete Post
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm line-clamp-3 mb-3">{post.content}</p>
                
                {post.tags && post.tags.length > 0 && (
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="h-3 w-3 text-muted-foreground" />
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {post.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{post.tags.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    {post.likes_count || 0} likes
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    {post.comments_count || 0} comments
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Post Detail Dialog */}
      <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Post Details</DialogTitle>
            <DialogDescription>
              View full post content and details
            </DialogDescription>
          </DialogHeader>
          
          {selectedPost && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    {getTypeIcon(selectedPost.type)}
                  </div>
                  <div>
                    <p className="font-medium">{selectedPost.profiles?.name || 'Unknown User'}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(selectedPost.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                {getTypeBadge(selectedPost.type)}
              </div>
              
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="whitespace-pre-wrap">{selectedPost.content}</p>
              </div>
              
              {selectedPost.tags && selectedPost.tags.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedPost.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-4 pt-4 border-t">
                <span className="flex items-center gap-2 text-sm">
                  <MessageSquare className="h-4 w-4" />
                  {selectedPost.likes_count || 0} likes
                </span>
                <span className="flex items-center gap-2 text-sm">
                  <MessageSquare className="h-4 w-4" />
                  {selectedPost.comments_count || 0} comments
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPostsManager;