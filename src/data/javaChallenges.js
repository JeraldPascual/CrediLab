/**
 * Java Challenge Bank — Professor-Style Problems
 *
 * 15 challenges across 3 difficulty tiers:
 *   Easy   (5): 15–20 CLB — Fundamentals every CS1 student should master
 *   Medium (5): 50–60 CLB — Multi-step logic, arrays, methods
 *   Hard   (5): 75–90 CLB — OOP, data structures, algorithmic thinking
 *
 * Style: Academic/professor-style — practical scenarios, not LeetCode puzzles.
 * All use Scanner for input and System.out.println for output.
 */

const JAVA_STARTER = `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Your code here
    }
}`;

const JAVA_CHALLENGES = [
  // ═══════════════════════════════════════════════════════════════════
  //  EASY TIER — 15–20 CLB
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "even-odd-006",
    title: "Even or Odd Checker",
    difficulty: "Easy",
    reward: 15,
    language: "java",
    languageId: 62,
    category: "Basics",
    author: "CrediLab Team",
    description:
      "Write a Java program that reads an integer from standard input and prints whether it is \"Even\" or \"Odd\".",
    inputDescription: "A single integer n on one line.",
    outputDescription: 'Print "Even" if the number is divisible by 2, otherwise print "Odd".',
    sampleInput: "7",
    sampleOutput: "Odd",
    starterCode: JAVA_STARTER,
    testCases: [
      { input: "7", expectedOutput: "Odd" },
      { input: "4", expectedOutput: "Even" },
      { input: "0", expectedOutput: "Even" },
      { input: "-3", expectedOutput: "Odd" },
      { input: "100", expectedOutput: "Even" },
    ],
  },
  {
    id: "area-calc-007",
    title: "Rectangle Area & Perimeter",
    difficulty: "Easy",
    reward: 15,
    language: "java",
    languageId: 62,
    category: "Basics",
    author: "CrediLab Team",
    description:
      "Write a Java program that reads the length and width of a rectangle (integers) and prints the area and perimeter on separate lines.",
    inputDescription:
      "Two integers on separate lines: length and width.",
    outputDescription:
      'Two lines:\n  Line 1: "Area: X"\n  Line 2: "Perimeter: Y"',
    sampleInput: "5\n3",
    sampleOutput: "Area: 15\nPerimeter: 16",
    starterCode: JAVA_STARTER,
    testCases: [
      { input: "5\n3", expectedOutput: "Area: 15\nPerimeter: 16" },
      { input: "10\n10", expectedOutput: "Area: 100\nPerimeter: 40" },
      { input: "1\n1", expectedOutput: "Area: 1\nPerimeter: 4" },
      { input: "7\n2", expectedOutput: "Area: 14\nPerimeter: 18" },
    ],
  },
  {
    id: "temp-convert-008",
    title: "Temperature Converter",
    difficulty: "Easy",
    reward: 18,
    language: "java",
    languageId: 62,
    category: "Math & Logic",
    author: "CrediLab Team",
    description:
      'Write a Java program that reads a temperature in Celsius (integer) and prints the equivalent in Fahrenheit. Use the formula: F = (C × 9/5) + 32. Print the result as an integer (truncated, not rounded).',
    inputDescription: "A single integer representing temperature in Celsius.",
    outputDescription: 'A single line: "XF" where X is the Fahrenheit value (integer, truncated).',
    sampleInput: "100",
    sampleOutput: "212F",
    starterCode: JAVA_STARTER,
    testCases: [
      { input: "100", expectedOutput: "212F" },
      { input: "0", expectedOutput: "32F" },
      { input: "37", expectedOutput: "98F" },
      { input: "-40", expectedOutput: "-40F" },
      { input: "25", expectedOutput: "77F" },
    ],
  },
  {
    id: "sum-digits-009",
    title: "Sum of Digits",
    difficulty: "Easy",
    reward: 18,
    language: "java",
    languageId: 62,
    category: "Math & Logic",
    author: "CrediLab Team",
    description:
      "Write a Java program that reads a positive integer and prints the sum of its digits. Use a loop — do not convert to a string.",
    inputDescription: "A single positive integer (1 ≤ n ≤ 999999).",
    outputDescription: "A single integer — the sum of all digits.",
    sampleInput: "1234",
    sampleOutput: "10",
    starterCode: JAVA_STARTER,
    testCases: [
      { input: "1234", expectedOutput: "10" },
      { input: "9", expectedOutput: "9" },
      { input: "100", expectedOutput: "1" },
      { input: "999999", expectedOutput: "54" },
      { input: "505", expectedOutput: "10" },
    ],
  },
  {
    id: "multiplication-table-010",
    title: "Multiplication Table",
    difficulty: "Easy",
    reward: 20,
    language: "java",
    languageId: 62,
    category: "Control Flow",
    author: "CrediLab Team",
    description:
      'Write a Java program that reads an integer n and prints its multiplication table from 1 to 10. Each line should be in the format "n x i = result".',
    inputDescription: "A single integer n.",
    outputDescription: '10 lines, each in the format "n x i = result" where i goes from 1 to 10.',
    sampleInput: "5",
    sampleOutput:
      "5 x 1 = 5\n5 x 2 = 10\n5 x 3 = 15\n5 x 4 = 20\n5 x 5 = 25\n5 x 6 = 30\n5 x 7 = 35\n5 x 8 = 40\n5 x 9 = 45\n5 x 10 = 50",
    starterCode: JAVA_STARTER,
    testCases: [
      {
        input: "5",
        expectedOutput:
          "5 x 1 = 5\n5 x 2 = 10\n5 x 3 = 15\n5 x 4 = 20\n5 x 5 = 25\n5 x 6 = 30\n5 x 7 = 35\n5 x 8 = 40\n5 x 9 = 45\n5 x 10 = 50",
      },
      {
        input: "3",
        expectedOutput:
          "3 x 1 = 3\n3 x 2 = 6\n3 x 3 = 9\n3 x 4 = 12\n3 x 5 = 15\n3 x 6 = 18\n3 x 7 = 21\n3 x 8 = 24\n3 x 9 = 27\n3 x 10 = 30",
      },
      {
        input: "1",
        expectedOutput:
          "1 x 1 = 1\n1 x 2 = 2\n1 x 3 = 3\n1 x 4 = 4\n1 x 5 = 5\n1 x 6 = 6\n1 x 7 = 7\n1 x 8 = 8\n1 x 9 = 9\n1 x 10 = 10",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  //  MEDIUM TIER — 50–60 CLB
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "student-avg-011",
    title: "Student Grade Average",
    difficulty: "Medium",
    reward: 50,
    language: "java",
    languageId: 62,
    category: "Arrays",
    author: "CrediLab Team",
    description:
      'Write a Java program that reads the number of students, then for each student reads their name and 3 exam scores. Print each student\'s name and average (rounded down to integer), then print the class average. Format: "Name: avg" per student, then "Class Average: avg" at the end.',
    inputDescription:
      "Line 1: integer n (number of students).\nFor each student: a line with name, then a line with 3 space-separated integer scores.",
    outputDescription:
      'n lines of "Name: avg" (integer, truncated), then one line "Class Average: avg" (integer, truncated).',
    sampleInput: "2\nAlice\n85 90 78\nBob\n70 65 80",
    sampleOutput: "Alice: 84\nBob: 71\nClass Average: 77",
    starterCode: JAVA_STARTER,
    testCases: [
      {
        input: "2\nAlice\n85 90 78\nBob\n70 65 80",
        expectedOutput: "Alice: 84\nBob: 71\nClass Average: 77",
      },
      {
        input: "1\nCarla\n100 100 100",
        expectedOutput: "Carla: 100\nClass Average: 100",
      },
      {
        input: "3\nAna\n80 80 80\nBen\n90 90 90\nCal\n70 70 70",
        expectedOutput: "Ana: 80\nBen: 90\nCal: 70\nClass Average: 80",
      },
    ],
  },
  {
    id: "palindrome-check-012",
    title: "Palindrome Checker",
    difficulty: "Medium",
    reward: 50,
    language: "java",
    languageId: 62,
    category: "Strings",
    author: "CrediLab Team",
    description:
      'Write a Java program that reads a string and determines if it is a palindrome. Ignore case and spaces. Print "Palindrome" or "Not Palindrome".',
    inputDescription: "A single line containing a string.",
    outputDescription: '"Palindrome" or "Not Palindrome".',
    sampleInput: "Race Car",
    sampleOutput: "Palindrome",
    starterCode: JAVA_STARTER,
    testCases: [
      { input: "Race Car", expectedOutput: "Palindrome" },
      { input: "hello", expectedOutput: "Not Palindrome" },
      { input: "A man a plan a canal Panama", expectedOutput: "Palindrome" },
      { input: "Java", expectedOutput: "Not Palindrome" },
      { input: "madam", expectedOutput: "Palindrome" },
    ],
  },
  {
    id: "array-stats-013",
    title: "Array Statistics",
    difficulty: "Medium",
    reward: 55,
    language: "java",
    languageId: 62,
    category: "Arrays",
    author: "CrediLab Team",
    description:
      'Write a Java program that reads n integers and prints the minimum, maximum, and average (truncated to integer). Format the output as three lines: "Min: X", "Max: Y", "Avg: Z".',
    inputDescription:
      "Line 1: integer n (number of elements).\nLine 2: n space-separated integers.",
    outputDescription:
      'Three lines:\n  "Min: X"\n  "Max: Y"\n  "Avg: Z" (integer, truncated)',
    sampleInput: "5\n3 7 1 9 4",
    sampleOutput: "Min: 1\nMax: 9\nAvg: 4",
    starterCode: JAVA_STARTER,
    testCases: [
      { input: "5\n3 7 1 9 4", expectedOutput: "Min: 1\nMax: 9\nAvg: 4" },
      { input: "1\n42", expectedOutput: "Min: 42\nMax: 42\nAvg: 42" },
      { input: "3\n10 20 30", expectedOutput: "Min: 10\nMax: 30\nAvg: 20" },
      { input: "4\n-5 0 5 10", expectedOutput: "Min: -5\nMax: 10\nAvg: 2" },
    ],
  },
  {
    id: "payroll-calc-014",
    title: "Payroll Calculator",
    difficulty: "Medium",
    reward: 55,
    language: "java",
    languageId: 62,
    category: "Control Flow",
    author: "CrediLab Team",
    description:
      'Write a Java program that calculates an employee\'s weekly pay. Read hours worked and hourly rate. Overtime (over 40 hours) is paid at 1.5x the rate. Print the total pay as an integer (truncated).\n\nFormula:\n  If hours ≤ 40: pay = hours × rate\n  If hours > 40: pay = (40 × rate) + ((hours − 40) × rate × 1.5)',
    inputDescription:
      "Two integers on separate lines: hours worked and hourly rate.",
    outputDescription: 'A single line: "Pay: X" where X is the total pay (integer, truncated).',
    sampleInput: "45\n20",
    sampleOutput: "Pay: 950",
    starterCode: JAVA_STARTER,
    testCases: [
      { input: "45\n20", expectedOutput: "Pay: 950" },
      { input: "40\n25", expectedOutput: "Pay: 1000" },
      { input: "35\n15", expectedOutput: "Pay: 525" },
      { input: "50\n10", expectedOutput: "Pay: 550" },
      { input: "0\n100", expectedOutput: "Pay: 0" },
    ],
  },
  {
    id: "vowel-count-015",
    title: "Vowel & Consonant Counter",
    difficulty: "Medium",
    reward: 60,
    language: "java",
    languageId: 62,
    category: "Strings",
    author: "CrediLab Team",
    description:
      'Write a Java program that reads a string and counts the number of vowels (a, e, i, o, u — case insensitive) and consonants (letters that are not vowels). Ignore non-letter characters (spaces, digits, symbols).',
    inputDescription: "A single line containing a string.",
    outputDescription:
      'Two lines:\n  "Vowels: X"\n  "Consonants: Y"',
    sampleInput: "Hello World 123",
    sampleOutput: "Vowels: 3\nConsonants: 7",
    starterCode: JAVA_STARTER,
    testCases: [
      { input: "Hello World 123", expectedOutput: "Vowels: 3\nConsonants: 7" },
      { input: "aeiou", expectedOutput: "Vowels: 5\nConsonants: 0" },
      { input: "bcdfg", expectedOutput: "Vowels: 0\nConsonants: 5" },
      { input: "Java Programming", expectedOutput: "Vowels: 5\nConsonants: 10" },
      { input: "123!@#", expectedOutput: "Vowels: 0\nConsonants: 0" },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  //  HARD TIER — 75–90 CLB
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "bank-account-016",
    title: "Bank Account Manager",
    difficulty: "Hard",
    reward: 80,
    language: "java",
    languageId: 62,
    category: "OOP",
    author: "CrediLab Team",
    description:
      'Simulate a simple bank account. Read the initial balance, then process a series of transactions. Each transaction is either "D amount" (deposit) or "W amount" (withdrawal). Withdrawals that exceed the balance should be skipped (print "Insufficient funds"). After all transactions, print the final balance.\n\nAll amounts are integers.',
    inputDescription:
      'Line 1: integer — initial balance.\nLine 2: integer n — number of transactions.\nNext n lines: "D amount" or "W amount".',
    outputDescription:
      'For each failed withdrawal, print "Insufficient funds".\nLast line: "Balance: X".',
    sampleInput: "1000\n3\nD 500\nW 200\nW 2000",
    sampleOutput: "Insufficient funds\nBalance: 1300",
    starterCode: JAVA_STARTER,
    testCases: [
      {
        input: "1000\n3\nD 500\nW 200\nW 2000",
        expectedOutput: "Insufficient funds\nBalance: 1300",
      },
      {
        input: "0\n2\nD 100\nW 100",
        expectedOutput: "Balance: 0",
      },
      {
        input: "500\n4\nW 100\nW 100\nW 100\nW 300",
        expectedOutput: "Insufficient funds\nBalance: 200",
      },
      {
        input: "100\n1\nW 100",
        expectedOutput: "Balance: 0",
      },
    ],
  },
  {
    id: "matrix-add-017",
    title: "Matrix Addition",
    difficulty: "Hard",
    reward: 75,
    language: "java",
    languageId: 62,
    category: "Arrays",
    author: "CrediLab Team",
    description:
      "Write a Java program that reads two matrices of the same dimensions and prints their sum. Each element in the result is the sum of the corresponding elements from the two input matrices.",
    inputDescription:
      "Line 1: two integers — rows and cols.\nNext 'rows' lines: first matrix (space-separated integers).\nNext 'rows' lines: second matrix (space-separated integers).",
    outputDescription:
      "The resulting matrix, one row per line, elements separated by spaces.",
    sampleInput: "2 3\n1 2 3\n4 5 6\n7 8 9\n10 11 12",
    sampleOutput: "8 10 12\n14 16 18",
    starterCode: JAVA_STARTER,
    testCases: [
      {
        input: "2 3\n1 2 3\n4 5 6\n7 8 9\n10 11 12",
        expectedOutput: "8 10 12\n14 16 18",
      },
      {
        input: "1 1\n5\n3",
        expectedOutput: "8",
      },
      {
        input: "2 2\n0 0\n0 0\n1 1\n1 1",
        expectedOutput: "1 1\n1 1",
      },
      {
        input: "3 1\n1\n2\n3\n4\n5\n6",
        expectedOutput: "5\n7\n9",
      },
    ],
  },
  {
    id: "word-frequency-018",
    title: "Word Frequency Counter",
    difficulty: "Hard",
    reward: 85,
    language: "java",
    languageId: 62,
    category: "Data Structures",
    author: "CrediLab Team",
    description:
      'Write a Java program that reads a sentence and counts how many times each word appears. Print each unique word and its count in the order they first appear, one per line. Words are case-insensitive (convert all to lowercase). Words are separated by spaces only.',
    inputDescription: "A single line containing a sentence.",
    outputDescription:
      'One line per unique word: "word count" (lowercase, in order of first appearance).',
    sampleInput: "the cat sat on the mat the cat",
    sampleOutput: "the 3\ncat 2\nsat 1\non 1\nmat 1",
    starterCode: JAVA_STARTER,
    testCases: [
      {
        input: "the cat sat on the mat the cat",
        expectedOutput: "the 3\ncat 2\nsat 1\non 1\nmat 1",
      },
      {
        input: "Hello hello HELLO",
        expectedOutput: "hello 3",
      },
      {
        input: "one",
        expectedOutput: "one 1",
      },
      {
        input: "Java is fun and Java is powerful",
        expectedOutput: "java 2\nis 2\nfun 1\nand 1\npowerful 1",
      },
    ],
  },
  {
    id: "pattern-print-019",
    title: "Diamond Pattern",
    difficulty: "Hard",
    reward: 80,
    language: "java",
    languageId: 62,
    category: "Control Flow",
    author: "CrediLab Team",
    description:
      "Write a Java program that reads an odd positive integer n and prints a diamond pattern made of asterisks (*). The diamond has n rows at its widest point. Use spaces for alignment — no trailing spaces on any line.",
    inputDescription: "A single odd positive integer n (1 ≤ n ≤ 21).",
    outputDescription:
      "A diamond pattern of asterisks, n rows tall at the widest.",
    sampleInput: "5",
    sampleOutput: "  *\n ***\n*****\n ***\n  *",
    starterCode: JAVA_STARTER,
    testCases: [
      {
        input: "5",
        expectedOutput: "  *\n ***\n*****\n ***\n  *",
      },
      {
        input: "1",
        expectedOutput: "*",
      },
      {
        input: "3",
        expectedOutput: " *\n***\n *",
      },
      {
        input: "7",
        expectedOutput: "   *\n  ***\n *****\n*******\n *****\n  ***\n   *",
      },
    ],
  },
  {
    id: "inventory-mgr-020",
    title: "Inventory Manager",
    difficulty: "Hard",
    reward: 90,
    language: "java",
    languageId: 62,
    category: "Data Structures",
    author: "CrediLab Team",
    description:
      'Simulate an inventory system. Read a list of products with name, quantity, and price. Then process a series of commands:\n  "SELL name qty" — decrease quantity (skip if insufficient stock, print "Out of stock: name")\n  "RESTOCK name qty" — increase quantity\n  "REPORT" — print all products with qty > 0 sorted alphabetically: "name qty price"\n\nPrices are integers. Print prices without decimals.',
    inputDescription:
      'Line 1: integer p — number of products.\nNext p lines: "name quantity price".\nLine p+2: integer c — number of commands.\nNext c lines: commands.',
    outputDescription:
      'For failed sells: "Out of stock: name".\nFor REPORT: one line per product (qty > 0), alphabetically: "name qty price".',
    sampleInput:
      "3\nApple 10 5\nBanana 5 3\nCherry 0 8\n4\nSELL Apple 3\nSELL Cherry 1\nRESTOCK Cherry 10\nREPORT",
    sampleOutput:
      "Out of stock: Cherry\nApple 7 5\nBanana 5 3\nCherry 10 8",
    starterCode: JAVA_STARTER,
    testCases: [
      {
        input:
          "3\nApple 10 5\nBanana 5 3\nCherry 0 8\n4\nSELL Apple 3\nSELL Cherry 1\nRESTOCK Cherry 10\nREPORT",
        expectedOutput:
          "Out of stock: Cherry\nApple 7 5\nBanana 5 3\nCherry 10 8",
      },
      {
        input: "1\nWidget 5 10\n3\nSELL Widget 5\nSELL Widget 1\nREPORT",
        expectedOutput: "Out of stock: Widget",
      },
      {
        input: "2\nMilk 3 4\nBread 2 3\n2\nRESTOCK Milk 7\nREPORT",
        expectedOutput: "Bread 2 3\nMilk 10 4",
      },
    ],
  },
];

export default JAVA_CHALLENGES;
