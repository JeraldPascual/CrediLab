package com.example.credilabmobile;

import android.content.pm.PackageManager;
import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.journeyapps.barcodescanner.BarcodeCallback;
import com.journeyapps.barcodescanner.BarcodeResult;
import com.journeyapps.barcodescanner.DecoratedBarcodeView;

public class QrScannerActivity extends AppCompatActivity {

    private static final String TAG = "QrScanner";
    public static final String EXTRA_SCAN_RESULT = "scan_result";
    private static final int CAMERA_PERMISSION_REQUEST = 100;

    private DecoratedBarcodeView barcodeView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        Log.d(TAG, "onCreate START");
        try {
            super.onCreate(savedInstanceState);
            Log.d(TAG, "setContentView...");
            setContentView(R.layout.activity_qr_scanner);

            Log.d(TAG, "finding views...");
            barcodeView = findViewById(R.id.barcodeScannerView);
            barcodeView.setStatusText("");

            Log.d(TAG, "setting up back button...");
            findViewById(R.id.btnScannerBack).setOnClickListener(v -> {
                setResult(RESULT_CANCELED);
                finish();
            });

            Log.d(TAG, "checking camera permission...");
            if (ContextCompat.checkSelfPermission(this,
                    android.Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
                Log.d(TAG, "requesting camera permission...");
                ActivityCompat.requestPermissions(this,
                        new String[] { android.Manifest.permission.CAMERA },
                        CAMERA_PERMISSION_REQUEST);
            } else {
                Log.d(TAG, "camera permission granted, starting scan...");
                startScanning();
            }
            Log.d(TAG, "onCreate COMPLETE");
        } catch (Exception e) {
            Log.e(TAG, "CRASH in onCreate", e);
            Toast.makeText(this, "Scanner error: " + e.getMessage(), Toast.LENGTH_LONG).show();
            finish();
        }
    }

    private void startScanning() {
        Log.d(TAG, "startScanning called");
        barcodeView.decodeContinuous(new BarcodeCallback() {
            @Override
            public void barcodeResult(BarcodeResult result) {
                if (result.getText() != null) {
                    Log.d(TAG, "Scanned: " + result.getText());
                    barcodeView.pause();
                    android.content.Intent data = new android.content.Intent();
                    data.putExtra(EXTRA_SCAN_RESULT, result.getText());
                    setResult(RESULT_OK, data);
                    finish();
                }
            }
        });
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions,
            @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == CAMERA_PERMISSION_REQUEST) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                Log.d(TAG, "camera permission granted after request");
                startScanning();
            } else {
                Log.w(TAG, "camera permission denied");
                Toast.makeText(this, "Camera permission is required to scan QR codes",
                        Toast.LENGTH_LONG).show();
                finish();
            }
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        Log.d(TAG, "onResume");
        if (barcodeView != null)
            barcodeView.resume();
    }

    @Override
    protected void onPause() {
        super.onPause();
        Log.d(TAG, "onPause");
        if (barcodeView != null)
            barcodeView.pause();
    }
}
