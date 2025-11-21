'use client'

import type { GMProfile } from '@/services/gm';
import Card from '@/components/Card';

interface Past2KExperienceProps {
  gm: GMProfile;
}

export default function Past2KExperience({ gm }: Past2KExperienceProps) {
  const hasTextExperience = gm.past_2k_experience_text && gm.past_2k_experience_text.trim().length > 0;
  const hasStructuredExperience = gm.experience && gm.experience.length > 0;

  if (!hasTextExperience && !hasStructuredExperience) {
    return (
      <Card>
        <h3 className="text-lg font-medium text-theme-primary mb-4">Past 2K Experience</h3>
        <div className="text-center py-8">
          <p className="text-theme-muted">No 2K experience information available</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Text Experience */}
      {hasTextExperience && (
        <Card>
          <h3 className="text-lg font-medium text-theme-primary mb-4">Experience Overview</h3>
          <div className="prose prose-sm max-w-none text-theme-secondary">
            <p className="whitespace-pre-line">{gm.past_2k_experience_text}</p>
          </div>
        </Card>
      )}

      {/* Structured Experience */}
      {hasStructuredExperience && (
        <Card>
          <h3 className="text-lg font-medium text-theme-primary mb-4">Career History</h3>
          <div className="space-y-4">
            {gm.experience.map((exp) => (
              <div
                key={exp.id}
                className="p-4 bg-theme-tertiary rounded-lg border border-theme-border"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2">
                  <div>
                    <h4 className="text-base font-semibold text-theme-primary mb-1">
                      {exp.league_name}
                    </h4>
                    {exp.team_name && (
                      <p className="text-sm text-theme-secondary mb-1">
                        {exp.team_name}
                        {exp.role && ` • ${exp.role}`}
                      </p>
                    )}
                    {exp.season && (
                      <p className="text-xs text-theme-muted mb-1">Season: {exp.season}</p>
                    )}
                  </div>
                  {(exp.start_date || exp.end_date) && (
                    <div className="text-xs text-theme-muted mt-2 sm:mt-0">
                      {exp.start_date && (
                        <div>
                          Start: {new Date(exp.start_date).toLocaleDateString()}
                        </div>
                      )}
                      {exp.end_date && (
                        <div>
                          End: {new Date(exp.end_date).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {exp.achievements && (
                  <div className="mt-3 pt-3 border-t border-theme-border">
                    <p className="text-sm text-theme-secondary">{exp.achievements}</p>
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

