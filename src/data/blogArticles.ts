import { BlogArticle } from '../types/blog';

// Minimal mock dataset (can be replaced by API fetch later)
export const blogArticles: BlogArticle[] = [
  {
    title: 'From absenteeism to attendance: what changed in Gitega',
    slug: 'from-absenteeism-to-attendance-gitega',
    category: 'Case Study',
    tags: ['MHM','Transparency','Gitega'],
    author: {
      id: 'sacode-team',
      name: 'SaCoDé Team',
      role: 'Training & Field',
      avatar_url: '/img/authors/sacode.jpg',
      bio: 'Women-led cooperative delivering training and distribution across Burundi.'
    },
    cover_image_url: '/img/blog/gitega-cover.jpg',
    cover_consent_verified: true,
    published_at: '2025-05-12',
    read_minutes: 6,
    excerpt: 'After kit distribution and MHM sessions, attendance among senior girls rose measurably…',
    body_md: `## Context\nGirls in Gitega missed classes due to lack of menstrual materials...\n\n### What changed\nDistribution of reusable kits and structured MHM sessions...\n\n> "Biology should never determine destiny."\n\n![Attendance trend](/img/blog/attendance-trend.png "caption: months before & after")\n\n## Outcomes\nAttendance up, reported discomfort down, peer-led teaching emerging.\n`,
    callout_transparency: 'Public dashboards show planned vs. collected vs. spent, with anonymized proofs and monthly updates.',
    related: [
      { title: 'Traceability in practice', slug: 'traceability-practice' },
      { title: 'Training day: MHM basics', slug: 'training-day-mhm' }
    ],
    seo_title: 'Attendance improved in Gitega — Case Study',
    seo_description: 'How locally-made kits and MHM sessions increased attendance while keeping transparency simple.'
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
