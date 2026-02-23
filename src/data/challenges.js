import JAVA_CHALLENGES from "./javaChallenges";

const CORE_CHALLENGES = [
  {
    id: "greeting-001",
    title: "Personalized Greeting",
    difficulty: "Easy",
    reward: 20,  // standardized to Easy tier (15-20 CLB)
    language: "java",
    languageId: 62,
    category: "Basics",
    author: "CrediLab Team",
    description: "Write a Java program that reads a person's name from standard input and prints a personalized greeting.",
    inputDescription: "A single line containing a string — the person's name.",
    outputDescription: 'A single line containing "Hello, [name]!" where [name] is the input string.',
    sampleInput: "John",
    sampleOutput: "Hello, John!",
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Your code here
    }
}`,
    testCases: [
      { input: "John", expectedOutput: "Hello, John!" },
      { input: "Maria Santos", expectedOutput: "Hello, Maria Santos!" },
      { input: "World", expectedOutput: "Hello, World!" },
    ],
  },
  {
    id: "grade-calc-002",
    title: "Grade Calculator",
    difficulty: "Medium",
    reward: 55,  // standardized to Medium tier (50-60 CLB)
    language: "java",
    languageId: 62,
    category: "Control Flow",
    author: "CrediLab Team",
    description: "Write a Java program that reads a numeric grade and prints the corresponding letter grade.",
    inputDescription: "A single integer on one line representing the numeric grade (0–100).",
    outputDescription: "A single uppercase letter representing the grade bracket:\n  90–100 → A\n  80–89 → B\n  70–79 → C\n  60–69 → D\n  Below 60 → F",
    sampleInput: "85",
    sampleOutput: "B",
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Your code here
    }
}`,
    testCases: [
      { input: "95", expectedOutput: "A" },
      { input: "85", expectedOutput: "B" },
      { input: "75", expectedOutput: "C" },
      { input: "65", expectedOutput: "D" },
      { input: "42", expectedOutput: "F" },
      { input: "100", expectedOutput: "A" },
      { input: "0", expectedOutput: "F" },
    ],
  },
  {
    id: "fib-003",
    title: "Fibonacci Sequence",
    difficulty: "Easy",
    reward: 18,  // standardized to Easy tier (15-20 CLB)
    language: "java",
    languageId: 62,
    category: "Recursion",
    author: "CrediLab Team",
    description: "Write a Java program that reads an integer n and prints the nth Fibonacci number (0-indexed).",
    inputDescription: "A single non-negative integer n on one line (0 \u2264 n \u2264 30).",
    outputDescription: "A single integer — the nth Fibonacci number.\n  F(0) = 0, F(1) = 1, F(n) = F(n\u22121) + F(n\u22122)",
    sampleInput: "6",
    sampleOutput: "8",
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Your code here
    }
}`,
    testCases: [
      { input: "0", expectedOutput: "0" },
      { input: "1", expectedOutput: "1" },
      { input: "6", expectedOutput: "8" },
      { input: "10", expectedOutput: "55" },
    ],
  },
  {
    id: "reverse-004",
    title: "Reverse a String",
    difficulty: "Easy",
    reward: 15,  // standardized to Easy tier (15-20 CLB)
    language: "java",
    languageId: 62,
    category: "Strings",
    author: "CrediLab Team",
    description: "Write a Java program that reads a string and prints it reversed, without using built-in reverse methods.",
    inputDescription: "A single line containing a string (1 \u2264 length \u2264 1000).",
    outputDescription: "A single line containing the reversed string. Do NOT use StringBuilder.reverse() or similar built-in reverse methods.",
    sampleInput: "hello",
    sampleOutput: "olleh",
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Your code here
    }
}`,
    testCases: [
      { input: "hello", expectedOutput: "olleh" },
      { input: "CrediLab", expectedOutput: "baLiderC" },
      { input: "a", expectedOutput: "a" },
      { input: "racecar", expectedOutput: "racecar" },
    ],
  },
  {
    id: "bubblesort-005",
    title: "Bubble Sort",
    difficulty: "Medium",
    reward: 60,  // standardized to Medium tier (50-60 CLB)
    language: "java",
    languageId: 62,
    category: "Sorting",
    author: "CrediLab Team",
    description: "Implement the bubble sort algorithm to sort an array of integers in ascending order.",
    inputDescription: "Line 1: an integer n — the number of elements.\nLine 2: n space-separated integers.",
    outputDescription: "A single line of the sorted integers, separated by spaces.",
    sampleInput: "5\n64 34 25 12 22",
    sampleOutput: "12 22 25 34 64",
    starterCode: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Your code here
    }
}`,
    testCases: [
      { input: "5\n64 34 25 12 22", expectedOutput: "12 22 25 34 64" },
      { input: "3\n3 1 2", expectedOutput: "1 2 3" },
      { input: "1\n42", expectedOutput: "42" },
      { input: "4\n1 2 3 4", expectedOutput: "1 2 3 4" },
    ],
  },
];

// ─── Merged Challenge Array ──────────────────────────────────────────
const CHALLENGES = [...CORE_CHALLENGES, ...JAVA_CHALLENGES];
export default CHALLENGES;

// ─── Lookup Helpers ──────────────────────────────────────────────────
export function getChallengeById(id) {
  return CHALLENGES.find((c) => c.id === id);
}

export function getAllChallengeIds() {
  return CHALLENGES.map((c) => c.id);
}

export function getTotalPossibleReward() {
  return CHALLENGES.reduce((sum, c) => sum + c.reward, 0);
}

// ─── Filter Helpers (for ProblemPage tabs) ────────────────────────────
export function getChallengesByDifficulty(difficulty) {
  return CHALLENGES.filter((c) => c.difficulty === difficulty);
}

export function getChallengesByCategory(category) {
  return CHALLENGES.filter((c) => c.category === category);
}

export function getCategories() {
  return [...new Set(CHALLENGES.map((c) => c.category))];
}

/**
 * Build a reward lookup map: { challengeId: reward }
 * Used by reward-student.js to validate client-sent amounts.
 */
export function getRewardMap() {
  const map = {};
  CHALLENGES.forEach((c) => { map[c.id] = c.reward; });
  return map;
}
