'use client'

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { gmApi } from '@/services/gm';
import GMHeader from '@/components/gm-profile/GMHeader';
import SocialConnections from '@/components/gm-profile/SocialConnections';
import Past2KExperience from '@/components/gm-profile/Past2KExperience';
import GMAccolades from '@/components/gm-profile/GMAccolades';
import TeamStats from '@/components/gm-profile/TeamStats';
import Tabs, { type TabItem } from '@/components/Tabs';

export default function GMProfilePage() {
  const params = useParams();
  const gmId = params?.gmId as string;

  const { data: gm, isLoading, error } = useQuery({
    queryKey: ['gm-profile', gmId],
    queryFn: () => gmApi.getById(gmId),
    enabled: !!gmId,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-legends-purple-500"></div>
      </div>
    );
  }

  if (error || !gm) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-theme-primary">General Manager not found</h3>
        <p className="mt-2 text-sm text-theme-muted">
          The requested general manager could not be found.
        </p>
      </div>
    );
  }

  const tabItems: TabItem[] = [
    {
      id: 'social',
      label: 'Social Connections',
      content: <SocialConnections gm={gm} />,
    },
    {
      id: 'experience',
      label: 'Past 2K Experience',
      content: <Past2KExperience gm={gm} />,
    },
    {
      id: 'accolades',
      label: 'Accolades',
      content: <GMAccolades gm={gm} />,
    },
    {
      id: 'team-stats',
      label: 'Team Stats',
      content: <TeamStats gm={gm} />,
    },
  ];

  return (
    <div className="space-y-8">
      {/* GM Header - Always visible */}
      <GMHeader gm={gm} />

      {/* Tabbed Sections */}
      <Tabs items={tabItems} defaultIndex={0} />
    </div>
  );
}

