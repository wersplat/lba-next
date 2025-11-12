'use client'

import type { PlayerProfile } from '@/services/players';
import Card from '@/components/Card';

interface AchievementsBadgesProps {
  player: PlayerProfile;
}

function getTierColor(tier: string) {
  const colors: Record<string, string> = {
    bronze: 'bg-yellow-600 dark:bg-yellow-700',
    silver: 'bg-gray-400 dark:bg-gray-500',
    gold: 'bg-yellow-500 dark:bg-yellow-600',
    platinum: 'bg-blue-500 dark:bg-blue-600',
    diamond: 'bg-purple-500 dark:bg-purple-600',
  };
  return colors[tier.toLowerCase()] || 'bg-gray-500 dark:bg-gray-600';
}

export default function AchievementsBadges({ player }: AchievementsBadgesProps) {
  // Calculate milestones from stats
  const milestones = [];
  
  if (player.ppg && player.games_played) {
    const totalPoints = player.ppg * player.games_played;
    if (totalPoints >= 1000) {
      milestones.push({
        title: '1K Points Club',
        description: `Scored ${Math.floor(totalPoints)} career points`,
        tier: 'gold',
      });
    } else {
      const pointsToNext = 1000 - totalPoints;
      milestones.push({
        title: '1K Points Club',
        description: `${Math.ceil(pointsToNext)} points to next milestone`,
        tier: 'bronze',
        progress: (totalPoints / 1000) * 100,
      });
    }
  }
  
  if (player.apg && player.games_played) {
    const totalAssists = player.apg * player.games_played;
    if (totalAssists >= 250) {
      milestones.push({
        title: '250 Assists Club',
        description: `Recorded ${Math.floor(totalAssists)} career assists`,
        tier: 'gold',
      });
    } else {
      const assistsToNext = 250 - totalAssists;
      milestones.push({
        title: '250 Assists Club',
        description: `${Math.ceil(assistsToNext)} assists to next milestone`,
        tier: 'bronze',
        progress: (totalAssists / 250) * 100,
      });
    }
  }
  
  return (
    <div className="space-y-6">
      {/* Awards */}
      <Card>
        <h3 className="text-lg font-medium text-theme-primary mb-4">Awards & Achievements</h3>
        {player.awards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {player.awards.map((award) => (
              <div
                key={award.id}
                className="relative overflow-hidden rounded-lg border border-theme bg-theme-primary p-4 hover:shadow-lg transition-shadow"
              >
                {award.asset_png_url || award.asset_svg_url ? (
                  <div className="mb-3 flex justify-center">
                    <img
                      src={award.asset_png_url || award.asset_svg_url || ''}
                      alt={award.title}
                      className="h-16 w-16 object-contain"
                    />
                  </div>
                ) : (
                  <div className={`mb-3 mx-auto h-16 w-16 rounded-full ${getTierColor(award.tier)} flex items-center justify-center`}>
                    <span className="text-2xl font-bold text-white">🏆</span>
                  </div>
                )}
                <h4 className="text-sm font-semibold text-theme-primary mb-1">
                  {award.title}
                </h4>
                <p className="text-xs text-theme-muted capitalize mb-2">
                  {award.tier} Tier
                </p>
                <p className="text-xs text-theme-muted">
                  {new Date(award.awarded_at).toLocaleDateString()}
                </p>
                {award.nft_mint_id && (
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                      NFT
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-theme-muted">No awards yet</p>
          </div>
        )}
      </Card>
      
      {/* Milestones */}
      {milestones.length > 0 && (
        <Card>
          <h3 className="text-lg font-medium text-theme-primary mb-4">Career Milestones</h3>
          <div className="space-y-4">
            {milestones.map((milestone, idx) => (
              <div key={idx} className="p-4 bg-theme-tertiary rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-theme-primary">
                    {milestone.title}
                  </h4>
                  {milestone.progress !== undefined && (
                    <span className="text-xs text-theme-muted">
                      {milestone.progress.toFixed(0)}%
                    </span>
                  )}
                </div>
                <p className="text-sm text-theme-secondary mb-2">
                  {milestone.description}
                </p>
                {milestone.progress !== undefined && (
                  <div className="w-full bg-theme-border rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getTierColor(milestone.tier)}`}
                      style={{ width: `${Math.min(100, milestone.progress)}%` }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

