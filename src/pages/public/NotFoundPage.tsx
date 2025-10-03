import React from 'react';
import { Link } from 'react-router-dom';
import PublicPageShell from '../../components/layout/PublicPageShell';
import { Button } from '../../components/ui/Button';

const NotFoundPage: React.FC = () => {
  return (
    <PublicPageShell>
      <div className="max-w-xl mx-auto text-center py-16 space-y-8">
        <div>
          <span className="inline-block px-4 py-1 rounded-full bg-[var(--color-primary-light)] text-primary text-xs font-semibold tracking-wide">404</span>
        </div>
        <h1 className="text-[32px] leading-[40px] font-extrabold text-primary">Page introuvable</h1>
        <p className="text-secondary text-[14px] leading-[20px] max-w-prose mx-auto">
          La page que vous cherchez n'existe pas ou a été déplacée. Vérifiez l'URL ou continuez votre navigation.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Button className="rounded-full h-10 px-6 text-sm">
            <Link to="/">Accueil</Link>
          </Button>
          <Button variant="secondary" className="rounded-full h-10 px-6 text-sm">
            <Link to="/projects">Nos Projets</Link>
          </Button>
          <Button variant="secondary" className="rounded-full h-10 px-6 text-sm">
            <Link to="/donate">Faire un Don</Link>
          </Button>
        </div>
        <div className="text-[11px] leading-[18px] text-secondary/70">
          Besoin d'aide ? <Link to="/contact" className="underline">Contactez-nous</Link>
        </div>
      </div>
    </PublicPageShell>
  );
};

export default NotFoundPage;
