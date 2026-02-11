# Data — Static Content

Static data for challenges, constants, and configuration.

## Example: Challenges
```javascript
// data/challenges.js
export const challenges = [
  {
    id: 'greeting-program',
    title: 'Personalized Greeting',
    description: 'Read a name from input and print "Hello, [name]! Welcome to CrediLab."',
    credits: 50,
    difficulty: 'Beginner',
    languageId: 62, // Java
    boilerplate: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Your code here

    }
}`,
    testCases: [
      { stdin: 'Alice', expectedOutput: 'Hello, Alice! Welcome to CrediLab.' },
      { stdin: 'Bob', expectedOutput: 'Hello, Bob! Welcome to CrediLab.' },
      { stdin: 'Charlie', expectedOutput: 'Hello, Charlie! Welcome to CrediLab.' }
    ]
  },
  {
    id: 'grade-calculator',
    title: 'Student Grade Calculator',
    description: 'Read a student name and 3 exam scores, calculate average, print name + average + letter grade.',
    credits: 100,
    difficulty: 'Intermediate',
    languageId: 62,
    boilerplate: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        // Read name, then 3 scores
        // Calculate average
        // Determine letter grade
        // Print: "[name]: Average = [avg], Grade = [letter]"

    }
}`,
    testCases: [
      { stdin: 'Juan\\n85\\n90\\n95', expectedOutput: 'Juan: Average = 90.0, Grade = A' },
      { stdin: 'Maria\\n70\\n75\\n80', expectedOutput: 'Maria: Average = 75.0, Grade = C' },
      { stdin: 'Pedro\\n50\\n55\\n45', expectedOutput: 'Pedro: Average = 50.0, Grade = F' }
    ]
  }
];
```

## Example: Constants
```javascript
// data/constants.js
export const JUDGE0_LANGUAGE_IDS = {
  JAVA: 62,
  PYTHON: 71,
  JAVASCRIPT: 63,
  CSHARP: 51
};

export const CREDIT_POOL_TOTAL = 10000;
export const SPEED_BONUS_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes
export const SPEED_BONUS_PERCENT = 0.2; // 20%
```

## Student A Task
1. Create `challenges.js` with the two Java problems (see above)
2. Create `constants.js` with app-wide constants
3. Import in pages/components: `import { challenges } from '../data/challenges'`
