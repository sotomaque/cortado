package com.press.modules.timepicker;

import android.util.Log;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.Date;

/**
 * Created by leonacky on 3/10/17.
 */

public class TimePickerModule extends ReactContextBaseJavaModule {
    ReactApplicationContext mContext;
    public TimePickerModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mContext = reactContext;
    }

    @Override
    public String getName() {
        return "RNTimePicker";
    }

    @ReactMethod
    public void show(String date, String time, String title, String subtitle, Callback callback) {
        Log.e("DatePicker", "show");
        try {
            new TimePickerDialog.Builder(mContext.getCurrentActivity())
                    .bottomSheet()
    //                .curved()
                    //.minutesStep(15)
                    .title(title)
                    .subtitle(subtitle)
    //                .mustBeOnFuture()
                    .listener(new TimePickerDialog.Listener() {
                        @Override
                        public void onDateSelected(Date date) {

                        }
                    }).display();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
