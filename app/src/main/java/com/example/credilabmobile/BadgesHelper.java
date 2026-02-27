package com.example.credilabmobile;

import android.content.Context;
import android.graphics.Color;
import android.graphics.drawable.PictureDrawable;
import android.util.Log;
import android.widget.ImageView;

import com.caverock.androidsvg.SVG;
import com.caverock.androidsvg.SVGParseException;
import com.google.gson.Gson;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class BadgesHelper {

    private static final String TAG = "BadgesHelper";
    private BadgesData badgesData;
    private final Map<String, int[]> rarityColors;
    private final Map<String, String> rarityHexColors;

    public BadgesHelper(Context context) {
        rarityColors = new HashMap<>();
        // These are for the SweepGradient on TierFrameView
        rarityColors.put("common", new int[] { Color.parseColor("#CD7F32"), Color.parseColor("#8B4513") }); // Bronze
        rarityColors.put("uncommon", new int[] { Color.parseColor("#C0C0C0"), Color.parseColor("#808080") }); // Silver
        rarityColors.put("rare", new int[] { Color.parseColor("#FFD700"), Color.parseColor("#DAA520") }); // Gold
        rarityColors.put("epic", new int[] { Color.parseColor("#9C27B0"), Color.parseColor("#E1BEE7") }); // Purple
        rarityColors.put("legendary",
                new int[] { Color.parseColor("#FFD700"), Color.parseColor("#FF8C00"), Color.parseColor("#FF1493") }); // Multi-color

        rarityHexColors = new HashMap<>();
        // These are for the SVGs (accentHex)
        rarityHexColors.put("common", "#CD7F32");
        rarityHexColors.put("uncommon", "#C0C0C0");
        rarityHexColors.put("rare", "#FFD700");
        rarityHexColors.put("epic", "#9C27B0");
        rarityHexColors.put("legendary", "#FF8C00");

        loadBadgesJson(context);
    }

    private void loadBadgesJson(Context context) {
        try {
            InputStream is = context.getAssets().open("badges.json");
            int size = is.available();
            byte[] buffer = new byte[size];
            is.read(buffer);
            is.close();
            String jsonString = new String(buffer, StandardCharsets.UTF_8);
            Gson gson = new Gson();
            badgesData = gson.fromJson(jsonString, BadgesData.class);
        } catch (IOException e) {
            Log.e(TAG, "Error loading badges.json", e);
        }
    }

    public Badge getBadgeById(String id) {
        if (badgesData != null && badgesData.getBadges() != null) {
            for (Badge badge : badgesData.getBadges()) {
                if (badge.getId().equals(id)) {
                    return badge;
                }
            }
        }
        return null;
    }

    public List<Badge> getAllBadges() {
        if (badgesData != null) {
            return badgesData.getBadges();
        }
        return new java.util.ArrayList<>();
    }

    public int[] getTierColors(String tierType) {
        if (tierType == null)
            return rarityColors.get("common");
        int[] colors = rarityColors.get(tierType.toLowerCase());
        return colors != null ? colors : rarityColors.get("common");
    }

    public String getTierHexColor(String tierType) {
        if (tierType == null)
            return rarityHexColors.get("common");
        String color = rarityHexColors.get(tierType.toLowerCase());
        return color != null ? color : rarityHexColors.get("common");
    }

    public void renderBadgeSvg(ImageView imageView, String svgString, String accentHex) {
        if (svgString == null || svgString.isEmpty())
            return;
        try {
            String updatedSvg = svgString;
            if (accentHex != null && !accentHex.isEmpty()) {
                updatedSvg = svgString.replace("currentColor", accentHex);
            }
            SVG svg = SVG.getFromString(updatedSvg);
            PictureDrawable drawable = new PictureDrawable(svg.renderToPicture());
            imageView.setImageDrawable(drawable);
        } catch (SVGParseException | NullPointerException e) {
            Log.e(TAG, "Error parsing SVG", e);
        }
    }

    public boolean isBadgeUnlocked(Badge badge, FirestoreHelper.UserData user) {
        if (badge == null || badge.getCondition() == null || user == null)
            return false;
        String type = badge.getCondition().getType();
        Map<String, Object> reqs = badge.getCondition().getReqs();

        if ("none".equals(type))
            return true;

        if ("course_completion".equals(type) && reqs != null) {
            String courseId = (String) reqs.get("course_id");
            return user.completedChallenges != null && user.completedChallenges.contains(courseId);
        }

        if ("wallet_connection".equals(type)) {
            return user.walletAddress != null && !user.walletAddress.isEmpty();
        }

        if ("clb_threshold".equals(type) && reqs != null) {
            Object amountObj = reqs.get("amount");
            if (amountObj instanceof Number) {
                long threshold = ((Number) amountObj).longValue();
                return user.totalCLBEarned >= threshold;
            }
        }

        return false;
    }
}
