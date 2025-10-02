import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

const DistributorPortal: React.FC = () => {
  const deliveries = [
    { id: 'DEL001', region: 'West Africa', items: 540, status: 'in_transit', eta: '2024-12-27' },
    { id: 'DEL002', region: 'East Africa', items: 320, status: 'delivered', eta: '2024-12-22' },
    { id: 'DEL003', region: 'North Africa', items: 180, status: 'preparing', eta: '2024-12-30' }
  ];

  const getStatusVariant = (s: string) => {
    switch (s) {
      case 'delivered': return 'success';
      case 'in_transit': return 'primary';
      case 'preparing': return 'warning';
      default: return 'secondary';
    }
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Distributor Portal</h1>
          <p className="text-text-secondary">Track regional distribution and logistics</p>
        </div>
        <Button>Create Distribution</Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader><CardTitle>Active Deliveries</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{deliveries.filter(d => d.status !== 'delivered').length}</div>
            <div className="text-text-secondary text-sm">In progress</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Delivered This Month</CardTitle></CardHeader>
            <CardContent>
            <div className="text-3xl font-bold text-success">42</div>
            <div className="text-text-secondary text-sm">Shipments</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Average Lead Time</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning">6d</div>
            <div className="text-text-secondary text-sm">From dispatch</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Deliveries</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead className="bg-background-light border-b border-border">
              <tr>
                <th className="p-4 text-left text-sm font-medium text-text-primary">Delivery ID</th>
                <th className="p-4 text-left text-sm font-medium text-text-primary">Region</th>
                <th className="p-4 text-left text-sm font-medium text-text-primary">Items</th>
                <th className="p-4 text-left text-sm font-medium text-text-primary">Status</th>
                <th className="p-4 text-left text-sm font-medium text-text-primary">ETA</th>
                <th className="p-4 text-left text-sm font-medium text-text-primary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {deliveries.map(o => (
                <tr key={o.id} className="border-b border-border hover:bg-background-light">
                  <td className="p-4 font-medium text-text-primary">{o.id}</td>
                  <td className="p-4 text-text-secondary">{o.region}</td>
                  <td className="p-4 text-text-secondary">{o.items}</td>
                  <td className="p-4"><Badge variant={getStatusVariant(o.status)} size="sm">{o.status}</Badge></td>
                  <td className="p-4 text-text-secondary">{new Date(o.eta).toLocaleDateString()}</td>
                  <td className="p-4 flex space-x-2"><Button size="sm" variant="secondary">View</Button><Button size="sm" variant="secondary">Docs</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DistributorPortal;
