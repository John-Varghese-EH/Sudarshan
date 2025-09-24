
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateCommunityPosts } from '@/lib/mock-data';
import type { CommunityPost } from '@/lib/types';
import { batchModerateCommunityPosts } from '@/ai/flows/batch-moderate-community-posts';
import { ThumbsUp, ThumbsDown, MessageSquare, Search, EyeOff } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const CommunityPage: React.FC = () => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const { toast } = useToast();

  useEffect(() => {
    const fetchAndModeratePosts = async () => {
      const initialPosts = generateCommunityPosts(20);
      
      try {
        const postsToModerate = initialPosts.map(post => ({ id: post.id, text: post.content }));
        const moderationResults = await batchModerateCommunityPosts({ posts: postsToModerate });
        
        const moderationMap = new Map(moderationResults.results.map(r => [r.id, r]));

        const moderatedPosts = initialPosts.map(post => {
            const result = moderationMap.get(post.id);
            return {
                ...post,
                isFlagged: result ? !result.isAppropriate : false,
            };
        });

        setPosts(moderatedPosts);

      } catch (error) {
        console.error('Batch moderation failed:', error);
        toast({
            variant: 'destructive',
            title: 'Error Moderating Posts',
            description: 'Could not moderate community posts. Displaying all content unfiltered.'
        });
        // On error, display posts without moderation
        setPosts(initialPosts.map(p => ({...p, isFlagged: false})));
      } finally {
        setLoading(false);
      }
    };
    fetchAndModeratePosts();
  }, [toast]);

  const filteredAndSortedPosts = useMemo(() => {
    return posts
      .filter((post) =>
        post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return b.timestamp.getTime() - a.timestamp.getTime();
        }
        if (sortBy === 'oldest') {
          return a.timestamp.getTime() - b.timestamp.getTime();
        }
        return 0;
      });
  }, [posts, searchTerm, sortBy]);
  
  if (loading) {
    return (
        <div className="space-y-6">
            <Skeleton className="h-10 w-1/3 mb-4" />
            <Skeleton className="h-4 w-2/5" />
            <div className="flex justify-between items-center mt-6">
                 <Skeleton className="h-10 w-1/3" />
                 <Skeleton className="h-10 w-1/4" />
            </div>
            <div className="mt-6 space-y-4">
                {[...Array(3)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center gap-4">
                             <Skeleton className="h-12 w-12 rounded-full" />
                             <div className="space-y-2">
                                <Skeleton className="h-4 w-[150px]" />
                                <Skeleton className="h-3 w-[100px]" />
                             </div>
                        </CardHeader>
                        <CardContent>
                             <Skeleton className="h-4 w-full mb-2" />
                             <Skeleton className="h-4 w-3/4" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Community Hub</h1>
        <p className="text-muted-foreground">Discussions, questions, and insights from the community.</p>
      </div>

      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Filter by author or keyword..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredAndSortedPosts.map((post) => (
          <Card key={post.id} className={post.isFlagged ? 'border-destructive/50 bg-destructive/5' : ''}>
            <CardHeader className="flex flex-row items-start gap-4 pb-2">
              <Avatar>
                <AvatarImage src={post.avatarUrl} alt={post.author} data-ai-hint="person avatar" />
                <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="font-semibold">{post.author}</p>
                        <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(post.timestamp, { addSuffix: true })}
                        </p>
                    </div>
                    {post.isFlagged && <Badge variant="destructive">Harmful Content</Badge>}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {post.isFlagged ? (
                 <div className="flex flex-col items-center justify-center text-center p-6 bg-muted/50 rounded-md">
                    <EyeOff className="h-8 w-8 text-muted-foreground mb-2"/>
                    <p className="text-muted-foreground font-medium">This content has been hidden</p>
                    <p className="text-sm text-muted-foreground">Our AI moderator has determined this content may be inappropriate.</p>
                </div>
              ) : (
                <p className="text-base whitespace-pre-wrap">{post.content}</p>
              )}
            </CardContent>
            {!post.isFlagged && (
                <div className="flex justify-end items-center gap-4 p-4 pt-0">
                    <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground">
                        <ThumbsUp className="h-4 w-4" /> {post.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground">
                        <ThumbsDown className="h-4 w-4" /> {post.dislikes}
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground">
                        <MessageSquare className="h-4 w-4" /> {post.comments}
                    </Button>
                </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CommunityPage;
