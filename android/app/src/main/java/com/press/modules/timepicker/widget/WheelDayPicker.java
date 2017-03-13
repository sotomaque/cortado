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

public class WheelDayPicker extends WheelPicker {

    private int defaultIndex;

    private OnDaySelectedListener onDaySelectedListener;

    Adapter adapter;

    public WheelDayPicker(Context context) {
        this(context, null);
    }

    public WheelDayPicker(Context context, AttributeSet attrs) {
        super(context, attrs);
        this.adapter = new Adapter();
        setAdapter(adapter);
        updateDays();
    }

    @Override
    protected void onItemSelected(int position, Object item) {
        if (null != onDaySelectedListener) {
            final String itemText = (String) item;
            onDaySelectedListener.onDaySelected(this, position, itemText);
        }
    }

    @Override
    protected void onItemCurrentScroll(int position, Object item) {

    }

    @Override
    protected String getFormattedValue(Object value) {
        return value.toString();
    }

    @Override
    public int getDefaultItemPosition() {
        return defaultIndex;
    }


    public void updateDays() {
        final List<String> data = new ArrayList<>();
        defaultIndex = 0;
        try {
            Log.e("DATE", TimePickerModule.current_type+"/"+TimePickerModule.currentDate);
            if (TimePickerModule.current_type.equals("currentPickup")) {
                for (int i = 0; i < TimePickerModule.data_picker.length(); i++) {
                    JSONObject jso = TimePickerModule.data_picker.getJSONObject(i);
                    String dayTitle = jso.getString("key");
                    if (i == 0) {
                        TimePickerModule.currentPickup = dayTitle;
                    }
                    if (dayTitle.equals(TimePickerModule.currentDate)) {
                        defaultIndex = data.size();
                        TimePickerModule.currentPickup = dayTitle;
                    }
                    data.add(dayTitle);
                }
            } else {
                JSONArray dropoff_times = TimePickerModule.data_picker_dropoff.getJSONArray(TimePickerModule.currentPickup);
                for (int i = 0; i < dropoff_times.length(); i++) {
                    JSONObject jso2 = dropoff_times.getJSONObject(i);
                    Iterator<?> keys = jso2.keys();
                    while (keys.hasNext()) {
                        String dayTitle = (String) keys.next();
                        if (dayTitle.equals(TimePickerModule.currentDate)) {
                            defaultIndex = data.size();
                        }
                        data.add(dayTitle);
                        break;
                    }
                }
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
        adapter.setData(data);
        updateDefaultDay();
    }

    public void setOnDaySelectedListener(OnDaySelectedListener onDaySelectedListener) {
        this.onDaySelectedListener = onDaySelectedListener;
    }

    private void updateDefaultDay() {
        setSelectedItemPosition(defaultIndex);
    }

    public int getDefaultDayIndex() {
        return defaultIndex;
    }

    public String getCurrentDate() {
        return adapter.getItemText(getCurrentItemPosition());
    }

    public interface OnDaySelectedListener {
        void onDaySelected(WheelDayPicker picker, int position, String name);
    }
}