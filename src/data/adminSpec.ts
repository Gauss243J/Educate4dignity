// Admin dashboard spec data generated from provided requirements
export const adminNavSpec = {
  sidebar: {
    title: 'Navigation',
  quick_links: [ { label: 'Dashboard', labelKey:'admin.ui.quick.dashboard', href: '/admin', active: true } ],
    groups: [
      { id: 'ops', title: 'Opérations & Projets', titleKey:'admin.ui.groups.operations', expanded: true, items: [
        { label: 'Projets', labelKey:'admin.projects', href: '/admin/projects' },
        { label: 'Distributeurs', labelKey:'admin.distributors', href: '/admin/distributors' },
        { label: 'Fournisseurs', labelKey:'admin.suppliers', href: '/admin/producers' },
        { label: 'Bénéficiaires', labelKey:'admin.beneficiaries', href: '/admin/beneficiaries' },
      ]},
      { id: 'fin', title: 'Finances & Donateurs', titleKey:'admin.ui.groups.finance', expanded: true, items: [
        { label: 'Dashboard', labelKey:'admin.ui.quick.dashboard', href: '/admin' },
        { label: 'Donateurs', labelKey:'admin.finances', href: '/admin/donors' },
      ]},
      { id: 'content', title: 'Contenu & Apprentissage', titleKey:'admin.ui.groups.content', expanded: true, items: [
        { label: 'Blogs', labelKey:'admin.resources', href: '/admin/blog' },
        { label: 'E-learning', labelKey:'admin.elearning', href: '/admin/elearning' },
        { label: 'Ressources', labelKey:'admin.resources', href: '/admin/resources' },
      ]},
  { id: 'gov', title: 'Gouvernance & Administration', titleKey:'admin.ui.groups.governance', expanded: true, preview: 'Équipes • Admin • Paramètres', items: [
        { label: 'Équipes', labelKey:'admin.team', href: '/admin/team' },
        { label: 'Admin', labelKey:'admin.admin', href: '/admin/settings/access' },
        { label: 'Paramètres', labelKey:'admin.settings', href: '/admin/settings' },
      ]},
    ]
  }
};

export const adminDashboardData = {
  kpis: {
    projects_active: 28,
    collected_month: 42300,
    collected_total: 284900,
    spent_month: 28900,
    spent_total: 196400,
    beneficiaries_month: 1420,
    beneficiaries_total: 12960,
    distribution_bar: [35,15,50]
  },
  charts: {
    months: ['Jan','F\u00e9v','Mar','Avr','Mai','Juin'],
    bar: {
      collecte: [22,26,24,28,30,32],
      planifi\u00e9: [24,28,27,30,32,34],
      d\u00e9pens\u00e9: [18,22,21,25,26,28]
    },
    milestones_percent: [20,35,50,65,78,86],
    pie_spending: [
      { label: 'Production', value: 45 },
      { label: 'Distribution', value: 32 },
      { label: 'Formation', value: 18 },
      { label: 'Admin', value: 5 },
    ]
  },
  recent: [
    {date:'2025-09-24',type:'don',ref:'P#R45S-DON-8932',statut:'r\u00e9ussi',montant:1200,action:'voir'},
    {date:'2025-09-23',type:'rapport',ref:'D123-final',statut:'soumis',montant:null,action:'valider'},
    {date:'2025-09-22',type:'don',ref:'P#G22-DON-1121',statut:'r\u00e9ussi',montant:600,action:'voir'},
    {date:'2025-09-22',type:'don',ref:'P#G22-DON-1120',statut:'r\u00e9ussi',montant:200,action:'voir'},
    {date:'2025-09-21',type:'projet',ref:'RS6',statut:'draft',montant:null,action:'\u00e9diter'},
    {date:'2025-09-20',type:'rapport',ref:'RS6-m1',statut:'valid\u00e9',montant:null,action:'voir'},
    {date:'2025-09-19',type:'don',ref:'P#B17-DON-7001',statut:'rembours\u00e9',montant:-200,action:'voir'},
    {date:'2025-09-19',type:'rapport',ref:'G33-m2',statut:'rejet\u00e9',montant:null,action:'voir'},
    {date:'2025-09-18',type:'projet',ref:'G33',statut:'actif',montant:null,action:'voir'}
  ],
  filters_default: { type:'Tous', statut:'Tous', periode:'30j', rows:10 }
};
