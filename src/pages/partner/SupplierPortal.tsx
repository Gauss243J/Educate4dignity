import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

const SupplierPortal: React.FC = () => {
  const activeOrders = [
    { id: 'ORD001', project: 'Clean Water Initiative', items: 1200, status: 'processing', eta: '2025-01-05' },
    { id: 'ORD002', project: 'Digital Literacy Program', items: 300, status: 'shipped', eta: '2024-12-28' }
  ];

  const getStatusVariant = (s: string) => {
    switch (s) {
      case 'processing': return 'warning';
      case 'shipped': return 'primary';
      case 'delivered': return 'success';
      default: return 'secondary';
    }
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Supplier Portal</h1>
          <p className="text-text-secondary">Manage purchase orders and deliveries</p>
        </div>
        <Button>Create Quote</Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader><CardTitle>Active Orders</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{activeOrders.length}</div>
            <div className="text-text-secondary text-sm">Current processing</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Fulfillment Rate</CardTitle></CardHeader>
            <CardContent>
            <div className="text-3xl font-bold text-success">96%</div>
            <div className="text-text-secondary text-sm">On-time delivery</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Pending Invoices</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning">3</div>
            <div className="text-text-secondary text-sm">Awaiting payment</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Purchase Orders</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead className="bg-background-light border-b border-border">
              <tr>
                <th className="p-4 text-left text-sm font-medium text-text-primary">Order ID</th>
                <th className="p-4 text-left text-sm font-medium text-text-primary">Project</th>
                <th className="p-4 text-left text-sm font-medium text-text-primary">Items</th>
                <th className="p-4 text-left text-sm font-medium text-text-primary">Status</th>
                <th className="p-4 text-left text-sm font-medium text-text-primary">ETA</th>
                <th className="p-4 text-left text-sm font-medium text-text-primary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {activeOrders.map(o => (
                <tr key={o.id} className="border-b border-border hover:bg-background-light">
                  <td className="p-4 font-medium text-text-primary">{o.id}</td>
                  <td className="p-4 text-text-secondary">{o.project}</td>
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

export default SupplierPortal;
