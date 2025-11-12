'use client'

import type { PlayerProfile } from '@/services/players';
import Card from '@/components/Card';

interface CareerTimelineProps {
  player: PlayerProfile;
}

export default function CareerTimeline({ player }: CareerTimelineProps) {
  // Build timeline events
  const timelineEvents: Array<{
    date: string;
    type: 'draft' | 'team' | 'award' | 'milestone';
    title: string;
    description: string;
    teamName?: string | null;
  }> = [];
  
  // Add draft events
  player.draftPicks.forEach((pick) => {
    timelineEvents.push({
      date: pick.created_at || new Date().toISOString(),
      type: 'draft',
      title: `Drafted #${pick.pick_number}`,
      description: pick.team_name ? `Selected by ${pick.team_name}` : 'Drafted',
      teamName: pick.team_name,
    });
  });
  
  // Add award events
  player.awards.slice(0, 10).forEach((award) => {
    timelineEvents.push({
      date: award.awarded_at,
      type: 'award',
      title: award.title,
      description: `${award.tier} tier award`,
    });
  });
  
  // Add regular team history events
  player.teamHistory.forEach((team) => {
    if (team.joined_at) {
      timelineEvents.push({
        date: team.joined_at,
        type: 'team',
        title: `Joined ${team.team_name || 'Team'}`,
        description: 'Team roster change',
        teamName: team.team_name,
      });
    }
  });
  
  // Add LBA team history events
  if (player.lbaTeamHistory) {
    player.lbaTeamHistory.forEach((team) => {
      if (team.joined_at) {
        timelineEvents.push({
          date: team.joined_at,
          type: 'team',
          title: `Joined LBA ${team.team_name || 'Team'}`,
          description: 'LBA team roster change',
          teamName: team.team_name,
        });
      }
    });
  }
  
  // Sort by date (newest first)
  timelineEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'draft':
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-legends-purple-100 dark:bg-legends-purple-900">
            <svg className="h-6 w-6 text-legends-purple-600 dark:text-legends-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        );
      case 'award':
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900">
            <svg className="h-6 w-6 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
        );
      case 'team':
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
            <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-theme-tertiary">
            <svg className="h-6 w-6 text-theme-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        );
    }
  };
  
  return (
    <Card>
      <h3 className="text-lg font-medium text-theme-primary mb-6">Career Timeline</h3>
      
      {timelineEvents.length > 0 ? (
        <div className="flow-root">
          <ul className="-mb-8">
            {timelineEvents.map((event, eventIdx) => {
              const date = new Date(event.date);
              const formattedDate = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              });
              
              return (
                <li key={eventIdx}>
                  <div className="relative pb-8">
                    {eventIdx !== timelineEvents.length - 1 && (
                      <span
                        className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-theme-border"
                        aria-hidden="true"
                      />
                    )}
                    <div className="relative flex items-start space-x-3">
                      <div className="relative">
                        {getEventIcon(event.type)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div>
                          <div className="text-sm">
                            <span className="font-medium text-theme-primary">{event.title}</span>
                          </div>
                          <p className="mt-0.5 text-sm text-theme-muted">{formattedDate}</p>
                        </div>
                        <div className="mt-2 text-sm text-theme-secondary">
                          <p>{event.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-theme-muted">No timeline events available</p>
        </div>
      )}
      
              {/* LBA Team History */}
              {player.lbaTeamHistory && player.lbaTeamHistory.length > 0 && (
                <div className="mt-8 pt-8 border-t border-theme">
                  <h4 className="text-md font-medium text-theme-primary mb-4">LBA Team History</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {player.lbaTeamHistory.map((team, idx) => (
                      <div
                        key={idx}
                        className="flex items-center space-x-3 p-3 bg-theme-tertiary rounded-lg"
                      >
                        {team.team_logo ? (
                          <img
                            src={team.team_logo}
                            alt={team.team_name || 'Team'}
                            className="h-10 w-10 rounded-full"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-theme-border flex items-center justify-center text-sm font-bold text-theme-secondary">
                            {team.team_name?.charAt(0) || '?'}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-theme-primary">
                            {team.team_name || 'Unknown Team'}
                          </p>
                          {team.joined_at && (
                            <p className="text-xs text-theme-muted">
                              {new Date(team.joined_at).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Regular Team History */}
              {player.teamHistory.length > 0 && (
                <div className="mt-8 pt-8 border-t border-theme">
                  <h4 className="text-md font-medium text-theme-primary mb-4">Team History</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {player.teamHistory.map((team, idx) => (
                      <div
                        key={idx}
                        className="flex items-center space-x-3 p-3 bg-theme-tertiary rounded-lg"
                      >
                        {team.team_logo ? (
                          <img
                            src={team.team_logo}
                            alt={team.team_name || 'Team'}
                            className="h-10 w-10 rounded-full"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-theme-border flex items-center justify-center text-sm font-bold text-theme-secondary">
                            {team.team_name?.charAt(0) || '?'}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-theme-primary">
                            {team.team_name || 'Unknown Team'}
                          </p>
                          {team.joined_at && (
                            <p className="text-xs text-theme-muted">
                              {new Date(team.joined_at).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
    </Card>
  );
}

