# Data

Static challenge definitions, constants, and Firestore-driven task helpers.

| File | Contents |
|---|---|
| `challenges.js` | 5 core challenges + re-exports `javaChallenges.js` into a single `CHALLENGES` array. Lookup helpers included. |
| `javaChallenges.js` | 15 Java challenges across Easy/Medium/Hard tiers with test cases and starter code |
| `constants.js` | Single source of truth: reward tiers, time limits, difficulty colors, categories, weekly task config |
| `achievements.js` | Skill tiers (Novice → Expert) and cafeteria claim tiers (revenue model) |
| `weeklyTasks.js` | Firestore-driven weekly SDG tasks — static fallback + read/write helpers + completion tracking |

**Important:** Credit values in `challenges.js` must match `REWARD_MAP` in `api/reward-student.js`.
