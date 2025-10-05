import { BlogArticle } from '../types/blog';

// Public, original content for the Blog. Keep concise, cite sources via links, and avoid copying.
export const blogArticles: BlogArticle[] = [
  // Matches admin store seed slug: from-absenteeism-to-attendance
  {
    title: 'From absenteeism to attendance: reusable kits at work',
    slug: 'from-absenteeism-to-attendance',
    category: 'impact',
    tags: ['MHM','Attendance','Case study'],
    author: {
      id: 'e4d-ops',
      name: 'E4D Field Team',
      role: 'Training & Distribution',
      avatar_url: '',
      bio: 'We partner with local schools and women-led cooperatives to deliver MHM training and reusable kits.'
    },
  cover_image_url: '/photos/course/variete-de-l-hygiene-menstruelle-feminine-vue-de-dessus.jpg',
    cover_consent_verified: true,
    published_at: '2025-05-12',
    read_minutes: 6,
    excerpt: 'What changes when girls receive practical MHM education and a reusable kit they can trust.',
  body_md: `## Context
In many schools, girls miss lessons due to pain, stigma, or lack of safe materials. Practical menstrual hygiene management (MHM) education and access to reliable materials can help reduce absenteeism and improve comfort and confidence.

### Our approach
We ran short, age-appropriate sessions covering hygiene, safe use, washing, and drying. Each learner received a reusable kit and a breathable storage bag. Teachers and caregivers were involved to reinforce key practices.

> "I didn't have to go home this time. I knew what to do." — Student participant

## What changed
- Fewer reported early departures during menstruation
- Better preparedness (spare pad packed, washing plan at home)
- Peer-to-peer support and myth-busting within classes

![Training session](/photos/Project/92038f75-aeef-42a1-a6f0-a4a014771f14.png "Training session — consent verified")

## Outcomes and notes
Short-term monitoring suggests improved attendance and comfort in the weeks after training. Longer-term tracking will refine these findings with school registers and anonymized follow-ups.

### What beneficiaries told us
- “I wasn’t worried, I packed a spare and stayed in class.”
- “Washing steps were clear; my caregiver helps at home.”

### What schools changed
- Teachers use 5-minute refreshers weekly
- Girls can access water and soap near classrooms
- A private corner for changing is signposted

## References
- WHO/UNICEF. Menstrual health and hygiene in schools — overview: https://www.who.int/health-topics/menstruation
- UNICEF. Guidance for MHH in education settings: https://www.unicef.org/wash/menstrual-hygiene-management
`,
    callout_transparency: 'Photos are illustrative. Attendance insights are aggregated; we do not publish personally identifiable data.',
    related: [
      { title: 'Training day: MHM basics that stick', slug: 'training-day-mhm-basics' },
      { title: 'Mobile money receipts for kits', slug: 'mobile-money-receipts-kits' }
    ],
    seo_title: 'From absenteeism to attendance — impact notes',
    seo_description: 'Practical MHM training and reusable kits can reduce missed lessons and improve comfort.'
  },

  // Matches admin store seed slug: mobile-money-receipts-kits
  {
    title: 'Mobile money receipts for dignity kits: a simple flow',
    slug: 'mobile-money-receipts-kits',
    category: 'howto',
    tags: ['Payments','Transparency','How‑to'],
    author: {
      id: 'e4d-ops',
      name: 'E4D Operations',
      role: 'Field Ops',
      avatar_url: ''
    },
  cover_image_url: '/photos/Dossier/1.png',
    cover_consent_verified: true,
    published_at: '2025-04-22',
    read_minutes: 5,
    excerpt: 'How to request, collect, and reconcile proofs of payment without adding friction for partners.',
  body_md: `## Why mobile receipts?
In places where banking is limited, mobile money is common for reimbursements. Clear steps reduce errors and make later audits painless.

## The five-step flow
1. Share a one-page guide (what to keep, how to capture screenshots)
2. Send payment with a short, consistent memo (e.g., "KIT-INV-2025-04-22")
3. Beneficiary sends a receipt screenshot or SMS export
4. Store in a dated folder; rename \`<memo>-<amount>-<recipient>.png\`
5. Reconcile weekly: CSV export + folder check

## Risks & mitigations
- Number mismatch → verify on first transfer with a small test amount
- Blurry screenshots → provide an example and acceptable alternatives (USSD text)
- Privacy → redact phone numbers before publishing any proof

## Templates
- Simple receipt checklist (PDF)
- Reconciliation sheet (CSV) — columns: date, memo, amount, payer, recipient, proof link

### Field-tested tips
- Ask partners to capture the screen immediately after payment confirmation
- For USSD: show how to export the text message
- Keep memos short and consistent (e.g., KIT-<date>-<seq>)

## References
- GSMA. Mobile money principles: https://www.gsma.com/mobilefordevelopment/mobile-money/
`,
    callout_transparency: 'Only aggregate amounts and redacted proofs are made public. Phone numbers and IDs are never published.',
    related: [
      { title: 'Traceability in practice', slug: 'tracking-beneficiary-offline' },
      { title: 'From absenteeism to attendance', slug: 'from-absenteeism-to-attendance' }
    ],
    seo_title: 'Mobile money receipts — simple, auditable flows',
    seo_description: 'Request, collect, and reconcile payment proofs while protecting privacy.'
  },

  // Keep the original Gitega case study (new slug kept as-is for direct navigation if linked elsewhere)
  {
    title: 'From absenteeism to attendance: what changed in Gitega',
    slug: 'from-absenteeism-to-attendance-gitega',
    category: 'impact',
    tags: ['MHM','Transparency','Gitega'],
    author: {
      id: 'sacode-team',
      name: 'SaCoDé Team',
      role: 'Training & Field',
      avatar_url: '',
      bio: 'Women-led cooperative delivering training and distribution across Burundi.'
    },
  cover_image_url: '/photos/jeune-adulte-deprime-a-la-maison.jpg',
    cover_consent_verified: true,
    published_at: '2025-05-12',
    read_minutes: 6,
    excerpt: 'After kit distribution and MHM sessions, attendance among senior girls rose measurably…',
    body_md: `## Context
Girls in Gitega missed classes due to limited materials, stigma, and pain management challenges. The program combined short, practical lessons with access to reusable kits.

## What changed
- Reported preparedness improved (spare pad packed, washing plan)
- Teachers integrated short refreshers on handwashing and drying
- Peer support groups formed to counter myths

## Outcomes
Early monitoring shows fewer absences in weeks following sessions. We will continue to triangulate school registers and learner check-ins.

## References
- UNESCO. Menstrual health in schools: https://www.unesco.org/en/education
`,
    callout_transparency: 'Public dashboards show planned vs. collected vs. spent, with anonymized proofs and monthly updates.',
    related: [
      { title: 'Co-ops at the center: women-led production', slug: 'coops-women-led-production' },
      { title: 'What counts as proof?', slug: 'what-counts-as-proof' }
    ],
    seo_title: 'Attendance improved in Gitega — Case Study',
    seo_description: 'How locally-made kits and MHM sessions increased attendance while keeping transparency simple.'
  },

  // New posts (public, original content)
  {
    title: 'What counts as proof? Photos, receipts, attestations',
    slug: 'what-counts-as-proof',
    category: 'howto',
    tags: ['Transparency','Evidence','Receipts'],
    author: {
      id: 'e4d-ops',
      name: 'E4D Operations',
      role: 'Monitoring & Transparency',
      avatar_url: ''
    },
  cover_image_url: '/photos/tir-isole-de-l-heureuse-jeune-femme-afro-tient-un-tampon-de-coton-menstuation-et-une-serviette-hygienique.jpg',
    cover_consent_verified: true,
    published_at: '2025-05-05',
    read_minutes: 6,
    excerpt: 'A practical checklist for collecting and publishing evidence without exposing personal data.',
    body_md: `## The goal
Transparency builds trust, but not all documents should be posted publicly. Our approach: collect robust proofs privately; publish redacted, aggregated evidence.

### Proof types we accept
- Photos from sessions (with consent)
- Receipts and mobile money confirmations (redacted)
- Attestations from school leads or partners (dated + contact)

## Redaction & consent
Remove phone numbers, ID codes and faces without consent. Use a consistent watermark for published versions and store originals securely.

## Publishing rhythm
Post aggregated dashboards monthly: planned vs. delivered, spend vs. budget, and links to selected proofs. Keep a changelog of corrections.

## References
- Open data principles (adapted for safeguarding): https://opendatacharter.net/
- UNICEF. Digital safeguarding tips: https://www.unicef.org/` ,
    callout_transparency: 'Personally identifiable information is removed before publication. Originals remain in restricted storage for audits.',
    related: [
      { title: 'Mobile money receipts for dignity kits', slug: 'mobile-money-receipts-kits' },
      { title: 'Traceability in practice (offline)', slug: 'tracking-beneficiary-offline' }
    ],
    seo_title: 'Proof for transparency — how we publish safely',
    seo_description: 'Collect evidence, redact safely, and publish aggregates that build trust without harming privacy.'
  },
  {
    title: 'Traceability in practice: lot → beneficiary in offline settings',
    slug: 'tracking-beneficiary-offline',
    category: 'insights',
    tags: ['Traceability','Offline','Operations'],
    author: {
      id: 'e4d-ops',
      name: 'E4D Field Team',
      role: 'Distribution & Records',
      avatar_url: ''
    },
  cover_image_url: '/photos/photo-d-une-femme-afro-americaine-ravie-tient-un-tampon-et-une-serviette-hygienique-vetue-d-un-t-shirt-blanc-isole-sur-un-mur-rose-femmes-pms.jpg',
    cover_consent_verified: true,
    published_at: '2025-05-02',
    read_minutes: 7,
    excerpt: 'How we map kit lots to recipients when connectivity is unreliable.',
    body_md: `## Why traceability matters
Knowing which lot reached whom helps quality control, recalls, and impact analysis.

### Minimal kit ledger
- Lot code printed on kit label
- Distribution sheet: name or alias, class, lot code, date, facilitator
- Optional: SMS confirmation template

## Offline-first tips
- Pre-generate sheets; carry spare copies
- Use short codes (e.g., L24-0512-A) for speed and fewer errors
- Reconcile at day’s end: photo + upload when signal is available

## Safeguards
Store named lists securely. Publicly, show counts and anonymized samples only.

## References
- GSMA. Inclusive tech in low-connectivity contexts: https://www.gsma.com/`,
    callout_transparency: 'Beneficiary-level lists are never published. We share only anonymized aggregates and redacted samples.',
    related: [
      { title: 'What counts as proof?', slug: 'what-counts-as-proof' },
      { title: 'From absenteeism to attendance', slug: 'from-absenteeism-to-attendance' }
    ],
    seo_title: 'Offline traceability — simple, robust practices',
    seo_description: 'Lot-to-beneficiary mapping with paper-first tools and later digitization.'
  },
  {
    title: 'Co-ops at the center: women-led production',
    slug: 'coops-women-led-production',
    category: 'impact',
    tags: ['Women-led','Cooperatives','Local production'],
    author: {
      id: 'sacode-team',
      name: 'SaCoDé Team',
      role: 'Production & Training'
    },
  cover_image_url: '/photos/course/48e1c9d3-6c82-469f-9b0a-f4fd7875090c (1).jpg',
    cover_consent_verified: true,
    published_at: '2025-04-18',
    read_minutes: 5,
    excerpt: 'Local cooperatives build skills and keep value in the community while meeting quality standards.',
    body_md: `## Why local matters
Women-led cooperatives increase resilience and reduce transport cost and delays.

### Quality-by-design
- Fabric selection and absorbency checks
- Batch records with lot codes
- Visual inspection and random washing tests

## Economic ripple effects
Income, skills and leadership opportunities stay local. Schools gain reliable supply.

## References
- ILO. Cooperatives & local development: https://www.ilo.org/`,
    callout_transparency: 'We publish batch sizes, unit costs and acceptance rates monthly; supplier names are disclosed with consent.',
    related: [
      { title: 'Training day: MHM basics that stick', slug: 'training-day-mhm-basics' },
      { title: 'From absenteeism to attendance', slug: 'from-absenteeism-to-attendance-gitega' }
    ],
    seo_title: 'Women-led cooperatives — quality and dignity',
    seo_description: 'How local production meets standards and builds community resilience.'
  },
  {
    title: 'Training day: MHM basics that stick',
    slug: 'training-day-mhm-basics',
    category: 'insights',
    tags: ['Training','Facilitation','MHM'],
    author: {
      id: 'e4d-ops',
      name: 'E4D Trainers',
      role: 'Facilitation'
    },
  cover_image_url: '/photos/jeune-adulte-deprime-a-la-maison (1).jpg',
    cover_consent_verified: true,
    published_at: '2025-04-10',
    read_minutes: 6,
    excerpt: 'Short, hands-on sessions outperform long lectures. Here is our 45‑minute recipe.',
    body_md: `## Session outline (45 minutes)
1. Icebreaker and myth check (10')
2. Kit demo & safe use (15')
3. Washing & drying practice (10')
4. Pack a spare & privacy routine (5')
5. Questions & handover (5')

### Tips that help retention
- Use real kits and role-play
- Keep language simple; invite questions anonymously
- Repeat handwashing steps out loud

## Follow-up
Teachers receive a 1-pager to run 5-minute refreshers weekly.

## References
- UNESCO. Health education briefs: https://www.unesco.org/`,
    callout_transparency: 'Our public reports show planned sessions vs. delivered, with anonymized attendance counts.',
    related: [
      { title: 'Co-ops at the center: women-led production', slug: 'coops-women-led-production' },
      { title: 'From absenteeism to attendance', slug: 'from-absenteeism-to-attendance' }
    ],
    seo_title: 'MHM training that sticks — a 45‑minute flow',
    seo_description: 'A practical, repeatable session plan that improves retention and comfort.'
  }
];

export function findArticleBySlug(slug: string) {
  return blogArticles.find(a => a.slug === slug);
}

export function listArticleIndex(): { slug: string; title: string; category: string; published_at: string; read_minutes: number; }[] {
  return blogArticles.map(a => ({
    slug: a.slug,
    title: a.title,
    category: a.category,
    published_at: a.published_at,
    read_minutes: a.read_minutes
  }));
}
