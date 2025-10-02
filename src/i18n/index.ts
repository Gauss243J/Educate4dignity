import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translations
const resources = {
  en: {
    translation: {
      // Navigation
      nav: {
        projects: 'Projects',
        about: 'About',
        resources: 'Resources',
        blog: 'Blog',
        contact: 'Contact',
        donate: 'Donate',
        signin: 'Sign In',
        signup: 'Sign Up'
      },
      
      // Landing Page
      landing: {
        title: 'From Taboo to Dignity',
        subtitle: 'Keep girls in school with reusable, dignified menstrual kits.',
        description: 'Join us in creating sustainable change through innovative projects that provide education, resources, and opportunities to communities worldwide.',
        exploreProjects: 'Explore Projects',
        makeDonation: 'Make a Donation',
        featuredProjects: 'Featured Projects',
        featuredDescription: 'Discover the projects making a real difference in communities worldwide',
  ourImpact: 'Why Educate4Dignity',
        impactDescription: 'Together, we\'re creating lasting change',
        projectsCompleted: 'Projects Completed',
        livesImpacted: 'Lives Impacted',
        countriesReached: 'Countries Reached',
        fundsRaised: 'Funds Raised'
      },
      
      // Authentication
      auth: {
        login: 'Login',
        email: 'Email',
        password: 'Password',
        rememberMe: 'Remember me',
        forgotPassword: 'Forgot password?',
        signin: 'Sign In',
        noAccount: 'Don\'t have an account?',
        signup: 'Sign up',
        enterEmail: 'Enter your email',
        enterPassword: 'Enter your password'
      },
      
      // Admin Dashboard
      admin: {
        dashboard: 'Dashboard',
        projects: 'Projects',
        suppliers: 'Suppliers',
        distributors: 'Distributors',
        beneficiaries: 'Beneficiaries',
        finances: 'Finances & Donors',
  donors: 'Donors',
        elearning: 'E-learning',
        resources: 'Resources',
        research: 'R&D',
  team: 'Team',
  admin: 'Admin',
        settings: 'Settings',
        welcome: 'Welcome back! Here\'s what\'s happening with your projects.',
        totalProjects: 'Total Projects',
        activeProjects: 'Active Projects',
        totalRaised: 'Total Raised',
        fundingProgress: 'Funding Progress',
        recentProjects: 'Recent Projects',
        recentDonations: 'Recent Donations',
  noMessage: 'No message',
  ui: {
          groups: {
            operations: 'Operations & Projects',
            finance: 'Finance & Donors',
            content: 'Content & Learning',
            governance: 'Governance & Administration'
          },
          quick: {
            dashboard: 'Dashboard'
          },
          table: {
            recentItems: 'Recent Items',
            date: 'Date',
            type: 'Type',
            reference: 'Reference',
            status: 'Status',
            amount: 'Amount',
            actions: 'Actions',
            searchPlaceholder: 'Search...'
          },
          filters: {
            all: 'All',
            period30: '30d',
            period90: '90d',
            period365: '365d'
          },
          status: {
            success: 'success',
            pending: 'in progress',
            submitted: 'submitted',
            validated: 'validated',
            refunded: 'refunded',
            rejected: 'rejected',
            draft: 'draft',
            active: 'active'
          },
          types: {
            project: 'project',
            donation: 'donation',
            report: 'report'
          },
          actions: {
            view: 'view',
            edit: 'edit',
            validate: 'validate',
            help: 'Help',
            logout: 'Logout'
          },
          charts: {
            collectePlanDep: 'Collected vs Planned vs Spent (monthly)',
            milestones: 'Milestones completed (%)',
            spendingSplit: 'Spending breakdown'
          },
          kpis: {
            activeProjects: 'ACTIVE PROJECTS',
            collected: 'COLLECTED',
            spent: 'SPENT',
            beneficiaries: 'BENEFICIARIES'
          },
          projects: {
            total: 'Total projects',
            plannedBudget: 'Planned budget',
            collected: 'Collected',
            spent: 'Spent',
            execution: 'Execution',
            table: {
              id: 'ID', name: 'Name', type: 'Type', organisation: 'Organisation', location: 'Location', dates: 'Dates', status: 'Status', budget: 'Budget', collected: 'Collected', spent: 'Spent'
            },
            filters: {
              type: 'Type', status: 'Status', country: 'Country', org: 'Org', period: 'Period'
            },
            create: {
              title: 'Create New Project',
              name: 'Project name',
              placeholderName: 'Ex: Gitega School Dignity Kits',
              manager: 'Project manager',
              operators: 'Field operators',
              type: 'Type',
              org: 'Organisation (type + entity)',
              organisationType: 'Type',
              organisationEntity: 'Entity',
              dates: 'Dates',
              startDate: 'Start date',
              endDate: 'End date',
              location: 'Location',
              country: 'Country',
              state: 'Province/State',
              city: 'City',
              template: 'Template (if distribution/training)',
              description: 'Description',
              plannedBudget: 'Planned total budget (USD)',
              code: 'Project code (auto)',
              createdBy: 'Created by',
              createdAt: 'Created at',
              tipRequired: 'Tip: Fields marked * are required. Errors show below fields.',
              saveDraft: 'Save draft',
              create: 'Create',
              createContinue: 'Create & continue',
              cancel: 'Cancel',
              operatorsPlaceholder: 'Add/remove operators',
              required: 'This field is required',
              budgetInvalid: 'Invalid budget value',
              shortDescription: 'Short description',
              coverImage: 'Cover image',
              videoUrl: 'Video URL',
              initialCollected: 'Initial collected (USD)',
              coverRequired: 'Cover image is required'
              ,videoSource: 'Video source'
              ,videoFile: 'Video file'
              ,sourceUrl: 'Link'
              ,sourceUpload: 'Upload'
              ,removeVideo: 'Remove video'
              ,type_blank: 'Blank'
              ,type_distribution: 'Distribution'
              ,type_formation: 'Training'
              ,type_recherche_dev: 'Research & Development'
              ,type_achat: 'Purchase'
              ,type_hybride: 'Hybrid (Distribution + Training)'
              ,operatorsLabel: 'Field operators'
              ,primaryOperator: 'Primary operator'
              ,operatorsRequired: 'Select at least one operator'
              ,primaryOperatorRequired: 'Select a primary operator'
              ,operatorSearch: 'Search operator...'
              ,orgType_ong: 'NGO'
              ,orgType_ecole: 'School'
              ,orgType_association: 'Association'
              ,orgType_institution: 'Institution'
              ,orgType_organisation: 'Organisation'
              ,detail_tabs_resume: 'Summary'
              ,detail_tabs_plan: 'Plan'
              ,detail_tabs_production: 'Production'
              ,detail_tabs_distribution: 'Distribution'
              ,detail_tabs_formation: 'Training'
              ,detail_tabs_transparency: 'Transparency'
              ,detail_tabs_depenses: 'Spending'
              ,detail_tabs_rapports: 'Reports'
              ,detail_tabs_beneficiaires: 'Beneficiaries'
              ,detail_checklist_title: 'Checklist — Next steps'
              ,detail_project_info: 'Project info'
              ,detail_quick_actions: 'Quick actions'
              ,action_open_production: 'Open Production'
              ,action_open_distribution: 'Open Distribution'
              ,action_add_expense: 'Add expense'
              ,action_upload_report: 'Upload report'
              ,action_import_beneficiaries: 'Import beneficiaries'
              ,action_export_pdf: 'Export PDF'
            }
            , newProject: 'New project'
          },
          months: {
            jan: 'Jan',
            feb: 'Feb',
            mar: 'Mar',
            apr: 'Apr',
            may: 'May',
            jun: 'Jun',
            jul: 'Jul',
            aug: 'Aug',
            sep: 'Sep',
            oct: 'Oct',
            nov: 'Nov',
            dec: 'Dec'
          }
        }
      },
      
      // Common
      common: {
        search: 'Search...',
        notifications: 'Notifications',
        loading: 'Loading...',
        save: 'Save',
        cancel: 'Cancel',
        edit: 'Edit',
        delete: 'Delete',
        view: 'View',
        create: 'Create',
        update: 'Update',
        back: 'Back',
        next: 'Next',
        previous: 'Previous',
        submit: 'Submit',
        learnMore: 'Learn More',
        viewAll: 'View All',
        progress: 'Progress'
      },
      
      // Transparency
      transparency: {
        title: 'Transparency & Accountability',
        subtitle: 'Track the progress and impact of every project. We believe in complete transparency.',
        kpis: {
          planned: 'Planned Budget',
          collected: 'Collected',
          spent: 'Spent',
          gap: 'Funding Gap',
          beneficiaries: 'Beneficiaries'
        },
        chart: {
          monthlyOverview: 'Monthly Financial Overview',
          legend: {
            planned: 'Planned',
            collected: 'Collected',
            spent: 'Spent'
          },
          month: 'Month'
        },
        expenses: {
          title: 'Expenses',
          category: 'Category',
          amount: 'Amount',
          date: 'Date',
          filterCategory: 'Filter Category',
          filterMonth: 'Filter Month',
          noData: 'No expenses found'
        },
        milestones: 'Project Milestones',
        documents: 'Available Documents',
        financialBreakdown: 'Financial Breakdown',
        budgetUtilization: 'Budget Utilization',
        remaining: 'Remaining',
        projectProgress: 'Project Progress',
        viewDetails: 'View Details',
        hideDetails: 'Hide Details'
      }
    }
  },
  fr: {
    translation: {
      // Navigation
      nav: {
        projects: 'Projets',
        about: 'À propos',
        resources: 'Ressources',
        blog: 'Blog',
        contact: 'Contact',
        donate: 'Faire un don',
        signin: 'Se connecter',
        signup: 'S\'inscrire'
      },
      
      // Landing Page
      landing: {
        title: 'Autonomiser les communautés grâce à',
        subtitle: 'l\'Éducation et la Dignité',
        description: 'Rejoignez-nous pour créer un changement durable grâce à des projets innovants qui fournissent éducation, ressources et opportunités aux communautés du monde entier.',
        exploreProjects: 'Explorer les projets',
        makeDonation: 'Faire un don',
        featuredProjects: 'Projets en vedette',
        featuredDescription: 'Découvrez les projets qui font une vraie différence dans les communautés du monde entier',
        ourImpact: 'Notre impact',
        impactDescription: 'Ensemble, nous créons un changement durable',
        projectsCompleted: 'Projets terminés',
        livesImpacted: 'Vies impactées',
        countriesReached: 'Pays atteints',
        fundsRaised: 'Fonds collectés'
      },
      
      // Authentication
      auth: {
        login: 'Connexion',
        email: 'Email',
        password: 'Mot de passe',
        rememberMe: 'Se souvenir de moi',
        forgotPassword: 'Mot de passe oublié ?',
        signin: 'Se connecter',
        noAccount: 'Vous n\'avez pas de compte ?',
        signup: 'S\'inscrire',
        enterEmail: 'Entrez votre email',
        enterPassword: 'Entrez votre mot de passe'
      },
      
      // Admin Dashboard
      admin: {
        dashboard: 'Tableau de bord',
        projects: 'Projets',
        suppliers: 'Fournisseurs',
        distributors: 'Distributeurs',
        beneficiaries: 'Bénéficiaires',
        finances: 'Finances et donateurs',
  donors: 'Donateurs',
        elearning: 'E-learning',
        resources: 'Ressources',
        research: 'R&D',
  team: 'Équipe',
  admin: 'Admin',
        settings: 'Paramètres',
        welcome: 'Bon retour ! Voici ce qui se passe avec vos projets.',
        totalProjects: 'Total des projets',
        activeProjects: 'Projets actifs',
        totalRaised: 'Total collecté',
        fundingProgress: 'Progrès du financement',
        recentProjects: 'Projets récents',
        recentDonations: 'Dons récents',
  noMessage: 'Aucun message',
  ui: {
          groups: {
            operations: 'Opérations & Projets',
            finance: 'Finances & Donateurs',
            content: 'Contenu & Apprentissage',
            governance: 'Gouvernance & Administration'
          },
          quick: {
            dashboard: 'Dashboard'
          },
          table: {
            recentItems: 'Éléments récents',
            date: 'Date',
            type: 'Type',
            reference: 'Référence',
            status: 'Statut',
            amount: 'Montant',
            actions: 'Actions',
            searchPlaceholder: 'Rechercher...'
          },
          filters: {
            all: 'Tous',
            period30: '30j',
            period90: '90j',
            period365: '365j'
          },
          status: {
            success: 'réussi',
            pending: 'en cours',
            submitted: 'soumis',
            validated: 'validé',
            refunded: 'remboursé',
            rejected: 'rejeté',
            draft: 'draft',
            active: 'actif'
          },
          types: {
            project: 'projet',
            donation: 'don',
            report: 'rapport'
          },
            actions: {
              view: 'voir',
              edit: 'éditer',
              validate: 'valider',
              help: 'Aide',
              logout: 'Se déconnecter'
            },
          charts: {
            collectePlanDep: 'Collecte vs Planifié vs Dépensé (mensuel)',
            milestones: 'Jalons complétés (%)',
            spendingSplit: 'Répartition des dépenses'
          },
          kpis: {
            activeProjects: 'PROJETS ACTIFS',
            collected: 'COLLECTÉ',
            spent: 'DÉPENSÉ',
            beneficiaries: 'BÉNÉFICIAIRES'
          },
          projects: {
            total: 'Total projets',
            plannedBudget: 'Budget planifié',
            collected: 'Collecté',
            spent: 'Dépensé',
            execution: 'Exécution',
            table: {
              id: 'ID', name: 'Nom', type: 'Type', organisation: 'Organisation', location: 'Location', dates: 'Dates', status: 'Statut', budget: 'Budget', collected: 'Collecté', spent: 'Dépensé'
            },
            filters: {
              type: 'Type', status: 'Statut', country: 'Pays', org: 'Org', period: 'Période'
            },
            create: {
              title: 'Créer un nouveau projet',
              name: 'Nom du projet',
              placeholderName: 'Ex: Gitega School Dignity Kits',
              manager: 'Chef de projet',
              operators: 'Opérateurs terrain',
              type: 'Type',
              org: 'Organisation (type + entité)',
              organisationType: 'Type',
              organisationEntity: 'Entité',
              dates: 'Dates',
              startDate: 'Date début',
              endDate: 'Date fin',
              location: 'Location',
              country: 'Pays',
              state: 'Province/État',
              city: 'Ville',
              template: 'Template (si distribution/formation)',
              description: 'Description',
              plannedBudget: 'Budget planifié total (USD)',
              code: 'Code projet (auto)',
              createdBy: 'Créé par',
              createdAt: 'Créé le',
              tipRequired: 'Astuce : les champs marqués * sont obligatoires. Les erreurs s\'affichent sous les champs.',
              saveDraft: 'Enregistrer brouillon',
              create: 'Créer',
              createContinue: 'Créer & continuer',
              cancel: 'Annuler',
              operatorsPlaceholder: 'Ajouter/supprimer des opérateurs',
              required: 'Champ requis',
              budgetInvalid: 'Budget invalide',
              shortDescription: 'Courte description',
              coverImage: 'Image de couverture',
              videoUrl: 'URL vidéo',
              initialCollected: 'Collecté initial (USD)',
              coverRequired: 'Image de couverture requise'
              ,videoSource: 'Source vidéo'
              ,videoFile: 'Fichier vidéo'
              ,sourceUrl: 'Lien'
              ,sourceUpload: 'Téléverser'
              ,removeVideo: 'Supprimer la vidéo'
              ,type_blank: 'Blank'
              ,type_distribution: 'Distribution'
              ,type_formation: 'Formation'
              ,type_recherche_dev: 'Recherche & Développement'
              ,type_achat: 'Achat'
              ,type_hybride: 'Hybride (Distribution + Formation)'
              ,operatorsLabel: 'Opérateurs terrain'
              ,primaryOperator: 'Opérateur principal'
              ,operatorsRequired: 'Choisissez au moins un opérateur'
              ,primaryOperatorRequired: 'Sélectionnez un opérateur principal'
              ,operatorSearch: 'Rechercher un opérateur...'
              ,orgType_ong: 'ONG'
              ,orgType_ecole: 'École'
              ,orgType_association: 'Association'
              ,orgType_institution: 'Institution'
              ,orgType_organisation: 'Organisation'
              ,detail_tabs_resume: 'Résumé'
              ,detail_tabs_plan: 'Plan'
              ,detail_tabs_production: 'Production'
              ,detail_tabs_distribution: 'Distribution'
              ,detail_tabs_formation: 'Formation'
              ,detail_tabs_transparency: 'Transparence'
              ,detail_tabs_depenses: 'Dépenses'
              ,detail_tabs_rapports: 'Rapports'
              ,detail_tabs_beneficiaires: 'Bénéficiaires'
              ,detail_checklist_title: 'Checklist — Prochaines étapes'
              ,detail_project_info: 'Infos projet'
              ,detail_quick_actions: 'Actions rapides'
              ,action_open_production: 'Ouvrir Production'
              ,action_open_distribution: 'Ouvrir Distribution'
              ,action_add_expense: 'Ajouter dépense'
              ,action_upload_report: 'Téléverser rapport'
              ,action_import_beneficiaries: 'Importer bénéficiaires'
              ,action_export_pdf: 'Exporter PDF'
            }
            , newProject: 'Nouveau projet'
          },
          months: {
            jan: 'Jan',
            feb: 'Fév',
            mar: 'Mar',
            apr: 'Avr',
            may: 'Mai',
            jun: 'Juin',
            jul: 'Juil',
            aug: 'Aoû',
            sep: 'Sep',
            oct: 'Oct',
            nov: 'Nov',
            dec: 'Déc'
          }
        }
      },
      
      // Common
      common: {
        search: 'Rechercher...',
        notifications: 'Notifications',
        loading: 'Chargement...',
        save: 'Enregistrer',
        cancel: 'Annuler',
        edit: 'Modifier',
        delete: 'Supprimer',
        view: 'Voir',
        create: 'Créer',
        update: 'Mettre à jour',
        back: 'Retour',
        next: 'Suivant',
        previous: 'Précédent',
        submit: 'Soumettre',
        learnMore: 'En savoir plus',
        viewAll: 'Voir tout',
        progress: 'Progrès'
      },
      
      // Transparency
      transparency: {
        title: 'Transparence & Responsabilité',
        subtitle: 'Suivez la progression et l\'impact de chaque projet. Nous croyons en une transparence totale.',
        kpis: {
          planned: 'Budget Prévu',
          collected: 'Collecté',
          spent: 'Dépensé',
          gap: 'Manque de Financement',
          beneficiaries: 'Bénéficiaires'
        },
        chart: {
          monthlyOverview: 'Vue Financière Mensuelle',
          legend: {
            planned: 'Prévu',
            collected: 'Collecté',
            spent: 'Dépensé'
          },
          month: 'Mois'
        },
        expenses: {
          title: 'Dépenses',
          category: 'Catégorie',
          amount: 'Montant',
          date: 'Date',
          filterCategory: 'Filtrer Catégorie',
          filterMonth: 'Filtrer Mois',
          noData: 'Aucune dépense trouvée'
        },
        milestones: 'Jalons du Projet',
        documents: 'Documents Disponibles',
        financialBreakdown: 'Répartition Financière',
        budgetUtilization: 'Utilisation du Budget',
        remaining: 'Restant',
        projectProgress: 'Progression du Projet',
        viewDetails: 'Voir les détails',
        hideDetails: 'Masquer les détails'
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
