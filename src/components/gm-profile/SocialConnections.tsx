'use client'

import type { GMProfile } from '@/services/gm';
import Card from '@/components/Card';

interface SocialConnectionsProps {
  gm: GMProfile;
}

export default function SocialConnections({ gm }: SocialConnectionsProps) {
  const socialLinks = [
    {
      name: 'Twitter',
      value: gm.twitter,
      url: gm.twitter ? `https://twitter.com/${gm.twitter.replace('@', '')}` : null,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
        </svg>
      ),
    },
    {
      name: 'Twitch',
      value: gm.twitch,
      url: gm.twitch ? `https://twitch.tv/${gm.twitch}` : null,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
        </svg>
      ),
    },
    {
      name: 'Discord',
      value: gm.discord_username || gm.discord_id,
      url: gm.discord_id ? `https://discord.com/users/${gm.discord_id}` : null,
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
        </svg>
      ),
    },
  ].filter(link => link.value);

  if (socialLinks.length === 0) {
    return (
      <Card>
        <h3 className="text-lg font-medium text-theme-primary mb-4">Social Connections</h3>
        <div className="text-center py-8">
          <p className="text-theme-muted">No social connections available</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-lg font-medium text-theme-primary mb-4">Social Connections</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {socialLinks.map((link) => (
          <div
            key={link.name}
            className="p-4 bg-theme-tertiary rounded-lg border border-theme-border hover:border-legends-purple-500 dark:hover:border-legends-purple-400 transition-colors"
          >
            {link.url ? (
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-theme-primary hover:text-legends-purple-600 dark:hover:text-legends-purple-400 transition-colors"
              >
                <div className="flex-shrink-0 text-theme-secondary">
                  {link.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{link.name}</div>
                  <div className="text-xs text-theme-muted truncate">{link.value}</div>
                </div>
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ) : (
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 text-theme-secondary">
                  {link.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{link.name}</div>
                  <div className="text-xs text-theme-muted truncate">{link.value}</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

