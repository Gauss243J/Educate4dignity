import React from 'react';
import PublicPageShell from '../../components/layout/PublicPageShell';

// A much more concise, linear About page for easier reading
const AboutPage: React.FC = () => {
  return (
    <PublicPageShell backgroundVariant="plain">
  <header className="space-y-3 mb-8 max-w-4xl mx-auto">
  <p className="text-[11px] tracking-wide font-semibold uppercase text-accent">Transform menstrual health education</p>
    <h1 className="text-[32px] leading-[40px] font-extrabold text-primary">From taboo to dignity</h1>
    <p className="text-[14px] leading-[20px] text-secondary">We break taboos, educate communities and provide sustainable, reusable solutions so every girl can manage her period with dignity.</p>
    <p className="text-[12px] leading-[18px]" style={{color:'var(--rose-700)'}}>Because no girl should miss school because of her period.</p>
      </header>

      {/* Inline video just after the header tagline (no visible title) */}
      <section className="mb-8 max-w-4xl mx-auto">
  <div className="w-full max-w-xl rounded-xl border border-base overflow-hidden bg-[var(--color-surface)]">
          <div className="relative w-full" style={{paddingTop:'56.25%'}}>
            <video
              className="absolute inset-0 w-full h-full object-cover"
              controls
              preload="metadata"
              poster="/photos/uploads/founder-video-thumb.jpg"
              aria-label="Organization overview video"
            >
              <source src="/videos/video5985359414595426492.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
  <p className="mt-2 text-[12px] leading-[18px] text-secondary">Short clip from a school distribution session, illustrating the energy in the room when girls receive their kits and guidance.</p>
      </section>

  <article className="max-w-4xl mx-auto">
        {/* Narrative */}
        <div className="space-y-4 text-[13px] leading-[20px] text-primary text-justify">
      <p>Across Burundi and the wider East Africa region, too many learners still miss lessons during menstruation— not for lack of motivation, but because of cost, silence, inadequate WASH facilities and limited guidance. Repeated absence chips away at confidence and learning continuity.</p>
      <p>Period poverty narrows futures: early absenteeism can become early dropout, reducing lifetime income and community resilience. When classrooms lose the consistent presence of girls, communities lose leadership, creativity and stability.</p>
      <p>Practical innovation already works: long‑lasting reusable kits, biodegradable fiber pads that create local jobs, and micro‑production enabling women to supply affordable products. These culturally attentive, low‑cost solutions keep girls learning.</p>
      <p>We call this dignity engineering — applying empathy, feasibility and local intelligence to remove basic health barriers so education remains uninterrupted.</p>
        </div>

        {/* Founder Statement */}
  <section className="mt-10 rounded-xl border border-base bg-white p-6 flex flex-col sm:flex-row gap-6 items-start">
          <div className="w-32 h-32 shrink-0 rounded-full overflow-hidden border border-base bg-[var(--color-primary-light)] flex items-center justify-center">
            <img
              src="/photos/Team/16.png"
              alt="Founder portrait"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="space-y-3 text-[13px] leading-[20px] text-primary text-justify">
            <h2 className="text-[18px] leading-[24px] font-semibold text-primary m-0">Founder’s note</h2>
            <p>I began listening to girls in Bujumbura in 2023. The pattern was simple and painful: curiosity and ambition blocked by a pad that was never there. A basic supply determining academic confidence felt unacceptable.</p>
            <p>Our approach now is to prototype small, evidence‑light solutions, share data, and widen partnerships— always centering the student experience. Biology should not decide who sits in a classroom.</p>
            <p className="italic">“Dignity is not a luxury add‑on. It is the quiet infrastructure of learning.”</p>
          </div>
        </section>

        

        <h2 className="mt-8 mb-3 text-[18px] leading-[24px] font-semibold text-primary">What we focus on</h2>
        <ul className="list-disc pl-5 space-y-1 text-[13px] leading-[20px] text-primary">
          <li>Education: clear, stigma‑free menstrual health learning.</li>
          <li>Access: sustainable, reusable kits & locally sourced materials.</li>
          <li>Facilities (WASH): privacy, water & handwashing that match real school contexts.</li>
          <li>Local capacity: co‑building with cooperatives, teachers & health workers.</li>
          <li>Transparency: open costs, impact metrics and shared lessons.</li>
        </ul>

        <h2 className="mt-8 mb-3 text-[18px] leading-[24px] font-semibold text-primary">Why it matters</h2>
        <p className="text-[13px] leading-[20px] text-primary">Education delays early marriage, improves health and multiplies community resilience. A pad is not the whole answer—but without one, too many futures shrink.</p>

        <h2 className="mt-8 mb-3 text-[18px] leading-[24px] font-semibold text-primary">How we work</h2>
        <p className="text-[13px] leading-[20px] text-primary text-justify">We listen first, co‑design with schools and cooperatives, document early, publish openly and iterate. The goal is replicable, low‑friction menstrual health support that any motivated local team can adapt.</p>

        {/* Team */}
        {/* Uses static assets from /public/photos/Team (001.png, 002.png, 16.png) */}
        <section className="mt-10">
          <h2 className="text-[18px] leading-[24px] font-semibold text-primary mb-4">Team</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title:'Operations Lead', body:'Program logistics & cooperative coordination.', img:'/photos/Team/001.png', alt:'Operations lead overseeing distribution workflows'},
              { title:'Finance & Compliance', body:'Budget discipline, transparent reporting.', img:'/photos/Team/002.png', alt:'Finance and compliance specialist'},
              { title:'Education & Research', body:'MHM content, training design, monitoring.', img:'/photos/Team/16.png', alt:'Education & research facilitator'}
            ].map((m,i)=>(
              <div key={i} className="rounded-xl border border-base bg-white p-4 flex flex-col items-start gap-3">
                <div className="w-16 h-16 rounded-full overflow-hidden border border-base bg-[var(--color-primary-light)]">
                  <img src={m.img} alt={m.alt} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div>
                  <h3 className="text-[13px] font-semibold text-primary leading-[18px] m-0">{m.title}</h3>
                  <p className="text-[12px] leading-[18px] text-secondary m-0">{m.body}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-[11px] leading-[16px] text-secondary">Images sourced from our Team library. Replace with consented photos for production.</p>
        </section>

        {/* Governance */}
        <section className="mt-8">
          <h2 className="text-[18px] leading-[24px] font-semibold text-primary mb-4">Governance</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title:'Board Chair', body:'Strategic oversight & safeguarding.', img:'/photos/Team/002.png', alt:'Board chair portrait'},
              { title:'Treasurer', body:'Financial stewardship & audit liaison.', img:'/photos/Team/001.png', alt:'Treasurer portrait'},
              { title:'Secretary', body:'Governance records & compliance.', img:'/photos/Team/16.png', alt:'Secretary portrait'}
            ].map((m,i)=>(
              <div key={i} className="rounded-xl border border-base bg-white p-4 flex flex-col items-start gap-3">
                <div className="w-16 h-16 rounded-full overflow-hidden border border-base bg-[var(--color-primary-light)]">
                  <img src={m.img} alt={m.alt} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div>
                  <h3 className="text-[13px] font-semibold text-primary leading-[18px] m-0">{m.title}</h3>
                  <p className="text-[12px] leading-[18px] text-secondary m-0">{m.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-12 p-6 rounded-xl border border-base bg-white text-center space-y-4">
          <h2 className="text-[18px] leading-[24px] font-semibold text-primary">Join us in restoring dignity</h2>
          <a href="/donate" className="btn-donate inline-flex justify-center">Donate</a>
        </div>
      </article>
    </PublicPageShell>
  );
};

export default AboutPage;
