import React, { useState, useRef } from 'react';
import AdminPage from '../../components/admin/AdminPage';
import { useTranslation } from 'react-i18next';
import { createProject } from '../../services/projectService';
import { useNavigate } from 'react-router-dom';

interface FieldError { [k:string]: string | undefined }

const operatorsList = ['Alice','Jean','Chantal','Peter','Grace'];
const organisationCategories = [
  { value:'ong', labelKey:'orgType_ong' },
  { value:'ecole', labelKey:'orgType_ecole' },
  { value:'association', labelKey:'orgType_association' },
  { value:'institution', labelKey:'orgType_institution' },
  { value:'organisation', labelKey:'orgType_organisation' }
];
const projectTypes = [
  { value:'blank', key:'type_blank' },
  { value:'distribution', key:'type_distribution' },
  { value:'formation', key:'type_formation' },
  { value:'recherche_dev', key:'type_recherche_dev' },
  { value:'achat', key:'type_achat' },
  { value:'hybride', key:'type_hybride' }
];

const countries = ['Burundi','Rwanda','DRC','Tanzania','Sénégal','India'];

interface OperatorChooserProps {
  all: string[];
  selected: string[];
  primary: string;
  onChange(list:string[]): void;
  onPrimaryChange(p:string): void;
  tr: (k:string)=>string;
  errorOps?: string;
  errorPrimary?: string;
}

const OperatorChooser: React.FC<OperatorChooserProps> = ({all, selected, primary, onChange, onPrimaryChange, tr, errorOps, errorPrimary}) => {
  const [query,setQuery] = useState('');
  const filtered = all.filter(o=> o.toLowerCase().includes(query.toLowerCase()) && !selected.includes(o));
  return (
    <div className="mt-1 space-y-2">
      <input value={query} onChange={e=>setQuery(e.target.value)} placeholder={tr('operatorSearch')} className="w-full rounded-lg px-3 h-8 bg-white border border-[var(--color-border)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none" />
      {filtered.length>0 && query && (
        <div className="flex flex-wrap gap-1">
          {filtered.map(o=> <button type="button" key={o} onClick={()=>{ onChange([...selected, o]); setQuery(''); }} className="px-2 py-1 rounded-full text-[11px] bg-white border border-[var(--color-border)] hover:bg-[var(--color-primary-light)]">{o} +</button>)}
        </div>
      )}
      {selected.length>0 && <div className="flex flex-wrap gap-1">
        {selected.map(o=> {
          const active = o===primary;
          return <div key={o} className={`flex items-center gap-1 px-2 py-1 rounded-full text-[11px] border ${active? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]':'bg-[var(--color-primary-light)] text-[var(--color-text-secondary)] border-transparent'}`}>
            <button type="button" onClick={()=> onPrimaryChange(o)} className="leading-none">{o}</button>
            <button type="button" onClick={()=>{ onChange(selected.filter(x=>x!==o)); if(primary===o){ const rest = selected.filter(x=>x!==o); onPrimaryChange(rest[0]||''); } }} className="opacity-70 hover:opacity-100">×</button>
          </div>;
        })}
      </div>}
      {selected.length>0 && <div>
        <label className="font-medium block mt-2">{tr('primaryOperator')} *</label>
        <select value={primary} onChange={e=>onPrimaryChange(e.target.value)} className="mt-1 w-full rounded-lg px-2 h-8 bg-white border border-[var(--color-border)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none">
          <option value="">--</option>
          {selected.map(o=> <option key={o}>{o}</option>)}
        </select>
      </div>}
      {errorOps && <p className="text-[11px] text-red-600">{errorOps}</p>}
      {errorPrimary && <p className="text-[11px] text-red-600">{errorPrimary}</p>}
    </div>
  );
};

const ProjectCreate: React.FC = () => {
  const { t } = useTranslation();
  const tr = (k:string, def?:string)=> t(`admin.ui.projects.create.${k}`, def || k);
  const [name,setName] = useState('');
  const [type,setType] = useState('distribution');
  const [manager,setManager] = useState('');
  const [operators,setOperators] = useState<string[]>(['Alice','Jean','Chantal']);
  const [primaryOperator,setPrimaryOperator] = useState<string>('Jean');
  const [orgType,setOrgType] = useState('ong');
  const [orgEntity,setOrgEntity] = useState('SaCoDó / ...');
  const [country,setCountry] = useState('Burundi');
  const [state,setState] = useState('');
  const [city,setCity] = useState('');
  const [startDate,setStartDate] = useState('2025-01-15');
  const [endDate,setEndDate] = useState('2025-11-30');
  const [template,setTemplate] = useState('');
  const [description,setDescription] = useState('');
  const [budget,setBudget] = useState('120000');
  const [shortDescription,setShortDescription] = useState('');
  const [initialCollected,setInitialCollected] = useState('0');
  const [videoUrl,setVideoUrl] = useState('');
  const [videoFileData,setVideoFileData] = useState<string | undefined>();
  const [videoSource,setVideoSource] = useState<'url'|'upload'>('url');
  const videoInputRef = useRef<HTMLInputElement|null>(null);
  const [coverImage,setCoverImage] = useState<string | undefined>();
  const [coverPreview,setCoverPreview] = useState<string | undefined>();
  const coverInputRef = useRef<HTMLInputElement|null>(null);
  const [saving,setSaving] = useState(false);
  const [errors,setErrors] = useState<FieldError>({});
  const [createdId,setCreatedId] = useState<string|undefined>();
  const navigate = useNavigate();


  function validate(): boolean {
    const e: FieldError = {};
    if(!name.trim()) e.name = tr('required');
    if(!manager.trim()) e.manager = tr('required');
    if(!country) e.country = tr('required');
    if(!budget || isNaN(Number(budget))) e.budget = tr('budgetInvalid');
    if(!coverImage) e.coverImage = tr('coverRequired');
    if(initialCollected && isNaN(Number(initialCollected))) e.initialCollected = tr('budgetInvalid');
  if(!operators.length) e.operators = tr('operatorsRequired');
  if(operators.length && !primaryOperator) e.primaryOperator = tr('primaryOperatorRequired');
  if(primaryOperator && !operators.includes(primaryOperator)) e.primaryOperator = tr('primaryOperatorRequired');
    setErrors(e);
    return Object.keys(e).length===0;
  }

  async function handleCreate(status: 'draft'|'actif', cont?: boolean){
    if(!validate()) return;
    setSaving(true);
    try {
      const row = createProject({
        name,
        type: type as any,
  organisation: orgEntity,
  orgType: orgType as any,
        location: `${country} • ${city||'---'}`,
        start: startDate,
        status,
        budget: Number(budget),
        shortDescription: shortDescription || description.slice(0,120),
        longDescription: description || undefined,
        coverImage: coverImage,
        videoUrl: videoUrl || undefined,
  collected: initialCollected? Number(initialCollected): 0,
  operators,
  primaryOperator
      });
      setCreatedId(row.id);
      if(!cont){
        // redirect to detail after slight delay to ensure state flush
        setTimeout(()=> { setSaving(false); navigate(`/admin/projects/${row.id}`); }, 150);
      } else {
        // reset but keep some context
        setName('');
        setDescription('');
        setBudget('');
        setShortDescription('');
        setInitialCollected('0');
        setVideoUrl('');
        setCoverImage(undefined);
        setCoverPreview(undefined);
  setOperators(['Alice']);
  setPrimaryOperator('Alice');
        setSaving(false);
      }
    } finally {
      setSaving(false);
    }
  }

  function onSelectCover(ev: React.ChangeEvent<HTMLInputElement>){
    const file = ev.target.files?.[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      const result = e.target?.result as string | undefined;
      if(result){
        setCoverImage(result);
        setCoverPreview(result);
      }
    };
    reader.readAsDataURL(file);
  }

  function removeCover(){
    setCoverImage(undefined);
    setCoverPreview(undefined);
    if(coverInputRef.current) coverInputRef.current.value='';
  }

  const embedVideo = videoSource==='url' && videoUrl && (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be'));

  function onSelectVideo(ev: React.ChangeEvent<HTMLInputElement>){
    const file = ev.target.files?.[0];
    if(!file) return;
    if(file.size > 40_000_000){ // ~40MB simple guard
      setErrors(e=>({...e, videoFile: 'Too large'}));
      return;
    }
    const reader = new FileReader();
    reader.onload = e => {
      const result = e.target?.result as string | undefined;
      if(result){
        setVideoFileData(result);
      }
    };
    reader.readAsDataURL(file);
  }

  function removeVideo(){
    setVideoFileData(undefined);
    if(videoInputRef.current) videoInputRef.current.value='';
  }

  return (
    <AdminPage title={tr('title')}>
      <div className="w-full max-w-[1260px] mx-auto">
        <div className="rounded-xl bg-white p-6" style={{boxShadow:'var(--elev-1)'}}>
          <form className="grid md:grid-cols-12 gap-5 text-[12px]">
            {/* Left column (8) */}
            <div className="md:col-span-8 space-y-5">
              <div>
                <label className="font-medium">{tr('name')} *</label>
                <input value={name} onChange={e=>setName(e.target.value)} placeholder={tr('placeholderName')} className="mt-1 w-full rounded-lg px-3 h-9 text-[12px] bg-white border border-[var(--color-border)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none" />
                {errors.name && <p className="text-[11px] text-red-600 mt-1">{errors.name}</p>}
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="font-medium">{tr('manager')} *</label>
                  <select value={manager} onChange={e=>setManager(e.target.value)} className="mt-1 w-full rounded-lg px-3 h-9 bg-white border border-[var(--color-border)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none">
                    <option value="">--</option>
                    <option>Alice</option><option>Jean</option><option>Chantal</option><option>Peter</option>
                  </select>
                  {errors.manager && <p className="text-[11px] text-red-600 mt-1">{errors.manager}</p>}
                </div>
                <div>
                  <label className="font-medium flex items-center gap-2">{tr('operatorsLabel')} <span className="opacity-60">({tr('operatorsPlaceholder')})</span></label>
                  <OperatorChooser
                    all={operatorsList}
                    selected={operators}
                    primary={primaryOperator}
                    onChange={(list)=>{
                      setOperators(list);
                      if(list.length && !list.includes(primaryOperator)) setPrimaryOperator(list[0]);
                      if(!list.length) setPrimaryOperator('');
                      setErrors(e=>({...e, operators: undefined, primaryOperator: undefined}));
                    }}
                    onPrimaryChange={(p)=>{ setPrimaryOperator(p); setErrors(e=>({...e, primaryOperator: undefined})); }}
                    tr={tr}
                    errorOps={errors.operators}
                    errorPrimary={errors.primaryOperator}
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="font-medium">{tr('type')} *</label>
                  <select value={type} onChange={e=>setType(e.target.value)} className="mt-1 w-full rounded-lg px-3 h-9 bg-white border border-[var(--color-border)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none">
                    {projectTypes.map(p=> <option key={p.value} value={p.value}>{tr(p.key)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-medium">{tr('template')}</label>
                  <select value={template} onChange={e=>setTemplate(e.target.value)} className="mt-1 w-full rounded-lg px-3 h-9 bg-white border border-[var(--color-border)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none">
                    <option value="">--</option>
                    <option value="dist-basic">Distribution basic</option>
                    <option value="training-basic">Training basic</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="font-medium">{tr('org')} *</label>
                <div className="grid md:grid-cols-3 gap-3 mt-1">
                  <div className="md:col-span-1 space-y-1">
                    <select value={orgType} onChange={e=>setOrgType(e.target.value)} className="w-full rounded-lg px-3 h-9 bg-white border border-[var(--color-border)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none">
                      {organisationCategories.map(o=> <option key={o.value} value={o.value}>{tr(o.labelKey)}</option>)}
                    </select>
                  </div>
                  <input value={orgEntity} onChange={e=>setOrgEntity(e.target.value)} placeholder="Entité / Nom" className="md:col-span-2 rounded-lg px-3 h-9 bg-white border border-[var(--color-border)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none" />
                </div>
              </div>
              <div>
                <label className="font-medium">{tr('location')} *</label>
                <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-3 mt-1">
                  <select value={country} onChange={e=>setCountry(e.target.value)} className="rounded-lg px-3 h-9 bg-white border border-[var(--color-border)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none">
                    {countries.map(c=> <option key={c}>{c}</option>)}
                  </select>
                  <input value={state} onChange={e=>setState(e.target.value)} placeholder={tr('state')} className="rounded-lg px-3 h-9 bg-white border border-[var(--color-border)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none" />
                  <input value={city} onChange={e=>setCity(e.target.value)} placeholder={tr('city')} className="rounded-lg px-3 h-9 bg-white border border-[var(--color-border)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none" />
                  <div className="flex gap-2 items-center text-[11px] text-[var(--muted-color)]">{tr('dates')}</div>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="font-medium">{tr('startDate')}</label>
                  <input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} className="mt-1 w-full rounded-lg px-3 h-9 bg-white border border-[var(--color-border)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none" />
                </div>
                <div>
                  <label className="font-medium">{tr('endDate')}</label>
                  <input type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} className="mt-1 w-full rounded-lg px-3 h-9 bg-white border border-[var(--color-border)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none" />
                </div>
              </div>
              <div>
                <label className="font-medium">{tr('description')}</label>
                <textarea value={description} onChange={e=>setDescription(e.target.value)} rows={3} className="mt-1 w-full rounded-lg px-3 py-2 resize-y bg-white border border-[var(--color-border)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none" />
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="font-medium">{tr('shortDescription')}</label>
                  <textarea value={shortDescription} onChange={e=>setShortDescription(e.target.value)} rows={3} className="mt-1 w-full rounded-lg px-3 py-2 resize-y bg-white border border-[var(--color-border)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none" />
                </div>
                <div>
                  <label className="font-medium flex items-center gap-2">{tr('videoSource')}
                    <div className="inline-flex rounded-full bg-[var(--color-primary-light)] p-1 text-[11px]">
                      <button type="button" onClick={()=>setVideoSource('url')} className={`px-2 py-0.5 rounded-full ${videoSource==='url'?'bg-[var(--color-primary)] text-white':'text-[var(--color-text-secondary)]'}`}>{tr('sourceUrl')}</button>
                      <button type="button" onClick={()=>setVideoSource('upload')} className={`px-2 py-0.5 rounded-full ${videoSource==='upload'?'bg-[var(--color-primary)] text-white':'text-[var(--color-text-secondary)]'}`}>{tr('sourceUpload')}</button>
                    </div>
                  </label>
                  {videoSource==='url' && <>
                    <input value={videoUrl} onChange={e=>setVideoUrl(e.target.value)} placeholder="https://youtu.be/..." className="mt-1 w-full rounded-lg px-3 h-9 bg-white border border-[var(--color-border)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none" />
                    {embedVideo && <div className="mt-2 aspect-video w-full rounded-lg overflow-hidden bg-black">
                      <iframe src={videoUrl.replace('watch?v=','embed/')} className="w-full h-full" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title="video" />
                    </div>}
                  </>}
                  {videoSource==='upload' && <div className="mt-1">
                    {!videoFileData && <div onClick={()=>videoInputRef.current?.click()} className="border border-dashed rounded-lg p-4 text-center text-[11px] cursor-pointer hover:bg-[var(--color-primary-light)]">
                      <p className="mb-1">{tr('videoFile')}</p>
                      <p className="opacity-60">MP4 &lt; 40MB</p>
                    </div>}
                    {videoFileData && <div className="relative group">
                      <video src={videoFileData} className="w-full rounded-lg aspect-video object-cover" controls />
                      <button type="button" onClick={removeVideo} className="absolute top-2 right-2 px-2 py-1 rounded bg-black/60 text-white text-[11px] opacity-0 group-hover:opacity-100 transition">{tr('removeVideo')}</button>
                    </div>}
                    <input ref={videoInputRef} type="file" accept="video/*" onChange={onSelectVideo} className="hidden" />
                  </div>}
                </div>
              </div>
            </div>
            {/* Right column (4) */}
            <div className="md:col-span-4 space-y-5">
              <div>
                <label className="font-medium">{tr('plannedBudget')} *</label>
                <input value={budget} onChange={e=>setBudget(e.target.value)} className="mt-1 w-full rounded-lg px-3 h-9 bg-white border border-[var(--color-border)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none" />
                {errors.budget && <p className="text-[11px] text-red-600 mt-1">{errors.budget}</p>}
              </div>
              <div>
                <label className="font-medium">{tr('initialCollected')}</label>
                <input value={initialCollected} onChange={e=>setInitialCollected(e.target.value)} className="mt-1 w-full rounded-lg px-3 h-9 bg-white border border-[var(--color-border)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none" />
                {errors.initialCollected && <p className="text-[11px] text-red-600 mt-1">{errors.initialCollected}</p>}
              </div>
              <div>
                <label className="font-medium">{tr('coverImage')} *</label>
                <div className="mt-1">
                  {!coverPreview && <div className="border border-dashed rounded-lg p-4 text-center text-[11px] cursor-pointer hover:bg-[var(--color-primary-light)]" onClick={()=>coverInputRef.current?.click()}>
                    <p className="mb-1">{tr('coverImage')}</p>
                    <p className="opacity-60">PNG/JPG &lt; 2MB</p>
                  </div>}
                  {coverPreview && <div className="relative group">
                    <img src={coverPreview} alt="cover" className="w-full rounded-lg object-cover aspect-video" />
                    <button type="button" onClick={removeCover} className="absolute top-2 right-2 px-2 py-1 rounded bg-black/60 text-white text-[11px] opacity-0 group-hover:opacity-100 transition">✕</button>
                  </div>}
                  <input ref={coverInputRef} type="file" accept="image/*" onChange={onSelectCover} className="hidden" />
                  {errors.coverImage && <p className="text-[11px] text-red-600 mt-1">{errors.coverImage}</p>}
                </div>
              </div>
              <div className="text-[11px] p-3 rounded-lg bg-[var(--color-primary-light)] text-[var(--color-text-secondary)]">
                <div className="font-medium mb-1">Meta</div>
                <div className="flex flex-col gap-1">
                  <div><span className="opacity-70">{tr('code')}:</span> <span className="font-mono">{createdId? createdId : 'D-2025-0926-001'}</span></div>
                  <div><span className="opacity-70">{tr('createdBy')}:</span> admin@e4d.org</div>
                  <div><span className="opacity-70">{tr('createdAt')}:</span> 2025-09-26</div>
                </div>
              </div>
              <p className="text-[11px] text-[var(--muted-color)] leading-relaxed">{tr('tipRequired')}</p>
            </div>
            {/* Actions bottom bar */}
            <div className="md:col-span-12 mt-2 flex flex-wrap gap-2 items-center justify-end border-t pt-4" style={{borderColor:'rgba(0,0,0,0.06)'}}>
              <button type="button" onClick={()=>handleCreate('draft', false)} disabled={saving} className="h-8 px-4 rounded-full text-[12px] bg-white border border-transparent hover:border-[var(--color-border)]" style={{boxShadow:'var(--elev-0)'}}>{tr('saveDraft')}</button>
              <button type="button" onClick={()=>handleCreate('draft', true)} disabled={saving} className="h-8 px-4 rounded-full text-[12px] bg-white border border-transparent hover:border-[var(--color-border)]" style={{boxShadow:'var(--elev-0)'}}>{tr('createContinue')}</button>
              <button type="button" onClick={()=>handleCreate('actif', false)} disabled={saving} className="h-8 px-5 rounded-full text-[12px] font-medium text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)]" style={{boxShadow:'var(--elev-1)'}}>{tr('create')}</button>
            </div>
          </form>
        </div>
      </div>
    </AdminPage>
  );
};

export default ProjectCreate;
