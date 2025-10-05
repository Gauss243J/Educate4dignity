import React, { useState, useEffect } from 'react';
import { Users, Heart, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Chatbot } from '../components/ui/Chatbot';
import { InteractiveWorldMap } from '../components/InteractiveWorldMap';
import { listActivePublicProjects } from '../utils/projects';
import { Project } from '../types';
import { useTranslation } from 'react-i18next';
import ProjectCard from '../components/ProjectCard';
import { ImageWithFallback } from '../components/ui/ImageWithFallback';
import PublicFooter from '../components/layout/PublicFooter';
import PublicNav from '../components/layout/PublicNav';
import { impactMetrics } from '../data/metrics';
import CountUp from '../components/ui/CountUp';
import Reveal from '../components/ui/Reveal';
import WorkflowDiagram from '../components/ui/WorkflowDiagram';

const LandingPage: React.FC = () => {
  const { t } = useTranslation();
  const [activeProjects, setActiveProjects] = useState<Project[]>([]);
  useEffect(()=> { let mounted=true; listActivePublicProjects().then(p=> { if(mounted) {
    // Replace any svg placeholder thumbnails with real photos pool for landing feature cards
    const photoPool = [
      '/photos/Dossier/1.png',
      '/photos/Dossier/48e1c9d3-6c82-469f-9b0a-f4fd7875090c (1).jpg',
      '/photos/Dossier/Generated Image October 02, 2025 - 8_39AM.png',
      '/photos/Dossier/Generated Image October 02, 2025 - 8_50AM (1).png',
      '/photos/Dossier/Generated Image October 02, 2025 - 9_21AM.png'
    ];
    let idx = 0;
    const mapped = p.slice(0,3).map(pr => {
      if(pr.thumbnail && pr.thumbnail.endsWith('.svg')) {
        return { ...pr, thumbnail: photoPool[idx++ % photoPool.length] };
      }
      return pr;
    });
    setActiveProjects(mapped);
  } }); return ()=> { mounted=false; }; }, []);
  const partners = ['Deerfield Academy','UNICEF (local)','Women Coop','Ministry of Edu.','Local NGO A','Local NGO B'];
  // Impact metrics now provided via centralized data module for reuse / future dynamic loading.
  // Staggered card fade-in observer (applies to any grid tagged with data-stagger-group)
  useEffect(()=> {
    const groups = document.querySelectorAll('[data-stagger-group]');
    if(!groups.length) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if(entry.isIntersecting) {
          const container = entry.target as HTMLElement;
          const items = Array.from(container.querySelectorAll('.card-fade')) as HTMLElement[];
          items.forEach((el, idx) => {
            el.style.transitionDelay = `${idx * 80}ms`;
            requestAnimationFrame(()=> el.classList.add('in'));
          });
          io.unobserve(container);
        }
      });
    }, { threshold: 0.2 });
    groups.forEach(g => io.observe(g));
    return () => io.disconnect();
  }, [activeProjects]);

  return (
  <div className="min-h-screen" style={{background:'var(--color-primary-light)'}}> 
  <PublicNav />
      <main>
        {/* Hero */}
  <section className="relative px-4 sm:px-6 lg:px-8 pt-10 pb-14 min-h-[520px] md:min-h-[640px] flex items-center overflow-hidden" >
          <div className="absolute inset-0 z-0">
            <img src="/photos/banniere.png" alt="Hero background" className="w-full h-full object-cover" />
            {/* Darker overlay tending toward black for stronger focus */}
            <div className="absolute inset-0" style={{
              background: 'linear-gradient(180deg, rgba(0,0,0,0.24) 0%, rgba(0,0,0,0.22) 35%, rgba(0,0,0,0.20) 60%, rgba(0,0,0,0.24) 100%), radial-gradient(circle at center, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.38) 100%)',
              mixBlendMode: 'normal'
            }} />
            {/* Subtle inner shadow for depth */}
            <div className="pointer-events-none absolute inset-0" style={{boxShadow:'inset 0 0 80px rgba(0,0,0,0.20)'}} />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto w-full">
            <div className="max-w-2xl space-y-6 bg-white/55 backdrop-blur-md rounded-xl px-8 py-8 shadow-sm ring-1 ring-white/40">
              <h1 className="font-extrabold text-[40px] leading-[44px] sm:text-[48px] sm:leading-[50px] md:text-[52px] md:leading-[56px]" style={{color:'var(--color-text-primary)'}}>{t('landing.title','Transform menstrual health education in East Africa')}</h1>
              <p className="text-lg font-medium" style={{color:'var(--color-text-secondary)'}}>{t('landing.subtitle','We break taboos, educate communities, and provide sustainable solutions so every girl can manage her period with dignity.')}</p>
              <p className="text-sm font-semibold" style={{color:'var(--rose-700)'}}>{t('landing.valueProp','Because no girl should miss school because of her period')}</p>
              <div className="flex gap-3 flex-wrap pt-2">
                <Link to="/donate" className="btn-donate" data-analytics-id="donate_now">{t('landing.makeDonation','Donate Now')}</Link>
                <Link to="/projects" className="btn-outline-rose" data-analytics-id="see_projects">{t('landing.exploreProjects','See Active Projects')}</Link>
              </div>
            </div>
          </div>
        </section>
        {/* Immediate Impact Stats (moved up) */}
        <section className="px-4 sm:px-6 lg:px-8 -mt-8 pb-12" id="impact-top">
          <div className="max-w-7xl mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4" data-stagger-group>
              {impactMetrics.map((m)=>{
                const format = (v:number)=> {
                  switch(m.formatter){
                    case 'percent': return Math.round(v) + '%';
                    case 'money': {
                      const base = (v>=1000) ? (v/1000).toFixed(v>=100000 ? 0:1) + 'k' : v.toString();
                      return '$' + base;
                    }
                    default: return Math.round(v).toLocaleString();
                  }
                };
                return (
                  <div key={m.key} className="p-6 text-center rounded-lg border card-fade card-hover-lift" style={{borderColor:'var(--color-border)',background:'var(--color-primary-light)'}}>
                    <div className="kpi-number mb-1">
                      <CountUp end={m.end} formatter={format} />{m.approx && '+'}
                    </div>
                    <div className="text-[13px]" style={{color:'var(--color-text-secondary)'}}>{m.sub}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        
        {/* EDUCATION SECTION (image left, text right) */}
  <Reveal as="section" className="px-4 sm:px-6 lg:px-8 pb-14 mt-14" id="education" delay={60}>
          <div className="max-w-7xl mx-auto grid gap-10 items-center md:grid-cols-2">
            <div className="rounded-2xl overflow-hidden border order-1 md:order-none" style={{borderColor:'var(--rose-200)'}}>
              <ImageWithFallback src="/photos/Project/Generated Image October 02, 2025 - 9_15AM.png" alt={t('education.title','Menstrual health education')} className="w-full h-full object-cover md:h-[420px]" />
            </div>
            <div className="order-2 md:order-none">
              <h2 className="font-extrabold mb-4" style={{fontSize:'34px',lineHeight:'1.15',color:'var(--color-text-primary)'}}>{t('education.title','Why menstrual health education matters')}</h2>
              <p className="text-base font-medium mb-4" style={{color:'var(--color-text-secondary)'}}>{t('education.lead','Knowledge + dignity keeps girls learning consistently.')}</p>
              <p className="text-sm mb-3" style={{color:'var(--color-text-secondary)'}}>{t('education.p1')}</p>
              <p className="text-sm mb-6" style={{color:'var(--color-text-secondary)'}}>{t('education.p2')}</p>
              <Link to="/blog" className="btn-outline-rose text-sm">{t('education.cta','Read more on our learning approach')}</Link>
            </div>
          </div>
    </Reveal>
  {/* AUDIENCE COMBINED 3-COLUMN SECTION (moved below education) */}
  <Reveal as="section" className="px-4 sm:px-6 lg:px-8 pb-16 mt-4" id="audiences-moved" delay={70}>
          <div className="max-w-7xl mx-auto">
            <h2 className="font-extrabold mb-8" style={{fontSize:'30px',color:'var(--color-text-primary)'}}>{t('audience.overview.title', 'Paths, impact and collaboration')}</h2>
            <div className="grid gap-6 md:grid-cols-3" data-stagger-group>
              {/* Card 1: Beneficiaries */}
              <div className="card-fade info-card flex flex-col" aria-labelledby="aud-card-beneficiaries">
                <div className="top-accent" />
                <div className="flex items-center gap-2 mt-3 mb-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center bg-[var(--rose-100)] text-[var(--rose-600)] border border-[var(--rose-200)]"><Users className="w-4 h-4" /></div>
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--rose-600)]">{t('audience.labels.beneficiaries','Beneficiaries')}</span>
                </div>
                <h3 id="aud-card-beneficiaries" className="font-bold mb-4" style={{color:'var(--color-text-primary)',fontSize:'20px'}}>{t('audience.beneficiaries.sectionTitle')}</h3>
                <ul className="space-y-3 text-sm flex-1" style={{color:'var(--color-text-secondary)'}}>
                  {[t('audience.beneficiaries.p1'),t('audience.beneficiaries.p2'),t('audience.beneficiaries.p3'),t('audience.beneficiaries.p4')].map((txt,i)=>(
                    <li key={i} className="pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-[var(--rose-500)] leading-snug">{txt}</li>
                  ))}
                </ul>
              </div>
              {/* Card 2: Donors */}
              <div className="card-fade info-card alt flex flex-col" aria-labelledby="aud-card-donors">
                <div className="top-accent" />
                <div className="flex items-center gap-2 mt-3 mb-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center bg-[var(--slate-900)] text-white border border-[var(--slate-700)]"><Heart className="w-4 h-4" /></div>
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--slate-800)]">{t('audience.labels.donors','Donors')}</span>
                </div>
                <h3 id="aud-card-donors" className="font-bold mb-4" style={{color:'var(--color-text-primary)',fontSize:'20px'}}>{t('audience.donors.sectionTitle')}</h3>
                <ul className="space-y-3 text-sm font-medium flex-1" style={{color:'var(--color-text-secondary)'}}>
                  {[t('audience.donors.i1'),t('audience.donors.i2'),t('audience.donors.i3')].map((txt,i)=>(
                    <li key={i} className="pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-[var(--rose-500)] leading-snug">{txt}</li>
                  ))}
                </ul>
                <div className="text-[12px] mt-4 font-semibold" style={{color:'var(--rose-700)'}}>{t('audience.donors.transparency')}</div>
              </div>
              {/* Card 3: Partners */}
              <div className="card-fade info-card secondary flex flex-col" aria-labelledby="aud-card-partners">
                <div className="top-accent" />
                <div className="flex items-center gap-2 mt-3 mb-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center bg-[var(--rose-100)] text-[var(--rose-600)] border border-[var(--rose-200)]"><Building2 className="w-4 h-4" /></div>
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--rose-600)]">{t('audience.labels.partners','Partners')}</span>
                </div>
                <h3 id="aud-card-partners" className="font-bold mb-4" style={{color:'var(--color-text-primary)',fontSize:'20px'}}>{t('audience.partners.sectionTitle')}</h3>
                <ul className="space-y-3 text-sm font-medium flex-1" style={{color:'var(--color-text-secondary)'}}>
                  {[t('audience.partners.i1'),t('audience.partners.i2'),t('audience.partners.i3')].map((txt,i)=>(
                    <li key={i} className="pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-[var(--rose-500)] leading-snug">{txt}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
  {/* Removed the two pedagogy/menstrual health info cards per request. Guard any leftover legacy sections by not rendering them. */}
        {/* STORIES */}
  <Reveal as="section" className="px-4 sm:px-6 lg:px-8 pb-12" id="stories" delay={80}>
          <div className="max-w-7xl mx-auto">
            <h2 className="font-extrabold mb-6" style={{fontSize:'26px',color:'var(--color-text-primary)'}}>{t('landing.storiesTitle','Real voices, real change')}</h2>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3" data-stagger-group>
              {/*
                Amina — Burundi
                Grace — Rwanda
                Esperance — DRC
              */}
              { [
                { key:'story_amima', n:'Amina — Burundi', q:'“I stopped missing school.”', d:'$25 keeps a girl learning all year.', img: '/photos/Dossier/1.png', alt:'Impact story 1' },
                { key:'story_grace', n:'Grace — Rwanda', q:'“My daughter now has confidence.”', d:'Reusable kits + teacher talks.', img: '/photos/Dossier/Generated Image October 02, 2025 - 8_39AM.png', alt:'Impact story 2' },
                { key:'story_esperance', n:'Esperance — DRC', q:'“No more stigma. Just dignity.”', d:'Parents & boys included in sessions.', img: '/photos/Dossier/Generated Image October 02, 2025 - 8_50AM (1).png', alt:'Impact story 3' }
              ].map((s)=>(
                <div key={s.key} className="p-4 rounded-lg border flex flex-col card-fade card-hover-lift" style={{borderColor:'var(--color-border)',background:'var(--color-primary-light)'}}>
                  <div className="h-40 mb-3 rounded-md border overflow-hidden" style={{borderColor:'var(--rose-200)'}}>
                    <ImageWithFallback src={s.img} alt={s.alt} className="w-full h-full object-cover" />
                  </div>
                  <blockquote className="text-base font-semibold mb-1" style={{color:'var(--color-text-primary)'}}>{s.q}</blockquote>
                  <div className="text-sm" style={{color:'var(--color-text-secondary)'}}>{s.n}</div>
                  <div className="text-[13px] mt-1" style={{color:'var(--color-text-tertiary)'}}>{s.d}</div>
                </div>
              )) }
            </div>
          </div>
  </Reveal>
        {/* PROJECTS */}
  <Reveal as="section" className="px-4 sm:px-6 lg:px-8 pb-12" id="projects" delay={120}>
          <div className="max-w-7xl mx-auto">
            <h2 className="font-extrabold mb-6" style={{fontSize:'26px',color:'var(--color-text-primary)'}}>{t('landing.featuredProjectsTitle','Pick a project and move it forward today')}</h2>
            <div className="grid gap-4 md:grid-cols-3" data-stagger-group>
              {activeProjects.map((p)=>(
                <div key={p.id} className="card-fade card-hover-lift">
                  <ProjectCard project={p} onSupport={()=>{/* future donate modal */}} />
                </div>
              ))}
              {activeProjects.length===0 && <div className="text-base text-[var(--slate-600)]">No active projects with cover image yet.</div>}
            </div>
            <div className="mt-6 text-right"><Link to="/projects" className="btn-outline-rose text-sm">View all projects</Link></div>
          </div>
  </Reveal>
  {/* (Moved) PARTNERS + MAP will appear near the end before donate banner */}
        {/* FIELD MOMENTS GALLERY */}
  <Reveal as="section" className="px-4 sm:px-6 lg:px-8 pb-12" id="field-moments" delay={240}>
          <div className="max-w-7xl mx-auto">
            <h2 className="font-extrabold mb-4" style={{fontSize:'26px',color:'var(--color-text-primary)'}}>{t('landing.momentsTitle','Small field moments that show big change')}</h2>
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" data-stagger-group>
              {[
                {src:'/photos/Project/92038f75-aeef-42a1-a6f0-a4a014771f14.png', alt:'Project field photo 1'},
                {src:'/photos/Project/Generated Image October 02, 2025 - 8_34AM.png', alt:'Project field photo 2'},
                {src:'/photos/Project/Generated Image October 02, 2025 - 9_01AM.png', alt:'Project field photo 3'},
                {src:'/photos/Project/Generated Image October 02, 2025 - 9_11AM.png', alt:'Project field photo 4'}
              ].map((g,i)=>(
                <div key={i} className="rounded-lg overflow-hidden border card-fade" style={{borderColor:'var(--color-border)'}}>
                  <ImageWithFallback src={g.src} alt={g.alt} className="w-full h-48 object-cover" />
                </div>
              ))}
            </div>
            <div className="text-[12px] mt-3" style={{color:'var(--slate-500)'}}>{t('landing.imagesDisclaimer','Images shown are illustrative placeholders for the prototype.')}</div>
          </div>
  </Reveal>
        {/* HOW IT WORKS (Workflow Diagram) */}
  <Reveal as="section" className="px-4 sm:px-6 lg:px-8 pb-12" id="how" delay={280}>
          <div className="max-w-7xl mx-auto">
            <h2 className="font-extrabold mb-8" style={{fontSize:'26px',color:'var(--color-text-primary)'}}>{t('landing.howTitle','A simple model that keeps girls in school')}</h2>
            <div className="rounded-xl p-6 md:p-10 border" style={{borderColor:'var(--rose-200)',background:'var(--rose-50)'}}>
              {/* New visual workflow */}
              <WorkflowDiagram />
            </div>
          </div>
  </Reveal>
        {/* RELOCATED PARTNERS */}
        <Reveal as="section" className="px-4 sm:px-6 lg:px-8 pb-12" id="partners" delay={300}>
          <div className="max-w-7xl mx-auto space-y-8">
            <div>
              <h2 className="font-extrabold mb-4" style={{fontSize:'26px',color:'var(--color-text-primary)'}}>{t('landing.partnersTitle','We go further by working together')}</h2>
              <div className="flex gap-3 overflow-x-auto py-2">
                {partners.map((pt,i)=>(<div key={i} className="partner-tile whitespace-nowrap">{pt}</div>))}
              </div>
              <div className="flex justify-center gap-2 mt-2">
                {partners.map((_,i)=>(<span key={i} className={`partner-rotate-dot ${i===0?'active':''}`}></span>))}
              </div>
            </div>
          </div>
        </Reveal>
        {/* RELOCATED MAP */}
        <Reveal as="section" className="px-4 sm:px-6 lg:px-8 pb-12" id="map" delay={320}>
          <div className="max-w-7xl mx-auto">
            <h2 className="font-extrabold mb-4" style={{fontSize:'26px',color:'var(--color-text-primary)'}}>{t('landing.countriesTitle','Where your impact is already growing')}</h2>
            <div className="bg-white border rounded-2xl p-2 sm:p-4 md:p-6" style={{borderColor:'var(--rose-200)'}}>
              <InteractiveWorldMap mode="global" />
            </div>
          </div>
        </Reveal>
        {/* DONATE BANNER */}
  <Reveal as="section" className="px-4 sm:px-6 lg:px-8 pb-16" id="donate-banner" delay={320}>
          <div className="max-w-7xl mx-auto">
            <div className="rounded-xl border p-10 text-center" style={{borderColor:'var(--rose-200)',background:'var(--rose-100)'}}>
              <h3 className="font-bold mb-3" style={{color:'var(--color-text-primary)',fontSize:'22px'}}>{t('landing.makeDonation','Help a girl stay in school')}</h3>
              <div className="text-sm mb-4 font-medium" style={{color:'var(--color-text-primary)'}}>$25 supports one girl for a year.</div>
              <Link to="/donate" className="btn-donate mb-2" data-analytics-id="donate_banner_btn">{t('nav.donate','Donate $25')}</Link>
              <div className="text-[12px] mt-2" style={{color:'var(--color-text-tertiary)'}}><a href="/transparency" className="underline hover:text-[var(--color-primary)]">Open costs & public evidence</a>.</div>
            </div>
          </div>
  </Reveal>
      </main>
      <PublicFooter withNewsletter topMargin={false} />
      <Chatbot />
    </div>
  );
};

export default LandingPage;
