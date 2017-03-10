package com.press.modules.timepicker;

import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.animation.ObjectAnimator;
import android.app.Activity;
import android.content.Context;
import android.graphics.PixelFormat;
import android.os.Handler;
import android.os.Looper;
import android.view.LayoutInflater;
import android.view.View;
import android.view.WindowManager;
import android.widget.TextView;

import com.press.R;

import static android.content.Context.WINDOW_SERVICE;

public class BottomSheetHelper {

    private Context context;
    private int layoutId;

    private View view;
    private View dimbg;
    private Listener listener;

    private Handler handler;
    private WindowManager windowManager;

    public BottomSheetHelper(Context context, int layoutId) {
        this.context = context;
        this.layoutId = layoutId;
        this.handler = new Handler(Looper.getMainLooper());
    }

    private void init() {
        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                if (context instanceof Activity) {
                    windowManager = (WindowManager) context.getSystemService(WINDOW_SERVICE);

                    view = LayoutInflater.from(context).inflate(layoutId, null, true);
                    view.setVisibility(View.INVISIBLE);
                    dimbg = LayoutInflater.from(context).inflate(R.layout.dimbg, null, true);
                    dimbg.setVisibility(View.INVISIBLE);

                    WindowManager.LayoutParams layoutParams = new WindowManager.LayoutParams(
                            // Shrink the window to wrap the content rather than filling the screen
                            WindowManager.LayoutParams.MATCH_PARENT, WindowManager.LayoutParams.MATCH_PARENT,
                            WindowManager.LayoutParams.TYPE_APPLICATION_PANEL,
                            // Don't let it grab the input focus
                            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
                            // Make the underlying application window visible through any transparent parts
                            PixelFormat.TRANSLUCENT);

                    if ((layoutParams.softInputMode
                            & WindowManager.LayoutParams.SOFT_INPUT_IS_FORWARD_NAVIGATION) == 0) {
                        WindowManager.LayoutParams nl = new WindowManager.LayoutParams();
                        nl.copyFrom(layoutParams);
                        nl.softInputMode |= WindowManager.LayoutParams.SOFT_INPUT_IS_FORWARD_NAVIGATION;
                        layoutParams = nl;
                    }

                    windowManager.addView(dimbg, layoutParams);
                    windowManager.addView(view, layoutParams);

                    view.findViewById(R.id.bottom_sheet_background)
                            .setOnClickListener(new View.OnClickListener() {
                                @Override
                                public void onClick(View view) {
                                    hide();
                                }
                            });

                    if (listener != null) {
                        listener.onLoaded(view);
                    }
                }
            }
        }, 100);
    }

    public BottomSheetHelper setListener(Listener listener) {
        this.listener = listener;
        return this;
    }

    public void display() {
        init();
        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                final ObjectAnimator objectAnimator = ObjectAnimator.ofFloat(view, View.TRANSLATION_Y, view.getHeight(), 0);
                objectAnimator.addListener(new AnimatorListenerAdapter() {

                    @Override
                    public void onAnimationEnd(Animator animation) {
                        if (listener != null) {
                            listener.onOpen();
                        }
                    }
                });
                view.setVisibility(View.VISIBLE);
                objectAnimator.start();

                final ObjectAnimator objectAnimator2 = ObjectAnimator.ofFloat(dimbg, View.ALPHA, 0, 1);
                dimbg.setVisibility(View.VISIBLE);
                objectAnimator2.start();
            }
        }, 200);
    }

    public void hide() {
        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                final ObjectAnimator objectAnimator = ObjectAnimator.ofFloat(view, View.TRANSLATION_Y, 0, view.getHeight());
                objectAnimator.addListener(new AnimatorListenerAdapter() {
                    @Override
                    public void onAnimationEnd(Animator animation) {
                        view.setVisibility(View.GONE);
                        dimbg.setVisibility(View.GONE);
                        if (listener != null) {
                            listener.onClose();
                        }
                        remove();
                    }
                });
                objectAnimator.start();
                final ObjectAnimator objectAnimator2 = ObjectAnimator.ofFloat(dimbg, View.ALPHA, 1, 0);
                objectAnimator2.start();
            }
        }, 200);
    }

    private void remove() {
        try {
            if (view.getWindowToken() != null) windowManager.removeView(view);
        } catch (Exception e) {
            e.printStackTrace();
        }
        try {
            if (dimbg.getWindowToken() != null) windowManager.removeView(dimbg);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public interface Listener {
        void onOpen();

        void onLoaded(View view);

        void onClose();
    }
}
