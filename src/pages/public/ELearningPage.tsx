import React, { useState } from 'react';
import { GraduationCap, Star, Search as SearchIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import PublicNav from '../../components/layout/PublicNav';

const ELearningPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');

  const categories = [
    { id: 'all', name: 'All Courses', count: 18 },
    { id: 'development', name: 'Development Practices', count: 6 },
    { id: 'management', name: 'Project Management', count: 4 },
    { id: 'sustainability', name: 'Sustainability', count: 4 },
    { id: 'community', name: 'Community Engagement', count: 4 }
  ];

  const levels = [
    { id: 'all', name: 'All Levels' },
    { id: 'beginner', name: 'Beginner' },
    { id: 'intermediate', name: 'Intermediate' },
    { id: 'advanced', name: 'Advanced' }
  ];

  const courses = [
    {
      id: '1',
      title: 'Fundamentals of Community Development',
      description: 'Learn the core principles and practices of effective community development work.',
      instructor: 'Dr. Sarah Johnson',
      duration: '6 weeks',
      lessons: 24,
      students: 1250,
      rating: 4.8,
      price: 'Free',
      category: 'development',
      level: 'beginner',
      image: '/api/placeholder/300/200',
      featured: true,
      skills: ['Community Assessment', 'Stakeholder Engagement', 'Project Planning'],
      certificate: true
    },
    {
      id: '2',
      title: 'Project Management for Social Impact',
      description: 'Master project management techniques specifically designed for social impact initiatives.',
      instructor: 'Michael Chen',
      duration: '8 weeks',
      lessons: 32,
      students: 892,
      rating: 4.9,
      price: '$49',
      category: 'management',
      level: 'intermediate',
      image: '/api/placeholder/300/200',
      featured: false,
      skills: ['Agile Management', 'Risk Assessment', 'Impact Measurement'],
      certificate: true
    },
    {
      id: '3',
      title: 'Sustainable Development Goals Implementation',
      description: 'Comprehensive guide to implementing and monitoring SDG-aligned projects.',
      instructor: 'Emma Rodriguez',
      duration: '10 weeks',
      lessons: 40,
      students: 567,
      rating: 4.7,
      price: '$99',
      category: 'sustainability',
      level: 'advanced',
      image: '/api/placeholder/300/200',
      featured: true,
      skills: ['SDG Framework', 'Policy Analysis', 'Monitoring & Evaluation'],
      certificate: true
    },
    {
      id: '4',
      title: 'Digital Tools for Development Work',
      description: 'Learn to leverage technology and digital tools to enhance development outcomes.',
      instructor: 'James Wilson',
      duration: '4 weeks',
      lessons: 16,
      students: 1105,
      rating: 4.6,
      price: 'Free',
      category: 'development',
      level: 'beginner',
      image: '/api/placeholder/300/200',
      featured: false,
      skills: ['Digital Literacy', 'Data Analysis', 'Remote Collaboration'],
      certificate: false
    },
    {
      id: '5',
      title: 'Community Engagement and Participation',
      description: 'Master the art of meaningful community engagement and participatory development.',
      instructor: 'Maria Santos',
      duration: '6 weeks',
      lessons: 28,
      students: 734,
      rating: 4.8,
      price: '$29',
      category: 'community',
      level: 'intermediate',
      image: '/api/placeholder/300/200',
      featured: false,
      skills: ['Facilitation', 'Participatory Methods', 'Cultural Sensitivity'],
      certificate: true
    },
    {
      id: '6',
      title: 'Financial Management for NGOs',
      description: 'Essential financial management skills for non-profit organizations and development projects.',
      instructor: 'Lisa Thompson',
      duration: '5 weeks',
      lessons: 20,
      students: 456,
      rating: 4.5,
      price: '$39',
      category: 'management',
      level: 'intermediate',
      image: '/api/placeholder/300/200',
      featured: false,
      skills: ['Budget Planning', 'Financial Reporting', 'Grant Management'],
      certificate: true
    }
  ];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const featuredCourses = courses.filter(course => course.featured);

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-text-primary mb-4">
            {t('elearning.title', 'Learning for Impact')}
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Build skills that matter with our comprehensive catalog of development and social impact courses.
          </p>
        </div>

        {/* Featured Courses */}
        {featuredCourses.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-text-primary mb-6">Featured Courses</h2>
            <div className="grid lg:grid-cols-2 gap-8">
              {featuredCourses.slice(0, 2).map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-background-light rounded-t-lg flex items-center justify-center">
                    <GraduationCap size={56} className="text-primary/70" />
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="primary" size="sm">Featured</Badge>
                      <Badge 
                        variant={course.price === 'Free' ? 'success' : 'secondary'} 
                        size="sm"
                      >
                        {course.price}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl line-clamp-2">{course.title}</CardTitle>
                    <p className="text-text-secondary line-clamp-3">{course.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-secondary">Instructor: {course.instructor}</span>
                        <div className="flex items-center space-x-1">
                          <Star size={16} className="text-warning fill-warning" />
                          <span>{course.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-text-secondary">
                        <span>{course.duration} • {course.lessons} lessons</span>
                        <span>{course.students} students</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {course.skills.slice(0, 3).map((skill, index) => (
                          <Badge key={index} variant="secondary" size="sm">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      <Button className="w-full">
                        {course.price === 'Free' ? 'Start Learning' : 'Enroll Now'}
                      </Button>
                    </div>
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
                placeholder="Search courses..."
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

            {/* Level Filter */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Difficulty Level</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {levels.map((level) => (
                    <button
                      key={level.id}
                      onClick={() => setSelectedLevel(level.id)}
                      className={`w-full text-left p-2 rounded-lg transition-colors ${
                        selectedLevel === level.id
                          ? 'bg-primary-light text-primary'
                          : 'hover:bg-background-light text-text-secondary'
                      }`}
                    >
                      {level.name}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Learning Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Learning Community</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">5,044</div>
                    <div className="text-text-secondary text-sm">Active Learners</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success">18</div>
                    <div className="text-text-secondary text-sm">Courses</div>
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
            {/* Results Header */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-text-primary mb-2">
                {selectedCategory === 'all' ? 'All Courses' : categories.find(c => c.id === selectedCategory)?.name}
              </h2>
              <div className="text-text-secondary text-sm">
                Showing {filteredCourses.length} courses
              </div>
            </div>

            {/* Course Grid */}
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <div className="aspect-video bg-background-light rounded-t-lg flex items-center justify-center">
                      <GraduationCap size={48} className="text-primary/70" />
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge 
                        variant={course.price === 'Free' ? 'success' : 'secondary'} 
                        size="sm"
                      >
                        {course.price}
                      </Badge>
                    </div>
                    {course.certificate && (
                      <div className="absolute top-2 left-2">
                        <Badge variant="primary" size="sm">Certificate</Badge>
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                    <p className="text-text-secondary text-sm line-clamp-3">
                      {course.description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm text-text-secondary">
                        by {course.instructor}
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-1">
                          <Star size={16} className="text-warning fill-warning" />
                          <span>{course.rating}</span>
                          <span className="text-text-secondary">({course.students})</span>
                        </div>
                        <Badge 
                          variant={
                            course.level === 'beginner' ? 'success' :
                            course.level === 'intermediate' ? 'warning' : 'error'
                          } 
                          size="sm"
                        >
                          {course.level}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between text-sm text-text-secondary">
                        <span>{course.duration}</span>
                        <span>{course.lessons} lessons</span>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {course.skills.slice(0, 2).map((skill, index) => (
                          <Badge key={index} variant="secondary" size="sm">
                            {skill}
                          </Badge>
                        ))}
                      </div>

                      <Button className="w-full">
                        {course.price === 'Free' ? 'Start Learning' : 'Enroll Now'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Empty State */}
            {filteredCourses.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4"><SearchIcon size={64} className="mx-auto text-muted" /></div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">No courses found</h3>
                <p className="text-text-secondary">
                  Try adjusting your search terms or filters.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16">
          <Card className="text-center">
            <CardContent className="py-12">
              <h3 className="text-2xl font-bold text-text-primary mb-4">
                Ready to make an impact?
              </h3>
              <p className="text-text-secondary mb-8 max-w-2xl mx-auto">
                Join thousands of learners who are building skills to create positive change in their communities.
              </p>
              <div className="flex justify-center space-x-4">
                <Button>Browse All Courses</Button>
                <Button variant="secondary">Create Account</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ELearningPage;
