package com.example.credilabmobile;

import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

public class BobFragment extends Fragment {

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
            @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_bob, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        View btnLaunchChat = view.findViewById(R.id.btnLaunchChat);
        View cardStartBob = view.findViewById(R.id.cardStartBob);

        View.OnClickListener listener = v -> startActivity(new Intent(requireActivity(), ChatActivity.class));

        if (btnLaunchChat != null)
            btnLaunchChat.setOnClickListener(listener);
        if (cardStartBob != null)
            cardStartBob.setOnClickListener(listener);
    }
}
