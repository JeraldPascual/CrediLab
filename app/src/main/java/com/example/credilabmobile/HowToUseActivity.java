package com.example.credilabmobile;

import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;

public class HowToUseActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_how_to_use);

        findViewById(R.id.btnBack).setOnClickListener(v -> finish());
    }
}
