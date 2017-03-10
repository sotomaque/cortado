package com.press.modules.timepicker.widget;

import android.content.Context;
import android.util.AttributeSet;


import java.util.ArrayList;
import java.util.List;

public class WheelTimePicker extends WheelPicker {

    String[] times = {"8:00 - 10:00 AM", "10:00 - 12:00 PM", "12:00 - 2:00 PM", "2:00 - 4:00 PM", "4:00 - 6:00 PM", "6:00 - 8:00 PM", "8:00 - 10:00 PM"};

    private Adapter adapter;

    private int lastScrollPosition;

    private OnTimeSelectedListener onTimeSelectedListener;

    public WheelTimePicker(Context context) {
        this(context, null);
    }

    public WheelTimePicker(Context context, AttributeSet attrs) {
        super(context, attrs);
        initAdapter();
    }

    private void initAdapter() {
        final List<String> values = new ArrayList<>();
        for(int i=0; i<times.length; i++)
            values.add(times[i]);
        adapter = new Adapter(values);
        setAdapter(adapter);
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

    public void setTimeSelected(int i) {
        setSelectedItemPosition(i);
    }

    public interface OnTimeSelectedListener {
        void onItemSelected(WheelTimePicker picker);
    }
}