import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';
import { TABLES } from '@/shared/constants/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://proq-noti.vercel.app';

  // Static routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5
    }
  ];

  // Dynamic routes (Teams)
  try {
    // Use public client without cookies for static generation
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data: teams } = await supabase.from(TABLES.TEAMS).select('name');

    if (teams) {
      const teamRoutes = teams.map((team: any) => ({
        url: `${baseUrl}/subscribe/${encodeURIComponent(team.name)}`,
        lastModified: new Date(),
        changeFrequency: 'hourly' as const,
        priority: 0.8
      }));
      routes.push(...teamRoutes);
    }
  } catch (error) {
    console.error('Sitemap generation error:', error);
  }

  return routes;
}
