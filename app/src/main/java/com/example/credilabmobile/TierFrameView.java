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
    private float currentRotation = 0f;
    private android.animation.ValueAnimator animator;

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
            startAnimationIfNeeded();
        } else {
            this.colors = new int[] { Color.TRANSPARENT, Color.TRANSPARENT };
            stopAnimation();
        }
        invalidate(); // Request redraw
    }

    private void startAnimationIfNeeded() {
        if (animator == null && colors.length > 1 && colors[0] != Color.TRANSPARENT) {
            animator = android.animation.ValueAnimator.ofFloat(0f, 360f);
            animator.setDuration(3000); // 3 seconds per rotation
            animator.setRepeatCount(android.animation.ValueAnimator.INFINITE);
            animator.setInterpolator(new android.view.animation.LinearInterpolator());
            animator.addUpdateListener(animation -> {
                currentRotation = (float) animation.getAnimatedValue();
                invalidate();
            });
            animator.start();
        }
    }

    private void stopAnimation() {
        if (animator != null) {
            animator.cancel();
            animator = null;
        }
    }

    @Override
    protected void onAttachedToWindow() {
        super.onAttachedToWindow();
        startAnimationIfNeeded();
    }

    @Override
    protected void onDetachedFromWindow() {
        super.onDetachedFromWindow();
        stopAnimation();
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
            SweepGradient sweepGradient = new SweepGradient(cx, cy, colors, null);
            paint.setShader(sweepGradient);
        } else if (colors.length == 1) {
            paint.setShader(null);
            paint.setColor(colors[0]);
        }

        canvas.save();
        canvas.rotate(currentRotation, cx, cy);
        canvas.drawCircle(cx, cy, radius, paint);
        canvas.restore();
    }
}
