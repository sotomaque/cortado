package com.press;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.microsoft.codepush.react.CodePush;
import com.bugsnag.BugsnagReactNative;
import com.joshblour.reactnativepermissions.ReactNativePermissionsPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import com.robinpowered.react.Intercom.IntercomPackage;
import com.beefe.picker.PickerViewPackage;
import com.devfd.RNGeocoder.RNGeocoderPackage;
import com.airbnb.android.react.maps.MapsPackage;
import cl.json.RNSharePackage;
import io.intercom.android.sdk.Intercom;

import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.press.modules.timepicker.TimePickerPackage;
import com.magus.fblogin.FacebookLoginPackage;
import com.smore.RNSegmentIOAnalytics.RNSegmentIOAnalyticsPackage;
import com.rt2zz.reactnativecontacts.ReactNativeContacts;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

    @Override
    protected String getJSBundleFile() {
      return CodePush.getJSBundleFile();
    }

        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                new FacebookLoginPackage(),
                new MainReactPackage(),
            new CodePush(getResources().getString(R.string.reactNativeCodePush_androidDeploymentKey), getApplicationContext(), BuildConfig.DEBUG),
            BugsnagReactNative.getPackage(),
            new ReactNativePermissionsPackage(),
            new ReactNativePushNotificationPackage(),
                new ReactNativeConfigPackage(),
                new RNSegmentIOAnalyticsPackage(),
                new IntercomPackage(),
                new PickerViewPackage(),
                new RNGeocoderPackage(),
                new MapsPackage(),
                new RNSharePackage(),
                new TimePickerPackage(),
                new ReactNativeContacts()
            );
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
        try {
            Intercom.initialize(this, "android_sdk-7630dfed29b0cae3a06ac3ce7b90d691bd437ef9", "uuy5q66v");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
