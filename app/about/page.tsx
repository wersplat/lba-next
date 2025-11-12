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
          The LBA was created by the organizers behind the Hall of Fame League and Unified Pro-Am, with creative direction from Bodega Cats GC.
        </p>
        <p className="text-theme-primary mb-4">
          Together, we're setting out to redefine what a draft league can be—transparent, organized, and player-focused from day one.
        </p>
        <p className="text-theme-primary">
          Powered by the HOF Arenas matchmaking system, the LBA's foundation is built on proven infrastructure and a shared belief that competitive basketball deserves a fresh start.
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

