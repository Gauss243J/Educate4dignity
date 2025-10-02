import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

const TrainerPortal: React.FC = () => {
  const sessions = [
    { id: 'SES001', course: 'Digital Literacy Basics', date: '2025-01-04', learners: 35, status: 'scheduled' },
    { id: 'SES002', course: 'Entrepreneurship 101', date: '2024-12-28', learners: 28, status: 'completed' },
    { id: 'SES003', course: 'AI Fundamentals', date: '2024-12-30', learners: 42, status: 'preparing' }
  ];

  const getStatusVariant = (s: string) => {
    switch (s) {
      case 'completed': return 'success';
      case 'scheduled': return 'primary';
      case 'preparing': return 'warning';
      default: return 'secondary';
    }
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Trainer Portal</h1>
          <p className="text-text-secondary">Manage training sessions and learners</p>
        </div>
        <Button>Schedule Session</Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader><CardTitle>Upcoming Sessions</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{sessions.filter(s => s.status !== 'completed').length}</div>
            <div className="text-text-secondary text-sm">Scheduled</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Learners This Month</CardTitle></CardHeader>
            <CardContent>
            <div className="text-3xl font-bold text-success">248</div>
            <div className="text-text-secondary text-sm">Across courses</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Completion Rate</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning">89%</div>
            <div className="text-text-secondary text-sm">All sessions</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Training Sessions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead className="bg-background-light border-b border-border">
              <tr>
                <th className="p-4 text-left text-sm font-medium text-text-primary">Session ID</th>
                <th className="p-4 text-left text-sm font-medium text-text-primary">Course</th>
                <th className="p-4 text-left text-sm font-medium text-text-primary">Date</th>
                <th className="p-4 text-left text-sm font-medium text-text-primary">Learners</th>
                <th className="p-4 text-left text-sm font-medium text-text-primary">Status</th>
                <th className="p-4 text-left text-sm font-medium text-text-primary">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map(o => (
                <tr key={o.id} className="border-b border-border hover:bg-background-light">
                  <td className="p-4 font-medium text-text-primary">{o.id}</td>
                  <td className="p-4 text-text-secondary">{o.course}</td>
                  <td className="p-4 text-text-secondary">{new Date(o.date).toLocaleDateString()}</td>
                  <td className="p-4 text-text-secondary">{o.learners}</td>
                  <td className="p-4"><Badge variant={getStatusVariant(o.status)} size="sm">{o.status}</Badge></td>
                  <td className="p-4 flex space-x-2"><Button size="sm" variant="secondary">View</Button><Button size="sm" variant="secondary">Materials</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainerPortal;
