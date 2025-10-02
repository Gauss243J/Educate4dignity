import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';

const SuppliersManagement: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const suppliers = [
    {
      id: 'SUP001',
      name: 'Global Water Solutions Ltd.',
      type: 'Equipment',
      status: 'active',
      location: 'Kenya',
      contact: 'contact@globalwater.co.ke',
      phone: '+254 123 456 789',
      projects: 8,
      lastOrder: '2024-12-10',
      rating: 4.8,
      certification: ['ISO 9001', 'Water Quality Certified'],
      products: ['Water Pumps', 'Filtration Systems', 'Storage Tanks']
    },
    {
      id: 'SUP002',
      name: 'EduTech Innovations',
      type: 'Technology',
      status: 'active',
      location: 'Ghana',
      contact: 'info@edutech.com.gh',
      phone: '+233 987 654 321',
      projects: 12,
      lastOrder: '2024-12-08',
      rating: 4.9,
      certification: ['CE Marked', 'Educational Standards'],
      products: ['Tablets', 'Learning Software', 'Solar Chargers']
    },
    {
      id: 'SUP003',
      name: 'Community Seeds Network',
      type: 'Agriculture',
      status: 'pending',
      location: 'Tanzania',
      contact: 'seeds@network.co.tz',
      phone: '+255 456 789 123',
      projects: 3,
      lastOrder: '2024-11-25',
      rating: 4.6,
      certification: ['Organic Certified', 'Fair Trade'],
      products: ['Seeds', 'Tools', 'Training Materials']
    },
    {
      id: 'SUP004',
      name: 'Solar Power Africa',
      type: 'Energy',
      status: 'inactive',
      location: 'South Africa',
      contact: 'info@solarafrica.co.za',
      phone: '+27 321 654 987',
      projects: 15,
      lastOrder: '2024-10-15',
      rating: 4.5,
      certification: ['Solar Standards', 'Environmental Compliance'],
      products: ['Solar Panels', 'Batteries', 'Inverters']
    }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status', count: suppliers.length },
    { value: 'active', label: 'Active', count: suppliers.filter(s => s.status === 'active').length },
    { value: 'pending', label: 'Pending', count: suppliers.filter(s => s.status === 'pending').length },
    { value: 'inactive', label: 'Inactive', count: suppliers.filter(s => s.status === 'inactive').length }
  ];

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || supplier.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'pending': return 'warning';
      case 'inactive': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">{t('admin.suppliers')}</h1>
            <p className="text-text-secondary">Manage suppliers and vendor relationships</p>
          </div>
          <Button>+ Add New Supplier</Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center">
              <div className="p-2 bg-primary-light rounded-lg">
                <span className="text-primary text-xl">🏢</span>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-text-primary">{suppliers.length}</div>
                <div className="text-text-secondary text-sm">Total Suppliers</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center">
              <div className="p-2 bg-success-light rounded-lg">
                <span className="text-success text-xl">✅</span>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-text-primary">
                  {suppliers.filter(s => s.status === 'active').length}
                </div>
                <div className="text-text-secondary text-sm">Active</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center">
              <div className="p-2 bg-warning-light rounded-lg">
                <span className="text-warning text-xl">⏳</span>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-text-primary">
                  {suppliers.filter(s => s.status === 'pending').length}
                </div>
                <div className="text-text-secondary text-sm">Pending</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center">
              <div className="p-2 bg-primary-light rounded-lg">
                <span className="text-primary text-xl">⭐</span>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-text-primary">4.7</div>
                <div className="text-text-secondary text-sm">Avg Rating</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search suppliers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex space-x-2">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedStatus(option.value)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                selectedStatus === option.value
                  ? 'bg-primary text-white'
                  : 'bg-background-light text-text-secondary hover:bg-border'
              }`}
            >
              {option.label} ({option.count})
            </button>
          ))}
        </div>
      </div>

      {/* Suppliers Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-background-light border-b border-border">
                <tr>
                  <th className="text-left p-4 font-medium text-text-primary">Supplier</th>
                  <th className="text-left p-4 font-medium text-text-primary">Type</th>
                  <th className="text-left p-4 font-medium text-text-primary">Location</th>
                  <th className="text-left p-4 font-medium text-text-primary">Projects</th>
                  <th className="text-left p-4 font-medium text-text-primary">Rating</th>
                  <th className="text-left p-4 font-medium text-text-primary">Status</th>
                  <th className="text-left p-4 font-medium text-text-primary">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSuppliers.map((supplier) => (
                  <tr key={supplier.id} className="border-b border-border hover:bg-background-light">
                    <td className="p-4">
                      <div>
                        <div className="font-medium text-text-primary">{supplier.name}</div>
                        <div className="text-text-secondary text-sm">{supplier.id}</div>
                        <div className="text-text-secondary text-sm">{supplier.contact}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="secondary" size="sm">{supplier.type}</Badge>
                    </td>
                    <td className="p-4 text-text-secondary">
                      {supplier.location}
                    </td>
                    <td className="p-4 text-text-secondary">
                      {supplier.projects} projects
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-1">
                        <span className="text-warning">⭐</span>
                        <span className="text-text-primary">{supplier.rating}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant={getStatusVariant(supplier.status)} size="sm">
                        {supplier.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <Button size="sm" variant="secondary">View</Button>
                        <Button size="sm" variant="secondary">Edit</Button>
                        <Button size="sm" variant="secondary">Contact</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button variant="secondary" className="h-16">
                <div className="text-center">
                  <div>📧</div>
                  <div className="text-xs">Send Newsletter</div>
                </div>
              </Button>
              <Button variant="secondary" className="h-16">
                <div className="text-center">
                  <div>📊</div>
                  <div className="text-xs">Performance Report</div>
                </div>
              </Button>
              <Button variant="secondary" className="h-16">
                <div className="text-center">
                  <div>💰</div>
                  <div className="text-xs">Payment Status</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SuppliersManagement;
