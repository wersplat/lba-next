import Card from '@/components/Card';

export default function MediaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-theme-primary mb-2">
          Media
        </h1>
        <p className="text-theme-secondary">
          Photos, videos, and highlights from Legends Basketball Association
        </p>
      </div>

      <Card>
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📸</div>
          <h2 className="text-2xl font-semibold text-theme-primary mb-2">
            Media Gallery Coming Soon
          </h2>
          <p className="text-theme-secondary">
            Check back soon for photos, videos, and highlights from our games and events.
          </p>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <div className="aspect-video bg-gray-200 dark:bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-theme-muted">Video Placeholder</span>
          </div>
          <h3 className="mt-4 font-semibold text-theme-primary">
            Game Highlights
          </h3>
          <p className="text-sm text-theme-secondary mt-1">
            Coming soon
          </p>
        </Card>

        <Card>
          <div className="aspect-video bg-gray-200 dark:bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-theme-muted">Photo Placeholder</span>
          </div>
          <h3 className="mt-4 font-semibold text-theme-primary">
            Photo Gallery
          </h3>
          <p className="text-sm text-theme-secondary mt-1">
            Coming soon
          </p>
        </Card>

        <Card>
          <div className="aspect-video bg-gray-200 dark:bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-theme-muted">Video Placeholder</span>
          </div>
          <h3 className="mt-4 font-semibold text-theme-primary">
            Player Interviews
          </h3>
          <p className="text-sm text-theme-secondary mt-1">
            Coming soon
          </p>
        </Card>
      </div>
    </div>
  );
}

