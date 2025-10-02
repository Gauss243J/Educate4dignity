import React, { useState } from 'react';
import { Search as SearchIcon, Star, Book, FileText, Download, Video, Wrench } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import PublicNav from '../../components/layout/PublicNav';

const ResourcesPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Resources', count: 24 },
    { id: 'guides', name: 'Implementation Guides', count: 8 },
    { id: 'reports', name: 'Research Reports', count: 6 },
    { id: 'tools', name: 'Tools & Templates', count: 5 },
    { id: 'videos', name: 'Training Videos', count: 5 }
  ];

  const resources = [
    {
      id: '1',
      title: 'Community Water System Implementation Guide',
      description: 'Comprehensive guide for implementing sustainable water systems in rural communities.',
      category: 'guides',
      type: 'PDF',
      size: '2.5 MB',
      downloads: 1250,
      rating: 4.8,
      tags: ['water', 'implementation', 'community'],
      image: '/api/placeholder/300/200',
      downloadUrl: '#'
    },
    {
      id: '2',
      title: 'Digital Literacy Training Curriculum',
      description: 'Complete curriculum for teaching digital skills to underserved populations.',
      category: 'guides',
      type: 'ZIP',
      size: '15.2 MB',
      downloads: 892,
      rating: 4.9,
      tags: ['education', 'digital', 'training'],
      image: '/api/placeholder/300/200',
      downloadUrl: '#'
    },
    {
      id: '3',
      title: 'Impact Measurement Framework',
      description: 'Research-based framework for measuring social impact in development projects.',
      category: 'reports',
      type: 'PDF',
      size: '1.8 MB',
      downloads: 567,
      rating: 4.7,
      tags: ['research', 'impact', 'measurement'],
      image: '/api/placeholder/300/200',
      downloadUrl: '#'
    },
    {
      id: '4',
      title: 'Project Budget Template',
      description: 'Excel template for creating detailed project budgets with built-in calculations.',
      category: 'tools',
      type: 'XLSX',
      size: '0.8 MB',
      downloads: 2145,
      rating: 4.6,
      tags: ['budget', 'template', 'planning'],
      image: '/api/placeholder/300/200',
      downloadUrl: '#'
    },
    {
      id: '5',
      title: 'Community Engagement Best Practices',
      description: 'Video series on effective community engagement strategies.',
      category: 'videos',
      type: 'MP4',
      size: '45.6 MB',
      downloads: 734,
      rating: 4.8,
      tags: ['community', 'engagement', 'training'],
      image: '/api/placeholder/300/200',
      downloadUrl: '#'
    },
    {
      id: '6',
      title: 'Sustainability Assessment Tool',
      description: 'Interactive tool for assessing project sustainability and long-term viability.',
      category: 'tools',
      type: 'WEB',
      size: 'Online',
      downloads: 456,
      rating: 4.5,
      tags: ['sustainability', 'assessment', 'tool'],
      image: '/api/placeholder/300/200',
      downloadUrl: '#'
    }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-4">
            {t('resources.title', 'Resource Library')}
          </h1>
          <p className="text-text-secondary text-lg">
            Free tools, guides, and resources to help implement impactful development projects.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Categories */}
          <div className="lg:w-1/4">
            <Card>
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

            {/* Quick Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Library Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">24</div>
                    <div className="text-text-secondary text-sm">Total Resources</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success">6,044</div>
                    <div className="text-text-secondary text-sm">Downloads</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-warning">4.7</div>
                    <div className="text-text-secondary text-sm">Avg Rating</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Search Bar */}
            <div className="mb-6">
              <Input
                placeholder="Search resources by title, description, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Resource Grid */}
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredResources.map((resource) => (
                <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <div className="aspect-video bg-background-light rounded-t-lg flex items-center justify-center">
                      <FileText size={48} className="text-primary/60" />
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" size="sm">{resource.type}</Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg line-clamp-2">{resource.title}</CardTitle>
                    <p className="text-text-secondary text-sm line-clamp-3">
                      {resource.description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {resource.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" size="sm">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="flex justify-between items-center text-sm text-text-secondary mb-4">
                      <div className="flex items-center space-x-4">
                        <span className="inline-flex items-center gap-1"><Download size={14} /> {resource.downloads}</span>
                        <span className="inline-flex items-center gap-1"><Star size={14} className="text-yellow-500 fill-yellow-500" /> {resource.rating}</span>
                      </div>
                      <span>{resource.size}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1">
                        Download
                      </Button>
                      <Button size="sm" variant="outline">
                        Preview
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Empty State */}
            {filteredResources.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4"><SearchIcon size={64} className="mx-auto text-muted" /></div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">No resources found</h3>
                <p className="text-text-secondary">
                  Try adjusting your search terms or browse different categories.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Featured Resources Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-text-primary mb-6">Featured Resources</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardContent className="py-8">
                <div className="text-4xl mb-4"><Book size={48} className="mx-auto" /></div>
                <h3 className="font-bold text-text-primary mb-2">Getting Started Guide</h3>
                <p className="text-text-secondary mb-4">
                  Complete guide for organizations new to development work.
                </p>
                <Button>Download Guide</Button>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="py-8">
                <div className="text-4xl mb-4"><Video size={48} className="mx-auto" /></div>
                <h3 className="font-bold text-text-primary mb-2">Training Video Series</h3>
                <p className="text-text-secondary mb-4">
                  Video tutorials on project management and implementation.
                </p>
                <Button>Watch Videos</Button>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="py-8">
                <div className="text-4xl mb-4"><Wrench size={48} className="mx-auto" /></div>
                <h3 className="font-bold text-text-primary mb-2">Template Collection</h3>
                <p className="text-text-secondary mb-4">
                  Ready-to-use templates for planning and documentation.
                </p>
                <Button>Get Templates</Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="py-8">
              <h3 className="text-xl font-bold text-text-primary mb-4">
                Need a specific resource?
              </h3>
              <p className="text-text-secondary mb-6">
                Can't find what you're looking for? Request custom resources or suggest additions to our library.
              </p>
              <div className="flex justify-center space-x-4">
                <Button>Request Resource</Button>
                <Button variant="outline">Submit Suggestion</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;
