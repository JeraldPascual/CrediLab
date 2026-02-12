/**
 * Challenge data — stored locally for hackathon.
 * In production, these would come from Firestore.
 *
 * Each challenge has hidden test cases that Judge0 validates.
 * The `reward` field is the CLB token reward on completion.
 */

const CHALLENGES = [
  {
    id: "greeting-001",
    title: "Personalized Greeting",
    difficulty: "Easy",
    reward: 50,
    language: "java",
    languageId: 62,
    category: "Basics",
    description:
      "Write a Java program that reads a person's name from standard input and prints a personalized greeting.",
    instructions: `Write a program that:
1. Reads a single line from standard input (the person's name)
2. Prints "Hello, [name]!" to standard output

**Example:**
- Input: \`John\`
- Output: \`Hello, John!\``,
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
    reward: 100,
    language: "java",
    languageId: 62,
    category: "Control Flow",
    description:
      "Write a Java program that reads a numeric grade and prints the corresponding letter grade.",
    instructions: `Write a program that:
1. Reads a numeric grade (integer) from standard input
2. Prints the letter grade based on:
   - 90-100: A
   - 80-89: B
   - 70-79: C
   - 60-69: D
   - Below 60: F

**Example:**
- Input: \`85\`
- Output: \`B\`
- Input: \`42\`
- Output: \`F\``,
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
    reward: 50,
    language: "java",
    languageId: 62,
    category: "Recursion",
    description:
      "Write a Java program that reads an integer n and prints the nth Fibonacci number.",
    instructions: `Write a program that:
1. Reads an integer n from standard input
2. Prints the nth Fibonacci number (0-indexed)
   - F(0) = 0, F(1) = 1, F(n) = F(n-1) + F(n-2)

**Example:**
- Input: \`6\`
- Output: \`8\`
- Input: \`0\`
- Output: \`0\``,
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
    reward: 30,
    language: "java",
    languageId: 62,
    category: "Strings",
    description:
      "Write a Java program that reads a string and prints it reversed, without using built-in reverse methods.",
    instructions: `Write a program that:
1. Reads a string from standard input
2. Prints the reversed string
3. Do NOT use StringBuilder.reverse() or similar built-in methods

**Example:**
- Input: \`hello\`
- Output: \`olleh\``,
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
    reward: 100,
    language: "java",
    languageId: 62,
    category: "Sorting",
    description:
      "Implement the bubble sort algorithm to sort an array of integers in ascending order.",
    instructions: `Write a program that:
1. Reads the first line as n (the number of elements)
2. Reads the second line as n space-separated integers
3. Sorts them using bubble sort
4. Prints the sorted array as space-separated integers

**Example:**
- Input:
\`\`\`
5
64 34 25 12 22
\`\`\`
- Output: \`12 22 25 34 64\``,
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

export default CHALLENGES;

/**
 * Get a challenge by its ID
 * @param {string} id
 * @returns {object|undefined}
 */
export function getChallengeById(id) {
  return CHALLENGES.find((c) => c.id === id);
}

/**
 * Get all challenge IDs
 * @returns {string[]}
 */
export function getAllChallengeIds() {
  return CHALLENGES.map((c) => c.id);
}

/**
 * Total possible CLB from all challenges
 * @returns {number}
 */
export function getTotalPossibleReward() {
  return CHALLENGES.reduce((sum, c) => sum + c.reward, 0);
}
