import { TrophyIcon } from "@heroicons/react/24/outline";

// Placeholder data — will be populated from Firestore
const SAMPLE_LEADERBOARD = [
  { rank: 1, name: "Maria Santos", credits: 850, challenges: 12 },
  { rank: 2, name: "Juan Dela Cruz", credits: 720, challenges: 10 },
  { rank: 3, name: "Ana Reyes", credits: 650, challenges: 9 },
  { rank: 4, name: "Pedro Garcia", credits: 500, challenges: 7 },
  { rank: 5, name: "Sofia Cruz", credits: 400, challenges: 6 },
];

export default function LeaderboardView() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <TrophyIcon className="w-7 h-7 text-yellow-500" />
          Leaderboard
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-dark-muted">
          Top students ranked by credits earned this month.
        </p>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-dark-surface text-left text-xs font-medium text-gray-500 dark:text-dark-muted uppercase tracking-wider">
              <th className="px-6 py-3">Rank</th>
              <th className="px-6 py-3">Student</th>
              <th className="px-6 py-3 text-right">Challenges</th>
              <th className="px-6 py-3 text-right">Credits</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
            {SAMPLE_LEADERBOARD.map((entry) => (
              <tr
                key={entry.rank}
                className="hover:bg-gray-50 dark:hover:bg-dark-surface transition-colors"
              >
                <td className="px-6 py-4">
                  <RankBadge rank={entry.rank} />
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                  {entry.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-dark-muted text-right">
                  {entry.challenges}
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-sm font-bold text-green-primary">
                    {entry.credits} CLB
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-center text-gray-400 dark:text-dark-muted">
        Leaderboard updates when challenges are completed and verified on-chain.
      </p>
    </div>
  );
}

function RankBadge({ rank }) {
  if (rank === 1)
    return <span className="text-xl">🥇</span>;
  if (rank === 2)
    return <span className="text-xl">🥈</span>;
  if (rank === 3)
    return <span className="text-xl">🥉</span>;
  return (
    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 dark:bg-dark-surface text-xs font-bold text-gray-600 dark:text-dark-muted">
      {rank}
    </span>
  );
}
