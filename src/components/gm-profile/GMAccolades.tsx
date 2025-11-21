'use client'

import type { GMProfile } from '@/services/gm';
import Card from '@/components/Card';

interface GMAccoladesProps {
  gm: GMProfile;
}

export default function GMAccolades({ gm }: GMAccoladesProps) {
  const accolades2K = gm.accolades.filter(a => a.type === '2k');
  const accoladesRealLife = gm.accolades.filter(a => a.type === 'real_life');

  if (gm.accolades.length === 0) {
    return (
      <Card>
        <h3 className="text-lg font-medium text-theme-primary mb-4">Accolades</h3>
        <div className="text-center py-8">
          <p className="text-theme-muted">No accolades yet</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* 2K Accolades */}
      {accolades2K.length > 0 && (
        <Card>
          <h3 className="text-lg font-medium text-theme-primary mb-4">2K Accolades</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accolades2K.map((accolade) => (
              <div
                key={accolade.id}
                className="p-4 bg-theme-tertiary rounded-lg border border-theme-border hover:border-legends-purple-500 dark:hover:border-legends-purple-400 transition-colors"
              >
                <h4 className="text-sm font-semibold text-theme-primary mb-1">
                  {accolade.title}
                </h4>
                {accolade.description && (
                  <p className="text-xs text-theme-secondary mb-2">
                    {accolade.description}
                  </p>
                )}
                <p className="text-xs text-theme-muted">
                  {new Date(accolade.awarded_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Real Life Accolades */}
      {accoladesRealLife.length > 0 && (
        <Card>
          <h3 className="text-lg font-medium text-theme-primary mb-4">Real Life Accolades</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accoladesRealLife.map((accolade) => (
              <div
                key={accolade.id}
                className="p-4 bg-theme-tertiary rounded-lg border border-theme-border hover:border-legends-purple-500 dark:hover:border-legends-purple-400 transition-colors"
              >
                <h4 className="text-sm font-semibold text-theme-primary mb-1">
                  {accolade.title}
                </h4>
                {accolade.description && (
                  <p className="text-xs text-theme-secondary mb-2">
                    {accolade.description}
                  </p>
                )}
                <p className="text-xs text-theme-muted">
                  {new Date(accolade.awarded_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

