import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { uploadMedia } from '../../utils/media';
import { createProject } from '../../utils/projects';

const ProjectsManagement: React.FC = () => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [preview, setPreview] = useState<string | undefined>();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [form, setForm] = useState({ title: '', description: '', type: 'blank', budget: 0, startDate: '', endDate: '', location: '', organizationType:'', organizationId:'', country:'', province:'', city:'', projectManagerId:'', operatorIds: '' as string, templateKey:'' });

  const projectTypes = [
    { id: 'blank', name: 'Blank Project', description: 'Start from scratch with a custom project', color: 'secondary' },
    { id: 'distribution', name: 'Distribution Project', description: 'Distribution of goods and resources', color: 'primary' },
    { id: 'formation', name: 'Training Project', description: 'Educational and training programs', color: 'success' },
    { id: 'research', name: 'R&D Project', description: 'Research and development initiatives', color: 'warning' }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  };

  const submit = async () => {
    if (!fileRef.current || !fileRef.current.files?.[0]) {
      alert('Image or video thumbnail required');
      return;
    }
    if(!form.title || !form.description || !form.startDate || !form.location || !form.budget){
      alert('Missing required fields');
      return;
    }
    try {
      setCreating(true);
      const media = await uploadMedia(fileRef.current.files[0], fileRef.current.files[0].type.startsWith('video') ? 'video' : 'image');
      await createProject({
        title: form.title,
        description: form.description,
        type: form.type as any,
        budget: Number(form.budget),
        startDate: form.startDate,
        endDate: form.endDate,
        location: form.location,
        thumbnail: media.type === 'image' ? media.url : undefined,
        video: media.type === 'video' ? media.url : undefined,
        createdBy: 'admin_demo',
        organizationType: form.organizationType || undefined,
        organizationId: form.organizationId || undefined,
        country: form.country || undefined,
        province: form.province || undefined,
        city: form.city || undefined,
        projectManagerId: form.projectManagerId || undefined,
        operatorIds: form.operatorIds ? form.operatorIds.split(',').map(s=>s.trim()) : [],
        templateKey: form.templateKey || undefined
      });
      setShowModal(false);
      setForm({ title: '', description: '', type: 'blank', budget: 0, startDate: '', endDate: '', location: '', organizationType:'', organizationId:'', country:'', province:'', city:'', projectManagerId:'', operatorIds:'', templateKey:'' });
      setPreview(undefined);
      if (fileRef.current) fileRef.current.value = '';
      alert('Project created (mock).');
    } catch (e: any) {
      alert('Error: ' + e.message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">{t('admin.projects')}</h1>
            <p className="text-text-secondary">Create, manage and monitor all project types</p>
          </div>
          <Button onClick={()=>setShowModal(true)}>
            + {t('common.create')} Project
          </Button>
        </div>
      </div>

      {/* Project Types */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {projectTypes.map((type) => (
          <Card key={type.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{type.name}</CardTitle>
                <Badge variant={type.color as any} size="sm">
                  {type.id}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-text-secondary mb-4">{type.description}</p>
              <Button variant="outline" size="sm" className="w-full">
                Create {type.name}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Projects */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center">
                    📊
                  </div>
                  <div>
                    <h3 className="font-medium text-text-primary">Project {i}</h3>
                    <p className="text-sm text-text-secondary">Active • Last updated 2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="success" size="sm">Active</Badge>
                  <Button variant="outline" size="sm">
                    {t('common.view')}
                  </Button>
                  <Button variant="outline" size="sm">
                    {t('common.edit')}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Create Project Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-start justify-center z-50 overflow-auto py-10">
          <div className="bg-surface w-full max-w-2xl rounded-xl shadow-lg border border-border p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-text-primary">New Project</h2>
              <button onClick={()=>setShowModal(false)} className="text-text-secondary hover:text-text-primary">✕</button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title *</label>
                  <input name="title" value={form.title} onChange={handleChange} className="w-full bg-background border border-border rounded-md p-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Type *</label>
                  <select name="type" value={form.type} onChange={handleChange} className="w-full bg-background border border-border rounded-md p-2 text-sm">
                    {projectTypes.map(pt=> <option key={pt.id} value={pt.id}>{pt.name}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">Start *</label>
                    <input type="date" name="startDate" value={form.startDate} onChange={handleChange} className="w-full bg-background border border-border rounded-md p-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">End</label>
                    <input type="date" name="endDate" value={form.endDate} onChange={handleChange} className="w-full bg-background border border-border rounded-md p-2 text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Location *</label>
                  <input name="location" value={form.location} onChange={handleChange} className="w-full bg-background border border-border rounded-md p-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Budget (USD) *</label>
                  <input type="number" name="budget" value={form.budget} onChange={handleChange} className="w-full bg-background border border-border rounded-md p-2 text-sm" />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Description *</label>
                  <textarea name="description" value={form.description} onChange={handleChange} rows={6} className="w-full bg-background border border-border rounded-md p-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Thumbnail (image or video) *</label>
                  <input ref={fileRef} type="file" accept="image/*,video/*" onChange={handleFile} className="w-full text-sm" />
                  {preview && <div className="mt-2 text-xs text-text-secondary">Preview ready ✓</div>}
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Org Type</label>
                  <input name="organizationType" value={form.organizationType} onChange={handleChange} className="w-full bg-background border border-border rounded-md p-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Org ID</label>
                  <input name="organizationId" value={form.organizationId} onChange={handleChange} className="w-full bg-background border border-border rounded-md p-2 text-sm" />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Country</label>
                  <input name="country" value={form.country} onChange={handleChange} className="w-full bg-background border border-border rounded-md p-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Province</label>
                  <input name="province" value={form.province} onChange={handleChange} className="w-full bg-background border border-border rounded-md p-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">City</label>
                  <input name="city" value={form.city} onChange={handleChange} className="w-full bg-background border border-border rounded-md p-2 text-sm" />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Project Manager ID</label>
                  <input name="projectManagerId" value={form.projectManagerId} onChange={handleChange} className="w-full bg-background border border-border rounded-md p-2 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Operators IDs (comma)</label>
                  <input name="operatorIds" value={form.operatorIds} onChange={handleChange} className="w-full bg-background border border-border rounded-md p-2 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Template Key</label>
                <input name="templateKey" value={form.templateKey} onChange={handleChange} className="w-full bg-background border border-border rounded-md p-2 text-sm" />
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <Button variant="secondary" onClick={()=>setShowModal(false)} disabled={creating}>Cancel</Button>
              <Button onClick={submit} disabled={creating}>{creating ? 'Creating...' : 'Create Project'}</Button>
            </div>
            <p className="text-xs text-text-secondary">Media is mandatory. Data saved in-memory (mock) – replace with API later.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsManagement;
