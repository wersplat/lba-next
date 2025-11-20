'use client'

import Tabs, { type TabItem } from '@/components/Tabs';

export default function RulesPage() {
  const tabs: TabItem[] = [
    {
      id: 'player-eligibility',
      label: 'Player Eligibility',
      content: (
        <div className="space-y-6">
          <div>
            <p className="text-theme-primary mb-4">
              In order to obtain draft eligibility, a player must complete one of the following:
            </p>
            <ol className="list-decimal list-inside space-y-3 text-theme-primary">
              <li>5 combine games submitted</li>
              <li>3 HOF ARENA LEAGUE screenshots (completed during the combine period)</li>
              <li>
                1 Win in either HOF ARENA/HOF MIDDAY/HOF OVN with all active members from this league 
                (subject to commissioner interpretation and must be within the combine period)
              </li>
              <li>
                Have a subscription with UPA and be a UPA Member at the start of the season to skip 
                the entire combine process. (Please keep in mind this doesn't guarantee you will be drafted)
              </li>
            </ol>
          </div>
          
          <div className="border-t border-theme pt-4">
            <p className="text-theme-primary mb-2">
              <strong>The Commissioner has the right to remove anyone from the draft board at any point.</strong> A full refund of a paid tag will be provided if you have not broken any rules.
            </p>
          </div>

          <div className="border-t border-theme pt-4">
            <p className="text-theme-primary">
              During the regular season, in order to be eligible to play and be a Free Agent you must have been on the Draft Board prior to the season's first pick.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'general-team-rules',
      label: 'General Team Rules',
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-theme-primary mb-4">
              EACH TEAM WILL HAVE THE FOLLOWING ROSTER
            </h3>
            <ul className="list-disc list-inside space-y-2 text-theme-primary">
              <li>1 GM</li>
              <li>Minimum of 6 rostered players</li>
              <li>Maximum of 7 rostered players</li>
              <li>At no point prior to first game should any roster be below 7 including the GM</li>
            </ul>
          </div>

          <div className="border-t border-theme pt-4">
            <p className="text-theme-primary mb-4">
              As a player you must load up for any team that drafts you.
            </p>
          </div>

          <div className="border-t border-theme pt-4">
            <h3 className="text-lg font-semibold text-theme-primary mb-3">
              You CANNOT:
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-theme-primary">
              <li>Publicly demand a trade</li>
              <li>Refuse to load because of a losing record</li>
              <li>Consistently choose other 2K obligations over LBA League Games</li>
            </ol>
          </div>

          <div className="border-t border-theme pt-4">
            <h3 className="text-lg font-semibold text-theme-primary mb-3">
              You CAN:
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-theme-primary">
              <li>Play wherever you like, just finish your season here</li>
              <li>Privately ask for a trade</li>
              <li>Deny being a Keeper after 3 seasons</li>
            </ol>
          </div>
        </div>
      ),
    },
    {
      id: 'player-keeper-rules',
      label: 'Player Keeper Rules',
      content: (
        <div className="space-y-6">
          <div>
            <p className="text-theme-primary mb-4">
              You can keep any player drafted in any of the 5 rounds of the LBA draft.
            </p>
            <p className="text-theme-primary mb-4">
              You may also move a player up a keeper level at any point, but never down.
            </p>
            <p className="text-theme-secondary mb-4 italic">
              Example - keeping someone with a 2nd that was drafted with a 3rd
            </p>
          </div>

          <div className="border-t border-theme pt-4">
            <p className="text-theme-primary mb-4">
              After 3 seasons of keeping a player they have the option to opt out and reenter the draft, 
              however if they do not the 3 seasons restarts and they must wait again.
            </p>
          </div>

          <div className="border-t border-theme pt-4">
            <p className="text-theme-primary mb-4">
              <strong>AT THE END OF A 2K YOU MAY KEEP ONE PLAYER GOING INTO THE NEXT 2K</strong>
            </p>
            <p className="text-theme-primary mb-4">
              <strong>HOWEVER</strong>
            </p>
            <p className="text-theme-primary mb-4">
              you must move that player up a round. So first rounders are ineligible to be kept. 
            </p>
            <p className="text-theme-secondary mb-4 italic">
              Example - a player drafted round 3 being kept from 2k26 to 2k27 would need to be kept with a 2nd round pick.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'expansion-rules',
      label: 'Expansion Rules',
      content: (
        <div className="space-y-6">
          <div>
            <p className="text-theme-primary mb-4">
              As this is a launch of a new league, depending on the success we may expand in the future. 
              Upon expansion, to ensure that the league maintains all competitive balance and history intact, 
              all round 1 and 2 players will be moved into the draft of the original 12 teams. 
              Rounds 3-5 will be able to be kept, and round 2 players will be allowed to be moved up to a first to be kept.
            </p>
            <p className="text-theme-primary">
              <strong>*This rule will only be in place if the expansion occurs within the first 3 seasons*</strong>
            </p>
          </div>

          <div className="border-t border-theme pt-4">
            <p className="text-theme-primary">
              The expansion teams will be part of the draft lottery.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'regular-season-rules',
      label: 'Regular Season Rules',
      content: (
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold text-theme-primary mb-4">
              Lagout Rules (Regular Season)
            </h3>
            <ul className="list-disc list-inside space-y-2 text-theme-primary">
              <li>All games must be played out in full regardless of connection issues.</li>
              <li>No resets are allowed once the game has started.</li>
              <li>
                The only exception: if a lagout occurs within the first 2 minutes of the game, 
                a restart will be granted.
              </li>
              <li>Each team is allowed one restart per game under this rule.</li>
              <li>After the restart has been used, any future lagouts must be played out with no exceptions.</li>
            </ul>
            <p className="text-theme-secondary mt-4 italic">
              *THESE ARE ONLY REGULAR SEASON GUIDELINES FOR LAGOUTS*
            </p>
          </div>

          <div className="border-t border-theme pt-6">
            <p className="text-theme-primary mb-4">
              <strong>*STICK SHOOTING IS ALLOWED IN THIS LEAGUE*</strong>
            </p>
          </div>

          <div className="border-t border-theme pt-6">
            <h3 className="text-xl font-semibold text-theme-primary mb-4">
              In regards to scheduling:
            </h3>
            <p className="text-theme-primary mb-4 font-semibold">
              THERE WILL BE NO FORFEITS IN THIS LEAGUE. ALL REGULAR SEASON GAMES MUST BE PLAYED.
            </p>
            <p className="text-theme-primary mb-4 font-semibold">
              AS A GM YOU SHOULD BE:
            </p>
            <ul className="list-disc list-inside space-y-2 text-theme-primary mb-4">
              <li>Cordial</li>
              <li>Respectful</li>
              <li>Understanding</li>
            </ul>
            <p className="text-theme-primary mb-4">
              When it comes to scheduling games.
            </p>
            <p className="text-theme-primary mb-4">
              There is a 15 min grace window after which disciplinary means may occur if a valid excuse is not provided. 
              The GM who is late will then be at the behest of the other gm to reschedule or play.
            </p>
            <p className="text-theme-primary">
              Please understand that everyone has real life priorities, let's be a community here.
            </p>
          </div>

          <div className="border-t border-theme pt-6">
            <h3 className="text-xl font-semibold text-theme-primary mb-4">
              The Regular Season will consist of
            </h3>
            <p className="text-theme-primary mb-4 font-semibold">
              TWO CONFERENCES
            </p>
            <p className="text-theme-primary mb-4">
              UPA CONFERENCE AND HOF CONFERENCE
            </p>
            <p className="text-theme-primary mb-4">
              There will be a draft in the inaugural season by UPA rep and HOF rep to decide which teams will be in what conference.
            </p>
            <p className="text-theme-primary mb-4">
              There will be 16 Regular Season games in the inaugural season which each team playing their conference 2 times (10 conf games) 
              and the opposing conference 1 time each.
            </p>
            <p className="text-theme-primary">
              You will have 3 weeks to complete the season with a deadline in each week.
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-theme-primary mb-4">
          League Rules
        </h1>
        <p className="text-lg text-theme-secondary">
          Official rules and regulations for the Legends Basketball Association
        </p>
      </div>

      <Tabs items={tabs} />
    </div>
  );
}

