package com.example.credilabmobile.data;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class PuzzleRepository {

    public static class CodePuzzle {
        public String id;
        public String question;
        public List<String> correctSequence;
        public List<String> scrambledBlocks;
        public int rewardAmount;

        public CodePuzzle(String id, String question, List<String> correctSequence, int rewardAmount) {
            this.id = id;
            this.question = question;
            this.correctSequence = correctSequence;
            this.rewardAmount = rewardAmount;

            // Create scrambled version
            this.scrambledBlocks = new ArrayList<>(correctSequence);
            // Add some distractors/wrong answers
            if (id.equals("1")) {
                this.scrambledBlocks.add("tx.origin");
                this.scrambledBlocks.add("1000");
            } else if (id.equals("2")) {
                this.scrambledBlocks.add("array");
                this.scrambledBlocks.add("int");
            }
            Collections.shuffle(this.scrambledBlocks);
        }
    }

    public List<CodePuzzle> getPuzzles() {
        List<CodePuzzle> puzzles = new ArrayList<>();

        // Puzzle 1: Minting
        puzzles.add(new CodePuzzle(
                "1",
                "Construct a function to mint 100 tokens to the sender.",
                Arrays.asList("function", "mint()", "{", "_mint", "(", "msg.sender", ",", "100", ")", ";", "}"),
                10));

        // Puzzle 2: Mapping
        puzzles.add(new CodePuzzle(
                "2",
                "Define a mapping to store user balances.",
                Arrays.asList("mapping", "(", "address", "=>", "uint256", ")", "public", "balances", ";"),
                15));

        // Puzzle 3: Transfer
        puzzles.add(new CodePuzzle(
                "3",
                "Create a transfer event definition.",
                Arrays.asList("event", "Transfer", "(", "address", "indexed", "from", ",", "address", "to", ",", "uint",
                        "amount", ")", ";"),
                20));

        return puzzles;
    }

    public boolean checkAnswer(CodePuzzle puzzle, List<String> userAnswer) {
        if (puzzle.correctSequence.size() != userAnswer.size())
            return false;

        for (int i = 0; i < puzzle.correctSequence.size(); i++) {
            if (!puzzle.correctSequence.get(i).equals(userAnswer.get(i))) {
                return false;
            }
        }
        return true;
    }
}
