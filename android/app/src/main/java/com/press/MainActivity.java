package com.press;

import com.facebook.react.ReactActivity;
import com.smore.RNSegmentIOAnalytics.RNSegmentIOAnalyticsPackage;
import com.bugsnag.BugsnagReactNative;
import android.os.Bundle;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "PressApp";
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        BugsnagReactNative.start(this);
    }
}
