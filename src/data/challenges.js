import JAVA_CHALLENGES from "./javaChallenges";

const CORE_CHALLENGES = [
  {
    id: "greeting-001",
    title: "Personalized Greeting",
    difficulty: "Easy",
    reward: 20,
    language: "java",
    languageId: 62,
    category: "Basics",
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
    _tc: "JTVCJTdCJTIyaW5wdXQlMjIlM0ElMjJKb2huJTIyJTJDJTIyZXhwZWN0ZWRPdXRwdXQlMjIlM0ElMjJIZWxsbyUyQyUyMEpvaG4hJTIyJTdEJTJDJTdCJTIyaW5wdXQlMjIlM0ElMjJNYXJpYSUyMFNhbnRvcyUyMiUyQyUyMmV4cGVjdGVkT3V0cHV0JTIyJTNBJTIySGVsbG8lMkMlMjBNYXJpYSUyMFNhbnRvcyElMjIlN0QlMkMlN0IlMjJpbnB1dCUyMiUzQSUyMldvcmxkJTIyJTJDJTIyZXhwZWN0ZWRPdXRwdXQlMjIlM0ElMjJIZWxsbyUyQyUyMFdvcmxkISUyMiU3RCU1RA==",
  },
  {
    id: "grade-calc-002",
    title: "Grade Calculator",
    difficulty: "Medium",
    reward: 55,
    language: "java",
    languageId: 62,
    category: "Control Flow",
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
    _tc: "JTVCJTdCJTIyaW5wdXQlMjIlM0ElMjI5NSUyMiUyQyUyMmV4cGVjdGVkT3V0cHV0JTIyJTNBJTIyQSUyMiU3RCUyQyU3QiUyMmlucHV0JTIyJTNBJTIyODUlMjIlMkMlMjJleHBlY3RlZE91dHB1dCUyMiUzQSUyMkIlMjIlN0QlMkMlN0IlMjJpbnB1dCUyMiUzQSUyMjc1JTIyJTJDJTIyZXhwZWN0ZWRPdXRwdXQlMjIlM0ElMjJDJTIyJTdEJTJDJTdCJTIyaW5wdXQlMjIlM0ElMjI2NSUyMiUyQyUyMmV4cGVjdGVkT3V0cHV0JTIyJTNBJTIyRCUyMiU3RCUyQyU3QiUyMmlucHV0JTIyJTNBJTIyNDIlMjIlMkMlMjJleHBlY3RlZE91dHB1dCUyMiUzQSUyMkYlMjIlN0QlMkMlN0IlMjJpbnB1dCUyMiUzQSUyMjEwMCUyMiUyQyUyMmV4cGVjdGVkT3V0cHV0JTIyJTNBJTIyQSUyMiU3RCUyQyU3QiUyMmlucHV0JTIyJTNBJTIyMCUyMiUyQyUyMmV4cGVjdGVkT3V0cHV0JTIyJTNBJTIyRiUyMiU3RCU1RA==",
  },
  {
    id: "fib-003",
    title: "Fibonacci Sequence",
    difficulty: "Easy",
    reward: 18,
    language: "java",
    languageId: 62,
    category: "Recursion",
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
    _tc: "JTVCJTdCJTIyaW5wdXQlMjIlM0ElMjIwJTIyJTJDJTIyZXhwZWN0ZWRPdXRwdXQlMjIlM0ElMjIwJTIyJTdEJTJDJTdCJTIyaW5wdXQlMjIlM0ElMjIxJTIyJTJDJTIyZXhwZWN0ZWRPdXRwdXQlMjIlM0ElMjIxJTIyJTdEJTJDJTdCJTIyaW5wdXQlMjIlM0ElMjI2JTIyJTJDJTIyZXhwZWN0ZWRPdXRwdXQlMjIlM0ElMjI4JTIyJTdEJTJDJTdCJTIyaW5wdXQlMjIlM0ElMjIxMCUyMiUyQyUyMmV4cGVjdGVkT3V0cHV0JTIyJTNBJTIyNTUlMjIlN0QlNUQ=",
  },
  {
    id: "reverse-004",
    title: "Reverse a String",
    difficulty: "Easy",
    reward: 15,
    language: "java",
    languageId: 62,
    category: "Strings",
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
    _tc: "JTVCJTdCJTIyaW5wdXQlMjIlM0ElMjJoZWxsbyUyMiUyQyUyMmV4cGVjdGVkT3V0cHV0JTIyJTNBJTIyb2xsZWglMjIlN0QlMkMlN0IlMjJpbnB1dCUyMiUzQSUyMkNyZWRpTGFiJTIyJTJDJTIyZXhwZWN0ZWRPdXRwdXQlMjIlM0ElMjJiYUxpZGVyQyUyMiU3RCUyQyU3QiUyMmlucHV0JTIyJTNBJTIyYSUyMiUyQyUyMmV4cGVjdGVkT3V0cHV0JTIyJTNBJTIyYSUyMiU3RCUyQyU3QiUyMmlucHV0JTIyJTNBJTIycmFjZWNhciUyMiUyQyUyMmV4cGVjdGVkT3V0cHV0JTIyJTNBJTIycmFjZWNhciUyMiU3RCU1RA==",
  },
  {
    id: "bubblesort-005",
    title: "Bubble Sort",
    difficulty: "Medium",
    reward: 60,
    language: "java",
    languageId: 62,
    category: "Sorting",
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
    _tc: "JTVCJTdCJTIyaW5wdXQlMjIlM0ElMjI1JTVDbjY0JTIwMzQlMjAyNSUyMDEyJTIwMjIlMjIlMkMlMjJleHBlY3RlZE91dHB1dCUyMiUzQSUyMjEyJTIwMjIlMjAyNSUyMDM0JTIwNjQlMjIlN0QlMkMlN0IlMjJpbnB1dCUyMiUzQSUyMjMlNUNuMyUyMDElMjAyJTIyJTJDJTIyZXhwZWN0ZWRPdXRwdXQlMjIlM0ElMjIxJTIwMiUyMDMlMjIlN0QlMkMlN0IlMjJpbnB1dCUyMiUzQSUyMjElNUNuNDIlMjIlMkMlMjJleHBlY3RlZE91dHB1dCUyMiUzQSUyMjQyJTIyJTdEJTJDJTdCJTIyaW5wdXQlMjIlM0ElMjI0JTVDbjElMjAyJTIwMyUyMDQlMjIlMkMlMjJleHBlY3RlZE91dHB1dCUyMiUzQSUyMjElMjAyJTIwMyUyMDQlMjIlN0QlNUQ=",
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
