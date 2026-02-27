package com.example.credilabmobile;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.SweepGradient;
import android.util.AttributeSet;
import android.view.View;

import androidx.annotation.Nullable;

public class TierFrameView extends View {

    private Paint paint;
    private int[] colors = { Color.TRANSPARENT, Color.TRANSPARENT }; // Default transparent
    private float strokeWidth = 8f; // Adjustable stroke width

    public TierFrameView(Context context) {
        super(context);
        init();
    }

    public TierFrameView(Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
        init();
    }

    public TierFrameView(Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init();
    }

    private void init() {
        paint = new Paint(Paint.ANTI_ALIAS_FLAG);
        paint.setStyle(Paint.Style.STROKE);
        strokeWidth = 3f * getResources().getDisplayMetrics().density;
        paint.setStrokeWidth(strokeWidth);
    }

    public void setTierColors(int[] newColors) {
        if (newColors != null && newColors.length > 0) {
            this.colors = newColors;
        } else {
            this.colors = new int[] { Color.TRANSPARENT, Color.TRANSPARENT };
        }
        invalidate(); // Request redraw
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);

        float width = getWidth();
        float height = getHeight();
        float radius = Math.min(width, height) / 2f - strokeWidth / 2f;

        float cx = width / 2f;
        float cy = height / 2f;

        if (colors.length > 1) {
            // SweepGradient needs to be recreated on layout size changes if we depended on
            // bounds,
            // but cx, cy inside onDraw is fine. It's better to cache it, but for simplicity
            // we recreate.
            SweepGradient sweepGradient = new SweepGradient(cx, cy, colors, null);
            paint.setShader(sweepGradient);
        } else if (colors.length == 1) {
            paint.setShader(null);
            paint.setColor(colors[0]);
        }

        canvas.drawCircle(cx, cy, radius, paint);
    }
}
