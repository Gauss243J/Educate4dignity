import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import AdminPage from '../../components/admin/AdminPage';

const BeneficiariesManagement: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const beneficiaries = [
    {
      id: 'BEN001',
      name: 'Kibera Community Water Group',
      type: 'Community',
      category: 'Water Access',
      location: 'Kibera, Kenya',
      status: 'active',
      members: 1250,
      coordinator: 'Mary Wanjiku',
      phone: '+254 722 123 456',
      projectsCount: 3,
      impact: {
        waterAccess: 95,
        educationReach: 450,
        economicImprovement: 78
      },
      registrationDate: '2023-06-15',
      lastUpdate: '2024-12-10'
    },
    {
      id: 'BEN002',
      name: 'Digital Bridge Academy',
      type: 'Institution',
      category: 'Education',
      location: 'Accra, Ghana',
      status: 'active',
      members: 850,
      coordinator: 'Kwame Asante',
      phone: '+233 244 567 890',
      projectsCount: 2,
      impact: {
        waterAccess: 0,
        educationReach: 850,
        economicImprovement: 65
      },
      registrationDate: '2023-09-20',
      lastUpdate: '2024-12-08'
    },
    {
      id: 'BEN003',
      name: 'Rural Women Cooperative',
      type: 'Cooperative',
      category: 'Economic Empowerment',
      location: 'Dodoma, Tanzania',
      status: 'review',
      members: 320,
      coordinator: 'Grace Mwangi',
      phone: '+255 789 234 567',
      projectsCount: 1,
      impact: {
        waterAccess: 40,
        educationReach: 180,
        economicImprovement: 85
      },
      registrationDate: '2024-01-10',
      lastUpdate: '2024-12-05'
    },
    {
      id: 'BEN004',
      name: 'Youth Innovation Hub',
      type: 'Youth Group',
      category: 'Technology',
      location: 'Lagos, Nigeria',
      status: 'pending',
      members: 95,
      coordinator: 'Adaora Okafor',
      phone: '+234 803 345 678',
      projectsCount: 1,
      impact: {
        waterAccess: 0,
        educationReach: 95,
        economicImprovement: 45
      },
      registrationDate: '2024-11-15',
      lastUpdate: '2024-12-01'
    },
    {
      id: 'BEN005',
      name: 'Maasai Pastoralist Network',
      type: 'Community',
      category: 'Sustainability',
      location: 'Maasai Mara, Kenya',
      status: 'active',
      members: 680,
      coordinator: 'Joseph Sankale',
      phone: '+254 710 456 789',
      projectsCount: 2,
      impact: {
        waterAccess: 70,
        educationReach: 280,
        economicImprovement: 60
      },
      registrationDate: '2023-03-12',
      lastUpdate: '2024-12-12'
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'Water Access', label: 'Water Access' },
    { value: 'Education', label: 'Education' },
    { value: 'Economic Empowerment', label: 'Economic Empowerment' },
    { value: 'Technology', label: 'Technology' },
    { value: 'Sustainability', label: 'Sustainability' }
  ];

  const statuses = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'review', label: 'Under Review' },
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' }
  ];

  const filteredBeneficiaries = beneficiaries.filter(beneficiary => {
    const matchesSearch = beneficiary.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         beneficiary.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         beneficiary.coordinator.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || beneficiary.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || beneficiary.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'review': return 'warning';
      case 'pending': return 'secondary';
      case 'completed': return 'primary';
      default: return 'secondary';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Community': return '🏘️';
      case 'Institution': return '🏫';
      case 'Cooperative': return '🤝';
      case 'Youth Group': return '👥';
      default: return '📋';
    }
  };

  const totalBeneficiaries = beneficiaries.reduce((sum, b) => sum + b.members, 0);
  const totalProjects = beneficiaries.reduce((sum, b) => sum + b.projectsCount, 0);

  return (
    <AdminPage title={t('admin.beneficiaries')}>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-text-secondary text-sm">Manage beneficiary communities and track impact</p>
          </div>
          <Button>+ Register New Beneficiary</Button>
        </div>
      </div>

      {/* Impact Summary */}
      <div className="grid md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center">
              <div className="p-2 bg-primary-light rounded-lg">
                <span className="text-primary text-xl">👥</span>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-text-primary">{totalBeneficiaries.toLocaleString()}</div>
                <div className="text-text-secondary text-sm">Total Beneficiaries</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center">
              <div className="p-2 bg-success-light rounded-lg">
                <span className="text-success text-xl">🏘️</span>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-text-primary">{beneficiaries.length}</div>
                <div className="text-text-secondary text-sm">Communities</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center">
              <div className="p-2 bg-warning-light rounded-lg">
                <span className="text-warning text-xl">📊</span>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-text-primary">{totalProjects}</div>
                <div className="text-text-secondary text-sm">Active Projects</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center">
              <div className="p-2 bg-primary-light rounded-lg">
                <span className="text-primary text-xl">💧</span>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-text-primary">
                  {Math.round(beneficiaries.reduce((sum, b) => sum + (b.impact.waterAccess * b.members / 100), 0))}
                </div>
                <div className="text-text-secondary text-sm">Water Access</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search beneficiaries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {categories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {statuses.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </div>

      {/* Beneficiaries Grid */}
      <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
        {filteredBeneficiaries.map((beneficiary) => (
          <Card key={beneficiary.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-2xl">{getTypeIcon(beneficiary.type)}</span>
                    <Badge variant="secondary" size="sm">{beneficiary.type}</Badge>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{beneficiary.name}</CardTitle>
                  <div className="text-text-secondary text-sm">{beneficiary.id}</div>
                </div>
                <Badge variant={getStatusVariant(beneficiary.status)} size="sm">
                  {beneficiary.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Basic Info */}
                <div>
                  <div className="text-sm text-text-secondary mb-2">
                    📍 {beneficiary.location}<br />
                    👨‍💼 {beneficiary.coordinator}<br />
                    📱 {beneficiary.phone}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-text-secondary">Members:</span>
                    <span className="font-medium text-text-primary">{beneficiary.members.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-text-secondary">Projects:</span>
                    <span className="font-medium text-text-primary">{beneficiary.projectsCount}</span>
                  </div>
                </div>

                {/* Category */}
                <div>
                  <Badge variant="primary" size="sm">{beneficiary.category}</Badge>
                </div>

                {/* Impact Metrics */}
                <div>
                  <div className="text-sm font-medium text-text-primary mb-2">Impact Metrics</div>
                  <div className="space-y-2">
                    {beneficiary.impact.waterAccess > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-text-secondary">Water Access:</span>
                        <span className="text-sm font-medium">{beneficiary.impact.waterAccess}%</span>
                      </div>
                    )}
                    {beneficiary.impact.educationReach > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-text-secondary">Education Reach:</span>
                        <span className="text-sm font-medium">{beneficiary.impact.educationReach} people</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-text-secondary">Economic Improvement:</span>
                      <span className="text-sm font-medium">{beneficiary.impact.economicImprovement}%</span>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="text-xs text-text-secondary">
                  Registered: {new Date(beneficiary.registrationDate).toLocaleDateString()}<br />
                  Last Update: {new Date(beneficiary.lastUpdate).toLocaleDateString()}
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Button size="sm" variant="secondary" className="flex-1">View Profile</Button>
                  <Button size="sm" variant="secondary" className="flex-1">Contact</Button>
                  <Button size="sm" variant="secondary" className="flex-1">Reports</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Impact Analytics */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {categories.slice(1).map((category) => {
                const count = beneficiaries.filter(b => b.category === category.value).length;
                const percentage = beneficiaries.length > 0 ? (count / beneficiaries.length) * 100 : 0;
                return (
                  <div key={category.value}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{category.label}</span>
                      <span>{count} communities</span>
                    </div>
                    <div className="w-full bg-background-light rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {beneficiaries
                .sort((a, b) => new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime())
                .slice(0, 5)
                .map((beneficiary) => (
                  <div key={beneficiary.id} className="flex items-center space-x-3">
                    <span>{getTypeIcon(beneficiary.type)}</span>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-text-primary">{beneficiary.name}</div>
                      <div className="text-xs text-text-secondary">
                        Updated {new Date(beneficiary.lastUpdate).toLocaleDateString()}
                      </div>
                    </div>
                    <Badge variant={getStatusVariant(beneficiary.status)} size="sm">
                      {beneficiary.status}
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
  </AdminPage>
  );
};

export default BeneficiariesManagement;
