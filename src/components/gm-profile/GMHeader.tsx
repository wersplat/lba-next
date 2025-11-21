'use client'

import type { GMProfile } from '@/services/gm';
import Image from 'next/image';
import Link from 'next/link';

interface GMHeaderProps {
  gm: GMProfile;
}

function getAvatarUrl(twitter: string | null, twitch: string | null): string | null {
  // Priority: Twitter first, then Twitch
  if (twitter) {
    return `https://unavatar.io/x/${twitter}`;
  }
  if (twitch) {
    return `https://unavatar.io/twitch/${twitch}`;
  }
  return null;
}

export default function GMHeader({ gm }: GMHeaderProps) {
  const avatarUrl = getAvatarUrl(gm.twitter, gm.twitch);
  const displayName = gm.player?.gamertag || gm.discord_username || 'General Manager';
  const winPercentage = gm.total_wins + gm.total_losses > 0
    ? ((gm.total_wins / (gm.total_wins + gm.total_losses)) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="bg-theme-primary shadow rounded-lg overflow-hidden">
      <div className="px-6 py-8 sm:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={`${displayName} avatar`}
                width={128}
                height={128}
                className="h-32 w-32 rounded-full object-cover"
                unoptimized
              />
            ) : (
              <div className="h-32 w-32 rounded-full bg-gradient-to-br from-legends-purple-500 to-legends-red-500 flex items-center justify-center text-4xl font-bold text-white">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          
          {/* GM Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-3xl font-bold text-theme-primary truncate">
                {displayName}
              </h1>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-legends-purple-100 text-legends-purple-800 dark:bg-legends-purple-900 dark:text-legends-purple-200">
                General Manager
              </span>
            </div>
            
            {gm.player && (
              <div className="mb-2">
                <Link 
                  href={`/player/${gm.player.id}`}
                  className="text-lg text-theme-secondary hover:text-legends-purple-600 dark:hover:text-legends-purple-400 transition-colors"
                >
                  {gm.player.gamertag}
                  {gm.player.position && ` • ${gm.player.position}`}
                </Link>
              </div>
            )}
            
            <div className="flex flex-wrap items-center gap-3 mt-3">
              {gm.team && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-theme-muted">Team:</span>
                  {gm.team.team_logo ? (
                    <div className="flex items-center space-x-2">
                      <img 
                        src={gm.team.team_logo} 
                        alt={gm.team.team_name}
                        className="h-6 w-6 rounded-full object-cover"
                      />
                      <Link 
                        href={`/teams/${gm.team.id}`}
                        className="text-sm font-semibold text-theme-primary hover:text-legends-purple-600 dark:hover:text-legends-purple-400 transition-colors"
                      >
                        {gm.team.team_name}
                      </Link>
                    </div>
                  ) : (
                    <Link 
                      href={`/teams/${gm.team.id}`}
                      className="text-sm font-semibold text-theme-primary hover:text-legends-purple-600 dark:hover:text-legends-purple-400 transition-colors"
                    >
                      {gm.team.team_name}
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Stats Summary */}
          <div className="w-full sm:w-auto sm:min-w-[200px] grid grid-cols-2 sm:grid-cols-1 gap-4 sm:gap-2">
            <div className="text-center sm:text-right">
              <div className="text-2xl font-bold text-theme-primary">
                {gm.total_wins}-{gm.total_losses}
              </div>
              <div className="text-xs text-theme-muted">Record</div>
            </div>
            <div className="text-center sm:text-right">
              <div className="text-2xl font-bold text-theme-primary">{winPercentage}%</div>
              <div className="text-xs text-theme-muted">Win %</div>
            </div>
            {gm.championships > 0 && (
              <div className="text-center sm:text-right">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-500">
                  {gm.championships}
                </div>
                <div className="text-xs text-theme-muted">Championships</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

