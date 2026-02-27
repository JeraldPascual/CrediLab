package com.example.credilabmobile;

import java.util.List;
import java.util.Map;

public class Badge {
    private String id;
    private String name;
    private String description;
    private String svg;
    private int xpReward;
    private Condition condition;
    private String type;
    private String rarity;
    private String accentHex;

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public String getSvg() {
        return svg;
    }

    public int getXpReward() {
        return xpReward;
    }

    public Condition getCondition() {
        return condition;
    }

    public String getType() {
        return type;
    }

    public String getRarity() {
        return rarity;
    }

    public String getAccentHex() {
        return accentHex;
    }

    public static class Condition {
        private String type; // e.g., "course_completion", "specific_action", "xp_threshold"
        private Map<String, Object> reqs; // Reqs can contain different types depending on the condition type

        public String getType() {
            return type;
        }

        public Map<String, Object> getReqs() {
            return reqs;
        }
    }
}
