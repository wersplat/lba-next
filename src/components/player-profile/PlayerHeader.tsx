'use client'

import type { PlayerProfile } from '@/services/players';
import Image from 'next/image';
import Tooltip from '@/components/Tooltip';

interface PlayerHeaderProps {
  player: PlayerProfile;
}

function getStatusBadge(
  status: 'drafted' | 'free-agent' | 'draft-eligible' | 'inactive',
  draftPoolStatus: PlayerProfile['draftPoolStatus']
) {
  // If player has draft pool status, use that for eligibility display
  if (draftPoolStatus?.is_eligible) {
    if (draftPoolStatus.eligibility_reason === 'status' || draftPoolStatus.eligibility_reason === 'both') {
      return {
        label: 'Eligible (Status)',
        className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        tooltip: draftPoolStatus.eligibility_reason === 'both'
          ? 'Player is eligible for the draft because they are marked as eligible AND have 5+ combine games played.'
          : 'Player is eligible for the draft because they are marked as eligible in the draft pool.',
      };
    } else if (draftPoolStatus.eligibility_reason === 'combine_games') {
      return {
        label: 'Eligible (5+ Games)',
        className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        tooltip: `Player is eligible for the draft because they have played ${draftPoolStatus.combine_games} combine games (5+ required).`,
      };
    }
  }
  
  // If player has draft pool status but not eligible, show draft pool status
  if (draftPoolStatus) {
    const statusLower = draftPoolStatus.status?.toLowerCase();
    if (!draftPoolStatus.status || statusLower === 'available') {
      return {
        label: 'Available',
        className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        tooltip: draftPoolStatus.combine_games > 0
          ? `Player is available in the draft pool. They have played ${draftPoolStatus.combine_games} combine game${draftPoolStatus.combine_games !== 1 ? 's' : ''} but need 5+ games or eligible status to be draft eligible.`
          : 'Player is available in the draft pool. They need 5+ combine games or eligible status to be draft eligible.',
      };
    } else if (statusLower === 'assigned') {
      return {
        label: 'Assigned',
        className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
        tooltip: 'Player has been assigned to a team and is no longer available in the draft pool.',
      };
    } else {
      return {
        label: draftPoolStatus.status,
        className: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
        tooltip: `Player status in draft pool: ${draftPoolStatus.status}.`,
      };
    }
  }
  
  // Fallback to original status logic
  const badges = {
    drafted: {
      label: 'Drafted',
      className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      tooltip: 'Player has been drafted to a team.',
    },
    'free-agent': {
      label: 'Free Agent',
      className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      tooltip: 'Player is a free agent and not currently on a team.',
    },
    'draft-eligible': {
      label: 'Draft Eligible',
      className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      tooltip: 'Player is eligible for the draft.',
    },
    inactive: {
      label: 'Inactive',
      className: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      tooltip: 'Player status is inactive.',
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
  // Determine player status (fallback if no draft pool status)
  const status: 'drafted' | 'free-agent' | 'draft-eligible' | 'inactive' = player.draftPicks.length > 0
    ? 'drafted'
    : player.currentTeamName
    ? 'free-agent'
    : 'draft-eligible';
  
  const statusBadge = getStatusBadge(status, player.draftPoolStatus);
  
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
                <Tooltip content={statusBadge.tooltip || ''}>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium cursor-help ${statusBadge.className}`}>
                    {statusBadge.label}
                  </span>
                </Tooltip>
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
              
              {player.draftPoolStatus && player.draftPoolStatus.combine_games > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-theme-muted">
                    Combine Games:
                  </span>
                  <span className="text-sm font-semibold text-theme-primary">
                    {player.draftPoolStatus.combine_games}
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
          <div className="w-full sm:w-auto sm:min-w-[200px] space-y-4">
            {/* League Stats */}
            {(player.leagueStats.ppg !== null || player.leagueStats.apg !== null || player.leagueStats.rpg !== null || player.leagueStats.games_played > 0) && (
              <div>
                <div className="text-xs font-semibold text-theme-muted mb-2 text-center sm:text-right">League Stats</div>
                <div className="grid grid-cols-2 sm:grid-cols-1 gap-2">
                  {player.leagueStats.ppg !== null && (
                    <div className="text-center sm:text-right">
                      <div className="text-xl font-bold text-theme-primary">{player.leagueStats.ppg.toFixed(1)}</div>
                      <div className="text-xs text-theme-muted">PPG</div>
                    </div>
                  )}
                  {player.leagueStats.apg !== null && (
                    <div className="text-center sm:text-right">
                      <div className="text-xl font-bold text-theme-primary">{player.leagueStats.apg.toFixed(1)}</div>
                      <div className="text-xs text-theme-muted">APG</div>
                    </div>
                  )}
                  {player.leagueStats.rpg !== null && (
                    <div className="text-center sm:text-right">
                      <div className="text-xl font-bold text-theme-primary">{player.leagueStats.rpg.toFixed(1)}</div>
                      <div className="text-xs text-theme-muted">RPG</div>
                    </div>
                  )}
                  {player.leagueStats.games_played > 0 && (
                    <div className="text-center sm:text-right">
                      <div className="text-xl font-bold text-theme-primary">{player.leagueStats.games_played}</div>
                      <div className="text-xs text-theme-muted">Games</div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Outside League Stats */}
            {(player.outsideLeagueStats.ppg !== null || player.outsideLeagueStats.apg !== null || player.outsideLeagueStats.rpg !== null || player.outsideLeagueStats.games_played > 0) && (
              <div>
                <div className="text-xs font-semibold text-theme-muted mb-2 text-center sm:text-right">Other League Stats</div>
                <div className="grid grid-cols-2 sm:grid-cols-1 gap-2">
                  {player.outsideLeagueStats.ppg !== null && (
                    <div className="text-center sm:text-right">
                      <div className="text-xl font-bold text-theme-primary">{player.outsideLeagueStats.ppg.toFixed(1)}</div>
                      <div className="text-xs text-theme-muted">PPG</div>
                    </div>
                  )}
                  {player.outsideLeagueStats.apg !== null && (
                    <div className="text-center sm:text-right">
                      <div className="text-xl font-bold text-theme-primary">{player.outsideLeagueStats.apg.toFixed(1)}</div>
                      <div className="text-xs text-theme-muted">APG</div>
                    </div>
                  )}
                  {player.outsideLeagueStats.rpg !== null && (
                    <div className="text-center sm:text-right">
                      <div className="text-xl font-bold text-theme-primary">{player.outsideLeagueStats.rpg.toFixed(1)}</div>
                      <div className="text-xs text-theme-muted">RPG</div>
                    </div>
                  )}
                  {player.outsideLeagueStats.games_played > 0 && (
                    <div className="text-center sm:text-right">
                      <div className="text-xl font-bold text-theme-primary">{player.outsideLeagueStats.games_played}</div>
                      <div className="text-xs text-theme-muted">Games</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

