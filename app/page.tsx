import Link from 'next/link';
import Card from '@/components/Card';

export default function HomePage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-theme-primary mb-4">
          Welcome to Legends Basketball Association
        </h1>
        <p className="text-xl text-theme-secondary mb-8">
          The premier competitive basketball league
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <Link href="/rankings" className="block">
            <div className="text-center">
              <div className="text-4xl mb-4">🏀</div>
              <h2 className="text-xl font-semibold text-theme-primary mb-2">
                Player Rankings
              </h2>
              <p className="text-theme-secondary">
                View all players and their profiles
              </p>
            </div>
          </Link>
        </Card>

        <Card>
          <Link href="/rankings/gm" className="block">
            <div className="text-center">
              <div className="text-4xl mb-4">👔</div>
              <h2 className="text-xl font-semibold text-theme-primary mb-2">
                GM Rankings
              </h2>
              <p className="text-theme-secondary">
                General Manager rankings by Win-Loss record
              </p>
            </div>
          </Link>
        </Card>

        <Card>
          <Link href="/matches" className="block">
            <div className="text-center">
              <div className="text-4xl mb-4">📊</div>
              <h2 className="text-xl font-semibold text-theme-primary mb-2">
                Recent Matches
              </h2>
              <p className="text-theme-secondary">
                Latest game results and scores
              </p>
            </div>
          </Link>
        </Card>

        <Card>
          <Link href="/matches/combine" className="block">
            <div className="text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h2 className="text-xl font-semibold text-theme-primary mb-2">
                Combine Matches
              </h2>
              <p className="text-theme-secondary">
                Pre-draft combine game results
              </p>
            </div>
          </Link>
        </Card>

        <Card>
          <Link href="/standings" className="block">
            <div className="text-center">
              <div className="text-4xl mb-4">🏆</div>
              <h2 className="text-xl font-semibold text-theme-primary mb-2">
                Standings
              </h2>
              <p className="text-theme-secondary">
                Current league standings
              </p>
            </div>
          </Link>
        </Card>

        <Card>
          <Link href="/statistics" className="block">
            <div className="text-center">
              <div className="text-4xl mb-4">📈</div>
              <h2 className="text-xl font-semibold text-theme-primary mb-2">
                Statistics
              </h2>
              <p className="text-theme-secondary">
                League-wide stats and metrics
              </p>
            </div>
          </Link>
        </Card>

        <Card>
          <Link href="/draft-board" className="block">
            <div className="text-center">
              <div className="text-4xl mb-4">📋</div>
              <h2 className="text-xl font-semibold text-theme-primary mb-2">
                Draft Board
              </h2>
              <p className="text-theme-secondary">
                Eligible players for the draft
              </p>
            </div>
          </Link>
        </Card>

        <Card>
          <Link href="/draft-pool" className="block">
            <div className="text-center">
              <div className="text-4xl mb-4">👥</div>
              <h2 className="text-xl font-semibold text-theme-primary mb-2">
                Draft Pool
              </h2>
              <p className="text-theme-secondary">
                Available players for draft
              </p>
            </div>
          </Link>
        </Card>
      </div>

      <Card>
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-theme-primary mb-4">
            About Legends Basketball Association
          </h2>
          <p className="text-theme-primary mb-4">
            The Legends Basketball Association is dedicated to providing the highest level of competitive basketball 
            while fostering sportsmanship, teamwork, and excellence both on and off the court.
          </p>
          <Link
            href="/about"
            className="inline-block px-6 py-2 bg-legends-purple-600 text-white rounded-lg hover:bg-legends-purple-700 transition-colors"
          >
            Learn More
          </Link>
        </div>
      </Card>
    </div>
  );
}

