package com.example.credilabmobile;

import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;

import android.view.View;
import android.widget.ScrollView;
import com.google.android.material.tabs.TabLayout;

public class HowToUseActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_how_to_use);

        findViewById(R.id.btnBack).setOnClickListener(v -> finish());

        TabLayout tabLayout = findViewById(R.id.tabLayout);
        ScrollView svAppTutorial = findViewById(R.id.svAppTutorial);
        ScrollView svWalletSetup = findViewById(R.id.svWalletSetup);

        tabLayout.addOnTabSelectedListener(new TabLayout.OnTabSelectedListener() {
            @Override
            public void onTabSelected(TabLayout.Tab tab) {
                if (tab.getPosition() == 0) {
                    svAppTutorial.setVisibility(View.VISIBLE);
                    svWalletSetup.setVisibility(View.GONE);
                } else {
                    svAppTutorial.setVisibility(View.GONE);
                    svWalletSetup.setVisibility(View.VISIBLE);
                }
            }

            @Override
            public void onTabUnselected(TabLayout.Tab tab) {
            }

            @Override
            public void onTabReselected(TabLayout.Tab tab) {
            }
        });
    }
}
