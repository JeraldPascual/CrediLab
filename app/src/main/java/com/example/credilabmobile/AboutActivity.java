package com.example.credilabmobile;

import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;

public class AboutActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_about);

        findViewById(R.id.btnBack).setOnClickListener(v -> finish());

        android.view.View btnWebPromo = findViewById(R.id.btnOpenWebPromoAbout);
        if (btnWebPromo != null) {
            btnWebPromo.setOnClickListener(v -> {
                android.content.Intent intent = new android.content.Intent(android.content.Intent.ACTION_VIEW,
                        android.net.Uri.parse("https://credilab.vercel.app/"));
                startActivity(intent);
            });
        }
    }
}
