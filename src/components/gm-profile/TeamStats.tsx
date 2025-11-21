'use client'

import type { GMProfile } from '@/services/gm';
import Card from '@/components/Card';

interface TeamStatsProps {
  gm: GMProfile;
}

export default function TeamStats({ gm }: TeamStatsProps) {
  const totalGames = gm.total_wins + gm.total_losses;
  const winPercentage = totalGames > 0
    ? ((gm.total_wins / totalGames) * 100).toFixed(1)
    : '0.0';

  const stats = [
    {
      label: 'Total Wins',
      value: gm.total_wins,
      color: 'text-green-600 dark:text-green-400',
    },
    {
      label: 'Total Losses',
      value: gm.total_losses,
      color: 'text-red-600 dark:text-red-400',
    },
    {
      label: 'Win Percentage',
      value: `${winPercentage}%`,
      color: 'text-theme-primary',
    },
    {
      label: 'Championships',
      value: gm.championships,
      color: 'text-yellow-600 dark:text-yellow-500',
      highlight: gm.championships > 0,
    },
    {
      label: 'Playoff Appearances',
      value: gm.playoff_appearances,
      color: 'text-theme-primary',
    },
    {
      label: 'Division Titles',
      value: gm.division_titles,
      color: 'text-legends-purple-600 dark:text-legends-purple-400',
    },
    {
      label: 'Conference Titles',
      value: gm.conference_titles,
      color: 'text-legends-purple-600 dark:text-legends-purple-400',
    },
  ];

  return (
    <Card>
      <h3 className="text-lg font-medium text-theme-primary mb-6">Team Statistics</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`text-center p-4 rounded-lg ${
              stat.highlight
                ? 'bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-500 dark:border-yellow-600'
                : 'bg-theme-tertiary border border-theme-border'
            }`}
          >
            <div className={`text-3xl font-bold mb-1 ${stat.color}`}>
              {stat.value}
            </div>
            <div className="text-xs font-medium text-theme-muted">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Record Summary */}
      {totalGames > 0 && (
        <div className="mt-6 pt-6 border-t border-theme-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-theme-primary">Overall Record</span>
            <span className="text-sm font-semibold text-theme-primary">
              {gm.total_wins}-{gm.total_losses}
            </span>
          </div>
          <div className="w-full bg-theme-border rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500"
              style={{ width: `${winPercentage}%` }}
            />
          </div>
          <div className="flex justify-between mt-1 text-xs text-theme-muted">
            <span>Wins: {gm.total_wins}</span>
            <span>Losses: {gm.total_losses}</span>
          </div>
        </div>
      )}
    </Card>
  );
}

