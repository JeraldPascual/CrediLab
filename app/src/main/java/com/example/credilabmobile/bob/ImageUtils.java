package com.example.credilabmobile.bob;

import android.graphics.Bitmap;
import android.graphics.Color;
import java.nio.FloatBuffer;

public class ImageUtils {

    // Phi-3 Vision / CLIP Constants
    private static final int TARGET_WIDTH = 336;
    private static final int TARGET_HEIGHT = 336;

    // OpenAI CLIP Mean and Std definitions
    private static final float[] P_MEAN = { 0.48145466f, 0.4578275f, 0.40821073f };
    private static final float[] P_STD = { 0.26862954f, 0.26130258f, 0.27577711f };

    /**
     * Preprocesses a bitmap for Phi-3 Vision ONNX model.
     * Steps:
     * 1. Resize to 336x336 (Bilinear)
     * 2. Normalize RGB values (0-1 range, then subtract mean, divide by std)
     * 3. Layout data in NCHW format [1, 3, 336, 336]
     */
    public static FloatBuffer bitmapToFloatBuffer(Bitmap original) {
        // 1. Resize
        Bitmap resized = Bitmap.createScaledBitmap(original, TARGET_WIDTH, TARGET_HEIGHT, true);

        // Prepare buffer: 1 * 3 * 336 * 336 float values
        FloatBuffer buffer = FloatBuffer.allocate(1 * 3 * TARGET_WIDTH * TARGET_HEIGHT);

        // 2. Extract Pixels
        int[] pixels = new int[TARGET_WIDTH * TARGET_HEIGHT];
        resized.getPixels(pixels, 0, TARGET_WIDTH, 0, 0, TARGET_WIDTH, TARGET_HEIGHT);

        // 3. Normalize & Fill Buffer (NCHW)
        // We need to iterate by channel (R, then G, then B) to fill buffer in Planar
        // format
        // Channel 0: Red
        for (int i = 0; i < pixels.length; i++) {
            int c = pixels[i];
            float r = ((c >> 16) & 0xFF) / 255.0f;
            float normalized = (r - P_MEAN[0]) / P_STD[0];
            buffer.put(normalized);
        }

        // Channel 1: Green
        for (int i = 0; i < pixels.length; i++) {
            int c = pixels[i];
            float g = ((c >> 8) & 0xFF) / 255.0f;
            float normalized = (g - P_MEAN[1]) / P_STD[1];
            buffer.put(normalized);
        }

        // Channel 2: Blue
        for (int i = 0; i < pixels.length; i++) {
            int c = pixels[i];
            float b = (c & 0xFF) / 255.0f;
            float normalized = (b - P_MEAN[2]) / P_STD[2];
            buffer.put(normalized);
        }

        buffer.flip();
        return buffer;
    }

    public static String saveImageToInternalStorage(android.content.Context context, Bitmap bitmap) {
        java.io.File directory = context.getDir("chat_images", android.content.Context.MODE_PRIVATE);
        String fileName = "img_" + System.currentTimeMillis() + ".jpg";
        java.io.File file = new java.io.File(directory, fileName);

        try (java.io.FileOutputStream fos = new java.io.FileOutputStream(file)) {
            bitmap.compress(Bitmap.CompressFormat.JPEG, 90, fos);
            return file.getAbsolutePath();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
