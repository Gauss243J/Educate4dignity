import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { trackEvent } from '../../utils/analytics';

const DonorPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'recurring' | 'impact' | 'profile'>('overview');
  const recurring = [
    { id: 'R001', project: 'Clean Water Initiative', amount: 50, currency: 'USD', interval: 'monthly', status: 'active' },
    { id: 'R002', project: 'Digital Literacy Program', amount: 25, currency: 'USD', interval: 'monthly', status: 'active' }
  ];
  const history = [
    { id: 'H001', date: '2024-12-01', project: 'Clean Water Initiative', amount: 100, currency: 'USD', method: 'Stripe' },
    { id: 'H002', date: '2024-11-15', project: 'Digital Literacy Program', amount: 75, currency: 'USD', method: 'Stripe' },
  ];

  const totalDonated = history.reduce((s, h) => s + h.amount, 0) + recurring.reduce((s, r) => s + r.amount, 0);

  const getStatusVariant = (s: string) => {
    switch (s) {
      case 'active': return 'success';
      case 'paused': return 'warning';
      case 'cancelled': return 'error';
      default: return 'secondary';
    }
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Donor Portal</h1>
          <p className="text-text-secondary">Track your giving and impact</p>
        </div>
        <Button onClick={() => trackEvent({ name: 'donor_portal_new_donation_click' })}>New Donation</Button>
      </div>

      <div className="mb-6 border-b border-border">
        <div className="flex space-x-8">
          {['overview','history','recurring','impact','profile'].map(t => (
            <button key={t} onClick={() => setActiveTab(t as any)} className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab===t? 'border-primary text-primary':'border-transparent text-text-secondary hover:text-text-primary'}`}>{t}</button>
          ))}
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader><CardTitle>Total Donated</CardTitle></CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">${totalDonated}</div>
              <div className="text-text-secondary text-sm">All time</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Active Recurring</CardTitle></CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">{recurring.length}</div>
              <div className="text-text-secondary text-sm">Monthly plans</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Projects Supported</CardTitle></CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-warning">{new Set([...history.map(h=>h.project), ...recurring.map(r=>r.project)]).size}</div>
              <div className="text-text-secondary text-sm">Unique projects</div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'history' && (
        <Card>
          <CardHeader><CardTitle>Donation History</CardTitle></CardHeader>
          <CardContent className="p-0">
            <table className="w-full">
              <thead className="bg-background-light border-b border-border">
                <tr>
                  <th className="p-4 text-left text-sm font-medium text-text-primary">Date</th>
                  <th className="p-4 text-left text-sm font-medium text-text-primary">Project</th>
                  <th className="p-4 text-left text-sm font-medium text-text-primary">Amount</th>
                  <th className="p-4 text-left text-sm font-medium text-text-primary">Method</th>
                </tr>
              </thead>
              <tbody>
                {history.map(h => (
                  <tr key={h.id} className="border-b border-border hover:bg-background-light">
                    <td className="p-4 text-text-secondary">{new Date(h.date).toLocaleDateString()}</td>
                    <td className="p-4 text-text-secondary">{h.project}</td>
                    <td className="p-4 font-medium text-text-primary">${h.amount}</td>
                    <td className="p-4 text-text-secondary">{h.method}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {activeTab === 'recurring' && (
        <Card>
          <CardHeader><CardTitle>Recurring Donations</CardTitle></CardHeader>
          <CardContent className="p-0">
            <table className="w-full">
              <thead className="bg-background-light border-b border-border">
                <tr>
                  <th className="p-4 text-left text-sm font-medium text-text-primary">Project</th>
                  <th className="p-4 text-left text-sm font-medium text-text-primary">Amount</th>
                  <th className="p-4 text-left text-sm font-medium text-text-primary">Interval</th>
                  <th className="p-4 text-left text-sm font-medium text-text-primary">Status</th>
                  <th className="p-4 text-left text-sm font-medium text-text-primary">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recurring.map(r => (
                  <tr key={r.id} className="border-b border-border hover:bg-background-light">
                    <td className="p-4 text-text-secondary">{r.project}</td>
                    <td className="p-4 font-medium text-text-primary">${r.amount}</td>
                    <td className="p-4 text-text-secondary">{r.interval}</td>
                    <td className="p-4"><Badge variant={getStatusVariant(r.status)} size="sm">{r.status}</Badge></td>
                    <td className="p-4 flex space-x-2"><Button size="sm" variant="secondary">Pause</Button><Button size="sm" variant="secondary">Cancel</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {activeTab === 'impact' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Impact Metrics</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between"><span>People Reached</span><span className="font-medium">12,450</span></div>
                <div className="flex justify-between"><span>Communities Supported</span><span className="font-medium">34</span></div>
                <div className="flex justify-between"><span>Projects Sustained</span><span className="font-medium">8</span></div>
                <div className="flex justify-between"><span>Avg. Project Completion</span><span className="font-medium">78%</span></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Recent Updates</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {[1,2,3].map(i => (
                <div key={i} className="p-4 border border-border rounded-lg">
                  <div className="font-medium text-text-primary mb-1">Update #{i}</div>
                  <p className="text-sm text-text-secondary">Progress update for supported project with photos and field notes placeholder.</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="max-w-xl space-y-6">
          <Card>
            <CardHeader><CardTitle>Profile Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input value="Jane Smith" readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input value="jane@example.com" readOnly />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Preferred Language</label>
                <select className="w-full bg-background border border-border rounded-md p-2 text-sm">
                  <option>English</option>
                  <option>Français</option>
                </select>
              </div>
              <Button variant="primary">Update Preferences</Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DonorPortal;
