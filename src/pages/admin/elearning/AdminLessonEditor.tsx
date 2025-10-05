import React, { useEffect, useRef, useState } from 'react';
import AdminPage from '../../../components/admin/AdminPage';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { useNavigate, useParams } from 'react-router-dom';
import { EditorContent, useEditor } from '@tiptap/react';
import { Extension } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { TextStyle } from '@tiptap/extension-text-style';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { elearningStore, ElearnLessonRecord } from '../../../services/elearningStore';
import EditorToolbar from '../../../components/editor/EditorToolbar';

function slugify(input: string){
  return input
    .toLowerCase()
    .normalize('NFD').replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g,'-')
    .replace(/(^-|-$)+/g,'')
    .slice(0,100);
}

const AdminLessonEditor: React.FC = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const existing = slug ? elearningStore.get(slug) : undefined;
  const [title, setTitle] = useState(existing?.title || '');
  const [slugVal, setSlugVal] = useState(existing?.slug || '');
  const [summary, setSummary] = useState(existing?.summary || '');
  const [level, setLevel] = useState<ElearnLessonRecord['level']>(existing?.level || 'Beginner');
  const [duration, setDuration] = useState<number>(existing?.duration_minutes || 6);
  const [topic, setTopic] = useState(existing?.topic || 'MHM');
  const [tags, setTags] = useState<string[]>(existing?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [cover, setCover] = useState(existing?.cover_image_url || '');
  const coverInputRef = useRef<HTMLInputElement|null>(null);
  const fileInputRef = useRef<HTMLInputElement|null>(null);

  const FontSize = Extension.create({
    name: 'fontSize',
    addGlobalAttributes(){ return [{ types:['textStyle'], attributes:{ fontSize:{ default:null, parseHTML: (el:any)=> (el as HTMLElement).style.fontSize||null, renderHTML: (attrs:any)=> attrs.fontSize? { style:`font-size:${attrs.fontSize}` }:{} } } }]; }
  });

  const VideoAwareLink = Link.extend({
    addAttributes(){
      return { ...(this.parent && typeof this.parent==='function'? this.parent(): {}), 'data-e4d-video':{ default:null, parseHTML:(el:any)=> el.getAttribute('data-e4d-video'), renderHTML:(attrs:any)=> attrs['data-e4d-video']? { 'data-e4d-video': attrs['data-e4d-video'] }:{} } } as any;
    }
  });

  const [editorHTML, setEditorHTML] = useState(existing?.body_html || '');
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoCaption, setVideoCaption] = useState('');
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkTargetBlank, setLinkTargetBlank] = useState(true);
  const editor = useEditor({
    extensions:[ TextStyle, StarterKit, VideoAwareLink.configure({ openOnClick:true, autolink:true, linkOnPaste:true }), Image.configure({ HTMLAttributes:{ class:'rounded-xl' } }), Placeholder.configure({ placeholder:'Écrivez le contenu de la leçon…' }), FontSize ],
    content: existing?.body_html || '',
    editorProps:{ attributes:{ class:'prose prose-base max-w-none min-h-[420px] outline-none' } },
    onUpdate: ({editor})=> setEditorHTML(editor.getHTML()),
    onCreate: ({editor})=> setEditorHTML(editor.getHTML()),
  });

  useEffect(()=>{ if(!slug && title){ setSlugVal(s=> s || slugify(title)); } },[title, slug]);

  function addTag(){ const t=tagInput.trim(); if(!t) return; if(!tags.includes(t)) setTags([...tags,t]); setTagInput(''); }
  function removeTag(tag:string){ setTags(tags.filter(x=> x!==tag)); }

  function extractFirstImage(html: string): string|undefined {
    try{ const c=document.createElement('div'); c.innerHTML=html; const img=c.querySelector('img'); return img?.getAttribute('src')||undefined; }catch{ return undefined; }
  }

  async function save(publish:boolean){
    const rec: ElearnLessonRecord = {
      title,
      slug: slugVal || slugify(title) || `untitled-${Date.now()}`,
      summary,
      level,
      duration_minutes: Number(duration)||0,
      tags,
      topic,
      cover_image_url: cover || extractFirstImage(editorHTML) || null,
      published_at: publish? (existing?.published_at || new Date().toISOString()) : (existing?.published_at || ''),
      updated_at: new Date().toISOString(),
      body_html: editorHTML,
    };
    elearningStore.upsert(rec);
    if (publish && !rec.published_at) elearningStore.publish(rec.slug);
    navigate('/admin/elearning');
  }

  return (
    <AdminPage title={existing? "Modifier la leçon" : "Nouvelle leçon"}>
      <EditorToolbar
        editor={editor}
        fileInputRef={fileInputRef}
        onOpenVideoModal={()=> { setVideoUrl(''); setVideoCaption(''); setShowVideoModal(true); }}
        onOpenLinkModal={()=> { if(!editor) return; const current = editor.getAttributes('link') as any; setLinkUrl(current?.href || ''); setLinkTargetBlank((current?.target || '_blank') !== '_self'); setShowLinkModal(true); }}
      />
      {/* Hidden image input near toolbar for reliability */}
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={async (e)=>{
        const f = e.target.files?.[0]; if(!f || !editor) return; const r = new FileReader(); r.onload=()=> editor.chain().focus().setImage({ src: String(r.result||'') }).run(); r.readAsDataURL(f);
      }} />
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl bg-white border p-4 space-y-4" style={{borderColor:'var(--rose-200)'}}>
          <input value={title} onChange={e=> setTitle(e.target.value)} placeholder="Titre de la leçon..." className="w-full text-[28px] font-bold outline-none bg-transparent" />
          <div className="relative">{editor && <EditorContent editor={editor} />}</div>
        </div>
        <div className="space-y-4">
          <div className="rounded-2xl bg-white border p-4 space-y-3" style={{borderColor:'var(--rose-200)'}}>
            {/* Video insert modal */}
            {showVideoModal && (
              <div className="fixed inset-0 z-[110] bg-black/40 flex items-center justify-center p-4">
                <div className="w-full max-w-xl rounded-2xl bg-white border p-5" style={{borderColor:'var(--rose-200)'}}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[16px] font-semibold text-[var(--slate-900)]">Insérer une vidéo</h3>
                    <button className="h-8 px-3 rounded-md border text-[12px]" style={{borderColor:'var(--rose-200)'}} onClick={()=> setShowVideoModal(false)}>Fermer</button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[12px] font-medium text-[var(--slate-800)] mb-1">URL vidéo (YouTube ou MP4)</label>
                      <input value={videoUrl} onChange={e=> setVideoUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=... ou https://cdn.exemple.com/video.mp4" className="w-full h-10 rounded-md border px-3" style={{borderColor:'var(--rose-200)'}}/>
                      <p className="text-[12px] text-[var(--slate-600)] mt-1">Les liens YouTube seront intégrés automatiquement en lecteur responsive.</p>
                    </div>
                    <div>
                      <label className="block text-[12px] font-medium text-[var(--slate-800)] mb-1">Légende (optionnel)</label>
                      <input value={videoCaption} onChange={e=> setVideoCaption(e.target.value)} className="w-full h-10 rounded-md border px-3" style={{borderColor:'var(--rose-200)'}}/>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <button className="h-9 px-3 rounded-md border" style={{borderColor:'var(--rose-200)'}} onClick={()=> setShowVideoModal(false)}>Annuler</button>
                    <button className="h-9 px-3 rounded-md bg-[var(--rose-600)] hover:bg-[var(--rose-700)] text-white" onClick={()=> {
                      if (!editor) return;
                      const url = videoUrl.trim(); if (!url) return;
                      const label = (videoCaption.trim() || url).replace(/</g,'&lt;').replace(/>/g,'&gt;');
                      const html = `<p><a href="${url}" data-e4d-video="1" target="_blank" rel="noopener noreferrer">${label}</a></p>`;
                      editor.chain().focus().insertContent(html).run();
                      setShowVideoModal(false);
                    }}>Insérer</button>
                  </div>
                </div>
              </div>
            )}
            {/* Link modal */}
            {showLinkModal && (
              <div className="fixed inset-0 z-[110] bg-black/40 flex items-center justify-center p-4">
                <div className="w-full max-w-lg rounded-2xl bg-white border p-5" style={{borderColor:'var(--rose-200)'}}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[16px] font-semibold text-[var(--slate-900)]">Définir un lien</h3>
                    <button className="h-8 px-3 rounded-md border text-[12px]" style={{borderColor:'var(--rose-200)'}} onClick={()=> setShowLinkModal(false)}>Fermer</button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[12px] font-medium text-[var(--slate-800)] mb-1">URL</label>
                      <input value={linkUrl} onChange={e=> setLinkUrl(e.target.value)} placeholder="https://exemple.com" className="w-full h-10 rounded-md border px-3" style={{borderColor:'var(--rose-200)'}}/>
                    </div>
                    <label className="inline-flex items-center gap-2 text-[12px]">
                      <input type="checkbox" checked={linkTargetBlank} onChange={(e)=> setLinkTargetBlank(e.target.checked)} />
                      Ouvrir dans un nouvel onglet
                    </label>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <button className="h-9 px-3 rounded-md border" style={{borderColor:'var(--rose-200)'}} onClick={()=> setShowLinkModal(false)}>Annuler</button>
                    <button className="h-9 px-3 rounded-md bg-[var(--rose-600)] hover:bg-[var(--rose-700)] text-white" onClick={()=> {
                      if (!editor) return;
                      let url = linkUrl.trim(); if (!url) return;
                      if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
                      const attrs: any = { href: url };
                      if (linkTargetBlank) { attrs.target = '_blank'; attrs.rel = 'noopener noreferrer'; }
                      const hasSelection = !editor.state.selection.empty;
                      if (!hasSelection) {
                        editor.chain().focus().insertContent(`<a href="${url}"${linkTargetBlank?" target=\"_blank\" rel=\"noopener noreferrer\"":""}>${url}</a>`).run();
                      } else {
                        editor.chain().focus().extendMarkRange('link').setLink(attrs).run();
                      }
                      setShowLinkModal(false);
                    }}>Appliquer</button>
                  </div>
                </div>
              </div>
            )}
            <Input label="Slug" value={slugVal} onChange={e=> setSlugVal(slugify(e.target.value))} placeholder="auto" />
            <label className="block text-sm font-medium">Résumé</label>
            <textarea value={summary} onChange={e=> setSummary(e.target.value)} rows={3} className="w-full rounded-md border px-3 py-2 text-sm" style={{borderColor:'var(--rose-200)'}} />
            <label className="block text-sm font-medium">Niveau</label>
            <select value={level} onChange={e=> setLevel(e.target.value as any)} className="h-10 w-full rounded-md border px-3" style={{borderColor:'var(--rose-200)'}}>
              {['Beginner','Intermediate','Advanced'].map(l=> <option key={l} value={l}>{l}</option>)}
            </select>
            <label className="block text-sm font-medium">Durée (minutes)</label>
            <input type="number" value={duration} onChange={e=> setDuration(Number(e.target.value))} className="h-10 w-full rounded-md border px-3" style={{borderColor:'var(--rose-200)'}} />
            <label className="block text-sm font-medium">Thème</label>
            <input value={topic} onChange={e=> setTopic(e.target.value)} className="h-10 w-full rounded-md border px-3" style={{borderColor:'var(--rose-200)'}} />
            <div>
              <label className="block text-sm font-medium">Tags</label>
              <div className="flex gap-2 mt-1">
                <input value={tagInput} onChange={e=> setTagInput(e.target.value)} placeholder="Ajouter un tag" className="h-9 flex-1 rounded-md border px-3" style={{borderColor:'var(--rose-200)'}} />
                <Button size="sm" onClick={addTag}>Ajouter</Button>
              </div>
              {tags.length>0 && (
                <div className="flex flex-wrap gap-2 mt-2">{tags.map(t=> <span key={t} className="inline-flex items-center gap-2 px-2 h-7 rounded-full border text-[12px]" style={{borderColor:'var(--rose-200)'}}>{t}<button className="text-[var(--rose-700)]" onClick={()=> removeTag(t)}>×</button></span>)}</div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">Cover/Thumbnail</label>
              <div className="flex gap-2 mt-1">
                <Button size="sm" onClick={()=> coverInputRef.current?.click()}>Choisir une image…</Button>
                {cover && <Button size="sm" variant="secondary" onClick={()=> setCover('')}>Retirer</Button>}
              </div>
              <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={(e)=>{ const f=e.target.files?.[0]; if(!f) return; const r=new FileReader(); r.onload=()=> setCover(String(r.result||'')); r.readAsDataURL(f); }} />
              {cover && (<div className="rounded-xl overflow-hidden border mt-2" style={{borderColor:'var(--rose-200)'}}><img src={cover} alt="thumbnail" className="w-full h-36 object-cover" /></div>)}
            </div>
            <div className="flex gap-2 pt-1">
              <Button onClick={()=> save(false)} className="rounded-full">Enregistrer brouillon</Button>
              <Button onClick={()=> save(true)} className="rounded-full">Publier</Button>
              <Button variant="secondary" onClick={()=> navigate('/admin/elearning')} className="rounded-full">Annuler</Button>
            </div>
          </div>
        </div>
      </div>
    </AdminPage>
  );
};

export default AdminLessonEditor;
