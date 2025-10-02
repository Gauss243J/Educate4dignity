import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

const TeamPortalDashboard: React.FC = () => {
  const tasks = [
    { id: 'T001', title: 'Review supplier quotes', assignee: 'Alice', due: '2024-12-27', status: 'in_progress' },
    { id: 'T002', title: 'Prepare training materials', assignee: 'Bob', due: '2024-12-28', status: 'pending' },
    { id: 'T003', title: 'Compile monthly report', assignee: 'Claire', due: '2024-12-29', status: 'blocked' }
  ];

  const announcements = [
    { id: 'A001', title: 'Holiday Schedule', message: 'Office closed Jan 1st - 2nd', date: '2024-12-20' },
    { id: 'A002', title: 'New Project Launch', message: 'Sustainability pilot starting Jan 5', date: '2024-12-19' }
  ];

  const getStatusVariant = (s: string) => {
    switch (s) {
      case 'in_progress': return 'primary';
      case 'pending': return 'secondary';
      case 'blocked': return 'error';
      case 'done': return 'success';
      default: return 'secondary';
    }
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Team Portal</h1>
          <p className="text-text-secondary">Internal collaboration and operations hub</p>
        </div>
        <Button>Create Task</Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader><CardTitle>Active Tasks</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{tasks.filter(t => t.status !== 'done').length}</div>
            <div className="text-text-secondary text-sm">In progress</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Announcements</CardTitle></CardHeader>
            <CardContent>
            <div className="text-3xl font-bold text-success">{announcements.length}</div>
            <div className="text-text-secondary text-sm">Latest updates</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Pending Reviews</CardTitle></CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning">5</div>
            <div className="text-text-secondary text-sm">Awaiting approval</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Team Tasks</CardTitle></CardHeader>
          <CardContent className="p-0">
            <table className="w-full">
              <thead className="bg-background-light border-b border-border">
                <tr>
                  <th className="p-4 text-left text-sm font-medium text-text-primary">Task</th>
                  <th className="p-4 text-left text-sm font-medium text-text-primary">Assignee</th>
                  <th className="p-4 text-left text-sm font-medium text-text-primary">Due</th>
                  <th className="p-4 text-left text-sm font-medium text-text-primary">Status</th>
                  <th className="p-4 text-left text-sm font-medium text-text-primary">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(o => (
                  <tr key={o.id} className="border-b border-border hover:bg-background-light">
                    <td className="p-4 font-medium text-text-primary">{o.title}</td>
                    <td className="p-4 text-text-secondary">{o.assignee}</td>
                    <td className="p-4 text-text-secondary">{new Date(o.due).toLocaleDateString()}</td>
                    <td className="p-4"><Badge variant={getStatusVariant(o.status)} size="sm">{o.status}</Badge></td>
                    <td className="p-4 flex space-x-2"><Button size="sm" variant="secondary">View</Button><Button size="sm" variant="secondary">Done</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Announcements</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {announcements.map(a => (
                <div key={a.id} className="p-4 border border-border rounded-lg">
                  <div className="flex justify-between mb-1">
                    <h3 className="font-medium text-text-primary">{a.title}</h3>
                    <span className="text-xs text-text-secondary">{new Date(a.date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-text-secondary">{a.message}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeamPortalDashboard;
