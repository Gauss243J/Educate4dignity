import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import PublicNav from '../../components/layout/PublicNav';

const BlogPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Posts', count: 24 },
    { id: 'impact', name: 'Impact Stories', count: 8 },
    { id: 'insights', name: 'Insights', count: 6 },
    { id: 'updates', name: 'Project Updates', count: 7 },
    { id: 'research', name: 'Research', count: 3 }
  ];

  const blogPosts = [
    {
      id: '1',
      title: 'Transforming Lives Through Clean Water: A Year in Review',
      excerpt: 'How our water initiatives have impacted over 10,000 lives across rural communities.',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      author: 'Sarah Johnson',
      authorRole: 'Program Director',
      publishDate: '2024-12-15',
      readTime: '5 min read',
      category: 'impact',
      tags: ['water', 'impact', 'communities'],
      image: '/api/placeholder/400/250',
      featured: true
    },
    {
      id: '2',
      title: 'Digital Divide: Bridging Technology Gaps in Education',
      excerpt: 'Exploring innovative approaches to bring digital literacy to underserved populations.',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      author: 'Michael Chen',
      authorRole: 'Technology Lead',
      publishDate: '2024-12-10',
      readTime: '7 min read',
      category: 'insights',
      tags: ['education', 'technology', 'digital'],
      image: '/api/placeholder/400/250',
      featured: false
    },
    {
      id: '3',
      title: 'Q4 Progress Report: Key Milestones Achieved',
      excerpt: 'Comprehensive overview of our fourth quarter achievements and impact metrics.',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      author: 'Emma Rodriguez',
      authorRole: 'Operations Manager',
      publishDate: '2024-12-08',
      readTime: '4 min read',
      category: 'updates',
      tags: ['progress', 'milestones', 'quarterly'],
      image: '/api/placeholder/400/250',
      featured: false
    },
    {
      id: '4',
      title: 'The Economics of Sustainable Development: New Research Findings',
      excerpt: 'Latest research on cost-effective approaches to sustainable development projects.',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      author: 'Dr. James Wilson',
      authorRole: 'Research Director',
      publishDate: '2024-12-05',
      readTime: '10 min read',
      category: 'research',
      tags: ['research', 'economics', 'sustainability'],
      image: '/api/placeholder/400/250',
      featured: false
    },
    {
      id: '5',
      title: 'Community Voices: Stories from the Field',
      excerpt: 'Inspiring stories from beneficiaries and local partners working on the ground.',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      author: 'Maria Santos',
      authorRole: 'Community Coordinator',
      publishDate: '2024-12-01',
      readTime: '6 min read',
      category: 'impact',
      tags: ['community', 'stories', 'voices'],
      image: '/api/placeholder/400/250',
      featured: true
    },
    {
      id: '6',
      title: 'Innovation in Training: New Methodologies for Better Outcomes',
      excerpt: 'How we\'re revolutionizing training programs with innovative pedagogical approaches.',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
      author: 'Lisa Thompson',
      authorRole: 'Training Specialist',
      publishDate: '2024-11-28',
      readTime: '8 min read',
      category: 'insights',
      tags: ['training', 'innovation', 'methodology'],
      image: '/api/placeholder/400/250',
      featured: false
    }
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPosts = blogPosts.filter(post => post.featured);

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-text-primary mb-4">
            {t('blog.title', 'Stories & Insights')}
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Stay updated with our latest impact stories, research insights, and project developments.
          </p>
        </div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-text-primary mb-6">Featured Stories</h2>
            <div className="grid lg:grid-cols-2 gap-8">
              {featuredPosts.slice(0, 2).map((post) => (
                <Card key={post.id} className="hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-background-light rounded-t-lg flex items-center justify-center">
                    <span className="text-4xl">📰</span>
                  </div>
                  <CardHeader>
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="primary" size="sm">{post.category}</Badge>
                      <Badge variant="secondary" size="sm">Featured</Badge>
                    </div>
                    <CardTitle className="text-xl line-clamp-2">{post.title}</CardTitle>
                    <p className="text-text-secondary line-clamp-3">{post.excerpt}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-text-secondary mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-primary-light rounded-full flex items-center justify-center">
                          {post.author.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-text-primary">{post.author}</div>
                          <div className="text-xs">{post.authorRole}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div>{new Date(post.publishDate).toLocaleDateString()}</div>
                        <div className="text-xs">{post.readTime}</div>
                      </div>
                    </div>
                    <Button className="w-full">Read More</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            {/* Search */}
            <div className="mb-6">
              <Input
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Categories */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-primary-light text-primary'
                          : 'hover:bg-background-light text-text-secondary'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{category.name}</span>
                        <Badge variant="secondary" size="sm">{category.count}</Badge>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Newsletter Signup */}
            <Card>
              <CardHeader>
                <CardTitle>Stay Updated</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary text-sm mb-4">
                  Subscribe to our newsletter for the latest stories and updates.
                </p>
                <div className="space-y-3">
                  <Input placeholder="Your email address" type="email" />
                  <Button className="w-full">Subscribe</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* All Posts */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-text-primary mb-4">
                {selectedCategory === 'all' ? 'All Posts' : categories.find(c => c.id === selectedCategory)?.name}
              </h2>
              <div className="text-text-secondary text-sm">
                Showing {filteredPosts.length} posts
              </div>
            </div>

            <div className="space-y-6">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="hover:shadow-lg transition-shadow">
                  <div className="md:flex">
                    <div className="md:w-1/3">
                      <div className="aspect-video md:aspect-square bg-background-light rounded-t-lg md:rounded-l-lg md:rounded-t-none flex items-center justify-center">
                        <span className="text-4xl">📰</span>
                      </div>
                    </div>
                    <div className="md:w-2/3">
                      <CardHeader>
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="primary" size="sm">{post.category}</Badge>
                          {post.featured && <Badge variant="secondary" size="sm">Featured</Badge>}
                        </div>
                        <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                        <p className="text-text-secondary line-clamp-2">{post.excerpt}</p>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-sm text-text-secondary">
                            <div className="w-6 h-6 bg-primary-light rounded-full flex items-center justify-center text-xs">
                              {post.author.charAt(0)}
                            </div>
                            <span>{post.author}</span>
                            <span>•</span>
                            <span>{new Date(post.publishDate).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>{post.readTime}</span>
                          </div>
                          <Button size="sm">Read More</Button>
                        </div>
                      </CardContent>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Empty State */}
            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">No posts found</h3>
                <p className="text-text-secondary">
                  Try adjusting your search terms or browse different categories.
                </p>
              </div>
            )}

            {/* Load More */}
            {filteredPosts.length > 0 && (
              <div className="mt-8 text-center">
                <Button variant="secondary">Load More Posts</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
