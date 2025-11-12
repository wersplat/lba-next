'use client'

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { playersApi } from '@/services/players';
import PlayerHeader from '@/components/player-profile/PlayerHeader';
import DraftCombineOverview from '@/components/player-profile/DraftCombineOverview';
import SeasonPerformance from '@/components/player-profile/SeasonPerformance';
import CareerTimeline from '@/components/player-profile/CareerTimeline';
import AchievementsBadges from '@/components/player-profile/AchievementsBadges';
import MediaHighlights from '@/components/player-profile/MediaHighlights';
import Tabs, { type TabItem } from '@/components/Tabs';

export default function PlayerProfilePage() {
  const params = useParams();
  const playerId = params?.playerId as string;

  const { data: player, isLoading, error } = useQuery({
    queryKey: ['player-profile', playerId],
    queryFn: () => playersApi.getPlayerProfile(playerId),
    enabled: !!playerId,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-legends-purple-500"></div>
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-theme-primary">Player not found</h3>
        <p className="mt-2 text-sm text-theme-muted">
          The requested player could not be found.
        </p>
      </div>
    );
  }

  const tabItems: TabItem[] = [
    {
      id: 'draft-combine',
      label: 'Draft & Combine',
      content: <DraftCombineOverview player={player} />,
    },
    {
      id: 'season-performance',
      label: 'Season Performance',
      content: <SeasonPerformance player={player} />,
    },
    {
      id: 'career-timeline',
      label: 'Career Timeline',
      content: <CareerTimeline player={player} />,
    },
    {
      id: 'achievements',
      label: 'Achievements',
      content: <AchievementsBadges player={player} />,
    },
    {
      id: 'media',
      label: 'Media & Highlights',
      content: <MediaHighlights player={player} />,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Player Header - Always visible */}
      <PlayerHeader player={player} />

      {/* Tabbed Sections */}
      <Tabs items={tabItems} defaultIndex={0} />
    </div>
  );
}

