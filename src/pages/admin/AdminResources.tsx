import React, { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AdminPage from '../../components/admin/AdminPage';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Search } from 'lucide-react';
import { resourcesStore, ResourceIndexRow } from '../../services/resourcesStore';

const AdminResources: React.FC = () => {
  const { t } = useTranslation();

  // Load rows once (localStorage backed)
  const all = useMemo(()=> resourcesStore.list(), []);

  // KPI metrics
  const total = all.length;
  const pending = all.filter(r=> r.status==='draft').length; // treating drafts as "pending validation"
  const published = all.filter(r=> r.status==='published').length;
  const retired = all.filter(r=> r.status==='retired').length;

  // Toolbar filters
  const [q,setQ] = useState('');
  const [type,setType] = useState<'all'|string>('all');
  const [year,setYear] = useState<'all'|number>('all');
  const [visibility,setVisibility] = useState<'all'|'public'|'internal'>('all');

  const typeOptions = useMemo(()=> ['all', ...Array.from(new Set(all.map(r=> r.category)))], [all]);
  const yearOptions = useMemo(()=> ['all', ...Array.from(new Set(all.map(r=> r.year))).sort((a:any,b:any)=> b-a)], [all]);

  // Table state
  const [rowsPerPage,setRowsPerPage] = useState(10);
  const [page,setPage] = useState(1);
  const [selected,setSelected] = useState<string[]>([]); // ids

  const filtered: ResourceIndexRow[] = useMemo(()=> {
    const qq = q.toLowerCase();
    return all.filter(r=> {
      const inQ = !q || r.title.toLowerCase().includes(qq) || (r.summary||'').toLowerCase().includes(qq) || (r.tags||[]).some(t=> t.toLowerCase().includes(qq));
      const inT = type==='all' || r.category===type;
      const inY = year==='all' || r.year===year;
      const inV = visibility==='all' || r.visibility===visibility;
      return inQ && inT && inY && inV;
    });
  },[all,q,type,year,visibility]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const pageRows = filtered.slice((page-1)*rowsPerPage, page*rowsPerPage);

  function toggleAll(checked:boolean){ setSelected(checked? pageRows.map(r=> r.id): []); }
  function toggleOne(id:string){ setSelected(sel=> sel.includes(id)? sel.filter(x=> x!==id): [...sel,id]); }

  // Row/bulk actions (localStorage & reload to refresh memoized list)
  function bulkPublish(){ selected.forEach(id=> resourcesStore.publish(id)); window.location.reload(); }
  function bulkUnpublish(){ selected.forEach(id=> resourcesStore.unpublish(id)); window.location.reload(); }
  function bulkRetire(){ selected.forEach(id=> resourcesStore.retire(id)); window.location.reload(); }
  function bulkDelete(){ if(confirm('Supprimer définitivement ces ressources ?')){ selected.forEach(id=> resourcesStore.delete(id)); window.location.reload(); } }

  // CSV Export for filtered
  function exportCsv(){
    const headers = ['title','category','year','language','file_type','size_bytes','tags','status','visibility','published_at'];
    const rows = filtered.map(r=> [r.title,r.category,String(r.year),r.language,r.file_type,String(r.file_size_bytes||''),(r.tags||[]).join('|'),r.status,r.visibility,r.published_at||'']);
    const csv = [headers.join(','), ...rows.map(r=> r.map(v=> '"'+String(v).replace(/"/g,'""')+'"').join(','))].join('\n');
    const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='resources.csv'; a.click(); URL.revokeObjectURL(url);
  }

  // Upload modal (simple metadata-only for now)
  const [open,setOpen] = useState(false);
  const [title,setTitle] = useState('');
  const [summary,setSummary] = useState('');
  const [category,setCategory] = useState('report');
  const [resYear,setResYear] = useState(new Date().getFullYear());
  const [language,setLanguage] = useState<'EN'|'FR'|'EN/FR'>('EN');
  const [fileType,setFileType] = useState<'PDF'|'DOCX'|'CSV'|'ZIP'>('PDF');
  const [visibilityNew,setVisibilityNew] = useState<'public'|'internal'>('public');
  const [fileName,setFileName] = useState<string>('');
  const [fileSize,setFileSize] = useState<number|undefined>(undefined);
  const [dragOver,setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement|null>(null);

  function inferTypeByName(name: string): 'PDF'|'DOCX'|'CSV'|'ZIP'|null {
    const ext = (name.split('.').pop()||'').toLowerCase();
    if(ext==='pdf') return 'PDF';
    if(ext==='docx' || ext==='doc') return 'DOCX';
    if(ext==='csv') return 'CSV';
    if(ext==='zip') return 'ZIP';
    return null;
  }
  function onFilesSelected(files: FileList|null){
    const f = files && files[0];
    if(!f) return;
    setFileName(f.name);
    setFileSize(f.size);
    const t = inferTypeByName(f.name); if(t) setFileType(t);
  }

  function saveDraft(){
    const id = 'r_'+Math.random().toString(36).slice(2,9);
    const slug = title.trim().toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
    resourcesStore.upsert({ id, slug, title, summary, category: category as any, year: resYear, language, file_type: fileType, file_size_bytes: fileSize, url: '#', tags: [], status:'draft', visibility: visibilityNew, published_at:'', updated_at: new Date().toISOString() });
    setOpen(false); window.location.reload();
  }
  function publishNow(){ const id = 'r_'+Math.random().toString(36).slice(2,9); const slug = title.trim().toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''); const now = new Date().toISOString(); resourcesStore.upsert({ id, slug, title, summary, category: category as any, year: resYear, language, file_type: fileType, file_size_bytes: fileSize, url:'#', tags: [], status:'published', visibility: visibilityNew, published_at: now, updated_at: now }); setOpen(false); window.location.reload(); }

  return (
    <AdminPage title={t('admin.resources')}>
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <Kpi label={t('admin.ui.resources.kpis.total','Total documents')} value={total} />
        <Kpi label={t('admin.ui.resources.kpis.pending','Pending validation')} value={pending} />
        <Kpi label={t('admin.ui.resources.kpis.published','Published (public)')} value={published} />
        <Kpi label={t('admin.ui.resources.kpis.retired','Retired/archived')} value={retired} />
      </div>

      {/* Toolbar */}
      <div className="rounded-2xl bg-[var(--color-surface)] border p-3 mb-3 flex flex-wrap gap-2 items-center" style={{borderColor:'var(--color-border)'}}>
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-tertiary)]" />
          <input value={q} onChange={e=>{ setQ(e.target.value); setPage(1); }} placeholder={t('common.search')} className="h-10 w-full pl-9 pr-3 rounded-full border text-[13px] bg-[var(--color-surface)]" style={{borderColor:'var(--color-border)'}} />
        </div>
        <select value={type} onChange={e=> { setType(e.target.value); setPage(1); }} className="h-10 px-3 rounded-full border text-[13px] bg-[var(--color-surface)]" style={{borderColor:'var(--color-border)'}}>
          {typeOptions.map(opt=> <option key={opt} value={opt}>{opt==='all'? t('admin.ui.resources.filters.type','Type'): opt}</option>)}
        </select>
        <select value={year} onChange={e=> { const v=e.target.value==='all'?'all':Number(e.target.value); setYear(v as any); setPage(1); }} className="h-10 px-3 rounded-full border text-[13px] w-[120px] bg-[var(--color-surface)]" style={{borderColor:'var(--color-border)'}}>
          {yearOptions.map(opt=> <option key={String(opt)} value={String(opt)}>{opt==='all'? t('admin.ui.resources.filters.year','Year'): String(opt)}</option>)}
        </select>
        <select value={visibility} onChange={e=> { setVisibility(e.target.value as any); setPage(1); }} className="h-10 px-3 rounded-full border text-[13px] w-[140px] bg-[var(--color-surface)]" style={{borderColor:'var(--color-border)'}}>
          <option value="all">{t('admin.ui.resources.filters.visibility','Visibility')}</option>
          <option value="public">{t('admin.ui.resources.visibility.public','Public')}</option>
          <option value="internal">{t('admin.ui.resources.visibility.internal','Internal')}</option>
        </select>
        <Button variant="secondary" size="sm" className="rounded-full" onClick={exportCsv}>{t('admin.ui.actions.exportCsv')}</Button>
        <Button onClick={()=> setOpen(true)} className="rounded-full">+ {t('common.create')}</Button>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-[var(--color-surface)] border" style={{borderColor:'var(--color-border)'}}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-[var(--text-primary)]">
            <thead>
              <tr className="text-left text-[var(--color-text-secondary)]">
                <th className="py-3 pl-4 pr-2"><input type="checkbox" checked={selected.length===pageRows.length && pageRows.length>0} onChange={e=> toggleAll(e.target.checked)} /></th>
                <th className="py-3 pr-4">{t('common.title')}</th>
                <th className="py-3 pr-4">{t('admin.ui.resources.filters.type','Type')}</th>
                <th className="py-3 pr-4">{t('admin.ui.resources.filters.year','Year')}</th>
                <th className="py-3 pr-4">{t('admin.ui.resources.language','Language')}</th>
                <th className="py-3 pr-4">{t('admin.ui.resources.size','Size')}</th>
                <th className="py-3 pr-4">{t('admin.ui.table.status')}</th>
                <th className="py-3 pr-4">{t('admin.ui.resources.visibility.label','Visibility')}</th>
                <th className="py-3 pr-4">{t('common.updated')}</th>
                <th className="py-3 pr-4"></th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map(r=> {
                const checked = selected.includes(r.id);
                const date = (r.published_at||'').slice(0,10);
                return (
                  <tr key={r.id} className="border-t" style={{borderColor:'var(--color-border)'}}>
                    <td className="py-2 pl-4 pr-2"><input type="checkbox" checked={checked} onChange={()=> toggleOne(r.id)} /></td>
                    <td className="py-2 pr-4"><div className="font-medium text-[var(--text-primary)]">{r.title}</div><div className="text-[11px] text-[var(--muted-color)] truncate">{r.summary||'—'}</div></td>
                    <td className="py-2 pr-4"><span className="px-2 py-0.5 rounded-full text-[11px] border" style={{borderColor:'var(--color-border)', color:'var(--text-primary)'}}>{r.category}</span></td>
                    <td className="py-2 pr-4">{r.year}</td>
                    <td className="py-2 pr-4">{r.language}</td>
                    <td className="py-2 pr-4">{formatBytes(r.file_size_bytes)}</td>
                    <td className="py-2 pr-4"><span className={`${r.status==='published'? 'bg-emerald-50 text-emerald-700 border border-emerald-200': r.status==='draft'?'bg-amber-50 text-amber-700 border border-amber-200':'bg-rose-50 text-rose-700 border border-rose-200'} px-2 py-0.5 rounded-full text-[11px]`}>{r.status==='published'? t('admin.ui.resources.visibility.public','Public'): r.status==='draft'? t('admin.ui.status.pending','in progress'):t('admin.ui.resources.status.retired','Retired')}</span></td>
                    <td className="py-2 pr-4"><span className={`px-2 py-0.5 rounded-full text-[11px] border ${r.visibility==='public'?'bg-[var(--chip-bg)] text-[var(--text-primary)]':'bg-[var(--color-surface)] text-[var(--text-primary)]'}`} style={{borderColor:'var(--color-border)'}}>{r.visibility==='public'? t('admin.ui.resources.visibility.public','Public'):t('admin.ui.resources.visibility.internal','Internal')}</span></td>
                    <td className="py-2 pr-4">{date}</td>
                    <td className="py-2 pr-4 text-right">
                      <div className="flex justify-end gap-2">
                        {r.status==='published'? (
                          <Button size="sm" variant="secondary" className="rounded-full" onClick={()=> { resourcesStore.unpublish(r.id); window.location.reload(); }}>{t('admin.ui.actions.unpublish')}</Button>
                        ) : (
                          <Button size="sm" className="rounded-full" onClick={()=> { resourcesStore.publish(r.id); window.location.reload(); }}>{t('admin.ui.actions.publish')}</Button>
                        )}
                        <Button size="sm" variant="secondary" className="rounded-full" onClick={()=> { resourcesStore.retire(r.id); window.location.reload(); }}>{t('admin.ui.resources.actions.retire','Retire')}</Button>
                        <Button size="sm" variant="danger" className="rounded-full" onClick={()=> { if(confirm(t('admin.ui.resources.actions.confirmDelete','Delete this item?'))){ resourcesStore.delete(r.id); window.location.reload(); }}}>{t('common.delete')}</Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {pageRows.length===0 && (
                <tr><td colSpan={10} className="text-center py-10 text-[13px] text-[var(--muted-color)]">{t('common.noResults')}</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 border-t" style={{borderColor:'var(--color-border)'}}>
          <div className="flex items-center gap-2">
            <span className="text-[12px]">{t('admin.ui.actions.bulk')}</span>
            <Button size="sm" className="rounded-full" disabled={!selected.length} onClick={bulkPublish}>{t('admin.ui.actions.publishSelected')}</Button>
            <Button size="sm" variant="secondary" className="rounded-full" disabled={!selected.length} onClick={bulkUnpublish}>{t('admin.ui.actions.unpublish')}</Button>
            <Button size="sm" variant="secondary" className="rounded-full" disabled={!selected.length} onClick={bulkRetire}>{t('admin.ui.resources.actions.retire','Retire')}</Button>
            <Button size="sm" variant="danger" className="rounded-full" disabled={!selected.length} onClick={bulkDelete}>{t('common.delete')}</Button>
          </div>
          <div className="flex items-center gap-3 text-[12px]">
            <div className="flex items-center gap-2">{t('common.rows')}
              <select className="h-8 px-2 rounded-full border bg-[var(--color-surface)]" style={{borderColor:'var(--color-border)'}} value={rowsPerPage} onChange={e=>{ setRowsPerPage(Number(e.target.value)); setPage(1); }}>
                {[10,25,50].map(n=> <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-1">
              <button aria-label="Previous page" disabled={page===1} onClick={()=> setPage(p=> Math.max(1,p-1))} className="w-8 h-8 rounded-full border text-[12px] disabled:opacity-40 bg-[var(--color-surface)]" style={{borderColor:'var(--color-border)'}}>‹</button>
              {Array.from({length: totalPages}).slice(0,5).map((_,i)=> { const n=i+1; const active=n===page; return (
                <button key={n} aria-current={active? 'page':undefined} onClick={()=> setPage(n)} className={`w-8 h-8 rounded-full text-[12px] border ${active? 'bg-[var(--color-primary)] text-white':'bg-[var(--chip-bg)] text-[var(--text-primary)] hover:brightness-95'}`} style={{borderColor:'var(--color-border)'}}>{n}</button>
              );})}
              <button aria-label="Next page" disabled={page===totalPages} onClick={()=> setPage(p=> Math.min(totalPages,p+1))} className="w-8 h-8 rounded-full border text-[12px] disabled:opacity-40 bg-[var(--color-surface)]" style={{borderColor:'var(--color-border)'}}>›</button>
            </div>
          </div>
        </div>
      </div>

      {/* Upload modal */}
      <Modal isOpen={open} onClose={()=> setOpen(false)} title={t('admin.ui.resources.modal.title','Upload a document (simple)')} size="xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border p-4 space-y-3" style={{borderColor:'var(--color-border)'}}>
            <div
              onDragOver={e=> { e.preventDefault(); setDragOver(true); }}
              onDragLeave={()=> setDragOver(false)}
              onDrop={e=> { e.preventDefault(); setDragOver(false); onFilesSelected(e.dataTransfer.files); }}
              className={`h-[140px] rounded-lg border flex flex-col items-center justify-center text-[12px] bg-[var(--chip-bg)] ${dragOver? 'ring-2 ring-[var(--color-primary)]':''}`}
              style={{borderColor:'var(--color-border)'}}
              aria-label="Zone de dépôt"
            >
              {!fileName && <>
                <div className="text-[var(--text-primary)]">{t('admin.ui.resources.modal.dropHere','Drag & drop the file here')}</div>
                <div className="text-[var(--muted-color)] mt-1">{t('common.or','or')}</div>
                <button type="button" className="mt-2 px-3 h-8 rounded-full border bg-[var(--color-surface)]" style={{borderColor:'var(--color-border)'}} onClick={()=> fileInputRef.current?.click()}>{t('admin.ui.resources.modal.chooseFile','Choose a file')}</button>
              </>}
              {fileName && (
                <div className="text-center">
                  <div className="font-medium text-[var(--text-primary)]">{fileName}</div>
                  <div className="text-[11px] text-[var(--muted-color)]">{formatBytes(fileSize)} • {fileType}</div>
                  <div className="mt-2"><button type="button" className="px-2 h-7 rounded-full border text-[12px] bg-[var(--color-surface)]" style={{borderColor:'var(--color-border)'}} onClick={()=> fileInputRef.current?.click()}>{t('admin.ui.resources.modal.change','Change')}</button></div>
                </div>
              )}
              <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.csv,.zip" className="hidden" onChange={e=> onFilesSelected(e.target.files)} />
            </div>
            <div className="text-[12px] text-[var(--muted-color)]">PDF, DOCX, CSV or ZIP (max 20 MB). {t('admin.ui.projects.create.tipRequired','Tip: Fields marked * are required. Errors show below fields.')}</div>
          </div>
          <div className="rounded-xl border p-4 space-y-3" style={{borderColor:'var(--color-border)'}}>
            <div>
              <label className="text-[12px]">{t('common.title')} *</label>
              <Input value={title} onChange={e=> setTitle(e.target.value)} placeholder={t('admin.ui.resources.modal.placeholders.title','Document title')} />
            </div>
            <div>
              <label className="text-[12px]">{t('admin.ui.resources.modal.desc','Short description')}</label>
              <textarea value={summary} onChange={e=> setSummary(e.target.value)} rows={3} className="w-full rounded-lg border px-3 py-2 text-[13px] bg-[var(--color-surface)]" style={{borderColor:'var(--color-border)'}} placeholder={t('admin.ui.resources.modal.descPlaceholder','Displayed on public page')} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[12px]">{t('admin.ui.resources.filters.type','Type')} *</label>
                <select value={category} onChange={e=> setCategory(e.target.value)} className="h-10 w-full px-3 rounded-lg border bg-[var(--color-surface)]" style={{borderColor:'var(--color-border)'}}>
                  {['report','audit','policy','template','data','guide'].map(t=> <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[12px]">{t('admin.ui.resources.visibility.label','Visibility')} *</label>
                <select value={visibilityNew} onChange={e=> setVisibilityNew(e.target.value as any)} className="h-10 w-full px-3 rounded-lg border bg-[var(--color-surface)]" style={{borderColor:'var(--color-border)'}}>
                  <option value="public">{t('admin.ui.resources.visibility.public','Public')}</option>
                  <option value="internal">{t('admin.ui.resources.visibility.internal','Internal')}</option>
                </select>
              </div>
              <div>
                <label className="text-[12px]">{t('admin.ui.resources.filters.year','Year')}</label>
                <Input type="number" value={resYear} onChange={e=> setResYear(Number(e.target.value))} />
              </div>
              <div>
                <label className="text-[12px]">{t('admin.ui.resources.language','Language')}</label>
                <select value={language} onChange={e=> setLanguage(e.target.value as any)} className="h-10 w-full px-3 rounded-lg border bg-[var(--color-surface)]" style={{borderColor:'var(--color-border)'}}>
                  {['EN','FR','EN/FR'].map(l=> <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[12px]">{t('admin.ui.resources.format','Format')}</label>
                <select value={fileType} onChange={e=> setFileType(e.target.value as any)} className="h-10 w-full px-3 rounded-lg border bg-[var(--color-surface)]" style={{borderColor:'var(--color-border)'}}>
                  {['PDF','DOCX','CSV','ZIP'].map(ft=> <option key={ft} value={ft}>{ft}</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" onClick={()=> setOpen(false)}>{t('common.cancel')}</Button>
              <Button variant="secondary" onClick={saveDraft}>{t('admin.ui.projects.create.saveDraft','Save draft')}</Button>
              <Button onClick={publishNow}>{t('admin.ui.actions.publish')}</Button>
            </div>
          </div>
        </div>
      </Modal>
    </AdminPage>
  );
};

export default AdminResources;

const Kpi: React.FC<{label:string; value: React.ReactNode}> = ({label,value}) => (
  <div className="rounded-2xl p-4 bg-[var(--color-surface)] border" style={{borderColor:'var(--color-border)'}}>
    <div className="text-[12px] text-[var(--muted-color)]">{label}</div>
    <div className="text-[22px] font-bold text-[var(--text-primary)]">{value}</div>
  </div>
);

function formatBytes(bytes?: number){ if(bytes===undefined) return '—'; if(bytes<1024) return `${bytes} B`; const kb=bytes/1024; if(kb<1024) return `${kb.toFixed(1)} KB`; const mb=kb/1024; return `${mb.toFixed(1)} MB`; }
