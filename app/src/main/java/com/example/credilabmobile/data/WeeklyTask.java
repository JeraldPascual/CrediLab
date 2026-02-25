package com.example.credilabmobile.data;

import java.io.Serializable;

public class WeeklyTask implements Serializable {
    public String id;
    public int weekNumber;
    public String title;
    public String description;
    public int rewardCLB;
    public boolean isActive;
    public String type; // "reflection" or "photo"
    public int sdgGoal; // Optional SDG goal number (e.g., 13 for Climate Action)

    // Empty constructor for Firebase
    public WeeklyTask() {
    }

    public WeeklyTask(String id, int weekNumber, String title, String description, int rewardCLB, boolean isActive,
            String type, int sdgGoal) {
        this.id = id;
        this.weekNumber = weekNumber;
        this.title = title;
        this.description = description;
        this.rewardCLB = rewardCLB;
        this.isActive = isActive;
        this.type = type;
        this.sdgGoal = sdgGoal;
    }
}
