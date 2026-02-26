/**
 * Java Challenge Bank — Professor-Style Problems
 *
 * 35 challenges across 3 difficulty tiers:
 *   Easy  (10): 15–20 CLB — Fundamentals every CS1 student should master
 *   Medium (13): 50–60 CLB — Multi-step logic, arrays, methods
 *   Hard  (12): 75–90 CLB — OOP, data structures, algorithmic thinking
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
    description:
      "Write a Java program that reads an integer from standard input and prints whether it is \"Even\" or \"Odd\".",
    inputDescription: "A single integer n on one line.",
    outputDescription: 'Print "Even" if the number is divisible by 2, otherwise print "Odd".',
    sampleInput: "7",
    sampleOutput: "Odd",
    starterCode: JAVA_STARTER,
    _tc: "JTVCJTdCJTIyaW5wdXQlMjIlM0ElMjI3JTIyJTJDJTIyZXhwZWN0ZWRPdXRwdXQlMjIlM0ElMjJPZGQlMjIlN0QlMkMlN0IlMjJpbnB1dCUyMiUzQSUyMjQlMjIlMkMlMjJleHBlY3RlZE91dHB1dCUyMiUzQSUyMkV2ZW4lMjIlN0QlMkMlN0IlMjJpbnB1dCUyMiUzQSUyMjAlMjIlMkMlMjJleHBlY3RlZE91dHB1dCUyMiUzQSUyMkV2ZW4lMjIlN0QlMkMlN0IlMjJpbnB1dCUyMiUzQSUyMi0zJTIyJTJDJTIyZXhwZWN0ZWRPdXRwdXQlMjIlM0ElMjJPZGQlMjIlN0QlMkMlN0IlMjJpbnB1dCUyMiUzQSUyMjEwMCUyMiUyQyUyMmV4cGVjdGVkT3V0cHV0JTIyJTNBJTIyRXZlbiUyMiU3RCU1RA==",
  },
  {
    id: "area-calc-007",
    title: "Rectangle Area & Perimeter",
    difficulty: "Easy",
    reward: 15,
    language: "java",
    languageId: 62,
    category: "Basics",
    description:
      "Write a Java program that reads the length and width of a rectangle (integers) and prints the area and perimeter on separate lines.",
    inputDescription:
      "Two integers on separate lines: length and width.",
    outputDescription:
      'Two lines:\n  Line 1: "Area: X"\n  Line 2: "Perimeter: Y"',
    sampleInput: "5\n3",
    sampleOutput: "Area: 15\nPerimeter: 16",
    starterCode: JAVA_STARTER,
    _tc: "JTVCJTdCJTIyaW5wdXQlMjIlM0ElMjI1JTVDbjMlMjIlMkMlMjJleHBlY3RlZE91dHB1dCUyMiUzQSUyMkFyZWElM0ElMjAxNSU1Q25QZXJpbWV0ZXIlM0ElMjAxNiUyMiU3RCUyQyU3QiUyMmlucHV0JTIyJTNBJTIyMTAlNUNuMTAlMjIlMkMlMjJleHBlY3RlZE91dHB1dCUyMiUzQSUyMkFyZWElM0ElMjAxMDAlNUNuUGVyaW1ldGVyJTNBJTIwNDAlMjIlN0QlMkMlN0IlMjJpbnB1dCUyMiUzQSUyMjElNUNuMSUyMiUyQyUyMmV4cGVjdGVkT3V0cHV0JTIyJTNBJTIyQXJlYSUzQSUyMDElNUNuUGVyaW1ldGVyJTNBJTIwNCUyMiU3RCUyQyU3QiUyMmlucHV0JTIyJTNBJTIyNyU1Q24yJTIyJTJDJTIyZXhwZWN0ZWRPdXRwdXQlMjIlM0ElMjJBcmVhJTNBJTIwMTQlNUNuUGVyaW1ldGVyJTNBJTIwMTglMjIlN0QlNUQ=",
  },
  {
    id: "temp-convert-008",
    title: "Temperature Converter",
    difficulty: "Easy",
    reward: 18,
    language: "java",
    languageId: 62,
    category: "Math & Logic",
    description:
      'Write a Java program that reads a temperature in Celsius (integer) and prints the equivalent in Fahrenheit. Use the formula: F = (C × 9/5) + 32. Print the result as an integer (truncated, not rounded).',
    inputDescription: "A single integer representing temperature in Celsius.",
    outputDescription: 'A single line: "XF" where X is the Fahrenheit value (integer, truncated).',
    sampleInput: "100",
    sampleOutput: "212F",
    starterCode: JAVA_STARTER,
    _tc: "JTVCJTdCJTIyaW5wdXQlMjIlM0ElMjIxMDAlMjIlMkMlMjJleHBlY3RlZE91dHB1dCUyMiUzQSUyMjIxMkYlMjIlN0QlMkMlN0IlMjJpbnB1dCUyMiUzQSUyMjAlMjIlMkMlMjJleHBlY3RlZE91dHB1dCUyMiUzQSUyMjMyRiUyMiU3RCUyQyU3QiUyMmlucHV0JTIyJTNBJTIyMzclMjIlMkMlMjJleHBlY3RlZE91dHB1dCUyMiUzQSUyMjk4RiUyMiU3RCUyQyU3QiUyMmlucHV0JTIyJTNBJTIyLTQwJTIyJTJDJTIyZXhwZWN0ZWRPdXRwdXQlMjIlM0ElMjItNDBGJTIyJTdEJTJDJTdCJTIyaW5wdXQlMjIlM0ElMjIyNSUyMiUyQyUyMmV4cGVjdGVkT3V0cHV0JTIyJTNBJTIyNzdGJTIyJTdEJTVE",
  },
  {
    id: "sum-digits-009",
    title: "Sum of Digits",
    difficulty: "Easy",
    reward: 18,
    language: "java",
    languageId: 62,
    category: "Math & Logic",
    description:
      "Write a Java program that reads a positive integer and prints the sum of its digits. Use a loop — do not convert to a string.",
    inputDescription: "A single positive integer (1 ≤ n ≤ 999999).",
    outputDescription: "A single integer — the sum of all digits.",
    sampleInput: "1234",
    sampleOutput: "10",
    starterCode: JAVA_STARTER,
    _tc: "JTVCJTdCJTIyaW5wdXQlMjIlM0ElMjIxMjM0JTIyJTJDJTIyZXhwZWN0ZWRPdXRwdXQlMjIlM0ElMjIxMCUyMiU3RCUyQyU3QiUyMmlucHV0JTIyJTNBJTIyOSUyMiUyQyUyMmV4cGVjdGVkT3V0cHV0JTIyJTNBJTIyOSUyMiU3RCUyQyU3QiUyMmlucHV0JTIyJTNBJTIyMTAwJTIyJTJDJTIyZXhwZWN0ZWRPdXRwdXQlMjIlM0ElMjIxJTIyJTdEJTJDJTdCJTIyaW5wdXQlMjIlM0ElMjI5OTk5OTklMjIlMkMlMjJleHBlY3RlZE91dHB1dCUyMiUzQSUyMjU0JTIyJTdEJTJDJTdCJTIyaW5wdXQlMjIlM0ElMjI1MDUlMjIlMkMlMjJleHBlY3RlZE91dHB1dCUyMiUzQSUyMjEwJTIyJTdEJTVE",
  },
  {
    id: "multiplication-table-010",
    title: "Multiplication Table",
    difficulty: "Easy",
    reward: 20,
    language: "java",
    languageId: 62,
    category: "Control Flow",
    description:
      'Write a Java program that reads an integer n and prints its multiplication table from 1 to 10. Each line should be in the format "n x i = result".',
    inputDescription: "A single integer n.",
    outputDescription: '10 lines, each in the format "n x i = result" where i goes from 1 to 10.',
    sampleInput: "5",
    sampleOutput:
      "5 x 1 = 5\n5 x 2 = 10\n5 x 3 = 15\n5 x 4 = 20\n5 x 5 = 25\n5 x 6 = 30\n5 x 7 = 35\n5 x 8 = 40\n5 x 9 = 45\n5 x 10 = 50",
    starterCode: JAVA_STARTER,
    _tc: "JTVCJTdCJTIyaW5wdXQlMjIlM0ElMjI1JTIyJTJDJTIyZXhwZWN0ZWRPdXRwdXQlMjIlM0ElMjI1JTIweCUyMDElMjAlM0QlMjA1JTVDbjUlMjB4JTIwMiUyMCUzRCUyMDEwJTVDbjUlMjB4JTIwMyUyMCUzRCUyMDE1JTVDbjUlMjB4JTIwNCUyMCUzRCUyMDIwJTVDbjUlMjB4JTIwNSUyMCUzRCUyMDI1JTVDbjUlMjB4JTIwNiUyMCUzRCUyMDMwJTVDbjUlMjB4JTIwNyUyMCUzRCUyMDM1JTVDbjUlMjB4JTIwOCUyMCUzRCUyMDQwJTVDbjUlMjB4JTIwOSUyMCUzRCUyMDQ1JTVDbjUlMjB4JTIwMTAlMjAlM0QlMjA1MCUyMiU3RCUyQyU3QiUyMmlucHV0JTIyJTNBJTIyMyUyMiUyQyUyMmV4cGVjdGVkT3V0cHV0JTIyJTNBJTIyMyUyMHglMjAxJTIwJTNEJTIwMyU1Q24zJTIweCUyMDIlMjAlM0QlMjA2JTVDbjMlMjB4JTIwMyUyMCUzRCUyMDklNUNuMyUyMHglMjA0JTIwJTNEJTIwMTIlNUNuMyUyMHglMjA1JTIwJTNEJTIwMTUlNUNuMyUyMHglMjA2JTIwJTNEJTIwMTglNUNuMyUyMHglMjA3JTIwJTNEJTIwMjElNUNuMyUyMHglMjA4JTIwJTNEJTIwMjQlNUNuMyUyMHglMjA5JTIwJTNEJTIwMjclNUNuMyUyMHglMjAxMCUyMCUzRCUyMDMwJTIyJTdEJTJDJTdCJTIyaW5wdXQlMjIlM0ElMjIxJTIyJTJDJTIyZXhwZWN0ZWRPdXRwdXQlMjIlM0ElMjIxJTIweCUyMDElMjAlM0QlMjAxJTVDbjElMjB4JTIwMiUyMCUzRCUyMDIlNUNuMSUyMHglMjAzJTIwJTNEJTIwMyU1Q24xJTIweCUyMDQlMjAlM0QlMjA0JTVDbjElMjB4JTIwNSUyMCUzRCUyMDUlNUNuMSUyMHglMjA2JTIwJTNEJTIwNiU1Q24xJTIweCUyMDclMjAlM0QlMjA3JTVDbjElMjB4JTIwOCUyMCUzRCUyMDglNUNuMSUyMHglMjA5JTIwJTNEJTIwOSU1Q24xJTIweCUyMDEwJTIwJTNEJTIwMTAlMjIlN0QlNUQ=",
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
    description:
      'Write a Java program that reads the number of students, then for each student reads their name and 3 exam scores. Print each student\'s name and average (rounded down to integer), then print the class average. Format: "Name: avg" per student, then "Class Average: avg" at the end.',
    inputDescription:
      "Line 1: integer n (number of students).\nFor each student: a line with name, then a line with 3 space-separated integer scores.",
    outputDescription:
      'n lines of "Name: avg" (integer, truncated), then one line "Class Average: avg" (integer, truncated).',
    sampleInput: "2\nAlice\n85 90 78\nBob\n70 65 80",
    sampleOutput: "Alice: 84\nBob: 71\nClass Average: 77",
    starterCode: JAVA_STARTER,
    _tc: "JTVCJTdCJTIyaW5wdXQlMjIlM0ElMjIyJTVDbkFsaWNlJTVDbjg1JTIwOTAlMjA3OCU1Q25Cb2IlNUNuNzAlMjA2NSUyMDgwJTIyJTJDJTIyZXhwZWN0ZWRPdXRwdXQlMjIlM0ElMjJBbGljZSUzQSUyMDg0JTVDbkJvYiUzQSUyMDcxJTVDbkNsYXNzJTIwQXZlcmFnZSUzQSUyMDc3JTIyJTdEJTJDJTdCJTIyaW5wdXQlMjIlM0ElMjIxJTVDbkNhcmxhJTVDbjEwMCUyMDEwMCUyMDEwMCUyMiUyQyUyMmV4cGVjdGVkT3V0cHV0JTIyJTNBJTIyQ2FybGElM0ElMjAxMDAlNUNuQ2xhc3MlMjBBdmVyYWdlJTNBJTIwMTAwJTIyJTdEJTJDJTdCJTIyaW5wdXQlMjIlM0ElMjIzJTVDbkFuYSU1Q244MCUyMDgwJTIwODAlNUNuQmVuJTVDbjkwJTIwOTAlMjA5MCU1Q25DYWwlNUNuNzAlMjA3MCUyMDcwJTIyJTJDJTIyZXhwZWN0ZWRPdXRwdXQlMjIlM0ElMjJBbmElM0ElMjA4MCU1Q25CZW4lM0ElMjA5MCU1Q25DYWwlM0ElMjA3MCU1Q25DbGFzcyUyMEF2ZXJhZ2UlM0ElMjA4MCUyMiU3RCU1RA==",
  },
  {
    id: "palindrome-check-012",
    title: "Palindrome Checker",
    difficulty: "Medium",
    reward: 50,
    language: "java",
    languageId: 62,
    category: "Strings",
    description:
      'Write a Java program that reads a string and determines if it is a palindrome. Ignore case and spaces. Print "Palindrome" or "Not Palindrome".',
    inputDescription: "A single line containing a string.",
    outputDescription: '"Palindrome" or "Not Palindrome".',
    sampleInput: "Race Car",
    sampleOutput: "Palindrome",
    starterCode: JAVA_STARTER,
    _tc: "JTVCJTdCJTIyaW5wdXQlMjIlM0ElMjJSYWNlJTIwQ2FyJTIyJTJDJTIyZXhwZWN0ZWRPdXRwdXQlMjIlM0ElMjJQYWxpbmRyb21lJTIyJTdEJTJDJTdCJTIyaW5wdXQlMjIlM0ElMjJoZWxsbyUyMiUyQyUyMmV4cGVjdGVkT3V0cHV0JTIyJTNBJTIyTm90JTIwUGFsaW5kcm9tZSUyMiU3RCUyQyU3QiUyMmlucHV0JTIyJTNBJTIyQSUyMG1hbiUyMGElMjBwbGFuJTIwYSUyMGNhbmFsJTIwUGFuYW1hJTIyJTJDJTIyZXhwZWN0ZWRPdXRwdXQlMjIlM0ElMjJQYWxpbmRyb21lJTIyJTdEJTJDJTdCJTIyaW5wdXQlMjIlM0ElMjJKYXZhJTIyJTJDJTIyZXhwZWN0ZWRPdXRwdXQlMjIlM0ElMjJOb3QlMjBQYWxpbmRyb21lJTIyJTdEJTJDJTdCJTIyaW5wdXQlMjIlM0ElMjJtYWRhbSUyMiUyQyUyMmV4cGVjdGVkT3V0cHV0JTIyJTNBJTIyUGFsaW5kcm9tZSUyMiU3RCU1RA==",
  },
  {
    id: "array-stats-013",
    title: "Array Statistics",
    difficulty: "Medium",
    reward: 55,
    language: "java",
    languageId: 62,
    category: "Arrays",
    description:
      'Write a Java program that reads n integers and prints the minimum, maximum, and average (truncated to integer). Format the output as three lines: "Min: X", "Max: Y", "Avg: Z".',
    inputDescription:
      "Line 1: integer n (number of elements).\nLine 2: n space-separated integers.",
    outputDescription:
      'Three lines:\n  "Min: X"\n  "Max: Y"\n  "Avg: Z" (integer, truncated)',
    sampleInput: "5\n3 7 1 9 4",
    sampleOutput: "Min: 1\nMax: 9\nAvg: 4",
    starterCode: JAVA_STARTER,
    _tc: "JTVCJTdCJTIyaW5wdXQlMjIlM0ElMjI1JTVDbjMlMjA3JTIwMSUyMDklMjA0JTIyJTJDJTIyZXhwZWN0ZWRPdXRwdXQlMjIlM0ElMjJNaW4lM0ElMjAxJTVDbk1heCUzQSUyMDklNUNuQXZnJTNBJTIwNCUyMiU3RCUyQyU3QiUyMmlucHV0JTIyJTNBJTIyMSU1Q240MiUyMiUyQyUyMmV4cGVjdGVkT3V0cHV0JTIyJTNBJTIyTWluJTNBJTIwNDIlNUNuTWF4JTNBJTIwNDIlNUNuQXZnJTNBJTIwNDIlMjIlN0QlMkMlN0IlMjJpbnB1dCUyMiUzQSUyMjMlNUNuMTAlMjAyMCUyMDMwJTIyJTJDJTIyZXhwZWN0ZWRPdXRwdXQlMjIlM0ElMjJNaW4lM0ElMjAxMCU1Q25NYXglM0ElMjAzMCU1Q25BdmclM0ElMjAyMCUyMiU3RCUyQyU3QiUyMmlucHV0JTIyJTNBJTIyNCU1Q24tNSUyMDAlMjA1JTIwMTAlMjIlMkMlMjJleHBlY3RlZE91dHB1dCUyMiUzQSUyMk1pbiUzQSUyMC01JTVDbk1heCUzQSUyMDEwJTVDbkF2ZyUzQSUyMDIlMjIlN0QlNUQ=",
  },
  {
    id: "payroll-calc-014",
    title: "Payroll Calculator",
    difficulty: "Medium",
    reward: 55,
    language: "java",
    languageId: 62,
    category: "Control Flow",
    description:
      'Write a Java program that calculates an employee\'s weekly pay. Read hours worked and hourly rate. Overtime (over 40 hours) is paid at 1.5x the rate. Print the total pay as an integer (truncated).\n\nFormula:\n  If hours ≤ 40: pay = hours × rate\n  If hours > 40: pay = (40 × rate) + ((hours − 40) × rate × 1.5)',
    inputDescription:
      "Two integers on separate lines: hours worked and hourly rate.",
    outputDescription: 'A single line: "Pay: X" where X is the total pay (integer, truncated).',
    sampleInput: "45\n20",
    sampleOutput: "Pay: 950",
    starterCode: JAVA_STARTER,
    _tc: "JTVCJTdCJTIyaW5wdXQlMjIlM0ElMjI0NSU1Q24yMCUyMiUyQyUyMmV4cGVjdGVkT3V0cHV0JTIyJTNBJTIyUGF5JTNBJTIwOTUwJTIyJTdEJTJDJTdCJTIyaW5wdXQlMjIlM0ElMjI0MCU1Q24yNSUyMiUyQyUyMmV4cGVjdGVkT3V0cHV0JTIyJTNBJTIyUGF5JTNBJTIwMTAwMCUyMiU3RCUyQyU3QiUyMmlucHV0JTIyJTNBJTIyMzUlNUNuMTUlMjIlMkMlMjJleHBlY3RlZE91dHB1dCUyMiUzQSUyMlBheSUzQSUyMDUyNSUyMiU3RCUyQyU3QiUyMmlucHV0JTIyJTNBJTIyNTAlNUNuMTAlMjIlMkMlMjJleHBlY3RlZE91dHB1dCUyMiUzQSUyMlBheSUzQSUyMDU1MCUyMiU3RCUyQyU3QiUyMmlucHV0JTIyJTNBJTIyMCU1Q24xMDAlMjIlMkMlMjJleHBlY3RlZE91dHB1dCUyMiUzQSUyMlBheSUzQSUyMDAlMjIlN0QlNUQ=",
  },
  {
    id: "vowel-count-015",
    title: "Vowel & Consonant Counter",
    difficulty: "Medium",
    reward: 60,
    language: "java",
    languageId: 62,
    category: "Strings",
    description:
      'Write a Java program that reads a string and counts the number of vowels (a, e, i, o, u — case insensitive) and consonants (letters that are not vowels). Ignore non-letter characters (spaces, digits, symbols).',
    inputDescription: "A single line containing a string.",
    outputDescription:
      'Two lines:\n  "Vowels: X"\n  "Consonants: Y"',
    sampleInput: "Hello World 123",
    sampleOutput: "Vowels: 3\nConsonants: 7",
    starterCode: JAVA_STARTER,
    _tc: "JTVCJTdCJTIyaW5wdXQlMjIlM0ElMjJIZWxsbyUyMFdvcmxkJTIwMTIzJTIyJTJDJTIyZXhwZWN0ZWRPdXRwdXQlMjIlM0ElMjJWb3dlbHMlM0ElMjAzJTVDbkNvbnNvbmFudHMlM0ElMjA3JTIyJTdEJTJDJTdCJTIyaW5wdXQlMjIlM0ElMjJhZWlvdSUyMiUyQyUyMmV4cGVjdGVkT3V0cHV0JTIyJTNBJTIyVm93ZWxzJTNBJTIwNSU1Q25Db25zb25hbnRzJTNBJTIwMCUyMiU3RCUyQyU3QiUyMmlucHV0JTIyJTNBJTIyYmNkZmclMjIlMkMlMjJleHBlY3RlZE91dHB1dCUyMiUzQSUyMlZvd2VscyUzQSUyMDAlNUNuQ29uc29uYW50cyUzQSUyMDUlMjIlN0QlMkMlN0IlMjJpbnB1dCUyMiUzQSUyMkphdmElMjBQcm9ncmFtbWluZyUyMiUyQyUyMmV4cGVjdGVkT3V0cHV0JTIyJTNBJTIyVm93ZWxzJTNBJTIwNSU1Q25Db25zb25hbnRzJTNBJTIwMTAlMjIlN0QlMkMlN0IlMjJpbnB1dCUyMiUzQSUyMjEyMyElNDAlMjMlMjIlMkMlMjJleHBlY3RlZE91dHB1dCUyMiUzQSUyMlZvd2VscyUzQSUyMDAlNUNuQ29uc29uYW50cyUzQSUyMDAlMjIlN0QlNUQ=",
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
    description:
      'Simulate a simple bank account. Read the initial balance, then process a series of transactions. Each transaction is either "D amount" (deposit) or "W amount" (withdrawal). Withdrawals that exceed the balance should be skipped (print "Insufficient funds"). After all transactions, print the final balance.\n\nAll amounts are integers.',
    inputDescription:
      'Line 1: integer — initial balance.\nLine 2: integer n — number of transactions.\nNext n lines: "D amount" or "W amount".',
    outputDescription:
      'For each failed withdrawal, print "Insufficient funds".\nLast line: "Balance: X".',
    sampleInput: "1000\n3\nD 500\nW 200\nW 2000",
    sampleOutput: "Insufficient funds\nBalance: 1300",
    starterCode: JAVA_STARTER,
    _tc: "JTVCJTdCJTIyaW5wdXQlMjIlM0ElMjIxMDAwJTVDbjMlNUNuRCUyMDUwMCU1Q25XJTIwMjAwJTVDblclMjAyMDAwJTIyJTJDJTIyZXhwZWN0ZWRPdXRwdXQlMjIlM0ElMjJJbnN1ZmZpY2llbnQlMjBmdW5kcyU1Q25CYWxhbmNlJTNBJTIwMTMwMCUyMiU3RCUyQyU3QiUyMmlucHV0JTIyJTNBJTIyMCU1Q24yJTVDbkQlMjAxMDAlNUNuVyUyMDEwMCUyMiUyQyUyMmV4cGVjdGVkT3V0cHV0JTIyJTNBJTIyQmFsYW5jZSUzQSUyMDAlMjIlN0QlMkMlN0IlMjJpbnB1dCUyMiUzQSUyMjUwMCU1Q240JTVDblclMjAxMDAlNUNuVyUyMDEwMCU1Q25XJTIwMTAwJTVDblclMjAzMDAlMjIlMkMlMjJleHBlY3RlZE91dHB1dCUyMiUzQSUyMkluc3VmZmljaWVudCUyMGZ1bmRzJTVDbkJhbGFuY2UlM0ElMjAyMDAlMjIlN0QlMkMlN0IlMjJpbnB1dCUyMiUzQSUyMjEwMCU1Q24xJTVDblclMjAxMDAlMjIlMkMlMjJleHBlY3RlZE91dHB1dCUyMiUzQSUyMkJhbGFuY2UlM0ElMjAwJTIyJTdEJTVE",
  },
  {
    id: "matrix-add-017",
    title: "Matrix Addition",
    difficulty: "Hard",
    reward: 75,
    language: "java",
    languageId: 62,
    category: "Arrays",
    description:
      "Write a Java program that reads two matrices of the same dimensions and prints their sum. Each element in the result is the sum of the corresponding elements from the two input matrices.",
    inputDescription:
      "Line 1: two integers — rows and cols.\nNext 'rows' lines: first matrix (space-separated integers).\nNext 'rows' lines: second matrix (space-separated integers).",
    outputDescription:
      "The resulting matrix, one row per line, elements separated by spaces.",
    sampleInput: "2 3\n1 2 3\n4 5 6\n7 8 9\n10 11 12",
    sampleOutput: "8 10 12\n14 16 18",
    starterCode: JAVA_STARTER,
    _tc: "JTVCJTdCJTIyaW5wdXQlMjIlM0ElMjIyJTIwMyU1Q24xJTIwMiUyMDMlNUNuNCUyMDUlMjA2JTVDbjclMjA4JTIwOSU1Q24xMCUyMDExJTIwMTIlMjIlMkMlMjJleHBlY3RlZE91dHB1dCUyMiUzQSUyMjglMjAxMCUyMDEyJTVDbjE0JTIwMTYlMjAxOCUyMiU3RCUyQyU3QiUyMmlucHV0JTIyJTNBJTIyMSUyMDElNUNuNSU1Q24zJTIyJTJDJTIyZXhwZWN0ZWRPdXRwdXQlMjIlM0ElMjI4JTIyJTdEJTJDJTdCJTIyaW5wdXQlMjIlM0ElMjIyJTIwMiU1Q24wJTIwMCU1Q24wJTIwMCU1Q24xJTIwMSU1Q24xJTIwMSUyMiUyQyUyMmV4cGVjdGVkT3V0cHV0JTIyJTNBJTIyMSUyMDElNUNuMSUyMDElMjIlN0QlMkMlN0IlMjJpbnB1dCUyMiUzQSUyMjMlMjAxJTVDbjElNUNuMiU1Q24zJTVDbjQlNUNuNSU1Q242JTIyJTJDJTIyZXhwZWN0ZWRPdXRwdXQlMjIlM0ElMjI1JTVDbjclNUNuOSUyMiU3RCU1RA==",
  },
  {
    id: "word-frequency-018",
    title: "Word Frequency Counter",
    difficulty: "Hard",
    reward: 85,
    language: "java",
    languageId: 62,
    category: "Data Structures",
    description:
      'Write a Java program that reads a sentence and counts how many times each word appears. Print each unique word and its count in the order they first appear, one per line. Words are case-insensitive (convert all to lowercase). Words are separated by spaces only.',
    inputDescription: "A single line containing a sentence.",
    outputDescription:
      'One line per unique word: "word count" (lowercase, in order of first appearance).',
    sampleInput: "the cat sat on the mat the cat",
    sampleOutput: "the 3\ncat 2\nsat 1\non 1\nmat 1",
    starterCode: JAVA_STARTER,
    _tc: "JTVCJTdCJTIyaW5wdXQlMjIlM0ElMjJ0aGUlMjBjYXQlMjBzYXQlMjBvbiUyMHRoZSUyMG1hdCUyMHRoZSUyMGNhdCUyMiUyQyUyMmV4cGVjdGVkT3V0cHV0JTIyJTNBJTIydGhlJTIwMyU1Q25jYXQlMjAyJTVDbnNhdCUyMDElNUNub24lMjAxJTVDbm1hdCUyMDElMjIlN0QlMkMlN0IlMjJpbnB1dCUyMiUzQSUyMkhlbGxvJTIwaGVsbG8lMjBIRUxMTyUyMiUyQyUyMmV4cGVjdGVkT3V0cHV0JTIyJTNBJTIyaGVsbG8lMjAzJTIyJTdEJTJDJTdCJTIyaW5wdXQlMjIlM0ElMjJvbmUlMjIlMkMlMjJleHBlY3RlZE91dHB1dCUyMiUzQSUyMm9uZSUyMDElMjIlN0QlMkMlN0IlMjJpbnB1dCUyMiUzQSUyMkphdmElMjBpcyUyMGZ1biUyMGFuZCUyMEphdmElMjBpcyUyMHBvd2VyZnVsJTIyJTJDJTIyZXhwZWN0ZWRPdXRwdXQlMjIlM0ElMjJqYXZhJTIwMiU1Q25pcyUyMDIlNUNuZnVuJTIwMSU1Q25hbmQlMjAxJTVDbnBvd2VyZnVsJTIwMSUyMiU3RCU1RA==",
  },
  {
    id: "pattern-print-019",
    title: "Diamond Pattern",
    difficulty: "Hard",
    reward: 80,
    language: "java",
    languageId: 62,
    category: "Control Flow",
    description:
      "Write a Java program that reads an odd positive integer n and prints a diamond pattern made of asterisks (*). The diamond has n rows at its widest point. Use spaces for alignment — no trailing spaces on any line.",
    inputDescription: "A single odd positive integer n (1 ≤ n ≤ 21).",
    outputDescription:
      "A diamond pattern of asterisks, n rows tall at the widest.",
    sampleInput: "5",
    sampleOutput: "  *\n ***\n*****\n ***\n  *",
    starterCode: JAVA_STARTER,
    _tc: "JTVCJTdCJTIyaW5wdXQlMjIlM0ElMjI1JTIyJTJDJTIyZXhwZWN0ZWRPdXRwdXQlMjIlM0ElMjIlMjAlMjAqJTVDbiUyMCoqKiU1Q24qKioqKiU1Q24lMjAqKiolNUNuJTIwJTIwKiUyMiU3RCUyQyU3QiUyMmlucHV0JTIyJTNBJTIyMSUyMiUyQyUyMmV4cGVjdGVkT3V0cHV0JTIyJTNBJTIyKiUyMiU3RCUyQyU3QiUyMmlucHV0JTIyJTNBJTIyMyUyMiUyQyUyMmV4cGVjdGVkT3V0cHV0JTIyJTNBJTIyJTIwKiU1Q24qKiolNUNuJTIwKiUyMiU3RCUyQyU3QiUyMmlucHV0JTIyJTNBJTIyNyUyMiUyQyUyMmV4cGVjdGVkT3V0cHV0JTIyJTNBJTIyJTIwJTIwJTIwKiU1Q24lMjAlMjAqKiolNUNuJTIwKioqKiolNUNuKioqKioqKiU1Q24lMjAqKioqKiU1Q24lMjAlMjAqKiolNUNuJTIwJTIwJTIwKiUyMiU3RCU1RA==",
  },
  {
    id: "inventory-mgr-020",
    title: "Inventory Manager",
    difficulty: "Hard",
    reward: 90,
    language: "java",
    languageId: 62,
    category: "Data Structures",
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
    _tc: "JTVCJTdCJTIyaW5wdXQlMjIlM0ElMjIzJTVDbkFwcGxlJTIwMTAlMjA1JTVDbkJhbmFuYSUyMDUlMjAzJTVDbkNoZXJyeSUyMDAlMjA4JTVDbjQlNUNuU0VMTCUyMEFwcGxlJTIwMyU1Q25TRUxMJTIwQ2hlcnJ5JTIwMSU1Q25SRVNUT0NLJTIwQ2hlcnJ5JTIwMTAlNUNuUkVQT1JUJTIyJTJDJTIyZXhwZWN0ZWRPdXRwdXQlMjIlM0ElMjJPdXQlMjBvZiUyMHN0b2NrJTNBJTIwQ2hlcnJ5JTVDbkFwcGxlJTIwNyUyMDUlNUNuQmFuYW5hJTIwNSUyMDMlNUNuQ2hlcnJ5JTIwMTAlMjA4JTIyJTdEJTJDJTdCJTIyaW5wdXQlMjIlM0ElMjIxJTVDbldpZGdldCUyMDUlMjAxMCU1Q24zJTVDblNFTEwlMjBXaWRnZXQlMjA1JTVDblNFTEwlMjBXaWRnZXQlMjAxJTVDblJFUE9SVCUyMiUyQyUyMmV4cGVjdGVkT3V0cHV0JTIyJTNBJTIyT3V0JTIwb2YlMjBzdG9jayUzQSUyMFdpZGdldCUyMiU3RCUyQyU3QiUyMmlucHV0JTIyJTNBJTIyMiU1Q25NaWxrJTIwMyUyMDQlNUNuQnJlYWQlMjAyJTIwMyU1Q24yJTVDblJFU1RPQ0slMjBNaWxrJTIwNyU1Q25SRVBPUlQlMjIlMkMlMjJleHBlY3RlZE91dHB1dCUyMiUzQSUyMkJyZWFkJTIwMiUyMDMlNUNuTWlsayUyMDEwJTIwNCUyMiU3RCU1RA==",
  },

  // ═══════════════════════════════════════════════════════════════════
  //  ADDITIONAL CHALLENGES (21–30) — Professor-Style
  // ═══════════════════════════════════════════════════════════════════
  {
    id: "factorial-021",
    title: "Factorial Calculator",
    difficulty: "Easy",
    reward: 18,
    language: "java",
    languageId: 62,
    category: "Math & Logic",
    description:
      "Write a Java program that reads a non-negative integer n and prints its factorial (n!). Use a loop — do not use recursion. Remember: 0! = 1.",
    inputDescription: "A single non-negative integer n (0 ≤ n ≤ 20).",
    outputDescription: "A single integer — n! (the factorial of n).",
    sampleInput: "5",
    sampleOutput: "120",
    starterCode: JAVA_STARTER,
    _tc: "JTVCJTdCJTIyaW5wdXQlMjIlM0ElMjI1JTIyJTJDJTIyZXhwZWN0ZWRPdXRwdXQlMjIlM0ElMjIxMjAlMjIlN0QlMkMlN0IlMjJpbnB1dCUyMiUzQSUyMjAlMjIlMkMlMjJleHBlY3RlZE91dHB1dCUyMiUzQSUyMjElMjIlN0QlMkMlN0IlMjJpbnB1dCUyMiUzQSUyMjElMjIlMkMlMjJleHBlY3RlZE91dHB1dCUyMiUzQSUyMjElMjIlN0QlMkMlN0IlMjJpbnB1dCUyMiUzQSUyMjEwJTIyJTJDJTIyZXhwZWN0ZWRPdXRwdXQlMjIlM0ElMjIzNjI4ODAwJTIyJTdEJTJDJTdCJTIyaW5wdXQlMjIlM0ElMjIxMiUyMiUyQyUyMmV4cGVjdGVkT3V0cHV0JTIyJTNBJTIyNDc5MDAxNjAwJTIyJTdEJTVE",
  },
  {
    id: "char-freq-022",
    title: "Character Frequency",
    difficulty: "Medium",
    reward: 55,
    language: "java",
    languageId: 62,
    category: "Strings",
    description:
      'Write a Java program that reads a string and prints the frequency of each unique character in alphabetical order. Only count alphabetic characters (a-z, case insensitive). Output each character in lowercase followed by its count.',
    inputDescription: "A single line containing a string.",
    outputDescription:
      'One line per unique alphabetic character: "c count" (lowercase, alphabetically sorted).',
    sampleInput: "Hello World!",
    sampleOutput: "d 1\ne 1\nh 1\nl 3\no 2\nr 1\nw 1",
    starterCode: JAVA_STARTER,
    _tc: "JTVCJTdCJTIyaW5wdXQlMjIlM0ElMjJIZWxsbyUyMFdvcmxkISUyMiUyQyUyMmV4cGVjdGVkT3V0cHV0JTIyJTNBJTIyZCUyMDElNUNuZSUyMDElNUNuaCUyMDElNUNubCUyMDMlNUNubyUyMDIlNUNuciUyMDElNUNudyUyMDElMjIlN0QlMkMlN0IlMjJpbnB1dCUyMiUzQSUyMmFhYSUyMiUyQyUyMmV4cGVjdGVkT3V0cHV0JTIyJTNBJTIyYSUyMDMlMjIlN0QlMkMlN0IlMjJpbnB1dCUyMiUzQSUyMkFiQmElMjIlMkMlMjJleHBlY3RlZE91dHB1dCUyMiUzQSUyMmElMjAyJTVDbmIlMjAyJTIyJTdEJTJDJTdCJTIyaW5wdXQlMjIlM0ElMjIxMjMhJTQwJTIzJTIyJTJDJTIyZXhwZWN0ZWRPdXRwdXQlMjIlM0ElMjIlMjIlN0QlNUQ=",
  },
  {
    id: "prime-check-023",
    title: "Prime Number Checker",
    difficulty: "Medium",
    reward: 50,
    language: "java",
    languageId: 62,
    category: "Math & Logic",
    description:
      'Write a Java program that reads n integers, one per line, and for each one prints "Prime" or "Not Prime". A prime number is an integer greater than 1 that has no positive divisors other than 1 and itself.',
    inputDescription:
      "Line 1: integer n — how many numbers to check.\nNext n lines: one integer per line.",
    outputDescription: 'n lines, each "Prime" or "Not Prime".',
    sampleInput: "4\n2\n4\n7\n1",
    sampleOutput: "Prime\nNot Prime\nPrime\nNot Prime",
    starterCode: JAVA_STARTER,
    _tc: "JTVCJTdCJTIyaW5wdXQlMjIlM0ElMjI0JTVDbjIlNUNuNCU1Q243JTVDbjElMjIlMkMlMjJleHBlY3RlZE91dHB1dCUyMiUzQSUyMlByaW1lJTVDbk5vdCUyMFByaW1lJTVDblByaW1lJTVDbk5vdCUyMFByaW1lJTIyJTdEJTJDJTdCJTIyaW5wdXQlMjIlM0ElMjIzJTVDbjEzJTVDbjE1JTVDbjE3JTIyJTJDJTIyZXhwZWN0ZWRPdXRwdXQlMjIlM0ElMjJQcmltZSU1Q25Ob3QlMjBQcmltZSU1Q25QcmltZSUyMiU3RCUyQyU3QiUyMmlucHV0JTIyJTNBJTIyMSU1Q24wJTIyJTJDJTIyZXhwZWN0ZWRPdXRwdXQlMjIlM0ElMjJOb3QlMjBQcmltZSUyMiU3RCUyQyU3QiUyMmlucHV0JTIyJTNBJTIyMiU1Q245NyU1Q24xMDAlMjIlMkMlMjJleHBlY3RlZE91dHB1dCUyMiUzQSUyMlByaW1lJTVDbk5vdCUyMFByaW1lJTIyJTdEJTVE",
  },
  {
    id: "linked-list-024",
    title: "Singly Linked List Operations",
    difficulty: "Hard",
    reward: 85,
    language: "java",
    languageId: 62,
    category: "Data Structures",
    description:
      'Simulate a singly linked list using arrays. Start with an empty list and process commands:\n  "INSERT x" — insert integer x at the end\n  "DELETE x" — remove the first occurrence of x (print "Not found: x" if absent)\n  "PRINT" — print all elements space-separated on one line (print "Empty" if list is empty)',
    inputDescription:
      "Line 1: integer c — number of commands.\nNext c lines: commands (INSERT x, DELETE x, or PRINT).",
    outputDescription:
      'For DELETE failures: "Not found: x".\nFor PRINT: elements space-separated, or "Empty".',
    sampleInput: "6\nINSERT 10\nINSERT 20\nINSERT 30\nDELETE 20\nDELETE 99\nPRINT",
    sampleOutput: "Not found: 99\n10 30",
    starterCode: JAVA_STARTER,
    _tc: "JTVCJTdCJTIyaW5wdXQlMjIlM0ElMjI2JTVDbklOU0VSVCUyMDEwJTVDbklOU0VSVCUyMDIwJTVDbklOU0VSVCUyMDMwJTVDbkRFTEVURSUyMDIwJTVDbkRFTEVURSUyMDk5JTVDblBSSU5UJTIyJTJDJTIyZXhwZWN0ZWRPdXRwdXQlMjIlM0ElMjJOb3QlMjBmb3VuZCUzQSUyMDk5JTVDbjEwJTIwMzAlMjIlN0QlMkMlN0IlMjJpbnB1dCUyMiUzQSUyMjIlNUNuREVMRVRFJTIwNSU1Q25QUklOVCUyMiUyQyUyMmV4cGVjdGVkT3V0cHV0JTIyJTNBJTIyTm90JTIwZm91bmQlM0ElMjA1JTVDbkVtcHR5JTIyJTdEJTJDJTdCJTIyaW5wdXQlMjIlM0ElMjI0JTVDbklOU0VSVCUyMDElNUNuSU5TRVJUJTIwMSU1Q25ERUxFVEUlMjAxJTVDblBSSU5UJTIyJTJDJTIyZXhwZWN0ZWRPdXRwdXQlMjIlM0ElMjIxJTIyJTdEJTJDJTdCJTIyaW5wdXQlMjIlM0ElMjI1JTVDbklOU0VSVCUyMDUlNUNuSU5TRVJUJTIwMTAlNUNuSU5TRVJUJTIwMTUlNUNuREVMRVRFJTIwNSU1Q25QUklOVCUyMiUyQyUyMmV4cGVjdGVkT3V0cHV0JTIyJTNBJTIyMTAlMjAxNSUyMiU3RCU1RA==",
  },
  {
    id: "student-gpa-025",
    title: "Student GPA Calculator",
    difficulty: "Hard",
    reward: 80,
    language: "java",
    languageId: 62,
    category: "OOP",
    description:
      'Simulate a student grade book. Read student data and compute GPAs.\n\nGPA scale (per course): A=4.0, B=3.0, C=2.0, D=1.0, F=0.0\nGPA = sum of grade points / number of courses (truncated to 1 decimal).\n\nFor each student, print "Name: GPA" where GPA is truncated to 1 decimal. Then print the student with the highest GPA: "Top: Name".\nIf there is a tie, print the first one alphabetically.',
    inputDescription:
      'Line 1: integer n — number of students.\nFor each student:\n  Line 1: name\n  Line 2: integer c — number of courses\n  Next c lines: grade letter (A, B, C, D, or F)',
    outputDescription:
      'n lines of "Name: GPA" (1 decimal), then "Top: Name".',
    sampleInput: "2\nAlice\n3\nA\nB\nA\nBob\n2\nB\nC",
    sampleOutput: "Alice: 3.6\nBob: 2.5\nTop: Alice",
    starterCode: JAVA_STARTER,
    _tc: "JTVCJTdCJTIyaW5wdXQlMjIlM0ElMjIyJTVDbkFsaWNlJTVDbjMlNUNuQSU1Q25CJTVDbkElNUNuQm9iJTVDbjIlNUNuQiU1Q25DJTIyJTJDJTIyZXhwZWN0ZWRPdXRwdXQlMjIlM0ElMjJBbGljZSUzQSUyMDMuNiU1Q25Cb2IlM0ElMjAyLjUlNUNuVG9wJTNBJTIwQWxpY2UlMjIlN0QlMkMlN0IlMjJpbnB1dCUyMiUzQSUyMjElNUNuRXZhJTVDbjQlNUNuQSU1Q25BJTVDbkElNUNuQSUyMiUyQyUyMmV4cGVjdGVkT3V0cHV0JTIyJTNBJTIyRXZhJTNBJTIwNC4wJTVDblRvcCUzQSUyMEV2YSUyMiU3RCUyQyU3QiUyMmlucHV0JTIyJTNBJTIyMyU1Q25BbmElNUNuMSU1Q25DJTVDbkJlbiU1Q24xJTVDbkMlNUNuQ2FsJTVDbjElNUNuQSUyMiUyQyUyMmV4cGVjdGVkT3V0cHV0JTIyJTNBJTIyQW5hJTNBJTIwMi4wJTVDbkJlbiUzQSUyMDIuMCU1Q25DYWwlM0ElMjA0LjAlNUNuVG9wJTNBJTIwQ2FsJTIyJTdEJTJDJTdCJTIyaW5wdXQlMjIlM0ElMjIyJTVDblpvZSU1Q24yJTVDbkElNUNuQiU1Q25BbXklNUNuMiU1Q25BJTVDbkIlMjIlMkMlMjJleHBlY3RlZE91dHB1dCUyMiUzQSUyMlpvZSUzQSUyMDMuNSU1Q25BbXklM0ElMjAzLjUlNUNuVG9wJTNBJTIwQW15JTIyJTdEJTVE",
  },

  // ─── Challenges 26–30 ────────────────────────────────────────────
  {
    id: "stack-ops-026",
    title: "Stack Using Array",
    difficulty: "Hard",
    reward: 85,
    language: "java",
    languageId: 62,
    category: "Data Structures",
    description:
      'Simulate a stack (LIFO) using an array. Process commands:\n  "PUSH x" — push integer x onto the stack\n  "POP" — pop the top element and print it (print "Stack is empty" if empty)\n  "PEEK" — print the top element without removing it (print "Stack is empty" if empty)\n  "SIZE" — print the current number of elements',
    inputDescription:
      'Line 1: integer c — number of commands.\nNext c lines: commands (PUSH x, POP, PEEK, SIZE).',
    outputDescription:
      'One output line per POP, PEEK, and SIZE command.',
    sampleInput: "7\nPUSH 5\nPUSH 10\nPEEK\nPOP\nPOP\nPOP\nSIZE",
    sampleOutput: "10\n10\n5\nStack is empty\n0",
    starterCode: JAVA_STARTER,
    _tc: "JTVCJTdCJTIyaW5wdXQlMjIlM0ElMjI3JTVDblBVU0glMjA1JTVDblBVU0glMjAxMCU1Q25QRUVLJTVDblBPUCU1Q25QT1AlNUNuUE9QJTVDblNJWkUlMjIlMkMlMjJleHBlY3RlZE91dHB1dCUyMiUzQSUyMjEwJTVDbjEwJTVDbjUlNUNuU3RhY2slMjBpcyUyMGVtcHR5JTVDbjAlMjIlN0QlMkMlN0IlMjJpbnB1dCUyMiUzQSUyMjMlNUNuUE9QJTVDblBVU0glMjAxJTVDblNJWkUlMjIlMkMlMjJleHBlY3RlZE91dHB1dCUyMiUzQSUyMlN0YWNrJTIwaXMlMjBlbXB0eSU1Q24xJTIyJTdEJTJDJTdCJTIyaW5wdXQlMjIlM0ElMjI1JTVDblBVU0glMjAzJTVDblBVU0glMjA2JTVDblBVU0glMjA5JTVDblNJWkUlNUNuUEVFSyUyMiUyQyUyMmV4cGVjdGVkT3V0cHV0JTIyJTNBJTIyMyU1Q245JTIyJTdEJTVE",
  },
  {
    id: "number-pattern-027",
    title: "Number Triangle",
    difficulty: "Easy",
    reward: 15,
    language: "java",
    languageId: 62,
    category: "Control Flow",
    description:
      'Write a Java program that reads an integer n and prints a right-aligned triangle of numbers. Row i (1-indexed) contains the numbers 1 through i separated by spaces.',
    inputDescription: 'A single positive integer n (1 ≤ n ≤ 9).',
    outputDescription:
      'n lines. Row i contains "1 2 ... i".',
    sampleInput: "4",
    sampleOutput: "1\n1 2\n1 2 3\n1 2 3 4",
    starterCode: JAVA_STARTER,
    _tc: "JTVCJTdCJTIyaW5wdXQlMjIlM0ElMjI0JTIyJTJDJTIyZXhwZWN0ZWRPdXRwdXQlMjIlM0ElMjIxJTVDbjElMjAyJTVDbjElMjAyJTIwMyU1Q24xJTIwMiUyMDMlMjA0JTIyJTdEJTJDJTdCJTIyaW5wdXQlMjIlM0ElMjIxJTIyJTJDJTIyZXhwZWN0ZWRPdXRwdXQlMjIlM0ElMjIxJTIyJTdEJTJDJTdCJTIyaW5wdXQlMjIlM0ElMjIzJTIyJTJDJTIyZXhwZWN0ZWRPdXRwdXQlMjIlM0ElMjIxJTVDbjElMjAyJTVDbjElMjAyJTIwMyUyMiU3RCUyQyU3QiUyMmlucHV0JTIyJTNBJTIyNSUyMiUyQyUyMmV4cGVjdGVkT3V0cHV0JTIyJTNBJTIyMSU1Q24xJTIwMiU1Q24xJTIwMiUyMDMlNUNuMSUyMDIlMjAzJTIwNCU1Q24xJTIwMiUyMDMlMjA0JTIwNSUyMiU3RCU1RA==",
  },
  {
    id: "binary-convert-028",
    title: "Decimal to Binary",
    difficulty: "Easy",
    reward: 18,
    language: "java",
    languageId: 62,
    category: "Math & Logic",
    description:
      'Write a Java program that reads a positive integer and prints its binary representation. Do NOT use Integer.toBinaryString() — implement the conversion manually using division.',
    inputDescription: 'A single positive integer n (1 ≤ n ≤ 1023).',
    outputDescription: 'A single line containing the binary representation.',
    sampleInput: "10",
    sampleOutput: "1010",
    starterCode: JAVA_STARTER,
    _tc: "JTVCJTdCJTIyaW5wdXQlMjIlM0ElMjIxMCUyMiUyQyUyMmV4cGVjdGVkT3V0cHV0JTIyJTNBJTIyMTAxMCUyMiU3RCUyQyU3QiUyMmlucHV0JTIyJTNBJTIyMSUyMiUyQyUyMmV4cGVjdGVkT3V0cHV0JTIyJTNBJTIyMSUyMiU3RCUyQyU3QiUyMmlucHV0JTIyJTNBJTIyOCUyMiUyQyUyMmV4cGVjdGVkT3V0cHV0JTIyJTNBJTIyMTAwMCUyMiU3RCUyQyU3QiUyMmlucHV0JTIyJTNBJTIyMjU1JTIyJTJDJTIyZXhwZWN0ZWRPdXRwdXQlMjIlM0ElMjIxMTExMTExMSUyMiU3RCUyQyU3QiUyMmlucHV0JTIyJTNBJTIyMTAwJTIyJTJDJTIyZXhwZWN0ZWRPdXRwdXQlMjIlM0ElMjIxMTAwMTAwJTIyJTdEJTVE",
  },
  {
    id: "queue-sim-029",
    title: "Queue Simulator",
    difficulty: "Medium",
    reward: 55,
    language: "java",
    languageId: 62,
    category: "Data Structures",
    description:
      'Simulate a queue (FIFO). Process commands:\n  "ENQUEUE x" — add x to the back\n  "DEQUEUE" — remove and print the front element (print "Queue is empty" if empty)\n  "FRONT" — print the front element without removing (print "Queue is empty" if empty)\n  "SIZE" — print the number of elements',
    inputDescription:
      'Line 1: integer c — number of commands.\nNext c lines: commands (ENQUEUE x, DEQUEUE, FRONT, SIZE).',
    outputDescription:
      'One output line per DEQUEUE, FRONT, and SIZE command.',
    sampleInput: "7\nENQUEUE 1\nENQUEUE 2\nFRONT\nDEQUEUE\nDEQUEUE\nDEQUEUE\nSIZE",
    sampleOutput: "1\n1\n2\nQueue is empty\n0",
    starterCode: JAVA_STARTER,
    _tc: "JTVCJTdCJTIyaW5wdXQlMjIlM0ElMjI3JTVDbkVOUVVFVUUlMjAxJTVDbkVOUVVFVUUlMjAyJTVDbkZST05UJTVDbkRFUVVFVUUlNUNuREVRVUVVRSU1Q25ERVFVRVVFJTVDblNJWkUlMjIlMkMlMjJleHBlY3RlZE91dHB1dCUyMiUzQSUyMjElNUNuMSU1Q24yJTVDblF1ZXVlJTIwaXMlMjBlbXB0eSU1Q24wJTIyJTdEJTJDJTdCJTIyaW5wdXQlMjIlM0ElMjIyJTVDbkRFUVVFVUUlNUNuU0laRSUyMiUyQyUyMmV4cGVjdGVkT3V0cHV0JTIyJTNBJTIyUXVldWUlMjBpcyUyMGVtcHR5JTVDbjAlMjIlN0QlMkMlN0IlMjJpbnB1dCUyMiUzQSUyMjUlNUNuRU5RVUVVRSUyMDEwJTVDbkVOUVVFVUUlMjAyMCU1Q25FTlFVRVVFJTIwMzAlNUNuU0laRSU1Q25GUk9OVCUyMiUyQyUyMmV4cGVjdGVkT3V0cHV0JTIyJTNBJTIyMyU1Q24xMCUyMiU3RCU1RA==",
  },
  {
    id: "roman-convert-030",
    title: "Roman Numeral Converter",
    difficulty: "Medium",
    reward: 60,
    language: "java",
    languageId: 62,
    category: "Math & Logic",
    description:
      'Write a Java program that converts a positive integer to its Roman numeral representation.\n\nRoman numeral values:\n  M=1000, CM=900, D=500, CD=400, C=100, XC=90, L=50, XL=40, X=10, IX=9, V=5, IV=4, I=1',
    inputDescription: 'A single positive integer n (1 ≤ n ≤ 3999).',
    outputDescription: 'A single line containing the Roman numeral.',
    sampleInput: "2024",
    sampleOutput: "MMXXIV",
    starterCode: JAVA_STARTER,
    _tc: "JTVCJTdCJTIyaW5wdXQlMjIlM0ElMjIyMDI0JTIyJTJDJTIyZXhwZWN0ZWRPdXRwdXQlMjIlM0ElMjJNTVhYSVYlMjIlN0QlMkMlN0IlMjJpbnB1dCUyMiUzQSUyMjQlMjIlMkMlMjJleHBlY3RlZE91dHB1dCUyMiUzQSUyMklWJTIyJTdEJTJDJTdCJTIyaW5wdXQlMjIlM0ElMjI5JTIyJTJDJTIyZXhwZWN0ZWRPdXRwdXQlMjIlM0ElMjJJWCUyMiU3RCUyQyU3QiUyMmlucHV0JTIyJTNBJTIyMTk5NCUyMiUyQyUyMmV4cGVjdGVkT3V0cHV0JTIyJTNBJTIyTUNNWENJViUyMiU3RCUyQyU3QiUyMmlucHV0JTIyJTNBJTIyMzk5OSUyMiUyQyUyMmV4cGVjdGVkT3V0cHV0JTIyJTNBJTIyTU1NQ01YQ0lYJTIyJTdEJTJDJTdCJTIyaW5wdXQlMjIlM0ElMjIxJTIyJTJDJTIyZXhwZWN0ZWRPdXRwdXQlMjIlM0ElMjJJJTIyJTdEJTVE",
  },

  {
    id: "class-roster-031",
    title: "Class Roster Manager",
    difficulty: "Hard",
    reward: 85,
    language: "java",
    languageId: 62,
    category: "OOP",
    description:
      'Write a Java program that manages a class roster. Read n students (name and grade), then process queries:\n  "AVERAGE" — print the class average (rounded to 2 decimal places)\n  "HIGHEST" — print the name and grade of the student with the highest grade\n  "PASS" — print the count of students who scored 60 or above',
    inputDescription:
      'Line 1: integer n — number of students.\nNext n lines: name (single word) and grade (integer) separated by space.\nNext line: integer q — number of queries.\nNext q lines: query command (AVERAGE, HIGHEST, PASS).',
    outputDescription:
      'One output line per query.\n  AVERAGE → "Average: X.XX"\n  HIGHEST → "Highest: name (grade)"\n  PASS → "Passed: X"',
    sampleInput: "3\nAlice 88\nBob 72\nCarla 95\n2\nAVERAGE\nHIGHEST",
    sampleOutput: "Average: 85.00\nHighest: Carla (95)",
    starterCode: JAVA_STARTER,
    _tc: "JTVCJTdCJTIyaW5wdXQlMjIlM0ElMjIzJTVDJTVDbkFsaWNlJTIwODglNUMlNUNuQm9iJTIwNzIlNUMlNUNuQ2FybGElMjA5NSU1QyU1Q24yJTVDJTVDbkFWRVJBR0UlNUMlNUNuSElHSEVTVCUyMiUyQyUyMmV4cGVjdGVkT3V0cHV0JTIyJTNBJTIyQXZlcmFnZSUzQSUyMDg1LjAwJTVDJTVDbkhpZ2hlc3QlM0ElMjBDYXJsYSUyMCg5NSklMjIlN0QlMkMlN0IlMjJpbnB1dCUyMiUzQSUyMjQlNUMlNUNuQW5hJTIwNTklNUMlNUNuQmVuJTIwNjAlNUMlNUNuQ2FsJTIwMTAwJTVDJTVDbkRlZSUyMDQ1JTVDJTVDbjMlNUMlNUNuQVZFUkFHRSU1QyU1Q25QQVNTJTVDJTVDbkhJR0hFU1QlMjIlMkMlMjJleHBlY3RlZE91dHB1dCUyMiUzQSUyMkF2ZXJhZ2UlM0ElMjA2Ni4wMCU1QyU1Q25QYXNzZWQlM0ElMjAyJTVDJTVDbkhpZ2hlc3QlM0ElMjBDYWwlMjAoMTAwKSUyMiU3RCUyQyU3QiUyMmlucHV0JTIyJTNBJTIyMSU1QyU1Q25ab2UlMjAxMDAlNUMlNUNuMSU1QyU1Q25QQVNTJTIyJTJDJTIyZXhwZWN0ZWRPdXRwdXQlMjIlM0ElMjJQYXNzZWQlM0ElMjAxJTIyJTdEJTVE",
  },

  {
    id: "word-wrap-032",
    title: "Text Word Wrapper",
    difficulty: "Medium",
    reward: 55,
    language: "java",
    languageId: 62,
    category: "Strings",
    description:
      'Write a Java program that wraps text to fit within a specified line width. Read the maximum line width and a paragraph of text, then print the text wrapped so that no line exceeds the maximum width. Words should not be broken across lines. If a single word is longer than the max width, print it on its own line.',
    inputDescription:
      'Line 1: integer maxWidth — the maximum characters per line.\nLine 2: a paragraph of text (space-separated words).',
    outputDescription:
      'The wrapped text with each line not exceeding maxWidth characters.',
    sampleInput: "15\nThe quick brown fox jumps over the lazy dog",
    sampleOutput: "The quick brown\nfox jumps over\nthe lazy dog",
    starterCode: JAVA_STARTER,
    _tc: "JTVCJTdCJTIyaW5wdXQlMjIlM0ElMjIxNSU1QyU1Q25UaGUlMjBxdWljayUyMGJyb3duJTIwZm94JTIwanVtcHMlMjBvdmVyJTIwdGhlJTIwbGF6eSUyMGRvZyUyMiUyQyUyMmV4cGVjdGVkT3V0cHV0JTIyJTNBJTIyVGhlJTIwcXVpY2slMjBicm93biU1QyU1Q25mb3glMjBqdW1wcyUyMG92ZXIlNUMlNUNudGhlJTIwbGF6eSUyMGRvZyUyMiU3RCUyQyU3QiUyMmlucHV0JTIyJTNBJTIyMTAlNUMlNUNuSGVsbG8lMjBXb3JsZCUyMiUyQyUyMmV4cGVjdGVkT3V0cHV0JTIyJTNBJTIySGVsbG8lNUMlNUNuV29ybGQlMjIlN0QlMkMlN0IlMjJpbnB1dCUyMiUzQSUyMjUlNUMlNUNuSGklMjB0aGVyZSUyMGV2ZXJ5b25lJTIyJTJDJTIyZXhwZWN0ZWRPdXRwdXQlMjIlM0ElMjJIaSU1QyU1Q250aGVyZSU1QyU1Q25ldmVyeSU1QyU1Q25vbmUlMjIlN0QlNUQ=",
  },

  {
    id: "matrix-transpose-033",
    title: "Matrix Transpose",
    difficulty: "Easy",
    reward: 18,
    language: "java",
    languageId: 62,
    category: "Arrays",
    description:
      'Write a Java program that reads a matrix and prints its transpose. The transpose of a matrix swaps rows and columns — element at row i, column j moves to row j, column i.',
    inputDescription:
      'Line 1: two integers r and c — rows and columns.\nNext r lines: c space-separated integers per line.',
    outputDescription:
      'The transposed matrix (c rows, r columns), each row space-separated.',
    sampleInput: "2 3\n1 2 3\n4 5 6",
    sampleOutput: "1 4\n2 5\n3 6",
    starterCode: JAVA_STARTER,
    _tc: "JTVCJTdCJTIyaW5wdXQlMjIlM0ElMjIyJTIwMyU1QyU1Q24xJTIwMiUyMDMlNUMlNUNuNCUyMDUlMjA2JTIyJTJDJTIyZXhwZWN0ZWRPdXRwdXQlMjIlM0ElMjIxJTIwNCU1QyU1Q24yJTIwNSU1QyU1Q24zJTIwNiUyMiU3RCUyQyU3QiUyMmlucHV0JTIyJTNBJTIyMSUyMDQlNUMlNUNuMTAlMjAyMCUyMDMwJTIwNDAlMjIlMkMlMjJleHBlY3RlZE91dHB1dCUyMiUzQSUyMjEwJTVDJTVDbjIwJTVDJTVDbjMwJTVDJTVDbjQwJTIyJTdEJTJDJTdCJTIyaW5wdXQlMjIlM0ElMjIzJTIwMyU1QyU1Q24xJTIwMCUyMDAlNUMlNUNuMCUyMDElMjAwJTVDJTVDbjAlMjAwJTIwMSUyMiUyQyUyMmV4cGVjdGVkT3V0cHV0JTIyJTNBJTIyMSUyMDAlMjAwJTVDJTVDbjAlMjAxJTIwMCU1QyU1Q24wJTIwMCUyMDElMjIlN0QlNUQ=",
  },

  {
    id: "parking-lot-034",
    title: "Parking Lot Simulator",
    difficulty: "Hard",
    reward: 80,
    language: "java",
    languageId: 62,
    category: "Data Structures",
    description:
      'Simulate a parking lot with a fixed number of slots. Process commands:\n  "PARK plate" — assign the car to the first available slot (1-indexed). Print "Slot X" or "Lot Full" if no slot is open.\n  "LEAVE X" — free slot X. Print "Slot X is free" or "Slot X is already empty".\n  "STATUS" — print all occupied slots in order: "Slot X: plate"',
    inputDescription:
      'Line 1: integer n — number of parking slots.\nLine 2: integer c — number of commands.\nNext c lines: commands.',
    outputDescription:
      'One output line per command.',
    sampleInput: "2\n5\nPARK ABC123\nPARK XYZ789\nPARK QQQ111\nSTATUS\nLEAVE 1",
    sampleOutput: "Slot 1\nSlot 2\nLot Full\nSlot 1: ABC123\nSlot 2: XYZ789\nSlot 1 is free",
    starterCode: JAVA_STARTER,
    _tc: "JTVCJTdCJTIyaW5wdXQlMjIlM0ElMjIyJTVDJTVDbjUlNUMlNUNuUEFSSyUyMEFCQzEyMyU1QyU1Q25QQVJLJTIwWFlaNzg5JTVDJTVDblBBUkslMjBRUVExMTElNUMlNUNuU1RBVFVTJTVDJTVDbkxFQVZFJTIwMSUyMiUyQyUyMmV4cGVjdGVkT3V0cHV0JTIyJTNBJTIyU2xvdCUyMDElNUMlNUNuU2xvdCUyMDIlNUMlNUNuTG90JTIwRnVsbCU1QyU1Q25TbG90JTIwMSUzQSUyMEFCQzEyMyU1QyU1Q25TbG90JTIwMiUzQSUyMFhZWjc4OSU1QyU1Q25TbG90JTIwMSUyMGlzJTIwZnJlZSUyMiU3RCUyQyU3QiUyMmlucHV0JTIyJTNBJTIyMSU1QyU1Q24zJTVDJTVDbkxFQVZFJTIwMSU1QyU1Q25QQVJLJTIwQ0FSMSU1QyU1Q25MRUFWRSUyMDElMjIlMkMlMjJleHBlY3RlZE91dHB1dCUyMiUzQSUyMlNsb3QlMjAxJTIwaXMlMjBhbHJlYWR5JTIwZW1wdHklNUMlNUNuU2xvdCUyMDElNUMlNUNuU2xvdCUyMDElMjBpcyUyMGZyZWUlMjIlN0QlMkMlN0IlMjJpbnB1dCUyMiUzQSUyMjMlNUMlNUNuNCU1QyU1Q25QQVJLJTIwQSU1QyU1Q25QQVJLJTIwQiU1QyU1Q25MRUFWRSUyMDIlNUMlNUNuUEFSSyUyMEMlMjIlMkMlMjJleHBlY3RlZE91dHB1dCUyMiUzQSUyMlNsb3QlMjAxJTVDJTVDblNsb3QlMjAyJTVDJTVDblNsb3QlMjAyJTIwaXMlMjBmcmVlJTVDJTVDblNsb3QlMjAyJTIyJTdEJTVE",
  },

  {
    id: "run-length-035",
    title: "Run-Length Encoding",
    difficulty: "Medium",
    reward: 55,
    language: "java",
    languageId: 62,
    category: "Strings",
    description:
      'Write a Java program that compresses a string using run-length encoding. Consecutive identical characters are replaced by the character followed by its count. If a character appears only once, just print the character without a count.',
    inputDescription:
      'A single line containing a string of uppercase letters (1 ≤ length ≤ 1000).',
    outputDescription:
      'The run-length encoded string.',
    sampleInput: "AAABBBCCDA",
    sampleOutput: "A3B3C2DA",
    starterCode: JAVA_STARTER,
    _tc: "JTVCJTdCJTIyaW5wdXQlMjIlM0ElMjJBQUFCQkJDQ0RBJTIyJTJDJTIyZXhwZWN0ZWRPdXRwdXQlMjIlM0ElMjJBM0IzQzJEQSUyMiU3RCUyQyU3QiUyMmlucHV0JTIyJTNBJTIyQUJDRCUyMiUyQyUyMmV4cGVjdGVkT3V0cHV0JTIyJTNBJTIyQUJDRCUyMiU3RCUyQyU3QiUyMmlucHV0JTIyJTNBJTIyQUFBQUFBJTIyJTJDJTIyZXhwZWN0ZWRPdXRwdXQlMjIlM0ElMjJBNiUyMiU3RCUyQyU3QiUyMmlucHV0JTIyJTNBJTIyQUFCQkFBJTIyJTJDJTIyZXhwZWN0ZWRPdXRwdXQlMjIlM0ElMjJBMkIyQTIlMjIlN0QlMkMlN0IlMjJpbnB1dCUyMiUzQSUyMkElMjIlMkMlMjJleHBlY3RlZE91dHB1dCUyMiUzQSUyMkElMjIlN0QlNUQ=",
  },

  {
    id: "election-tally-036",
    title: "Election Tally",
    difficulty: "Medium",
    reward: 50,
    language: "java",
    languageId: 62,
    category: "Arrays",
    description:
      'Write a Java program that tallies votes in an election. Read candidate names then a list of votes (each vote is a candidate name). Print each candidate\'s vote count sorted by most votes first. In case of a tie, print them in alphabetical order.',
    inputDescription:
      'Line 1: integer n — number of candidates.\nNext n lines: candidate names (single word each).\nNext line: integer v — number of votes.\nNext v lines: one candidate name per line.',
    outputDescription:
      'One line per candidate: "name: X votes" sorted by count descending, then alphabetically.',
    sampleInput: "3\nAlice\nBob\nCarla\n5\nAlice\nBob\nAlice\nCarla\nAlice",
    sampleOutput: "Alice: 3 votes\nBob: 1 votes\nCarla: 1 votes",
    starterCode: JAVA_STARTER,
    _tc: "JTVCJTdCJTIyaW5wdXQlMjIlM0ElMjIzJTVDJTVDbkFsaWNlJTVDJTVDbkJvYiU1QyU1Q25DYXJsYSU1QyU1Q241JTVDJTVDbkFsaWNlJTVDJTVDbkJvYiU1QyU1Q25BbGljZSU1QyU1Q25DYXJsYSU1QyU1Q25BbGljZSUyMiUyQyUyMmV4cGVjdGVkT3V0cHV0JTIyJTNBJTIyQWxpY2UlM0ElMjAzJTIwdm90ZXMlNUMlNUNuQm9iJTNBJTIwMSUyMHZvdGVzJTVDJTVDbkNhcmxhJTNBJTIwMSUyMHZvdGVzJTIyJTdEJTJDJTdCJTIyaW5wdXQlMjIlM0ElMjIyJTVDJTVDblglNUMlNUNuWSU1QyU1Q240JTVDJTVDblklNUMlNUNuWCU1QyU1Q25ZJTVDJTVDblglMjIlMkMlMjJleHBlY3RlZE91dHB1dCUyMiUzQSUyMlglM0ElMjAyJTIwdm90ZXMlNUMlNUNuWSUzQSUyMDIlMjB2b3RlcyUyMiU3RCUyQyU3QiUyMmlucHV0JTIyJTNBJTIyMSU1QyU1Q25Tb2xvJTVDJTVDbjMlNUMlNUNuU29sbyU1QyU1Q25Tb2xvJTVDJTVDblNvbG8lMjIlMkMlMjJleHBlY3RlZE91dHB1dCUyMiUzQSUyMlNvbG8lM0ElMjAzJTIwdm90ZXMlMjIlN0QlNUQ=",
  },

  {
    id: "atm-machine-037",
    title: "ATM Cash Dispenser",
    difficulty: "Medium",
    reward: 55,
    language: "java",
    languageId: 62,
    category: "Control Flow",
    description:
      'Simulate an ATM that dispenses the minimum number of bills. Available denominations are 1000, 500, 200, 100, 50, and 20. Read a withdrawal amount and print how many of each denomination to dispense. Only print denominations that are used.',
    inputDescription:
      'A single positive integer — the withdrawal amount (divisible by 20).',
    outputDescription:
      'One line per denomination used: "D x N" where D is the denomination and N is the count. Print from largest to smallest.',
    sampleInput: "2780",
    sampleOutput: "1000 x 2\n500 x 1\n200 x 1\n50 x 1\n20 x 1",
    starterCode: JAVA_STARTER,
    _tc: "JTVCJTdCJTIyaW5wdXQlMjIlM0ElMjIyNzgwJTIyJTJDJTIyZXhwZWN0ZWRPdXRwdXQlMjIlM0ElMjIxMDAwJTIweCUyMDIlNUMlNUNuNTAwJTIweCUyMDElNUMlNUNuMjAwJTIweCUyMDElNUMlNUNuNTAlMjB4JTIwMSU1QyU1Q24yMCUyMHglMjAxJTIyJTdEJTJDJTdCJTIyaW5wdXQlMjIlM0ElMjIxMDAwJTIyJTJDJTIyZXhwZWN0ZWRPdXRwdXQlMjIlM0ElMjIxMDAwJTIweCUyMDElMjIlN0QlMkMlN0IlMjJpbnB1dCUyMiUzQSUyMjYwJTIyJTJDJTIyZXhwZWN0ZWRPdXRwdXQlMjIlM0ElMjIyMCUyMHglMjAzJTIyJTdEJTJDJTdCJTIyaW5wdXQlMjIlM0ElMjIxNTIwJTIyJTJDJTIyZXhwZWN0ZWRPdXRwdXQlMjIlM0ElMjIxMDAwJTIweCUyMDElNUMlNUNuNTAwJTIweCUyMDElNUMlNUNuMjAlMjB4JTIwMSUyMiU3RCU1RA==",
  },

  {
    id: "caesar-cipher-038",
    title: "Caesar Cipher",
    difficulty: "Easy",
    reward: 20,
    language: "java",
    languageId: 62,
    category: "Strings",
    description:
      'Write a Java program that encrypts a message using the Caesar cipher. Shift each letter by k positions in the alphabet (wrapping around Z→A). Non-letter characters remain unchanged. Preserve the original case of each letter.',
    inputDescription:
      'Line 1: integer k — the shift amount (1 ≤ k ≤ 25).\nLine 2: the message to encrypt.',
    outputDescription:
      'The encrypted message.',
    sampleInput: "3\nHello World!",
    sampleOutput: "Khoor Zruog!",
    starterCode: JAVA_STARTER,
    _tc: "JTVCJTdCJTIyaW5wdXQlMjIlM0ElMjIzJTVDJTVDbkhlbGxvJTIwV29ybGQhJTIyJTJDJTIyZXhwZWN0ZWRPdXRwdXQlMjIlM0ElMjJLaG9vciUyMFpydW9nISUyMiU3RCUyQyU3QiUyMmlucHV0JTIyJTNBJTIyMSU1QyU1Q25BQkMlMjB4eXolMjIlMkMlMjJleHBlY3RlZE91dHB1dCUyMiUzQSUyMkJDRCUyMHl6YSUyMiU3RCUyQyU3QiUyMmlucHV0JTIyJTNBJTIyMjUlNUMlNUNuQSUyMiUyQyUyMmV4cGVjdGVkT3V0cHV0JTIyJTNBJTIyWiUyMiU3RCUyQyU3QiUyMmlucHV0JTIyJTNBJTIyMTMlNUMlNUNuSGVsbG8lMjIlMkMlMjJleHBlY3RlZE91dHB1dCUyMiUzQSUyMlVyeXliJTIyJTdEJTVE",
  },

  {
    id: "library-system-039",
    title: "Library Book Tracker",
    difficulty: "Hard",
    reward: 90,
    language: "java",
    languageId: 62,
    category: "OOP",
    description:
      'Build a mini library system. Process commands:\n  "ADD title" — add a book (available by default). Print "Added: title"\n  "BORROW title" — mark as borrowed. Print "Borrowed: title" or "Not available: title" if already borrowed or not found.\n  "RETURN title" — mark as available. Print "Returned: title" or "Not borrowed: title"\n  "LIST" — print all books alphabetically with their status (Available/Borrowed)',
    inputDescription:
      'Line 1: integer c — number of commands.\nNext c lines: commands.',
    outputDescription:
      'One output line per command.',
    sampleInput: "6\nADD Java\nADD Python\nBORROW Java\nLIST\nRETURN Java\nBORROW C++",
    sampleOutput: "Added: Java\nAdded: Python\nBorrowed: Java\nJava: Borrowed\nPython: Available\nReturned: Java\nNot available: C++",
    starterCode: JAVA_STARTER,
    _tc: "JTVCJTdCJTIyaW5wdXQlMjIlM0ElMjI2JTVDJTVDbkFERCUyMEphdmElNUMlNUNuQUREJTIwUHl0aG9uJTVDJTVDbkJPUlJPVyUyMEphdmElNUMlNUNuTElTVCU1QyU1Q25SRVRVUk4lMjBKYXZhJTVDJTVDbkJPUlJPVyUyMEMlMkIlMkIlMjIlMkMlMjJleHBlY3RlZE91dHB1dCUyMiUzQSUyMkFkZGVkJTNBJTIwSmF2YSU1QyU1Q25BZGRlZCUzQSUyMFB5dGhvbiU1QyU1Q25Cb3Jyb3dlZCUzQSUyMEphdmElNUMlNUNuSmF2YSUzQSUyMEJvcnJvd2VkJTVDJTVDblB5dGhvbiUzQSUyMEF2YWlsYWJsZSU1QyU1Q25SZXR1cm5lZCUzQSUyMEphdmElNUMlNUNuTm90JTIwYXZhaWxhYmxlJTNBJTIwQyUyQiUyQiUyMiU3RCUyQyU3QiUyMmlucHV0JTIyJTNBJTIyMyU1QyU1Q25BREQlMjBCb29rMSU1QyU1Q25CT1JST1clMjBCb29rMSU1QyU1Q25CT1JST1clMjBCb29rMSUyMiUyQyUyMmV4cGVjdGVkT3V0cHV0JTIyJTNBJTIyQWRkZWQlM0ElMjBCb29rMSU1QyU1Q25Cb3Jyb3dlZCUzQSUyMEJvb2sxJTVDJTVDbk5vdCUyMGF2YWlsYWJsZSUzQSUyMEJvb2sxJTIyJTdEJTJDJTdCJTIyaW5wdXQlMjIlM0ElMjI0JTVDJTVDbkFERCUyMFolNUMlNUNuQUREJTIwQSU1QyU1Q25BREQlMjBNJTVDJTVDbkxJU1QlMjIlMkMlMjJleHBlY3RlZE91dHB1dCUyMiUzQSUyMkFkZGVkJTNBJTIwWiU1QyU1Q25BZGRlZCUzQSUyMEElNUMlNUNuQWRkZWQlM0ElMjBNJTVDJTVDbkElM0ElMjBBdmFpbGFibGUlNUMlNUNuTSUzQSUyMEF2YWlsYWJsZSU1QyU1Q25aJTNBJTIwQXZhaWxhYmxlJTIyJTdEJTVE",
  },

  {
    id: "power-calc-040",
    title: "Power Calculator",
    difficulty: "Easy",
    reward: 15,
    language: "java",
    languageId: 62,
    category: "Math & Logic",
    description:
      'Write a Java program that computes base raised to the power of exponent without using Math.pow(). Use a loop to multiply. Handle the case where the exponent is 0 (result is 1) and negative exponents (print "1/X" where X is the positive power result).',
    inputDescription:
      'Two integers on separate lines: base and exponent.',
    outputDescription:
      'A single line with the result.\n  Positive exponent → integer result\n  Zero exponent → 1\n  Negative exponent → "1/X" where X is base^|exponent|',
    sampleInput: "2\n10",
    sampleOutput: "1024",
    starterCode: JAVA_STARTER,
    _tc: "JTVCJTdCJTIyaW5wdXQlMjIlM0ElMjIyJTVDJTVDbjEwJTIyJTJDJTIyZXhwZWN0ZWRPdXRwdXQlMjIlM0ElMjIxMDI0JTIyJTdEJTJDJTdCJTIyaW5wdXQlMjIlM0ElMjI1JTVDJTVDbjAlMjIlMkMlMjJleHBlY3RlZE91dHB1dCUyMiUzQSUyMjElMjIlN0QlMkMlN0IlMjJpbnB1dCUyMiUzQSUyMjMlNUMlNUNuLTIlMjIlMkMlMjJleHBlY3RlZE91dHB1dCUyMiUzQSUyMjElMkY5JTIyJTdEJTJDJTdCJTIyaW5wdXQlMjIlM0ElMjIyJTVDJTVDbi0zJTIyJTJDJTIyZXhwZWN0ZWRPdXRwdXQlMjIlM0ElMjIxJTJGOCUyMiU3RCUyQyU3QiUyMmlucHV0JTIyJTNBJTIyMTAlNUMlNUNuMyUyMiUyQyUyMmV4cGVjdGVkT3V0cHV0JTIyJTNBJTIyMTAwMCUyMiU3RCU1RA==",
  },
];

export default JAVA_CHALLENGES;
