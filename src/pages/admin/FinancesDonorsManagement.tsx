import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';

const FinancesDonorsManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'donors' | 'transactions' | 'reports'>('overview');
  const [searchTerm, setSearchTerm] = useState('');

  const financialOverview = {
    totalDonations: 2485000,
    monthlyDonations: 156000,
    totalDonors: 3247,
    activeDonors: 1892,
    averageDonation: 765,
    recurringDonors: 1156
  };

  const recentDonors = [
    {
      id: 'DON001',
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      type: 'individual',
      status: 'active',
      totalDonated: 2500,
      lastDonation: '2024-12-15',
      frequency: 'monthly',
      preferredProjects: ['Clean Water Initiative'],
      country: 'United States'
    },
    {
      id: 'DON002',
      name: 'Global Impact Foundation',
      email: 'contact@globalimpact.org',
      type: 'foundation',
      status: 'active',
      totalDonated: 50000,
      lastDonation: '2024-12-10',
      frequency: 'quarterly',
      preferredProjects: ['Digital Literacy Program', 'Sustainability Projects'],
      country: 'United Kingdom'
    },
    {
      id: 'DON003',
      name: 'Michael Chen',
      email: 'mchen@tech.com',
      type: 'individual',
      status: 'active',
      totalDonated: 1200,
      lastDonation: '2024-12-08',
      frequency: 'one-time',
      preferredProjects: ['General Fund'],
      country: 'Canada'
    },
    {
      id: 'DON004',
      name: 'TechCorp Solutions',
      email: 'csr@techcorp.com',
      type: 'corporate',
      status: 'active',
      totalDonated: 25000,
      lastDonation: '2024-12-05',
      frequency: 'annual',
      preferredProjects: ['Digital Literacy Program'],
      country: 'Germany'
    }
  ];

  const recentTransactions = [
    {
      id: 'TXN001',
      donor: 'Sarah Johnson',
      amount: 100,
      project: 'Clean Water Initiative',
      method: 'Stripe',
      status: 'completed',
      date: '2024-12-15',
      reference: 'STR_2024_001',
      type: 'donation'
    },
    {
      id: 'TXN002',
      donor: 'Global Impact Foundation',
      amount: 12500,
      project: 'Digital Literacy Program',
      method: 'Bank Transfer',
      status: 'completed',
      date: '2024-12-10',
      reference: 'BT_2024_045',
      type: 'grant'
    },
    {
      id: 'TXN003',
      donor: 'Michael Chen',
      amount: 250,
      project: 'General Fund',
      method: 'Stripe',
      status: 'completed',
      date: '2024-12-08',
      reference: 'STR_2024_002',
      type: 'donation'
    },
    {
      id: 'TXN004',
      donor: 'TechCorp Solutions',
      amount: 5000,
      project: 'Digital Literacy Program',
      method: 'Corporate Account',
      status: 'pending',
      date: '2024-12-05',
      reference: 'CORP_2024_008',
      type: 'sponsorship'
    }
  ];

  const getDonorTypeIcon = (type: string) => {
    switch (type) {
      case 'individual': return '👤';
      case 'foundation': return '🏛️';
      case 'corporate': return '🏢';
      default: return '💼';
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'error';
      case 'active': return 'success';
      default: return 'secondary';
    }
  };

  const filteredDonors = recentDonors.filter(donor =>
    donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    donor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Finances & Donors</h1>
            <p className="text-text-secondary">Manage financial operations and donor relationships</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="secondary">Export Report</Button>
            <Button>Add Manual Transaction</Button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-6">
        <div className="border-b border-border">
          <div className="flex space-x-8">
            {[
              { key: 'overview', label: 'Overview', icon: '📊' },
              { key: 'donors', label: 'Donors', icon: '💝' },
              { key: 'transactions', label: 'Transactions', icon: '💳' },
              { key: 'reports', label: 'Reports', icon: '📈' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.key
                    ? 'border-primary text-primary'
                    : 'border-transparent text-text-secondary hover:text-text-primary'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Financial Summary */}
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card>
              <CardContent className="py-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    ${financialOverview.totalDonations.toLocaleString()}
                  </div>
                  <div className="text-text-secondary text-sm">Total Donations</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">
                    ${financialOverview.monthlyDonations.toLocaleString()}
                  </div>
                  <div className="text-text-secondary text-sm">This Month</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-warning">
                    {financialOverview.totalDonors.toLocaleString()}
                  </div>
                  <div className="text-text-secondary text-sm">Total Donors</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {financialOverview.activeDonors.toLocaleString()}
                  </div>
                  <div className="text-text-secondary text-sm">Active Donors</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">
                    ${financialOverview.averageDonation}
                  </div>
                  <div className="text-text-secondary text-sm">Avg Donation</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-warning">
                    {financialOverview.recurringDonors.toLocaleString()}
                  </div>
                  <div className="text-text-secondary text-sm">Recurring</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts and Recent Activity */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Donations Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-background-light rounded-lg flex items-center justify-center">
                  <div className="text-center text-text-secondary">
                    <div className="text-4xl mb-2">📈</div>
                    <div>Chart visualization would go here</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Donor Type Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <span>👤</span>
                      <span>Individual Donors</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">65%</div>
                      <div className="text-text-secondary text-sm">2,110 donors</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <span>🏢</span>
                      <span>Corporate</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">25%</div>
                      <div className="text-text-secondary text-sm">812 donors</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <span>🏛️</span>
                      <span>Foundations</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">10%</div>
                      <div className="text-text-secondary text-sm">325 donors</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Donors Tab */}
      {activeTab === 'donors' && (
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search donors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="secondary">Filter</Button>
            <Button variant="secondary">Export</Button>
          </div>

          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredDonors.map((donor) => (
              <Card key={donor.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-xl">{getDonorTypeIcon(donor.type)}</span>
                        <Badge variant="secondary" size="sm">{donor.type}</Badge>
                      </div>
                      <CardTitle className="text-lg">{donor.name}</CardTitle>
                      <div className="text-text-secondary text-sm">{donor.email}</div>
                    </div>
                    <Badge variant={getStatusVariant(donor.status)} size="sm">
                      {donor.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-xl font-bold text-primary">
                          ${donor.totalDonated.toLocaleString()}
                        </div>
                        <div className="text-text-secondary text-xs">Total Donated</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-success">{donor.frequency}</div>
                        <div className="text-text-secondary text-xs">Frequency</div>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-text-primary mb-1">Preferred Projects</div>
                      <div className="flex flex-wrap gap-1">
                        {donor.preferredProjects.map((project, index) => (
                          <Badge key={index} variant="primary" size="sm">
                            {project}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="text-sm text-text-secondary">
                      📍 {donor.country}<br />
                      🕒 Last donation: {new Date(donor.lastDonation).toLocaleDateString()}
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="secondary" className="flex-1">View Profile</Button>
                      <Button size="sm" variant="secondary" className="flex-1">Contact</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-background-light border-b border-border">
                    <tr>
                      <th className="text-left p-4 font-medium text-text-primary">Date</th>
                      <th className="text-left p-4 font-medium text-text-primary">Donor</th>
                      <th className="text-left p-4 font-medium text-text-primary">Amount</th>
                      <th className="text-left p-4 font-medium text-text-primary">Project</th>
                      <th className="text-left p-4 font-medium text-text-primary">Method</th>
                      <th className="text-left p-4 font-medium text-text-primary">Status</th>
                      <th className="text-left p-4 font-medium text-text-primary">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTransactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b border-border hover:bg-background-light">
                        <td className="p-4 text-text-secondary">
                          {new Date(transaction.date).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <div className="font-medium text-text-primary">{transaction.donor}</div>
                          <div className="text-text-secondary text-sm">{transaction.reference}</div>
                        </td>
                        <td className="p-4">
                          <div className="font-medium text-text-primary">
                            ${transaction.amount.toLocaleString()}
                          </div>
                          <Badge variant="secondary" size="sm">{transaction.type}</Badge>
                        </td>
                        <td className="p-4 text-text-secondary">{transaction.project}</td>
                        <td className="p-4 text-text-secondary">{transaction.method}</td>
                        <td className="p-4">
                          <Badge variant={getStatusVariant(transaction.status)} size="sm">
                            {transaction.status}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex space-x-2">
                            <Button size="sm" variant="secondary">View</Button>
                            <Button size="sm" variant="secondary">Receipt</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="py-8 text-center">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="font-bold text-text-primary mb-2">Financial Summary</h3>
                <p className="text-text-secondary text-sm mb-4">
                  Comprehensive financial overview and metrics
                </p>
                <Button>Generate Report</Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="py-8 text-center">
                <div className="text-4xl mb-4">💝</div>
                <h3 className="font-bold text-text-primary mb-2">Donor Analytics</h3>
                <p className="text-text-secondary text-sm mb-4">
                  Detailed donor behavior and retention analysis
                </p>
                <Button>Generate Report</Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="py-8 text-center">
                <div className="text-4xl mb-4">📈</div>
                <h3 className="font-bold text-text-primary mb-2">Tax Reports</h3>
                <p className="text-text-secondary text-sm mb-4">
                  Tax-deductible donation reports for compliance
                </p>
                <Button>Generate Report</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancesDonorsManagement;
