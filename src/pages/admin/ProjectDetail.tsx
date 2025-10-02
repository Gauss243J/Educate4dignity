import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { fetchProjectById, updateProjectStatus, patchProject } from '../../services/projectService';

const ProjectDetail: React.FC = () => {
  const { id } = useParams();
  useTranslation(); // ensure i18n context (ArticleResume uses its own useTranslation)
  const project = id ? fetchProjectById(id) : undefined;
  if(!project) return <div className="p-6 text-sm">Projet introuvable.</div>;
  return (
    <ArticleResume project={project} />
  );
};

const ArticleResume: React.FC<{project:any}> = ({project}) => {
  const { t } = useTranslation();
  const [editing,setEditing] = React.useState(false);
  const [name,setName] = React.useState(project.name);
  const [short,setShort] = React.useState(project.shortDescription||'');
  const [long,setLong] = React.useState(project.longDescription||'');
  const [cover,setCover] = React.useState<string|undefined>(project.coverImage);
  const [video,setVideo] = React.useState(project.videoUrl||'');
  const [status,setStatus] = React.useState(project.status);
  const [type,setType] = React.useState(project.type as string);
  const [organisation,setOrganisation] = React.useState(project.organisation);
  const [orgType,setOrgType] = React.useState(project.orgType||'ong');
  const [location,setLocation] = React.useState(project.location); // simple string (Country • City)
  const [start,setStart] = React.useState(project.start);
  const [budget,setBudget] = React.useState(String(project.budget));
  const [collected,setCollected] = React.useState(String(project.collected));
  const [operators,setOperators] = React.useState<string[]>(project.operators||[]);
  const [primaryOperator,setPrimaryOperator] = React.useState(project.primaryOperator||'');
  const [newOperator,setNewOperator] = React.useState('');
  const save = () => { patchProject(project.id,{ name, shortDescription: short, longDescription: long, coverImage: cover, videoUrl: video, status }); setEditing(false); };
  const publish = () => { updateProjectStatus(project.id,'actif'); setStatus('actif'); };
  const draft = () => { updateProjectStatus(project.id,'draft'); setStatus('draft'); };
  return (
    <article className="rounded-xl bg-white p-6 space-y-6 text-[13px] leading-relaxed" style={{boxShadow:'var(--elev-1)'}}>
      <header className="space-y-1">
        {!editing && <h1 className="text-xl font-semibold text-[var(--text-primary,#503246)]">{name} <span className="text-sm font-normal text-gray-500">({project.id}) · {status}</span></h1>}
        {editing && (
          <div className="space-y-3">
            <input className="w-full border rounded-md px-3 py-2 text-[13px]" value={name} onChange={e=>setName(e.target.value)} />
            <div className="grid md:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] mb-1 font-medium">Type</label>
                <select value={type} onChange={e=>setType(e.target.value)} className="w-full border rounded-md px-2 py-2 text-[12px]">
                  <option value="distribution">distribution</option>
                  <option value="formation">formation</option>
                  <option value="recherche_dev">recherche_dev</option>
                  <option value="achat">achat</option>
                  <option value="hybride">hybride</option>
                  <option value="blank">blank</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] mb-1 font-medium">Org type</label>
                <select value={orgType} onChange={e=>setOrgType(e.target.value)} className="w-full border rounded-md px-2 py-2 text-[12px]">
                  <option value="ong">ong</option>
                  <option value="ecole">ecole</option>
                  <option value="association">association</option>
                  <option value="institution">institution</option>
                  <option value="organisation">organisation</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] mb-1 font-medium">Budget (USD)</label>
                <input value={budget} onChange={e=>setBudget(e.target.value)} className="w-full border rounded-md px-3 py-2 text-[12px]" />
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] mb-1 font-medium">Organisation</label>
                <input value={organisation} onChange={e=>setOrganisation(e.target.value)} className="w-full border rounded-md px-3 py-2 text-[12px]" />
              </div>
              <div>
                <label className="block text-[11px] mb-1 font-medium">Location</label>
                <input value={location} onChange={e=>setLocation(e.target.value)} className="w-full border rounded-md px-3 py-2 text-[12px]" placeholder="Pays • Ville" />
              </div>
              <div>
                <label className="block text-[11px] mb-1 font-medium">Collecté</label>
                <input value={collected} onChange={e=>setCollected(e.target.value)} className="w-full border rounded-md px-3 py-2 text-[12px]" />
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] mb-1 font-medium">Date début</label>
                <input type="date" value={start} onChange={e=>setStart(e.target.value)} className="w-full border rounded-md px-3 py-2 text-[12px]" />
              </div>
              <div>
                <label className="block text-[11px] mb-1 font-medium">Opérateur principal</label>
                <select value={primaryOperator} onChange={e=>setPrimaryOperator(e.target.value)} className="w-full border rounded-md px-2 py-2 text-[12px]">
                  <option value="">--</option>
                  {operators.map(o=> <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[11px] mb-1 font-medium">Ajouter opérateur</label>
                <div className="flex gap-2">
                  <input value={newOperator} onChange={e=>setNewOperator(e.target.value)} className="flex-1 border rounded-md px-2 py-2 text-[12px]" placeholder="Nom" />
                  <button type="button" onClick={()=>{ if(newOperator && !operators.includes(newOperator)){ setOperators(o=>[...o,newOperator]); if(!primaryOperator) setPrimaryOperator(newOperator); setNewOperator(''); } }} className="px-3 rounded-md bg-indigo-600 text-white text-[11px]">+</button>
                </div>
              </div>
            </div>
            {operators.length>0 && <div className="flex flex-wrap gap-1">
              {operators.map(o=> (
                <span key={o} className={`px-2 py-1 rounded-full text-[11px] border flex items-center gap-1 ${o===primaryOperator?'bg-indigo-600 text-white border-indigo-600':'bg-white'}`}>
                  {o}
                  <button type="button" onClick={()=>{ setOperators(prev=> { const updated = prev.filter(x=>x!==o); if(primaryOperator===o){ setPrimaryOperator(updated[0]||''); } return updated; }); }} className="opacity-70 hover:opacity-100">×</button>
                </span>
              ))}
            </div>}
            <textarea className="w-full border rounded-md px-3 py-2 text-[12px]" value={short} onChange={e=>setShort(e.target.value)} placeholder="Résumé court" />
            <textarea className="w-full border rounded-md px-3 py-2 text-[12px] min-h-[120px]" value={long} onChange={e=>setLong(e.target.value)} placeholder="Description détaillée" />
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium mb-1">Image (URL/base64)</label>
                <input className="w-full border rounded-md px-3 py-2 text-[12px]" value={cover||''} onChange={e=>setCover(e.target.value||undefined)} placeholder="https://..." />
                {cover && <img src={cover} alt="cover" className="mt-2 rounded-md max-h-40 object-cover w-full" />}
              </div>
              <div>
                <label className="block text-[11px] font-medium mb-1">Vidéo (YouTube URL)</label>
                <input className="w-full border rounded-md px-3 py-2 text-[12px]" value={video} onChange={e=>setVideo(e.target.value)} placeholder="https://youtu.be/..." />
                {video && (video.includes('youtube')||video.includes('youtu.be')) && <div className="mt-2 aspect-video w-full rounded-md overflow-hidden"><iframe src={video.replace('watch?v=','embed/')} className="w-full h-full" allowFullScreen title="video" /></div>}
              </div>
            </div>
            <select className="border rounded-md px-3 py-2 text-[12px]" value={status} onChange={e=>setStatus(e.target.value as any)}>
              <option value="draft">draft</option>
              <option value="actif">actif</option>
              <option value="en pause">en pause</option>
              <option value="clos">clos</option>
            </select>
            <div className="flex gap-2 text-[11px]">
              <button onClick={save} className="px-3 py-1.5 rounded-full bg-indigo-600 text-white">Enregistrer</button>
              <button onClick={()=>setEditing(false)} className="px-3 py-1.5 rounded-full border">Annuler</button>
            </div>
          </div>
        )}
        {!editing && short && <p className="text-[12px] text-gray-600 max-w-2xl">{short}</p>}
        {!editing && cover && <div className="mt-4"><img src={cover} alt="cover" className="rounded-lg max-h-60 object-cover" /></div>}
        {!editing && video && (video.includes('youtube')||video.includes('youtu.be')) && <div className="mt-4 aspect-video max-w-3xl rounded-lg overflow-hidden"><iframe src={video.replace('watch?v=','embed/')} className="w-full h-full" allowFullScreen title="video" /></div>}
        <div className="flex gap-2 pt-2">
          {!editing && <button onClick={()=>setEditing(true)} className="px-3 py-1 rounded-full border text-[11px] bg-white hover:bg-gray-50">Éditer</button>}
          {!editing && status!=='actif' && <button onClick={publish} className="px-3 py-1 rounded-full bg-green-600 text-white text-[11px]">Publier</button>}
          {!editing && status!=='draft' && <button onClick={draft} className="px-3 py-1 rounded-full bg-amber-500 text-white text-[11px]">Mettre en draft</button>}
          {!editing && <Link to={`/admin/projects/${project.id}/plan`} className="px-3 py-1 rounded-full bg-indigo-500 text-white text-[11px]">Configurer projet</Link>}
        </div>
      </header>
      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-[11px]">
        <InfoCard k={t('admin.ui.projects.create.type')} v={project.type} />
        <InfoCard k={t('admin.ui.projects.create.org')} v={`${project.organisation}${project.orgType? ' ('+project.orgType+')':''}`} />
        <InfoCard k={t('admin.ui.projects.create.location')} v={project.location} />
        <InfoCard k={t('admin.ui.projects.create.dates')} v={`${project.start} – ...`} />
  <InfoCard k={t('admin.ui.projects.create.primaryOperator')} v={project.primaryOperator || '-'} />
  <InfoCard k={t('admin.ui.projects.create.operatorsLabel')} v={(project.operators||[]).join(', ')} />
  <InfoCard k="Budget" v={String(project.budget)} />
  <InfoCard k="Collecté" v={String(project.collected)} />
      </section>
      <section className="text-[11px] text-gray-600">
        <h2 className="font-semibold mb-2 text-[12px]">{t('admin.ui.projects.create.detail_project_info')}</h2>
  {long && <div className="prose prose-sm max-w-none mb-3 whitespace-pre-wrap leading-relaxed">{long}</div>}
  <p>Les sections détaillées (Plan, Production, Distribution, Formation, Transparence, Dépenses, Rapports, Bénéficiaires) sont accessibles via les onglets au-dessus. Cette vue est volontairement simplifiée.</p>
      </section>
    </article>
  );
};

const InfoCard: React.FC<{k:string; v:string}> = ({k,v}) => (
  <div className="rounded-lg border p-3 bg-[var(--color-primary-light)]/30 space-y-1" style={{boxShadow:'var(--elev-0)'}}>
    <div className="text-[10px] uppercase tracking-wide text-[var(--muted-color,#7a6d7b)]">{k}</div>
    <div className="font-medium text-[var(--text-primary,#503246)] truncate">{v || '—'}</div>
  </div>
);


export default ProjectDetail;