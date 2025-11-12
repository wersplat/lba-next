'use client'

import type { PlayerProfile } from '@/services/players';
import Card from '@/components/Card';

interface MediaHighlightsProps {
  player: PlayerProfile;
}

export default function MediaHighlights({ player }: MediaHighlightsProps) {
  const hasSocialMedia = player.twitch || player.twitter_id || player.discord_id;
  
  return (
    <div className="space-y-6">
      {/* Social Media Links */}
      {hasSocialMedia && (
        <Card>
          <h3 className="text-lg font-medium text-theme-primary mb-4">Social Media</h3>
          <div className="flex flex-wrap gap-4">
            {player.twitch && (
              <a
                href={`https://twitch.tv/${player.twitch}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
                </svg>
                Twitch
              </a>
            )}
            {player.twitter_id && (
              <a
                href={`https://twitter.com/${player.twitter_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
                Twitter
              </a>
            )}
            {player.discord_id && (
              <div className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 text-white">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
                Discord: {player.discord_id}
              </div>
            )}
          </div>
        </Card>
      )}
      
      {/* Twitch/YouTube Highlights */}
      {player.twitch && (
        <Card>
          <h3 className="text-lg font-medium text-theme-primary mb-4">Stream Highlights</h3>
          <div className="aspect-video bg-theme-tertiary rounded-lg flex items-center justify-center">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto text-theme-muted mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <p className="text-theme-muted mb-2">
                Watch highlights on{' '}
                <a
                  href={`https://twitch.tv/${player.twitch}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-legends-purple-600 dark:text-legends-purple-400 hover:underline"
                >
                  Twitch
                </a>
              </p>
            </div>
          </div>
        </Card>
      )}
      
      {/* Screenshot Gallery Placeholder */}
      <Card>
        <h3 className="text-lg font-medium text-theme-primary mb-4">Gallery</h3>
        <div className="text-center py-8">
          <svg className="w-16 h-16 mx-auto text-theme-muted mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-theme-muted">Gallery coming soon</p>
        </div>
      </Card>
      
      {/* Press Mentions Placeholder */}
      <Card>
        <h3 className="text-lg font-medium text-theme-primary mb-4">Press & Features</h3>
        <div className="text-center py-8">
          <svg className="w-16 h-16 mx-auto text-theme-muted mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          <p className="text-theme-muted">Press mentions coming soon</p>
        </div>
      </Card>
    </div>
  );
}

