'use client'

import type { PlayerProfile } from '@/services/players';
import Image from 'next/image';

interface PlayerHeaderProps {
  player: PlayerProfile;
}

function getStatusBadge(status: 'drafted' | 'free-agent' | 'draft-eligible' | 'inactive') {
  const badges = {
    drafted: {
      label: 'Drafted',
      className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    },
    'free-agent': {
      label: 'Free Agent',
      className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    },
    'draft-eligible': {
      label: 'Draft Eligible',
      className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    },
    inactive: {
      label: 'Inactive',
      className: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    },
  };
  return badges[status] || badges.inactive;
}

function getPositionBadge(position: string | null) {
  if (!position) return null;
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-legends-purple-100 text-legends-purple-800 dark:bg-legends-purple-900 dark:text-legends-purple-200">
      {position}
    </span>
  );
}

function getAvatarUrl(twitterId: string | null, twitch: string | null): string | null {
  // Priority: Twitter first, then Twitch
  if (twitterId) {
    return `https://unavatar.io/x/${twitterId}`;
  }
  if (twitch) {
    return `https://unavatar.io/twitch/${twitch}`;
  }
  return null;
}

export default function PlayerHeader({ player }: PlayerHeaderProps) {
  // Determine player status
  const status: 'drafted' | 'free-agent' | 'draft-eligible' | 'inactive' = player.draftPicks.length > 0
    ? 'drafted'
    : player.currentTeamName
    ? 'free-agent'
    : 'draft-eligible';
  
  const statusBadge = getStatusBadge(status);
  
  // Calculate overall rating (combine performance_score and player_rank_score)
  const overallRating = player.performance_score || player.player_rank_score || null;
  
  // Get avatar URL: Twitter first, then Twitch, then fallback to initials
  const avatarUrl = getAvatarUrl(player.twitter_id, player.twitch);
  
  return (
    <div className="bg-theme-primary shadow rounded-lg overflow-hidden">
      <div className="px-6 py-8 sm:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={`${player.gamertag} avatar`}
                width={128}
                height={128}
                className="h-32 w-32 rounded-full object-cover"
                unoptimized
              />
            ) : (
              <div className="h-32 w-32 rounded-full bg-gradient-to-br from-legends-purple-500 to-legends-red-500 flex items-center justify-center text-4xl font-bold text-white">
                {player.gamertag.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          
          {/* Player Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-3xl font-bold text-theme-primary truncate">
                {player.gamertag}
              </h1>
              {statusBadge && (
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusBadge.className}`}>
                  {statusBadge.label}
                </span>
              )}
            </div>
            
            {player.alternate_gamertag && (
              <p className="text-lg text-theme-secondary mb-2">
                {player.alternate_gamertag}
              </p>
            )}
            
            <div className="flex flex-wrap items-center gap-3 mt-3">
              {getPositionBadge(player.position)}
              
              {overallRating && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-theme-muted">
                    Overall:
                  </span>
                  <span className="text-lg font-bold text-legends-purple-600 dark:text-legends-purple-400">
                    {Math.round(overallRating)}
                  </span>
                </div>
              )}
              
              {player.currentTeamName && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-theme-muted">
                    Team:
                  </span>
                  <span className="text-sm font-semibold text-theme-primary">
                    {player.currentTeamName}
                  </span>
                </div>
              )}
            </div>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              {player.salary_tier && (
                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-theme-tertiary text-theme-secondary">
                  {player.salary_tier}
                </span>
              )}
              {player.is_rookie && (
                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  Rookie
                </span>
              )}
              {player.crewName && (
                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-legends-red-100 text-legends-red-800 dark:bg-legends-red-900 dark:text-legends-red-200">
                  {player.crewName}
                </span>
              )}
            </div>
          </div>
          
          {/* Stats Summary */}
          <div className="w-full sm:w-auto sm:min-w-[200px] grid grid-cols-2 sm:grid-cols-1 gap-4 sm:gap-2">
            {player.ppg !== null && (
              <div className="text-center sm:text-right">
                <div className="text-2xl font-bold text-theme-primary">{player.ppg.toFixed(1)}</div>
                <div className="text-xs text-theme-muted">PPG</div>
              </div>
            )}
            {player.apg !== null && (
              <div className="text-center sm:text-right">
                <div className="text-2xl font-bold text-theme-primary">{player.apg.toFixed(1)}</div>
                <div className="text-xs text-theme-muted">APG</div>
              </div>
            )}
            {player.rpg !== null && (
              <div className="text-center sm:text-right">
                <div className="text-2xl font-bold text-theme-primary">{player.rpg.toFixed(1)}</div>
                <div className="text-xs text-theme-muted">RPG</div>
              </div>
            )}
            {player.games_played !== null && (
              <div className="text-center sm:text-right">
                <div className="text-2xl font-bold text-theme-primary">{player.games_played}</div>
                <div className="text-xs text-theme-muted">Games</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

