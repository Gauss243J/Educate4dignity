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
            }
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
            }
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
