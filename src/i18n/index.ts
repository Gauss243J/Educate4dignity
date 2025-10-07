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
        signup: 'Sign Up',
        menuToggle: 'Toggle menu',
        menu: 'Menu',
        close: 'Close menu'
      },
      nav_mh: {
        projects: 'Menstrual Health Projects',
        resources: 'Menstrual Health Resources',
        blog: 'Stories & Insights',
        elearning: 'E-learning (Menstrual Health)',
        about: 'About Our Menstrual Health Mission'
      },
      
      // Landing Page
      landing: {
  title: 'Transform menstrual health education in Africa',
  subtitle: 'We break taboos, educate communities, and provide sustainable solutions so every girl can manage her period with dignity.',
  valueProp: 'Because no girl should miss school because of her period',
        description: 'Join us in creating sustainable change through innovative projects that provide education, resources, and opportunities to communities worldwide.',
        exploreProjects: 'Explore Projects',
        makeDonation: 'Make a Donation',
        featuredProjects: 'Featured Projects',
        featuredDescription: 'Discover the projects making a real difference in communities worldwide',
  // New human-like single line section titles
  whyTitle: "Education with dignity transforms a girl's future",
  storiesTitle: 'Discover real voices and moments from the field',
  featuredProjectsTitle: 'Choose a project you believe in and follow its progress',
  featuredProjectsTitle_mh: 'Back a menstrual health project and follow real impact',
  momentsTitle: 'Locally sewn kits, women leading, girls keeping their days',
  imagesDisclaimer: 'Images shown are illustrative placeholders for the prototype',
  howTitle: 'See how your support turns into measurable impact',
  partnersTitle: 'We work hand‑in‑hand with committed local partners',
  countriesTitle: 'Where we are learning, building, and expanding together',
  ourImpact: 'Why Educate4Dignity',
        impactDescription: 'Together, we\'re creating lasting change',
        projectsCompleted: 'Projects Completed',
        livesImpacted: 'Lives Impacted',
        countriesReached: 'Countries Reached',
        fundsRaised: 'Funds Raised'
      },
      audience: {
        labels: {
          beneficiaries: 'Beneficiaries',
          donors: 'Donors',
          partners: 'Partners'
        },
        beneficiaries: {
          sectionTitle: "Your path to confidence",
          p1: 'Understand your body without shame',
          p2: 'Learn with female facilitators who get you',
          p3: 'Receive free, durable menstrual hygiene kits',
          p4: 'Join a supportive sisterhood community'
        },
        donors: {
          sectionTitle: 'Your concrete impact',
          i1: '$15 = 1 menstrual hygiene kit for 6 months',
          i2: '$50 = Full training for a class of 30 students',
          i3: '$100 = Equip a school with adapted facilities',
          transparency: 'Track every dollar all the way to the beneficiaries'
        },
        partners: {
          sectionTitle: 'Let\'s build together',
          i1: 'Schools: Embed menstrual health education & supportive facilities',
          i2: 'NGOs & local associations: Run kit production and distribution points',
          i3: 'Community & faith leaders: Break stigma and champion girls\' dignity'
        },
        overview: {
          title: 'Paths, impact and collaboration'
        },
        pedagogy: {
          sectionTitle: 'Our learning approach',
          i1: 'Participatory method adapted to cultural realities',
          i2: 'Training in local languages with visual supports',
            i3: 'Mixed parent–girl sessions to lift family taboos'
        },
        menstrualHealth: {
          sectionTitle: 'Clear, practical menstrual health',
          i1: 'Hygiene: preventing infections',
          i2: 'Pain management with natural methods',
          i3: 'When to seek care: warning signs explained simply'
        }
      },
      projectCard: {
        supportCta: 'Advance menstrual health',
        supportCtaLong: 'Advance menstrual health & dignity',
        locationFrom: 'Location',
        funded: 'funded'
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
    blog: 'Blog',
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
          distributors: {
            listTitle: 'Distributors list',
            total: 'Total distributors',
            contact: 'Main contact',
            volume: 'Distributed volume (kits)',
            satisfaction: 'Average satisfaction',
            profile: {
              title: 'Distributor profile',
              notFound: 'Distributor not found.',
              users: 'Users',
              addUser: 'Add user',
              role: 'Role',
              lastAccess: 'Last access',
              deactivate: 'Deactivate',
              activate: 'Activate',
              noUsers: 'No users',
              associatedProjects: 'Associated projects',
              noProjects: 'No associated projects',
              notes: 'Notes',
              agreement: 'Agreement',
              lastReport: 'Last report',
              download: 'Download'
            },
            create: {
              title: 'New distributor',
              placeholders: { name: 'Ex: Ecole Kanyosha' },
              contract: 'Contract (optional)',
              selected: 'Selected'
            }
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
            logout: 'Logout',
            exportCsv: 'Export CSV',
            publish: 'Publish',
            unpublish: 'Unpublish',
            publishSelected: 'Publish selected',
            bulk: 'Bulk actions'
          },
          resources: {
            kpis: {
              total: 'Total documents',
              pending: 'Pending validation',
              published: 'Published (public)',
              retired: 'Retired/archived'
            },
            filters: {
              type: 'Type',
              year: 'Year',
              visibility: 'Visibility'
            },
            language: 'Language',
            size: 'Size',
            visibility: { label: 'Visibility', public: 'Public', internal: 'Internal' },
            status: { retired: 'Retired' },
            actions: { retire: 'Retire', confirmDelete: 'Delete this item?' },
            modal: {
              title: 'Upload a document (simple)',
              hint: 'Drop a file (optional). Metadata is enough for the demo.',
              dropHere: 'Drag & drop a file here',
              chooseFile: 'Choose a file',
              file: 'File',
              change: 'Change',
              desc: 'Short description',
              descPlaceholder: 'Displayed on public page',
              placeholders: { title: 'Document title' }
            }
          },
          donors: {
            anon: 'Anon.',
            kpis: { collected: 'Collected', average: 'Average donation', last: 'Last donation' },
            table: { count: 'Donations' },
            filters: { dest: { general: 'General fund' } },
            profile: {
              title: 'Donor profile',
              notFound: 'Donor not found.',
              history: 'Donations history',
              destination: 'Destination',
              method: 'Method',
              amount: 'Amount',
              requestRefund: 'Request refund',
              noDonations: 'No donations',
              projects: 'Projects supported',
              generalOnly: 'General fund only',
              refunds: 'Refunds',
              noRefunds: 'No refund requests.',
              donation: 'Donation',
              selectDonation: 'Select donation',
              reason: 'Reason',
              since: 'Since'
            }
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
        error: 'Error',
        retry: 'Retry',
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
        progress: 'Progress',
        // Admin table/common fields
        title: 'Title',
        category: 'Category',
        tags: 'Tags',
        author: 'Author',
        updated: 'Updated',
        level: 'Level',
        duration: 'Duration',
        rows: 'Rows',
        noResults: 'No results'
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
      },
      // Newsletter
      newsletter: {
        title: 'Newsletter',
        description: 'Sign up for monthly updates.',
        placeholder: 'you@example.com',
        cta: 'Subscribe',
        success: 'Thank you! Check your email.',
        invalid: 'Invalid address',
        failure: 'Failed, please retry',
        privacy: 'Data protection: unsubscribe with one click in every email.'
      }
      ,education: {
        title: 'Why menstrual health education matters',
  lead: 'Knowledge and dignity keep girls in school.',
    p1: 'When a girl does not know how to manage her period safely, she stays home. In many African schools, water is scarce and privacy is thin, so confusion turns into fear, and fear becomes missed days. Kits are the start. Training makes them work',
  p2: '',
  cta: 'See more content about menstruation health'
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
  signup: 'S\'inscrire',
  menuToggle: 'Ouvrir/fermer le menu',
  menu: 'Menu',
  close: 'Fermer le menu'
      },
      
      // Landing Page
      landing: {
  title: 'Transformons l\'éducation menstruelle en Afrique',
  subtitle: 'Nous brisons les tabous, éduquons les communautés et offrons des solutions durables pour que chaque jeune fille vive ses règles avec dignité.',
  valueProp: 'Parce qu\'aucune fille ne devrait manquer l\'école à cause de ses règles',
        description: 'Rejoignez-nous pour créer un changement durable grâce à des projets innovants qui fournissent éducation, ressources et opportunités aux communautés du monde entier.',
        exploreProjects: 'Explorer les projets',
        makeDonation: 'Faire un don',
        featuredProjects: 'Projets en vedette',
        featuredDescription: 'Découvrez les projets qui font une vraie différence dans les communautés du monde entier',
  // New human-like single line section titles (FR)
  whyTitle: 'Une éducation vécue dans la dignité transforme l’avenir d’une fille.',
  storiesTitle: 'Découvrez des voix et des moments authentiques du terrain.',
  featuredProjectsTitle: 'Choisissez un projet qui vous parle et suivez son évolution.',
  momentsTitle: 'Des kits cousus localement, des femmes qui mènent, des filles qui gardent leurs journées.',
  imagesDisclaimer: 'Images présentées = illustrations provisoires pour le prototype.',
  howTitle: 'Voyez comment votre soutien devient un impact mesurable.',
  partnersTitle: 'Nous avançons main dans la main avec des partenaires locaux engagés.',
  countriesTitle: 'Là où nous apprenons, construisons et avançons ensemble.',
        ourImpact: 'Notre impact',
        impactDescription: 'Ensemble, nous créons un changement durable',
        projectsCompleted: 'Projets terminés',
        livesImpacted: 'Vies impactées',
        countriesReached: 'Pays atteints',
        fundsRaised: 'Fonds collectés'
      },
      audience: {
        labels: {
          beneficiaries: 'Bénéficiaires',
          donors: 'Donateurs',
          partners: 'Partenaires'
        },
        beneficiaries: {
          sectionTitle: 'Ton parcours vers la confiance',
          p1: 'Découvre ton corps sans honte',
          p2: 'Apprends avec des formatrices qui te comprennent',
          p3: 'Reçois des kits d\'hygiène gratuits et durables',
          p4: 'Rejoins une communauté de sœurs solidaires'
        },
        donors: {
          sectionTitle: 'Votre impact concret',
          i1: '15$ = 1 kit d\'hygiène menstruelle pour 6 mois',
          i2: '50$ = Formation complète d\'une classe de 30 élèves',
          i3: '100$ = Équipement d\'une école avec des infrastructures adaptées',
          transparency: 'Suivez chaque franc jusqu\'aux mains des bénéficiaires'
        },
        partners: {
          sectionTitle: 'Construisons ensemble',
          i1: 'Écoles : Intégrer l\'éducation menstruelle et des espaces adaptés',
          i2: 'ONG & associations : Organiser production et distribution des kits',
          i3: 'Leaders communautaires & religieux : Briser le silence et porter la dignité des filles'
        },
        overview: {
          title: 'Parcours, impact et collaboration'
        },
        pedagogy: {
          sectionTitle: 'Approche pédagogique visible',
          i1: 'Méthode participative adaptée aux réalités culturelles',
          i2: 'Formation en langues locales avec supports visuels',
          i3: 'Sessions mixtes parents–filles pour lever les tabous familiaux'
        },
        menstrualHealth: {
          sectionTitle: 'Santé menstruelle sans détour',
          i1: 'Hygiène menstruelle : prévention des infections',
          i2: 'Gestion de la douleur avec méthodes naturelles',
          i3: 'Quand consulter : signaux d\'alerte expliqués simplement'
        }
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
    blog: 'Blog',
        resources: 'Ressources',
        research: 'R&D',
  team: 'Équipe',
          nav_mh: {
            projects: 'Projets santé menstruelle',
            resources: 'Ressources santé menstruelle',
            blog: 'Histoires & Perspectives',
            elearning: 'E-learning (santé menstruelle)',
            about: 'Notre mission santé menstruelle'
          },
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
          projectCard: {
            supportCta: 'Avancer la santé menstruelle',
            supportCtaLong: 'Avancer la santé menstruelle & la dignité',
            locationFrom: 'Lieu',
            funded: 'financé'
          },
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
          blog: {
            kpis: {
              total: 'Total articles',
              drafts: 'Drafts',
              published: 'Published',
              views30: 'Views (30d)'
            }
          },
          donors: {
            kpis: { total: 'Total donors', collected: 'Collected', average: 'Average donation', top: 'Top donor' },
            filters: {
              anon: { all: 'All', yes: 'Anonymous', no: 'Identified' },
              dest: { all: 'All destinations', general: 'General fund', project: 'Projects' },
              country: 'Country'
            },
            table: { name: 'Name', email: 'Email', count: 'Donations', total: 'Total', last: 'Last' },
            viewProfile: 'View profile',
            anon: 'Anon.'
          },
            donation: 'don',
            report: 'rapport'
          },
            actions: {
              view: 'voir',
              edit: 'éditer',
              validate: 'valider',
              help: 'Aide',
              logout: 'Se déconnecter',
              exportCsv: 'Exporter CSV',
              publish: 'Publier',
              unpublish: 'Dépublier',
              publishSelected: 'Publier sélection',
              bulk: 'Actions en masse'
            },
            resources: {
              kpis: {
                total: 'Total documents',
                pending: 'En attente de validation',
                published: 'Publiés (public)',
                retired: 'Retirés/archivés'
              },
              filters: {
                type: 'Type',
                year: 'Année',
                visibility: 'Visibilité'
              },
              language: 'Langue',
              size: 'Taille',
              visibility: { label: 'Visibilité', public: 'Public', internal: 'Interne' },
              status: { retired: 'Retiré' },
              actions: { retire: 'Retirer', confirmDelete: 'Supprimer cet élément ?' },
              modal: {
                title: 'Téléverser un document (simple)',
                hint: 'Déposez un fichier (optionnel). Les métadonnées suffisent pour la démo.',
                dropHere: 'Glissez-déposez un fichier ici',
                chooseFile: 'Choisir un fichier',
                file: 'Fichier',
                change: 'Changer',
                desc: 'Description (courte)',
                descPlaceholder: 'Affichée sur la page publique',
                placeholders: { title: 'Titre du document' }
              }
            },
            donors: {
              kpis: { total: 'Total donateurs', collected: 'Collecté', average: 'Don moyen', top: 'Top donateur' },
              filters: {
                anon: { all: 'Tous', yes: 'Anonyme', no: 'Identifié' },
                dest: { all: 'Toutes destinations', general: 'Fonds général', project: 'Projets' },
                country: 'Pays'
              },
              table: { name: 'Nom', email: 'Email', count: 'Dons', total: 'Total', last: 'Dernier' },
              viewProfile: 'Voir profil',
              anon: 'Anonyme',
              profile: {
                title: 'Profil donateur',
                notFound: 'Donateur introuvable.',
                history: 'Historique des dons',
                destination: 'Destination',
                method: 'Méthode',
                amount: 'Montant',
                requestRefund: 'Demander un remboursement',
                noDonations: 'Aucun don',
                projects: 'Projets soutenus',
                generalOnly: 'Fonds général uniquement',
                refunds: 'Remboursements',
                noRefunds: 'Aucune demande de remboursement.',
                donation: 'Don',
                selectDonation: 'Sélectionner un don',
                reason: 'Motif',
                since: 'Depuis'
              }
            },
          charts: {
            collectePlanDep: 'Collecte vs Planifié vs Dépensé (mensuel)',
            milestones: 'Jalons complétés (%)',
            spendingSplit: 'Répartition des dépenses'
          },
          distributors: {
            listTitle: 'Liste des distributeurs',
            total: 'Total distributeurs',
            contact: 'Contact principal',
            volume: 'Volume distribué (kits)',
            satisfaction: 'Satisfaction moyenne',
            profile: {
              title: 'Profil distributeur',
              notFound: 'Distributeur introuvable.',
              users: 'Utilisateurs',
              addUser: 'Ajouter utilisateur',
              role: 'Rôle',
              lastAccess: 'Dernier accès',
              deactivate: 'Désactiver',
              activate: 'Activer',
              noUsers: 'Aucun utilisateur',
              associatedProjects: 'Projets associés',
              noProjects: 'Aucun projet associé',
              notes: 'Notes',
              agreement: 'Convention',
              lastReport: 'Dernier rapport',
              download: 'Télécharger'
            },
            create: {
              title: 'Nouveau distributeur',
              placeholders: { name: 'Ex : École Kanyosha' },
              contract: 'Convention (optionnel)',
              selected: 'Sélectionné'
            }
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
        error: 'Erreur',
        retry: 'Réessayer',
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
        progress: 'Progrès',
        // Admin table/common fields
        title: 'Titre',
        category: 'Catégorie',
        tags: 'Tags',
        author: 'Auteur',
        updated: 'MAJ',
        level: 'Niveau',
        duration: 'Durée',
        rows: 'Lignes',
        noResults: 'Aucun résultat'
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
            blog: {
              kpis: {
                total: 'Articles totaux',
                drafts: 'Brouillons',
                published: 'Publiés',
                views30: 'Vues (30j)'
              }
            },
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
      },
      // Newsletter
      newsletter: {
        title: 'Newsletter',
        description: 'Inscrivez-vous pour des mises à jour mensuelles.',
        placeholder: 'vous@exemple.com',
        cta: 'S\'inscrire',
        success: 'Merci ! Vérifiez votre email.',
        invalid: 'Adresse invalide',
        failure: 'Échec, réessayez',
        privacy: 'Protection des données : désabonnement en un clic dans chaque email.'
      }
      ,education: {
        title: 'Pourquoi l\'éducation à la santé menstruelle compte',
  lead: 'Savoir et dignité gardent les filles à l\'école.',
    p1: 'Sans informations claires, des filles manquent des cours, subissent la stigmatisation ou utilisent des solutions risquées. Les kits aident et la formation donne confiance.',
  p2: 'Animatrices locales : hygiène, réutilisation, moins de honte. Cours en ligne et blog renforcent. Cet appui combiné garde les filles présentes et équipées.',
  cta: 'Voir plus de contenu sur la santé menstruelle'
      }
      ,aboutPage: {
        heroTitle: 'From Taboo to Dignity: Rethinking Menstrual Health through Innovation and Equity',
        heroSubtitle: 'An origin story about girls, engineering, and dignity — how communities and simple innovations can remove a monthly barrier to education.',
        quote: 'Biology should never determine destiny. Menstruation must be met with science, support, and solidarity — not silence.',
        beginnings: 'Our beginnings',
        vision: 'Vision & intent',
        team: 'Team & governance',
        partners: 'Partners',
        cta: 'Join us in restoring dignity through engineering with empathy.',
        donate: 'Donate now'
      }
      ,blog: {
        listTitle: 'Stories & Insights',
        listSubtitle: 'Field stories, research notes, and product updates from the ground.',
        searchPlaceholder: 'Search articles...',
        filters: { topic:'Topic', country:'Country', year:'Year', type:'Type', sortNewest:'Sort: Newest' },
        stayLoop: 'Stay in the loop',
        stayLoopDesc: 'Monthly round-up of impact stories and transparency updates.',
        subscribeCta: 'Subscribe',
        onThisPage: 'On this page',
        consentVerified: 'Consent verified',
        transparencyNote: 'Transparency note',
        keepReading: 'Keep Reading',
        popularTopics: 'Popular topics'
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
