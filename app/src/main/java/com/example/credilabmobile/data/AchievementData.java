package com.example.credilabmobile.data;

import java.util.Arrays;
import java.util.List;

/**
 * Static achievement data mirroring the web app's achievements.js.
 * Includes skill tiers, placeholder frames, and placeholder badges.
 */
public class AchievementData {

    // ─── Skill Tiers ────────────────────────────────────────────────
    public static class SkillTier {
        public final String id;
        public final String title;
        public final String shortTitle;
        public final int minCredits;
        public final String icon;
        public final int colorResId; // 0 = use default

        public SkillTier(String id, String title, String shortTitle, int minCredits, String icon) {
            this.id = id;
            this.title = title;
            this.shortTitle = shortTitle;
            this.minCredits = minCredits;
            this.icon = icon;
            this.colorResId = 0;
        }
    }

    public static final List<SkillTier> SKILL_TIERS = Arrays.asList(
            new SkillTier("novice", "Novice Coder", "Novice", 0, "🌱"),
            new SkillTier("apprentice", "Apprentice Developer", "Apprentice", 50, "⚙️"),
            new SkillTier("junior", "Junior Programmer", "Junior", 130, "💻"),
            new SkillTier("intermediate", "Intermediate Coder", "Intermediate", 280, "🔧"),
            new SkillTier("advanced", "Advanced Developer", "Advanced", 480, "🚀"),
            new SkillTier("expert", "Expert Engineer", "Expert", 730, "🏆"));

    /** Returns the skill tier for a given credit amount. */
    public static SkillTier getSkillTier(long credits) {
        SkillTier result = SKILL_TIERS.get(0);
        for (SkillTier tier : SKILL_TIERS) {
            if (credits >= tier.minCredits) {
                result = tier;
            }
        }
        return result;
    }

    /** Returns progress (0–100) toward the next skill tier. */
    public static int getTierProgress(long credits) {
        SkillTier current = getSkillTier(credits);
        int currentIdx = SKILL_TIERS.indexOf(current);
        if (currentIdx >= SKILL_TIERS.size() - 1)
            return 100;
        SkillTier next = SKILL_TIERS.get(currentIdx + 1);
        int range = next.minCredits - current.minCredits;
        int earned = (int) (credits - current.minCredits);
        return Math.min(100, (earned * 100) / range);
    }

    // ─── Frames (ID 100+ on-chain) ─────────────────────────────────
    public static class FrameData {
        public final String id;
        public final String name;
        public final int onChainId; // ERC-1155 token ID (100+)
        public final String rarity; // Common, Rare, Epic, Legendary

        public FrameData(String id, String name, int onChainId, String rarity) {
            this.id = id;
            this.name = name;
            this.onChainId = onChainId;
            this.rarity = rarity;
        }
    }

    public static final List<FrameData> FRAMES = Arrays.asList(
            new FrameData("newbie_circuit", "Newbie Circuit", 100, "Common"),
            new FrameData("code_runner", "Code Runner", 101, "Common"),
            new FrameData("syntax_lord", "Syntax Lord", 102, "Rare"),
            new FrameData("blockchain_node", "Blockchain Node", 103, "Rare"),
            new FrameData("neon_hacker", "Neon Hacker", 104, "Epic"),
            new FrameData("diamond_dev", "Diamond Dev", 105, "Epic"),
            new FrameData("fire_coder", "Fire Coder", 106, "Epic"),
            new FrameData("quantum_frame", "Quantum Frame", 107, "Legendary"),
            new FrameData("golden_algorithm", "Golden Algorithm", 108, "Legendary"),
            new FrameData("void_master", "Void Master", 109, "Legendary"));

    // ─── Badges (ID 1-99 on-chain, soulbound) ──────────────────────
    public static class BadgeData {
        public final String id;
        public final String name;
        public final int onChainId; // ERC-1155 token ID (1-99)
        public final String description;

        public BadgeData(String id, String name, int onChainId, String description) {
            this.id = id;
            this.name = name;
            this.onChainId = onChainId;
            this.description = description;
        }
    }

    public static final List<BadgeData> BADGES = Arrays.asList(
            new BadgeData("first_compile", "First Compile", 1, "Compiled your first program"),
            new BadgeData("bug_squasher", "Bug Squasher", 2, "Fixed 10 bugs in your code"),
            new BadgeData("polyglot", "Polyglot", 3, "Completed quizzes in 3+ languages"),
            new BadgeData("quiz_streak", "Quiz Streak", 4, "10 consecutive quiz completions"),
            new BadgeData("clb_100_club", "100 CLB Club", 5, "Earned 100 CLB tokens"),
            new BadgeData("speed_demon", "Speed Demon", 6, "Completed a quiz in under 30 seconds"),
            new BadgeData("perfect_score", "Perfect Score", 7, "100% accuracy on a quiz"),
            new BadgeData("blockchain_pioneer", "Blockchain Pioneer", 8, "First on-chain transaction"),
            new BadgeData("night_owl", "Night Owl", 9, "Completed a quiz after midnight"),
            new BadgeData("grandmaster", "Grandmaster", 10, "Reached Expert Engineer tier"));

    /** Find a frame by its string ID. */
    public static FrameData getFrameById(String id) {
        if (id == null)
            return null;
        for (FrameData f : FRAMES) {
            if (f.id.equals(id))
                return f;
        }
        return null;
    }

    /** Find a badge by its string ID. */
    public static BadgeData getBadgeById(String id) {
        if (id == null)
            return null;
        for (BadgeData b : BADGES) {
            if (b.id.equals(id))
                return b;
        }
        return null;
    }
}
