import React, { useEffect, useRef, useState } from 'react';
import AdminPage from '../../components/admin/AdminPage';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { blogStore } from '../../services/blogStore';
import { BlogArticle } from '../../types/blog';
import { useNavigate, useParams } from 'react-router-dom';
import { EditorContent, useEditor } from '@tiptap/react';
import { Extension } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { TextStyle } from '@tiptap/extension-text-style';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import EditorToolbar from '../../components/editor/EditorToolbar';
import { transformArticleHtml } from '../../utils/mediaTransform';
// Minimal UI: only Bubble (selection) and Floating "+" menu

function slugify(input: string){
  return input
    .toLowerCase()
    .normalize('NFD').replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g,'-')
    .replace(/(^-|-$)+/g,'')
    .slice(0,100);
}

const CATEGORIES = ['impact','insights','updates','research','howto'];

const AdminBlogEditor: React.FC = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const existing = slug? blogStore.get(slug) : undefined;
  const [title, setTitle] = useState(existing?.title || '');
  const [slugVal, setSlugVal] = useState(existing?.slug || '');
  const [excerpt, setExcerpt] = useState(existing?.excerpt || '');
  const [category, setCategory] = useState(existing?.category || 'impact');
  const [tags, setTags] = useState<string[]>(existing?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [cover, setCover] = useState(existing?.cover_image_url || '');
  const coverInputRef = useRef<HTMLInputElement|null>(null);
  // Rich editor only (Markdown mode removed)
  const fileInputRef = useRef<HTMLInputElement|null>(null);

  // Custom font-size support on TextStyle mark
  const FontSize = Extension.create({
    name: 'fontSize',
    addGlobalAttributes() {
      return [
        {
          types: ['textStyle'],
          attributes: {
            fontSize: {
              default: null,
              parseHTML: element => (element as HTMLElement).style.fontSize || null,
              renderHTML: attributes => {
                const size = (attributes as any).fontSize as string | null;
                if (!size) return {};
                return { style: `font-size: ${size}` };
              },
            },
          },
        },
      ];
    },
  });

  const [editorHTML, setEditorHTML] = useState(existing?.body_html || '');
  // Fallback simple paragraphs (if TipTap fails or user prefers)
  const [fallbackParas, setFallbackParas] = useState<string[]>(()=>
    existing?.body_md ? existing.body_md.split(/\n\n+/).filter(Boolean) : ['']
  );
  const [useFallback, setUseFallback] = useState(false);

  // Extend Link to preserve data-e4d-video attribute
  const VideoAwareLink = Link.extend({
    addAttributes() {
      return {
        ...((this.parent && typeof this.parent === 'function') ? this.parent() : {}),
        'data-e4d-video': {
          default: null,
          parseHTML: (element: any) => element.getAttribute('data-e4d-video'),
          renderHTML: (attributes: any) => {
            const v = attributes['data-e4d-video'];
            return v ? { 'data-e4d-video': v } : {};
          },
        },
      } as any;
    },
  });

  const editor = useEditor({
    extensions: [
      TextStyle,
      StarterKit,
  VideoAwareLink.configure({ openOnClick: true, autolink: true, linkOnPaste: true }),
      Image.configure({ HTMLAttributes: { class: 'rounded-xl' } }),
      Placeholder.configure({ placeholder: 'Écrivez votre article…' }),
      FontSize,
    ],
    content: existing?.body_html || '',
    editorProps: {
      attributes: { class: 'prose prose-base max-w-none min-h-[420px] outline-none' },
      handleClickOn: (_view: any, _pos: number, node: any, nodePos: number, event: MouseEvent) => {
        if (node?.type?.name === 'image') {
          // Focus the editor and select the image node
          editor?.chain().setNodeSelection(nodePos).focus().run();
          const current = node?.attrs?.title || node?.attrs?.alt || '';
          const caption = window.prompt('Légende de l\'image (caption):', current || '');
          if (caption !== null) {
            editor?.chain().focus().updateAttributes('image', { title: caption, alt: caption }).run();
          }
          event.preventDefault();
          return true;
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      setEditorHTML(editor.getHTML());
    },
    onCreate: ({ editor }) => {
      setEditorHTML(editor.getHTML());
    }
  });
  const [authorName, setAuthorName] = useState(existing?.author?.name || 'E4D Ops');
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoCaption, setVideoCaption] = useState('');
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkTargetBlank, setLinkTargetBlank] = useState(true);

  // Use shared transform util for preview/public rendering parity
  // Note: We purposely do NOT embed raw iframes into TipTap content, because StarterKit schema drops them.
  // We insert links instead and convert them to embeds in preview/public rendering.

  // Auto-enable fallback if editor failed to initialize
  useEffect(()=> { if(!editor) setUseFallback(true); }, [editor]);

  useEffect(()=>{ if(!slug && title){ setSlugVal(s=> s|| slugify(title)); } },[title, slug]);

  useEffect(()=>{
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (saving) return;
      const hasEditorContent = !!editorHTML && editorHTML.replace(/<[^>]*>/g,'').trim().length>0;
      if (title || excerpt || hasEditorContent) { e.preventDefault(); e.returnValue = ''; }
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return ()=> window.removeEventListener('beforeunload', onBeforeUnload);
  },[title, excerpt, saving, editorHTML]);

  function addTag(){ const t=tagInput.trim(); if(!t) return; if(!tags.includes(t)) setTags([...tags,t]); setTagInput(''); }
  function removeTag(tag:string){ setTags(tags.filter(t=> t!==tag)); }

  function extractMedia(html: string | undefined): { images: string[]; videos: string[] } {
    if (!html) return { images: [], videos: [] };
    const container = document.createElement('div');
    container.innerHTML = html;
    const imgs = Array.from(container.querySelectorAll('img')).map(img => img.getAttribute('src') || '').filter(Boolean) as string[];
    const vids: string[] = [];
    // native video tags
    Array.from(container.querySelectorAll('video')).forEach(v => {
      const direct = v.getAttribute('src');
      if (direct) vids.push(direct);
      Array.from(v.querySelectorAll('source')).forEach(s => { const src = s.getAttribute('src'); if (src) vids.push(src); });
    });
    // basic iframe embeds (e.g., YouTube)
    Array.from(container.querySelectorAll('iframe')).forEach(f => { const src = f.getAttribute('src'); if (src) vids.push(src); });
    return { images: imgs, videos: vids };
  }

  function buildArticle(): BlogArticle {
    const html = editorHTML;
    const plainText = editor?.getText() || '';
    return {
      title,
      slug: slugVal || slugify(title) || `untitled-${Date.now()}`,
      category,
      tags,
      author: { id: 'auth1', name: authorName },
      cover_image_url: (() => {
        const { images } = extractMedia(html);
        // Prefer explicit cover if set, else first image in content, else default
        return cover || images[0] || '/photos/course/001.jpg';
      })(),
      published_at: existing?.published_at || '',
      read_minutes: Math.max(3, Math.round(plainText.split(/\s+/).filter(Boolean).length / 200)),
      excerpt,
      body_md: plainText,
      body_html: html,
      media_images: (() => {
        const { images } = extractMedia(html);
        return images;
      })(),
      media_videos: (() => {
        const { videos } = extractMedia(html);
        return videos;
      })(),
      callout_transparency: existing?.callout_transparency
    };
  }

  async function saveDraft(){
    if (saving) return;
    setSaving(true);
    try {
      const article = buildArticle();
      if (useFallback) {
        const text = fallbackParas.join('\n\n').trim();
        article.body_md = text;
        article.body_html = text.split(/\n\n+/).map(par => `<p>${par.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</p>`).join('');
      }
      // keep published_at as-is for drafts
      blogStore.upsert(article);
      setSaving(false);
      navigate('/admin/blog');
    } catch (e) {
      setSaving(false);
      console.error(e);
      alert('Erreur lors de la sauvegarde');
    }
  }

  async function publishNow(){
    if (saving) return;
    setSaving(true);
    try {
      const article = buildArticle();
      if (useFallback) {
        const text = fallbackParas.join('\n\n').trim();
        article.body_md = text;
        article.body_html = text.split(/\n\n+/).map(par => `<p>${par.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</p>`).join('');
      }
      article.published_at = new Date().toISOString();
      blogStore.upsert(article);
      setSaving(false);
      navigate('/admin/blog');
    } catch (e) {
      setSaving(false);
      console.error(e);
      alert('Erreur lors de la publication');
    }
  }
  return (
    <AdminPage title={existing ? 'Modifier l\'article' : 'Nouvel article'}>
      {/* Global fixed toolbar placed under the page title (not inside the editor) */}
      {!useFallback && (
        <>
          <EditorToolbar
            editor={editor}
            fileInputRef={fileInputRef}
            onOpenVideoModal={()=> { setVideoUrl(''); setVideoCaption(''); setShowVideoModal(true); }}
            onOpenLinkModal={()=> { if(!editor) return; const current = editor.getAttributes('link') as any; setLinkUrl(current?.href || ''); setLinkTargetBlank((current?.target || '_blank') !== '_self'); setShowLinkModal(true); }}
            onPreview={()=> setShowPreview(true)}
          />
          {/* Hidden image input near toolbar for reliability */}
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={async (e)=>{
            const f = e.target.files?.[0];
            if(!f || !editor) return;
            const reader = new FileReader();
            reader.onload = () => {
              const src = String(reader.result||'');
              editor.chain().focus().setImage({ src }).run();
            };
            reader.readAsDataURL(f);
          }} />
        </>
      )}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Editor area */}
        <div className="lg:col-span-2 rounded-2xl bg-white border p-4 space-y-4" style={{borderColor:'var(--rose-200)'}}>
          {/* Title (Medium-like) */}
          <input value={title} onChange={e=> setTitle(e.target.value)} placeholder="Titre..." className="w-full text-[28px] font-bold outline-none bg-transparent" />
          {/* Fallback is automatic if the rich editor fails; no manual toggle shown */}
          {/* Toolbar moved to top of page; editor area stays clean */}
          {/* Editors */}
          {!useFallback && (
          <div className="relative">
              {editor && <EditorContent editor={editor} />}
            </div>
          )}
          {useFallback && (
            <div className="space-y-3">
              <div className="text-[12px] text-[var(--muted-color)]">Si l'éditeur riche ne fonctionne pas, utilisez ces paragraphes. Chaque zone représente un paragraphe.</div>
              {fallbackParas.map((p,idx)=> (
                <div key={idx} className="flex items-start gap-2">
                  <textarea value={p} onChange={e=> { const arr=[...fallbackParas]; arr[idx]=e.target.value; setFallbackParas(arr); }} rows={5} className="flex-1 rounded-md border px-3 py-2" />
                  <button className="h-9 px-3 rounded-md border" onClick={()=> setFallbackParas(prev=> prev.filter((_,i)=> i!==idx))}>Supprimer</button>
                </div>
              ))}
              <button className="h-9 px-3 rounded-md border" onClick={()=> setFallbackParas(prev=> [...prev,''])}>+ Ajouter un paragraphe</button>
            </div>
          )}
        </div>

        {/* Meta sidebar */}
        <div className="space-y-4">
          <div className="rounded-2xl bg-white border p-4 space-y-3" style={{borderColor:'var(--rose-200)'}}>
            <Input label="Slug" value={slugVal} onChange={e=> setSlugVal(slugify(e.target.value))} placeholder="auto" />
            <label className="block text-sm font-medium text-text-primary">Catégorie</label>
            <select className="h-10 w-full rounded-md border px-3" style={{borderColor:'var(--rose-200)'}} value={category} onChange={e=> setCategory(e.target.value)}>
              {CATEGORIES.map(c=> <option key={c} value={c}>{c}</option>)}
            </select>
            <div>
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
                      const url = videoUrl.trim();
                      if (!url) return;
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
                      let url = linkUrl.trim();
                      if (!url) return;
                      if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
                      const attrs: any = { href: url };
                      if (linkTargetBlank) { attrs.target = '_blank'; attrs.rel = 'noopener noreferrer'; }
                      // If selection is empty, insert link as its own text; else set mark on selection
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
              <label className="block text-sm font-medium text-text-primary">Tags</label>

          {/* Preview overlay */}
          {showPreview && (
            <div className="fixed inset-0 z-[100] bg-black/40 flex items-start justify-center overflow-auto">
              <div className="bg-[var(--rose-50)] w-full max-w-[1200px] min-h-screen p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-[18px] font-semibold text-[var(--slate-900)]">Aperçu de l'article</h2>
                  <button className="h-9 px-3 rounded-md border" style={{borderColor:'var(--rose-200)'}} onClick={()=> setShowPreview(false)}>Fermer</button>
                </div>
                <div className="grid lg:grid-cols-[820px_300px] gap-8">
                  <article className="space-y-6">
                    <header className="space-y-2">
                      <h1 className="text-[28px] font-extrabold text-[var(--slate-900)]">{title || 'Sans titre'}</h1>
                      {excerpt && <p className="text-[14px] text-[var(--slate-700)]">{excerpt}</p>}
                    </header>
                    <div className="prose prose-sm max-w-none bg-white border rounded-2xl p-6 prose-img:rounded-xl" style={{borderColor:'var(--rose-200)'}} dangerouslySetInnerHTML={{__html: transformArticleHtml(editorHTML)}} />
                  </article>
                  <aside className="space-y-4">
                    <div className="rounded-2xl border bg-white p-5" style={{borderColor:'var(--rose-200)'}}>
                      <div className="text-[12px] text-[var(--slate-700)]">Cette prévisualisation reprend le style de lecture public (BlogArticlePage).</div>
                    </div>
                  </aside>
                </div>
              </div>
            </div>
          )}
              <div className="flex gap-2 mt-1">
                <input value={tagInput} onChange={e=> setTagInput(e.target.value)} placeholder="Ajouter un tag" className="h-9 flex-1 rounded-md border px-3" style={{borderColor:'var(--rose-200)'}} />
                <Button size="sm" onClick={addTag}>Ajouter</Button>
              </div>
              {tags.length>0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map(t=> (
                    <span key={t} className="inline-flex items-center gap-2 px-2 h-7 rounded-full border text-[12px]" style={{borderColor:'var(--rose-200)'}}>
                      {t}
                      <button aria-label={`Remove ${t}`} className="text-[var(--rose-700)]" onClick={()=> removeTag(t)}>×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="rounded-2xl bg-white border p-4 space-y-3" style={{borderColor:'var(--rose-200)'}}>
            <Input label="Auteur" value={authorName} onChange={e=> setAuthorName(e.target.value)} />
            <div>
              <label className="block text-sm font-medium text-text-primary">Cover/Thumbnail</label>
              <div className="flex gap-2 mt-1">
                <Button size="sm" onClick={()=> coverInputRef.current?.click()}>Choisir une image…</Button>
                {cover && <Button size="sm" variant="secondary" onClick={()=> setCover('')}>Retirer</Button>}
              </div>
              <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={(e)=>{
                const f = e.target.files?.[0];
                if(!f) return;
                const reader = new FileReader();
                reader.onload = () => setCover(String(reader.result||''));
                reader.readAsDataURL(f);
              }} />
            </div>
            {(cover || extractMedia(editorHTML).images[0]) && (
              <div className="rounded-xl overflow-hidden border" style={{borderColor:'var(--rose-200)'}}>
                <img src={cover || extractMedia(editorHTML).images[0]} alt="thumbnail" className="w-full h-36 object-cover" />
              </div>
            )}
            {/* Media summary */}
            {(() => {
              const { images, videos } = extractMedia(editorHTML);
              return (
                <div className="space-y-2">
                  <div className="text-sm text-text-secondary">Médias détectés: <b>{images.length}</b> image(s), <b>{videos.length}</b> vidéo(s)</div>
                  {images.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {images.slice(0,4).map((src, idx) => (
                        <div key={src+idx} className="flex flex-col items-center gap-1">
                          <img src={src} alt={`img-${idx}`} className="w-16 h-16 object-cover rounded-md border" style={{borderColor:'var(--rose-200)'}} />
                          <Button size="sm" variant="secondary" onClick={()=> setCover(src)}>Définir cover</Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}
            <div>
              <label className="block text-sm font-medium text-text-primary">Extrait</label>
              <textarea value={excerpt} onChange={e=> setExcerpt(e.target.value)} rows={3} className="w-full rounded-md border px-3 py-2 text-sm" style={{borderColor:'var(--rose-200)'}} />
            </div>
            <div className="flex gap-2 pt-1">
              <Button onClick={saveDraft} loading={saving} className="rounded-full">Enregistrer brouillon</Button>
              <Button onClick={publishNow} loading={saving} className="rounded-full">Publier</Button>
              <Button variant="secondary" onClick={()=> navigate('/admin/blog')} className="rounded-full">Annuler</Button>
            </div>
          </div>
        </div>
      </div>
    </AdminPage>
  );
};

export default AdminBlogEditor;
