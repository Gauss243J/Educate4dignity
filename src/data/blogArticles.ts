import { BlogArticle } from '../types/blog';

// Public, original content for the Blog. Keep concise, cite sources via links, and avoid copying.
export const blogArticles: BlogArticle[] = [
  // Matches admin store seed slug: from-absenteeism-to-attendance
  {
  title: 'From absenteeism to attendance: reusable kits at school',
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
  cover_image_url: '/photos/Dossier/Generated Image October 02, 2025 - 9_15AM.png',
    cover_consent_verified: true,
  published_at: '2024-10-15',
    read_minutes: 6,
    excerpt: 'Amina’s story: a simple reusable kit, practical training, and the missed days stopped.',
  body_md: `In many rural parts of Africa, hardship shows up in the small details of daily life. Water is sometimes far away, school latrines lack privacy, and a family budget can’t always cover disposable pads. In Burundi, one pad often costs the equivalent of a meal. When market prices rise, priorities shift and girls stay home during their periods.

Amina used to miss the first week of every month. She feared stains on her uniform, teasing, and failed quizzes. With each absence, she drifted further to the back of the classroom. Her world was shrinking with the calendar.

The day the school handed out a reusable kit, everything changed. Several washable pads, a breathable pouch, a simple guide for discreet washing and drying. A teacher led a hands‑on session. They talked about hygiene, pain, and planning. Myths gave way to clear, practical steps.

The following month, Amina was in class all week. She raised her hand, rejoined the science club, and went home proud of her grades. The kit eased the family budget, reduced waste, and gave learning time back. It’s a small solution that fits the local reality.

**$25 keeps a girl in school all year.** Your gift funds a durable kit, an education session, and simple follow‑up. You turn a lost week into filled pages, and you support local jobs for the seamstresses who make these kits.
`,
    callout_transparency: 'Photos are illustrative. Attendance insights are aggregated; we do not publish personally identifiable data.',
    related: [
      { title: 'Training day: MHM basics that stick', slug: 'training-day-mhm-basics' },
      { title: '“No more stigma. Just dignity.”', slug: 'coops-women-led-production' }
    ],
    seo_title: 'From absenteeism to attendance — impact notes',
    seo_description: 'Practical MHM training and reusable kits can reduce missed lessons and improve comfort.'
  },


  // New posts (public, original content)
  {
    title: '“No more stigma. Just dignity.”',
    slug: 'coops-women-led-production',
    category: 'impact',
    tags: ['MHM','Displacement','Hygiene corner'],
    author: {
      id: 'esperance',
      name: 'Esperance',
      role: 'Student (DRC)'
    },
  cover_image_url: '/photos/Dossier/Generated Image October 02, 2025 - 8_50AM (1).png',
    cover_consent_verified: true,
  published_at: '2024-04-12',
    read_minutes: 6,
  excerpt: 'In a displacement site near Goma, a simple hygiene corner and a reusable kit brought school and dignity back.',
    body_md: `On the outskirts of Goma, Esperance lives in a displacement site where water arrives in rotations and latrines are shared. When her period starts, she often stays under the tent. She fears leaks, smell, and teasing. The school is close, but dignity feels far away.

One morning, a mobile team sets up a small “hygiene corner” at the school. A bucket with a tap, soap, a line for discreet drying, and above all a reusable kit with a breathable pouch. The session is short and practical. They show how to use, wash, and dry everything discreetly. They also talk about cramps and intimate hygiene without judgment.

The administration reserves a discreet locker and a sign-in log so students can access the hygiene corner without drawing attention. Two peer mentors explain cycle tracking and a few simple ways to manage pain. On Saturdays, a short Swahili radio segment recaps the guidance for those who missed the session.

By the next month, Esperance is back in class all week. She sits closer to the board, joins the debate club, and no longer avoids group work. At home, the household budget eases, there’s less waste, and more peace of mind. She smiles and sums it up in one line: no more shame, just dignity.

Help provide reusable kits, set up a hygiene corner, and deliver education sessions. Each action protects a girl’s schooling in fragile settings and strengthens her knowledge and confidence month after month.
`,
    callout_transparency: 'Context and names adapted for privacy; photos illustrative with consent where shown.',
    related: [
      { title: 'From absenteeism to attendance', slug: 'from-absenteeism-to-attendance' },
      { title: 'Training day: MHM basics that stick', slug: 'training-day-mhm-basics' }
    ],
    seo_title: 'Dignity restored in a displacement setting — Esperance’s story',
    seo_description: 'A hygiene corner, clear guidance, and a reusable kit helped Esperance return to class with confidence.'
  },
  {
    title: '“My daughter now has confidence.”',
    slug: 'training-day-mhm-basics',
    category: 'impact',
    tags: ['Confidence','Parent voice','MHM'],
    author: {
      id: 'grace-parent',
      name: 'Grace',
      role: 'Parent (Rwanda)'
    },
  cover_image_url: '/photos/Dossier/Generated Image October 02, 2025 - 8_39AM.png',
    cover_consent_verified: true,
  published_at: '2023-11-05',
    read_minutes: 6,
  excerpt: 'A mother’s perspective on how a reusable kit and teacher talks restored confidence at home and at school.',
    body_md: `Grace remembers her daughter speaking in a low voice about her period. She avoided sports, asked to go home early, and feared leaks. In the evening, the mother felt powerless. She watched shyness take over and the desire to learn fade.

The reusable kit changed their routine. During a teacher-led session, a nurse explained how to use, wash, and dry everything safely. They covered pain management, how often to change, and how to plan the cycle. Understanding replaced fear.

At home, the pouch now hangs on a discreet hook. Washing fits into the family routine without embarrassment. At school, the girl sits in the front row, takes part in activities, and is back on the sports field. Her look has changed, her back is straight.

Around them, the ripple effect is clear. Neighbors ask questions, classmates share tips, and the teacher reinforces a message of respect. The kit costs less over time and avoids extra waste. Confidence, savings, and the environment advance together.

Your gift funds reusable kits and teacher talks. Give today. Help a mother see her daughter walk with her head held high and stay fully engaged in her studies.
`,
    callout_transparency: 'Photos illustrative; quotes paraphrased with consent when applicable.',
    related: [
      { title: 'From absenteeism to attendance', slug: 'from-absenteeism-to-attendance' },
      { title: '“No more stigma. Just dignity.”', slug: 'coops-women-led-production' }
    ],
    seo_title: 'Parent voice — confidence returns with clear steps',
    seo_description: 'A mother’s story: training and a reusable kit turned fear into confidence at home and in class.'
  }
  ,
  {
    title: 'Local production of reusable kits',
    slug: 'local-production-reusable-kits',
    category: 'impact',
    tags: ['MHM','Kits','Production','Burundi','SaCoDé'],
    author: {
      id: 'e4d-ops',
      name: 'E4D Field Team',
      role: 'Training & Distribution'
    },
    cover_image_url: '/photos/history/JessB2.jpg',
    cover_consent_verified: true,
  published_at: '2025-07-10',
    read_minutes: 5,
    excerpt: 'Women’s cooperatives in Burundi produced washable, reusable kits for 500 students at Lycée Buhiga—supporting income, reducing waste, and enabling education.',
    body_md: `**Partners:** Educate4Dignity (E4D) & SaCoDé • **Location:** Burundi • **Purpose:** Supply for Lycée Buhiga (Commune Karusi, Province Gitega)

Educate4Dignity, the non-profit initiative led by Jessica Luiru (Congolese American, Deerfield Academy, CSGC Prize), works with SaCoDé to address three linked challenges: menstrual education, access to products, and the fight against stigma.

To prepare for the school activity at Lycée Buhiga, women’s cooperatives produced washable, reusable kits for students. Each kit includes reusable pads and a storage pouch, along with simple care instructions.

Production was planned for a target group of 500 students, with batch and crate records to ensure traceability at handover to the school.

This local model fits rural constraints, supports income for seamstresses, offers a more affordable option for families, and reduces waste over time.

Kits were packed and transported to the school in advance of a dedicated education session followed by distribution.`,
    callout_transparency: 'Production details summarized from field planning notes; photos illustrative with partner consent where shown.',
    related: [
      { title: 'From absenteeism to attendance', slug: 'from-absenteeism-to-attendance' },
      { title: '“No more stigma. Just dignity.”', slug: 'coops-women-led-production' }
    ],
    seo_title: 'Local production of reusable kits — Burundi (E4D & SaCoDé)',
    seo_description: 'Women’s cooperatives produced washable kits for 500 students at Lycée Buhiga, with traceability and an education‑first distribution.'
  }
  ,
  {
    title: 'Menstrual health education at Lycée Buhiga',
    slug: 'menstrual-health-education-lycee-buhiga',
    category: 'impact',
    tags: ['MHM','Education','Burundi','Buhiga'],
    author: {
      id: 'jessica-luiru',
      name: 'Jessica Luiru',
      role: 'Lead (Deerfield Academy, CSGC Prize)'
    },
    cover_image_url: '/photos/history/Generated Image October 06, 2025 - 6_38AM.png',
    cover_consent_verified: true,
    published_at: '2025-07-23',
    read_minutes: 5,
    excerpt: 'A school-wide session at Lycée Buhiga brought over 700 students together to learn safe period management, reduce stigma, and restore dignity in class.',
    body_md: `**Lead:** Jessica Luiru (Deerfield Academy, CSGC Prize) • **Date:** 23 July 2025 • **Location:** Commune Karusi, Province Gitega, Burundi

The session gathered more than the 500 invited students, with attendance surpassing 700. It began with a short prayer led by a student, then Jessica introduced herself and the project goals: speak openly about menstruation, explain safe management, and restore dignity for girls at school.

Age-appropriate content covered essentials: what menstruation is, why it matters to talk about it, good hygiene practices, how to use and care for reusable pads, when to change, and basic pain management.

Students listened closely and asked many questions, reflecting a strong need for reliable information in a context where the topic remains taboo.

Teachers and school staff took notes to reinforce messages and practical steps in the weeks that follow.

The aim is clear: pair product access with understanding, reduce period-related absences, and strengthen girls’ confidence in class.`,
    callout_transparency: 'Session details summarized from field notes; photos illustrative with consent where applicable.',
    related: [
      { title: 'From absenteeism to attendance', slug: 'from-absenteeism-to-attendance' },
      { title: 'Local production of reusable kits', slug: 'local-production-reusable-kits' }
    ],
    seo_title: 'MHM education at Lycée Buhiga — field session notes',
    seo_description: '700+ students joined an MHM session at Lycée Buhiga covering safe use of reusable pads, hygiene, and confidence at school.'
  }
  ,
  {
    title: 'Kit distribution and next steps',
    slug: 'kit-distribution-next-steps',
    category: 'impact',
    tags: ['MHM','Distribution','Burundi','Buhiga','SaCoDé'],
    author: {
      id: 'e4d-ops',
      name: 'E4D Field Team',
      role: 'Training & Distribution'
    },
    cover_image_url: '/photos/kit/B13.jpg',
    cover_consent_verified: true,
    published_at: '2025-07-23',
    read_minutes: 5,
    excerpt: 'After the education session at Lycée Buhiga, distribution reached nearly 500 girls, with strong engagement and a clear path for sustained support.',
    body_md: `Program: Educate4Dignity (E4D) • Partner: SaCoDé
Site: Lycée Buhiga (Karusi, Gitega) • Date: 23 July 2025

Distribution followed the education session. Although 500 students were invited, more than 700 attended, showing high need and interest. The handover took longer than planned to orient each student on use and care.

During the event, a student expressed sincere gratitude not only for receiving pads but also for the essential education provided. Feedback from the school highlights increased confidence and clearer understanding of safe practices.

The intervention brought dignity to nearly 500 girls aged roughly 11 to 21. Beyond access to products, the focus is continued schooling, prevention of early pregnancies, and breaking cycles of poverty that widen gender gaps.

E4D and SaCoDé will build on this momentum to reach more remote villages, working with local leaders and within traditional values so that solutions are owned by the communities they serve.

This is a starting point, not an endpoint: sustain education, maintain a supply of reusable kits, and support schools to push back the taboo month after month.`,
    callout_transparency: 'Distribution details summarized from partner reports; photos illustrative with consent where applicable.',
    related: [
      { title: 'Local production of reusable kits', slug: 'local-production-reusable-kits' },
      { title: 'Menstrual health education at Lycée Buhiga', slug: 'menstrual-health-education-lycee-buhiga' }
    ],
    seo_title: 'Kit distribution and next steps — Lycée Buhiga',
    seo_description: 'Distribution at Lycée Buhiga followed a school-wide MHM session, reaching nearly 500 girls with guidance and reusable kits.'
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
