'use client'

import type { PlayerProfile } from '@/services/players';
import StatChart from './StatChart';
import Card from '@/components/Card';

interface DraftCombineOverviewProps {
  player: PlayerProfile;
}

// Placeholder combine data - replace with actual data when available
const getCombineData = (player: PlayerProfile) => {
  // Mock combine stats based on current stats
  return {
    ppg: player.ppg || 0,
    apg: player.apg || 0,
    rpg: player.rpg || 0,
    fgPercentage: player.recentGames.length > 0
      ? player.recentGames.reduce((acc, game) => {
          const fg = game.fgm && game.fga ? (game.fgm / game.fga) * 100 : 0;
          return acc + fg;
        }, 0) / player.recentGames.length
      : 0,
    threePointPercentage: player.recentGames.length > 0
      ? player.recentGames.reduce((acc, game) => {
          const tp = game.three_points_made && game.three_points_attempted
            ? (game.three_points_made / game.three_points_attempted) * 100
            : 0;
          return acc + tp;
        }, 0) / player.recentGames.length
      : 0,
  };
};

// Mock combine rating trend data
const getCombineRatingTrend = () => {
  return [
    { week: 'Week 1', rating: 72 },
    { week: 'Week 2', rating: 75 },
    { week: 'Week 3', rating: 78 },
    { week: 'Week 4', rating: 80 },
    { week: 'Week 5', rating: 82 },
    { week: 'Week 6', rating: 85 },
  ];
};

export default function DraftCombineOverview({ player }: DraftCombineOverviewProps) {
  const combineData = getCombineData(player);
  const ratingTrend = getCombineRatingTrend();
  const latestDraft = player.draftPicks.length > 0 ? player.draftPicks[0] : null;
  
  return (
    <div className="space-y-6">
      {/* Draft Details */}
      {latestDraft && (
        <Card>
          <h3 className="text-lg font-medium text-theme-primary mb-4">Draft Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-theme-muted">Pick Number</span>
              <p className="text-2xl font-bold text-theme-primary">#{latestDraft.pick_number}</p>
            </div>
            {latestDraft.team_name && (
              <div>
                <span className="text-sm font-medium text-theme-muted">Drafted By</span>
                <p className="text-lg font-semibold text-theme-primary">{latestDraft.team_name}</p>
              </div>
            )}
            {player.salary_tier && (
              <div>
                <span className="text-sm font-medium text-theme-muted">Contract Type</span>
                <p className="text-lg font-semibold text-theme-primary capitalize">{player.salary_tier}</p>
              </div>
            )}
          </div>
        </Card>
      )}
      
      {/* Combine Results */}
      <Card>
        <h3 className="text-lg font-medium text-theme-primary mb-4">Combine Results</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-legends-purple-600 dark:text-legends-purple-400">
              {combineData.ppg.toFixed(1)}
            </div>
            <div className="text-sm text-theme-muted">PPG</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-legends-purple-600 dark:text-legends-purple-400">
              {combineData.apg.toFixed(1)}
            </div>
            <div className="text-sm text-theme-muted">APG</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-legends-purple-600 dark:text-legends-purple-400">
              {combineData.rpg.toFixed(1)}
            </div>
            <div className="text-sm text-theme-muted">RPG</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-legends-purple-600 dark:text-legends-purple-400">
              {combineData.fgPercentage.toFixed(1)}%
            </div>
            <div className="text-sm text-theme-muted">FG%</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-legends-purple-600 dark:text-legends-purple-400">
              {combineData.threePointPercentage.toFixed(1)}%
            </div>
            <div className="text-sm text-theme-muted">3P%</div>
          </div>
        </div>
        
        {/* Combine Rating Trend */}
        <div className="mt-6">
          <StatChart
            data={ratingTrend}
            type="line"
            dataKey="rating"
            xAxisKey="week"
            title="Combine Rating Trend"
            color="#7A60A8"
          />
        </div>
      </Card>
      
      {/* Scouting Summary */}
      <Card>
        <h3 className="text-lg font-medium text-theme-primary mb-4">Scouting Summary</h3>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2">Strengths</h4>
            <ul className="list-disc list-inside text-sm text-theme-secondary space-y-1">
              <li>Strong scoring ability with consistent shooting form</li>
              <li>Good court vision and passing skills</li>
              <li>Solid defensive awareness and positioning</li>
              <li>High basketball IQ and decision-making</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-red-700 dark:text-red-400 mb-2">Areas for Improvement</h4>
            <ul className="list-disc list-inside text-sm text-theme-secondary space-y-1">
              <li>Can improve three-point shooting consistency</li>
              <li>Needs to work on reducing turnovers</li>
              <li>Could enhance rebounding presence</li>
            </ul>
          </div>
          <div className="mt-4 p-3 bg-theme-tertiary rounded-lg">
            <p className="text-sm italic text-theme-secondary">
              "A versatile player with strong fundamentals and good potential for growth. Shows promise in multiple areas of the game."
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

