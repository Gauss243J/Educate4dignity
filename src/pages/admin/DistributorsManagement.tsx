import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import AdminPage from '../../components/admin/AdminPage';

const DistributorsManagement: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');

  const distributors = [
    {
      id: 'DIST001',
      name: 'East Africa Distribution Network',
      region: 'East Africa',
      countries: ['Kenya', 'Uganda', 'Tanzania'],
      status: 'active',
      contact: 'coordinator@eadn.org',
      phone: '+254 700 123 456',
      activeProjects: 15,
      completedProjects: 42,
      coverage: '85%',
      performance: 92,
      lastReport: '2024-12-12',
      specialization: ['Water', 'Education', 'Health']
    },
    {
      id: 'DIST002',
      name: 'West African Community Partners',
      region: 'West Africa',
      countries: ['Ghana', 'Nigeria', 'Senegal'],
      status: 'active',
      contact: 'info@wacp.org',
      phone: '+233 245 678 901',
      activeProjects: 23,
      completedProjects: 67,
      coverage: '78%',
      performance: 88,
      lastReport: '2024-12-10',
      specialization: ['Agriculture', 'Technology', 'Training']
    },
    {
      id: 'DIST003',
      name: 'Southern Africa Development Hub',
      region: 'Southern Africa',
      countries: ['South Africa', 'Botswana', 'Zambia'],
      status: 'review',
      contact: 'hub@sadh.co.za',
      phone: '+27 11 234 5678',
      activeProjects: 8,
      completedProjects: 31,
      coverage: '65%',
      performance: 75,
      lastReport: '2024-12-05',
      specialization: ['Energy', 'Infrastructure', 'Sustainability']
    },
    {
      id: 'DIST004',
      name: 'Asian Impact Collective',
      region: 'Asia',
      countries: ['India', 'Bangladesh', 'Sri Lanka'],
      status: 'active',
      contact: 'operations@aic.asia',
      phone: '+91 98765 43210',
      activeProjects: 19,
      completedProjects: 53,
      coverage: '82%',
      performance: 90,
      lastReport: '2024-12-11',
      specialization: ['Digital Literacy', 'Water', 'Community Development']
    }
  ];

  const regions = [
    { value: 'all', label: 'All Regions' },
    { value: 'East Africa', label: 'East Africa' },
    { value: 'West Africa', label: 'West Africa' },
    { value: 'Southern Africa', label: 'Southern Africa' },
    { value: 'Asia', label: 'Asia' }
  ];

  const filteredDistributors = distributors.filter(distributor => {
    const matchesSearch = distributor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         distributor.countries.some(country => 
                           country.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRegion = selectedRegion === 'all' || distributor.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'review': return 'warning';
      case 'inactive': return 'secondary';
      default: return 'secondary';
    }
  };

  const getPerformanceColor = (performance: number) => {
    if (performance >= 90) return 'text-success';
    if (performance >= 75) return 'text-warning';
    return 'text-error';
  };

  return (
    <AdminPage title={t('admin.distributors')}>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-text-secondary text-sm">Manage distribution networks and regional partners</p>
          </div>
          <Button>+ Add New Distributor</Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center">
              <div className="p-2 bg-primary-light rounded-lg">
                <span className="text-primary text-xl">🌍</span>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-text-primary">{distributors.length}</div>
                <div className="text-text-secondary text-sm">Distribution Networks</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center">
              <div className="p-2 bg-success-light rounded-lg">
                <span className="text-success text-xl">📦</span>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-text-primary">
                  {distributors.reduce((sum, d) => sum + d.activeProjects, 0)}
                </div>
                <div className="text-text-secondary text-sm">Active Projects</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center">
              <div className="p-2 bg-warning-light rounded-lg">
                <span className="text-warning text-xl">🎯</span>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-text-primary">
                  {Math.round(distributors.reduce((sum, d) => sum + parseInt(d.coverage), 0) / distributors.length)}%
                </div>
                <div className="text-text-secondary text-sm">Avg Coverage</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center">
              <div className="p-2 bg-primary-light rounded-lg">
                <span className="text-primary text-xl">📊</span>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-text-primary">
                  {Math.round(distributors.reduce((sum, d) => sum + d.performance, 0) / distributors.length)}%
                </div>
                <div className="text-text-secondary text-sm">Avg Performance</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search distributors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {regions.map((region) => (
            <option key={region.value} value={region.value}>
              {region.label}
            </option>
          ))}
        </select>
      </div>

      {/* Distributors Grid */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {filteredDistributors.map((distributor) => (
          <Card key={distributor.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{distributor.name}</CardTitle>
                  <div className="text-text-secondary text-sm">{distributor.id}</div>
                </div>
                <Badge variant={getStatusVariant(distributor.status)} size="sm">
                  {distributor.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Coverage and Performance */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-xl font-bold text-primary">{distributor.activeProjects}</div>
                    <div className="text-text-secondary text-xs">Active</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-success">{distributor.completedProjects}</div>
                    <div className="text-text-secondary text-xs">Completed</div>
                  </div>
                  <div>
                    <div className={`text-xl font-bold ${getPerformanceColor(distributor.performance)}`}>
                      {distributor.performance}%
                    </div>
                    <div className="text-text-secondary text-xs">Performance</div>
                  </div>
                </div>

                {/* Coverage Bar */}
                <div>
                  <div className="flex justify-between text-sm text-text-secondary mb-1">
                    <span>Regional Coverage</span>
                    <span>{distributor.coverage}</span>
                  </div>
                  <div className="w-full bg-background-light rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: distributor.coverage }}
                    ></div>
                  </div>
                </div>

                {/* Countries */}
                <div>
                  <div className="text-sm font-medium text-text-primary mb-2">Coverage Areas</div>
                  <div className="flex flex-wrap gap-1">
                    {distributor.countries.map((country, index) => (
                      <Badge key={index} variant="secondary" size="sm">
                        {country}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Specializations */}
                <div>
                  <div className="text-sm font-medium text-text-primary mb-2">Specializations</div>
                  <div className="flex flex-wrap gap-1">
                    {distributor.specialization.map((spec, index) => (
                      <Badge key={index} variant="primary" size="sm">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Contact and Actions */}
                <div className="border-t border-border pt-4">
                  <div className="text-sm text-text-secondary mb-3">
                    📧 {distributor.contact}<br />
                    📱 {distributor.phone}<br />
                    📄 Last report: {new Date(distributor.lastReport).toLocaleDateString()}
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="secondary" className="flex-1">View Details</Button>
                    <Button size="sm" variant="secondary" className="flex-1">Contact</Button>
                    <Button size="sm" variant="secondary" className="flex-1">Reports</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Regional Performance Map */}
      <Card>
        <CardHeader>
          <CardTitle>Regional Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {regions.slice(1).map((region) => {
              const regionDistributors = distributors.filter(d => d.region === region.value);
              const avgPerformance = regionDistributors.length > 0 
                ? Math.round(regionDistributors.reduce((sum, d) => sum + d.performance, 0) / regionDistributors.length)
                : 0;
              const totalProjects = regionDistributors.reduce((sum, d) => sum + d.activeProjects, 0);
              
              return (
                <div key={region.value} className="text-center p-4 bg-background-light rounded-lg">
                  <div className="text-lg font-bold text-text-primary">{region.label}</div>
                  <div className="text-sm text-text-secondary mb-2">{regionDistributors.length} networks</div>
                  <div className="text-2xl font-bold text-primary mb-1">{totalProjects}</div>
                  <div className="text-text-secondary text-xs mb-2">Active Projects</div>
                  <div className={`text-lg font-bold ${getPerformanceColor(avgPerformance)}`}>
                    {avgPerformance}%
                  </div>
                  <div className="text-text-secondary text-xs">Performance</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
  </AdminPage>
  );
};

export default DistributorsManagement;
