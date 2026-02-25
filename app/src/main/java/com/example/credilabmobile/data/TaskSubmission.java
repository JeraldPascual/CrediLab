package com.example.credilabmobile.data;

import com.google.firebase.Timestamp;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class TaskSubmission implements Serializable {
    public String id; // Document ID (e.g. uid_taskId)
    public String uid;
    public String taskId;
    public int weekNumber;
    public Timestamp completedAt;
    public String response;
    public String photoBase64;
    public int rewardCLB;
    public String status; // "pending_review", "approved", "rejected", "completed"
    public String taskType; // "reflection" or "photo"
    public String displayName;
    public String email;
    public String photoURL; // Submitter's profile photo (optional for UI)

    // Community voting fields
    public int upvotes = 0;
    public int downvotes = 0;
    public List<String> upvoters = new ArrayList<>();
    public List<String> downvoters = new ArrayList<>();
    public int netScore = 0;

    // Empty constructor for Firebase
    public TaskSubmission() {
    }
}
