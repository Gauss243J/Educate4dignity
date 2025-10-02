import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Chatbot } from '../components/ui/Chatbot';
import { InteractiveWorldMap } from '../components/InteractiveWorldMap';
import { listActivePublicProjects } from '../utils/projects';
import { Project } from '../types';
import { useTranslation } from 'react-i18next';
import ProjectCard from '../components/ProjectCard';
import { ImageWithFallback } from '../components/ui/ImageWithFallback';
import Logo from '../components/ui/Logo';
import NewsletterSignup from '../components/ui/NewsletterSignup';
import PublicNav from '../components/layout/PublicNav';
import { impactMetrics } from '../data/metrics';
import CountUp from '../components/ui/CountUp';
import Reveal from '../components/ui/Reveal';
import RotatingQualities from '../components/ui/RotatingQualities';
import WorkflowDiagram from '../components/ui/WorkflowDiagram';

const LandingPage: React.FC = () => {
  const { t } = useTranslation();
  const [activeProjects, setActiveProjects] = useState<Project[]>([]);
  useEffect(()=> { let mounted=true; listActivePublicProjects().then(p=> { if(mounted) {
    // Replace any svg placeholder thumbnails with real photos pool for landing feature cards
    const photoPool = [
      '/photos/jeune-adulte-deprime-a-la-maison.jpg',
      '/photos/photo-d-une-femme-afro-americaine-ravie-tient-un-tampon-et-une-serviette-hygienique-vetue-d-un-t-shirt-blanc-isole-sur-un-mur-rose-femmes-pms.jpg',
      '/photos/tir-isole-de-l-heureuse-jeune-femme-afro-tient-un-tampon-de-coton-menstuation-et-une-serviette-hygienique.jpg',
      '/photos/portrait-de-femme-afro-americaine-triste.jpg'
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
  <section className="relative px-4 sm:px-6 lg:px-8 pt-10 pb-14 min-h-[640px] flex items-center overflow-hidden" >
          <div className="absolute inset-0 z-0">
            <img src="/photos/banniere.png" alt="Hero background" className="w-full h-full object-cover" />
            {/* Overlay: reduced white, added gradient & vignette shadow */}
            <div className="absolute inset-0" style={{
              background: 'linear-gradient(180deg, rgba(255,245,247,0.70) 0%, rgba(255,245,247,0.60) 35%, rgba(255,245,247,0.50) 60%, rgba(255,245,247,0.55) 100%), radial-gradient(circle at center, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.25) 100%)',
              mixBlendMode: 'normal'
            }} />
            {/* Subtle inner shadow for depth */}
            <div className="pointer-events-none absolute inset-0" style={{boxShadow:'inset 0 0 80px rgba(0,0,0,0.20)'}} />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto w-full">
            <div className="max-w-2xl space-y-6 bg-white/55 backdrop-blur-md rounded-xl px-8 py-8 shadow-sm ring-1 ring-white/40">
              <h1 className="font-extrabold" style={{fontSize:'52px',lineHeight:'56px',color:'var(--color-text-primary)'}}>{t('landing.title','From Taboo to Dignity')}</h1>
              <p className="text-lg font-medium" style={{color:'var(--color-text-secondary)'}}>{t('landing.subtitle','Keep girls in school with reusable, dignified menstrual kits.')}</p>
              <div className="flex gap-3 flex-wrap pt-2">
                <Link to="/donate" className="btn-rose" data-analytics-id="donate_now">{t('landing.makeDonation','Donate Now')}</Link>
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
        {/* WHY (Rotating qualities) */}
        <Reveal as="section" className="px-4 sm:px-6 lg:px-8 pb-12 mt-14" id="why">
          <div className="max-w-7xl mx-auto">
            <RotatingQualities
              lead={t('landing.ourImpact','Why Educate for Dignity')}
              items={[
                { label:'dignified', description:'Reusable kits that protect privacy.' },
                { label:'transparent', description:'Open costs and public evidence (see transparency).' },
                { label:'community-led', description:'Local women groups make & deliver.' },
                { label:'educational', description:'Menstrual health and hygiene lessons.' }
              ]}
            />
          </div>
        </Reveal>
        {/* STORIES */}
  <Reveal as="section" className="px-4 sm:px-6 lg:px-8 pb-12" id="stories" delay={80}>
          <div className="max-w-7xl mx-auto">
            <h2 className="font-extrabold mb-6" style={{fontSize:'26px',color:'var(--color-text-primary)'}}>Stories & Testimonials</h2>
            <div className="grid gap-4 md:grid-cols-3" data-stagger-group>
              {/*
                Amina — Burundi
                Grace — Rwanda
                Esperance — DRC
              */}
              { [
                { key:'story_amima', n:'Amina — Burundi', q:'“I stopped missing school.”', d:'$25 keeps a girl learning all year.', img: '/photos/photo-d-une-femme-afro-americaine-ravie-tient-un-tampon-et-une-serviette-hygienique-vetue-d-un-t-shirt-blanc-isole-sur-un-mur-rose-femmes-pms.jpg', alt:'Smiling young woman holding menstrual hygiene products' },
                { key:'story_grace', n:'Grace — Rwanda', q:'“My daughter now has confidence.”', d:'Reusable kits + teacher talks.', img: '/photos/tir-isole-de-l-heureuse-jeune-femme-afro-tient-un-tampon-de-coton-menstuation-et-une-serviette-hygienique.jpg', alt:'Happy woman holding cotton tampon and pad' },
                { key:'story_esperance', n:'Esperance — DRC', q:'“No more stigma. Just dignity.”', d:'Parents & boys included in sessions.', img: '/photos/portrait-de-femme-afro-americaine-triste.jpg', alt:'Thoughtful woman portrait addressing stigma' }
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
            <h2 className="font-extrabold mb-2" style={{fontSize:'26px',color:'var(--color-text-primary)'}}>{t('landing.featuredProjects','Projects')}</h2>
            <p className="text-sm mb-6" style={{color:'var(--color-text-secondary)'}}>Choose a project to fund.</p>
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
            <h2 className="font-extrabold mb-4" style={{fontSize:'26px',color:'var(--color-text-primary)'}}>Moments</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" data-stagger-group>
              {[
                {src:'/photos/jeune-adulte-deprime-a-la-maison (1).jpg', alt:'Young woman seated indoors reflective pose'},
                {src:'/photos/une-femme-europeenne-heureuse-choisit-entre-un-tampon-et-une-serviette-hygienique-annonce-des-produits-d-hygiene-pour-la-menstruation-porte-un-masque-de-sommeil-et-un-pyjama-applique-des-patchs-de-beaute-isoles-sur.jpg', alt:'Woman deciding between menstrual products smiling'},
                {src:'/photos/variete-de-l-hygiene-menstruelle-feminine-vue-de-dessus.jpg', alt:'Top view assortment of menstrual hygiene products'},
                {src:'/photos/jeune-adulte-deprime-a-la-maison.jpg', alt:'Young woman at home looking down thoughtful'}
              ].map((g,i)=>(
                <div key={i} className="rounded-lg overflow-hidden border card-fade" style={{borderColor:'var(--color-border)'}}>
                  <ImageWithFallback src={g.src} alt={g.alt} className="w-full h-48 object-cover" />
                </div>
              ))}
            </div>
            <div className="text-[12px] mt-3" style={{color:'var(--slate-500)'}}>All images for prototype illustration only.</div>
          </div>
  </Reveal>
        {/* HOW IT WORKS (Workflow Diagram) */}
  <Reveal as="section" className="px-4 sm:px-6 lg:px-8 pb-12" id="how" delay={280}>
          <div className="max-w-7xl mx-auto">
            <h2 className="font-extrabold mb-8" style={{fontSize:'26px',color:'var(--color-text-primary)'}}>{t('landing.learnMore','How')}</h2>
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
              <h2 className="font-extrabold mb-4" style={{fontSize:'26px',color:'var(--color-text-primary)'}}>Our Partners</h2>
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
            <h2 className="font-extrabold mb-4" style={{fontSize:'26px',color:'var(--color-text-primary)'}}>{t('landing.countriesReached','Where we work')}</h2>
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
              <Link to="/donate" className="btn-rose mb-2" data-analytics-id="donate_banner_btn">{t('nav.donate','Donate $25')}</Link>
              <div className="text-[12px] mt-2" style={{color:'var(--color-text-tertiary)'}}><a href="/transparency" className="underline hover:text-[var(--color-primary)]">Open costs & public evidence</a>.</div>
            </div>
          </div>
  </Reveal>
      </main>
      {/* FOOTER */}
      <footer className="px-4 sm:px-6 lg:px-8 pb-12" id="footer" style={{background:'var(--rose-50)',borderTop:'1px solid var(--rose-200)'}}>
        <div className="max-w-7xl mx-auto grid gap-8 md:grid-cols-5 pt-10">
          <div className="text-sm" style={{color:'var(--slate-600)'}}>
            <Logo size="sm" className="font-extrabold mb-2 inline-flex items-center" />
            <div className="text-[13px] mb-2">EN/FR — SSL — Compliance</div>
            <div className="text-[13px]">© 2025 Educate4Dignity</div>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-2" style={{color:'var(--slate-900)'}}>Programme</h4>
            <ul className="space-y-1 text-[13px]" style={{color:'var(--slate-600)'}}>
              <li>Projects</li><li>Transparency</li><li>E-learning</li><li>Resources</li><li>R&D</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-2" style={{color:'var(--slate-900)'}}>Partnerships & Help</h4>
            <ul className="space-y-1 text-[13px]" style={{color:'var(--slate-600)'}}>
              <li>Partner with us</li><li>Become distributor</li><li>FAQ</li><li>Contact</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-2" style={{color:'var(--slate-900)'}}>Support</h4>
            <ul className="space-y-1 text-[13px]" style={{color:'var(--slate-600)'}}>
              <li>Donate</li><li>Monthly giving</li><li>Corporate</li><li>Reports & audits</li>
            </ul>
          </div>
          <div>
            <NewsletterSignup />
          </div>
        </div>
      </footer>
      <Chatbot />
    </div>
  );
};

export default LandingPage;
