import React, { useState } from 'react';
import { Users, Lightbulb, Leaf, User, Target, Star, Mail, Phone, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import PublicNav from '../../components/layout/PublicNav';

const AboutContactPage: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '', type: 'general' });
  };

  const teamMembers = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Executive Director',
      bio: 'Leading sustainable development initiatives for over 15 years.',
      image: '/api/placeholder/150/150',
      linkedin: '#',
      email: 'sarah@educate4dignity.org'
    },
    {
      name: 'Michael Chen',
      role: 'Technology Director',
      bio: 'Expert in digital solutions for social impact and community empowerment.',
      image: '/api/placeholder/150/150',
      linkedin: '#',
      email: 'michael@educate4dignity.org'
    },
    {
      name: 'Emma Rodriguez',
      role: 'Operations Manager',
      bio: 'Ensuring efficient project delivery and community engagement.',
      image: '/api/placeholder/150/150',
      linkedin: '#',
      email: 'emma@educate4dignity.org'
    },
    {
      name: 'Dr. James Wilson',
      role: 'Research Director',
      bio: 'Leading research initiatives and impact measurement strategies.',
      image: '/api/placeholder/150/150',
      linkedin: '#',
      email: 'james@educate4dignity.org'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4 sm:mb-6 leading-tight">
            {t('about.title', 'About Educate4Dignity')}
          </h1>
          <p className="text-lg sm:text-xl text-text-secondary max-w-3xl mx-auto">
            We are dedicated to creating sustainable change through education, technology, 
            and community empowerment initiatives across the globe.
          </p>
        </div>

        {/* Mission & Vision */}
  <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-12 md:mb-16">
          <Card>
            <CardHeader>
              <div className="text-4xl mb-4"><Target className="w-10 h-10 text-primary/70" /></div>
              <CardTitle className="text-2xl">Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-text-secondary">
                To empower communities worldwide through sustainable development projects 
                that combine education, technology, and local engagement to create lasting 
                positive impact and human dignity.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="text-4xl mb-4"><Star className="w-10 h-10 text-primary/70" /></div>
              <CardTitle className="text-2xl">Our Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-text-secondary">
                A world where every community has access to the tools, knowledge, and 
                resources needed to thrive independently and sustainably, with dignity 
                and respect for all.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Impact Numbers */}
        <div className="bg-primary-light rounded-2xl p-6 sm:p-8 mb-12 md:mb-16">
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary text-center mb-6 sm:mb-8">Why Educate4Dignity</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">50,000+</div>
              <div className="text-text-secondary">Lives Impacted</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">120</div>
              <div className="text-text-secondary">Projects Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">25</div>
              <div className="text-text-secondary">Countries Reached</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">95%</div>
              <div className="text-text-secondary">Project Success Rate</div>
            </div>
          </div>
        </div>

        {/* Our Approach */}
        <div className="mb-12 md:mb-16">
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary text-center mb-6 sm:mb-8">Our Approach</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            <Card className="text-center">
              <CardContent className="py-8">
                <div className="text-4xl mb-4"><Users className="w-10 h-10 mx-auto text-primary/70" /></div>
                <h3 className="font-bold text-text-primary mb-4">Community-Centered</h3>
                <p className="text-text-secondary">
                  Every project begins and ends with the community. We work alongside 
                  local partners to ensure solutions are culturally appropriate and sustainable.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="py-8">
                <div className="text-4xl mb-4"><Lightbulb className="w-10 h-10 mx-auto text-primary/70" /></div>
                <h3 className="font-bold text-text-primary mb-4">Innovation-Driven</h3>
                <p className="text-text-secondary">
                  We leverage technology and innovative approaches to maximize impact 
                  while maintaining transparency and accountability.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="py-8">
                <div className="text-4xl mb-4"><Leaf className="w-10 h-10 mx-auto text-primary/70" /></div>
                <h3 className="font-bold text-text-primary mb-4">Sustainability-Focused</h3>
                <p className="text-text-secondary">
                  All our initiatives are designed for long-term sustainability, 
                  ensuring communities can continue to thrive independently.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-12 md:mb-16">
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary text-center mb-6 sm:mb-8">Meet Our Team</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center">
                <CardContent className="py-6">
                  <div className="w-24 h-24 bg-primary-light rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
                    <User className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-bold text-text-primary mb-1">{member.name}</h3>
                  <div className="text-primary text-sm mb-3">{member.role}</div>
                  <p className="text-text-secondary text-sm mb-4">{member.bio}</p>
                  <div className="flex justify-center space-x-2">
                    <Button size="sm" variant="secondary">LinkedIn</Button>
                    <Button size="sm" variant="secondary">Email</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Section */}
  <div className="grid lg:grid-cols-2 gap-10 lg:gap-12">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Get in Touch</CardTitle>
              <p className="text-text-secondary">
                We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      Name *
                    </label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-1">
                      Email *
                    </label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Inquiry Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="partnership">Partnership</option>
                    <option value="volunteer">Volunteering</option>
                    <option value="donation">Donation</option>
                    <option value="media">Media</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Subject *
                  </label>
                  <Input
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    placeholder="Brief subject of your message"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    placeholder="Your message..."
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="text-primary text-xl"><Mail className="w-5 h-5" /></div>
                  <div>
                    <div className="font-medium text-text-primary">Email</div>
                    <div className="text-text-secondary">info@educate4dignity.org</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="text-primary text-xl"><Phone className="w-5 h-5" /></div>
                  <div>
                    <div className="font-medium text-text-primary">Phone</div>
                    <div className="text-text-secondary">+1 (555) 123-4567</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="text-primary text-xl"><MapPin className="w-5 h-5" /></div>
                  <div>
                    <div className="font-medium text-text-primary">Address</div>
                    <div className="text-text-secondary">
                      123 Impact Street<br />
                      Development City, DC 12345<br />
                      United States
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Office Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-text-secondary">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span>10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>Closed</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Follow Us</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <Button variant="secondary" size="sm">Facebook</Button>
                  <Button variant="secondary" size="sm">Twitter</Button>
                  <Button variant="secondary" size="sm">LinkedIn</Button>
                  <Button variant="secondary" size="sm">Instagram</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutContactPage;
