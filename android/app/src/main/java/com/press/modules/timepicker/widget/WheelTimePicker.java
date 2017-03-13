package com.press.modules.timepicker.widget;

import android.content.Context;
import android.util.AttributeSet;
import android.util.Log;


import com.press.modules.timepicker.TimePickerModule;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

public class WheelTimePicker extends WheelPicker {

    private Adapter adapter;

    private int lastScrollPosition, defaultPosition=0;

    private OnTimeSelectedListener onTimeSelectedListener;

    public WheelTimePicker(Context context) {
        this(context, null);
    }

    public WheelTimePicker(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    public void updateTimes(String date_select) {
        defaultPosition = 0;
        final List<String> data = new ArrayList<>();
        try {
            if(TimePickerModule.current_type.equals("currentPickup")) {
                JSONArray windows = TimePickerModule.data_picker_pickup.getJSONArray(date_select);
                for(int i=0; i<windows.length(); i++) {
                    String timeTitle = windows.getString(i);
                    try {
                        if(timeTitle.equals(TimePickerModule.currentTime)) {
                            defaultPosition = data.size();
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                    data.add(timeTitle);
                }
            } else {
                JSONArray dropoff_times = TimePickerModule.data_picker_dropoff.getJSONArray(TimePickerModule.currentPickup);
                for (int i = 0; i < dropoff_times.length(); i++) {
                    JSONObject jso2 = dropoff_times.getJSONObject(i);
                    Iterator<?> keys = jso2.keys();
                    String key = "";
                    while (keys.hasNext()) {
                        key = (String) keys.next();
                        break;
                    }
                    if(key.equals(date_select)) {
                        JSONArray windows = jso2.getJSONArray(key);
                        for(int j=0; j<windows.length(); j++) {
                            try {
                                String timeTitle = windows.getString(j);
                                try {
                                    if(timeTitle.equals(TimePickerModule.currentTime)) {
                                        defaultPosition = data.size();
                                    }
                                } catch (Exception e) {
                                    e.printStackTrace();
                                }
                                data.add(timeTitle);
                            } catch (JSONException e) {
                                e.printStackTrace();
                            }
                        }
                        break;
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        adapter = new Adapter(data);
        setAdapter(adapter);
        setTimeSelected(defaultPosition);
    }


    public void setOnTimeSelectedListener(OnTimeSelectedListener onTimeSelectedListener) {
        this.onTimeSelectedListener = onTimeSelectedListener;
    }

    @Override
    protected void onItemSelected(int position, Object item) {

    }

    @Override
    protected void onItemCurrentScroll(int position, Object item) {
        if (lastScrollPosition != position) {
            lastScrollPosition = position;
        }
    }

    @Override
    protected String getFormattedValue(Object value) {
        return String.valueOf(value);
    }

    @Override
    public int getDefaultItemPosition() {
        return 0;
    }

    public String getCurrentTime() {
        return adapter.getItemText(getCurrentItemPosition());
    }

    public void setTimeSelected(int i) {
        setSelectedItemPosition(i);
    }

    public interface OnTimeSelectedListener {
        void onItemSelected(WheelTimePicker picker);
    }
}