package com.press.modules.timepicker;

import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.Iterator;

/**
 * Created by leonacky on 3/10/17.
 */

public class TimePickerModule extends ReactContextBaseJavaModule {
    ReactApplicationContext mContext;

    public TimePickerModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mContext = reactContext;
    }

    public static String currentTime = null;
    public static String currentDate = null;
    public static String currentPickup = null;
    public static JSONArray data_picker = new JSONArray();
    public static JSONObject data_picker_dropoff = new JSONObject();
    public static JSONObject data_picker_pickup = new JSONObject();
    public static String current_type = "currentPickup";

    @Override
    public String getName() {
        return "RNTimePicker";
    }

    @ReactMethod
    public void show(String date, String time, String pdata, final String title, String subtitle, final Callback callback) {
        Log.e("DatePicker", "show");
        currentDate = date;
        currentTime = time;
        try {
            data_picker = new JSONArray();
            data_picker_dropoff = new JSONObject();
            data_picker_pickup = new JSONObject();
            JSONArray jsa = new JSONArray(pdata);
            for (int i = 0; i < jsa.length(); i++) {
                JSONObject jso = jsa.getJSONObject(i);
                Iterator<?> keys = jso.keys();
                while (keys.hasNext()) {
                    String key = (String) keys.next();
                    JSONObject jso2 = jso.getJSONObject(key);
                    jso2.put("key", key);
                    data_picker.put(jso2);
                    data_picker_dropoff.put(key, jso2.getJSONArray("dropoff_times"));
                    data_picker_pickup.put(key, jso2.getJSONArray("windows"));
                    if (TimePickerModule.currentPickup == null && i == 0) {
                        TimePickerModule.currentPickup = key;
                    }
                    break;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        if (title.toUpperCase().contains("PICKUP")) {
            current_type = "currentPickup";
        } else {
            current_type = "dropoff";
        }
        try {
            TimePickerDialog.Builder builder = new TimePickerDialog.Builder(mContext.getCurrentActivity())
                    .bottomSheet()
                    .title(title)
                    .subtitle(subtitle)
                    .listener(new TimePickerDialog.Listener() {
                        @Override
                        public void onDateSelected(String dateString, String timeString) {
                            if (title.toUpperCase().contains("PICKUP")) {
                                currentPickup = dateString;
                            }
                            WritableMap map = Arguments.createMap();
                            map.putString("date", dateString);
                            map.putString("time", timeString);
                            callback.invoke(null, map);
                        }
                    });
            builder.display();
        } catch (Exception e) {
            e.printStackTrace();
            callback.invoke(e.getMessage(), null);
        }
    }
}
