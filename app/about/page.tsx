import Card from '@/components/Card';

export default function AboutPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-theme-primary mb-4">
          About Legends Basketball Association
        </h1>
        <p className="text-lg text-theme-secondary">
          The premier competitive basketball league
        </p>
      </div>

      <Card>
        <h2 className="text-2xl font-semibold text-theme-primary mb-4">
          Our Mission
        </h2>
        <p className="text-theme-primary mb-4">
          The Legends Basketball Association exists to bring structure, fairness, and opportunity back to competitive draft-league basketball.
        </p>
        <p className="text-theme-primary mb-4">
          We're building a space where players can compete seriously, improve their craft, and earn recognition through performance—not popularity.
        </p>
        <p className="text-theme-primary">
          Our mission is to set a consistent standard for competition, communication, and community across every season.
        </p>
      </Card>

      <Card>
        <h2 className="text-2xl font-semibold text-theme-primary mb-4">
          League Vision
        </h2>
        <p className="text-theme-primary mb-4">
          The Legends Basketball Association is the dream that UPA and HOF have envisioned since embarking on their journey in competitive 2K.
        </p>
        <p className="text-theme-primary mb-4">
          A draft league for the community, ran with the structure that the community deserves.
        </p>
        <p className="text-theme-primary">
          A platform for all future stars and streamers to build themselves and their own brand.
        </p>
      </Card>

      <Card>
        <h2 className="text-2xl font-semibold text-theme-primary mb-4">
          What Makes Us Different
        </h2>
        <ul className="list-disc list-inside space-y-2 text-theme-primary">
          <li>Fair, Verified Combines: Organized through HOF Arenas for consistent matchmaking and evaluation.</li>
          <li>Transparent Draft Process: Every player earns their place through performance and visibility.</li>
          <li>Structured Competition: Regular seasons and playoffs that reward teamwork and consistency.</li>
          <li>Integrated Stats & Profiles: Player data connects directly with ProAmRank.gg.</li>
          <li>Community-Driven Culture: Built collaboratively by players, league owners, and staff who believe in the same vision.</li>
        </ul>
      </Card>
    </div>
  );
}

