package com.press.modules.timepicker;

import android.content.Context;
import android.content.res.Resources;
import android.content.res.TypedArray;
import android.os.Handler;
import android.util.AttributeSet;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;

import com.press.R;
import com.press.modules.timepicker.widget.WheelDayPicker;
import com.press.modules.timepicker.widget.WheelPicker;
import com.press.modules.timepicker.widget.WheelTimePicker;

import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;

public class SingleDateAndTimePicker extends LinearLayout {

    public static final boolean IS_CYCLIC_DEFAULT = true;
    public static final boolean IS_CURVED_DEFAULT = false;
    public static final boolean MUST_BE_ON_FUTUR_DEFAULT = false;
    private static final int VISIBLE_ITEM_COUNT_DEFAULT = 3;

    private WheelDayPicker daysPicker;
    private WheelTimePicker timePicker;

    private Listener listener;

    private int textColor;
    private int selectedTextColor;
    private int textSize;
    private int selectorColor;
    private boolean isCyclic;
    private boolean isCurved;
    private int visibleItemCount;
    private View dtSelector;

    private int selectorHeight;
    Handler mHandler = new Handler();

    public SingleDateAndTimePicker(Context context) {
        this(context, null);
    }

    public SingleDateAndTimePicker(Context context, AttributeSet attrs) {
        this(context, attrs, 0);
    }

    public SingleDateAndTimePicker(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        init(context, attrs);
        inflate(context, R.layout.single_day_picker, this);

        timePicker = (WheelTimePicker) findViewById(R.id.timePicker);
        daysPicker = (WheelDayPicker) findViewById(R.id.daysPicker);
        dtSelector = findViewById(R.id.dtSelector);

        final ViewGroup.LayoutParams dtSelectorLayoutParams = dtSelector.getLayoutParams();
        dtSelectorLayoutParams.height = selectorHeight;
        dtSelector.setLayoutParams(dtSelectorLayoutParams);

        daysPicker.setOnDaySelectedListener(new WheelDayPicker.OnDaySelectedListener() {
            @Override
            public void onDaySelected(WheelDayPicker picker, int position, String name) {
                TimePickerModule.currentTime = null;
                timePicker.updateTimes(name);
                updateListener();
            }
        });

        updatePicker();
        updateViews();
        mHandler.postDelayed(new Runnable() {
            @Override
            public void run() {
                timePicker.updateTimes(daysPicker.getCurrentDate());
            }
        }, 300);
    }
    public Locale getCurrentLocale() {
//    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
//      return getResources().getConfiguration().getLocales().get(0);
//    } else {
        //noinspection deprecation
        return getResources().getConfiguration().locale;
//    }
    }


    public void setCurved(boolean curved) {
        isCurved = curved;
        updatePicker();
    }

    public void setCyclic(boolean cyclic) {
        isCyclic = cyclic;
        updatePicker();
    }

    public void setTextSize(int textSize) {
        this.textSize = textSize;
        updatePicker();
    }

    public void setSelectedTextColor(int selectedTextColor) {
        this.selectedTextColor = selectedTextColor;
        updatePicker();
    }

    public void setTextColor(int textColor) {
        this.textColor = textColor;
        updatePicker();
    }

    public void setSelectorColor(int selectorColor) {
        this.selectorColor = selectorColor;
        updateViews();
    }

    public void setVisibleItemCount(int visibleItemCount) {
        this.visibleItemCount = visibleItemCount;
        updatePicker();
    }

    private void updatePicker() {
        if (daysPicker != null && timePicker != null) {
            for (WheelPicker wheelPicker : Arrays.asList(daysPicker, timePicker)) {
                wheelPicker.setItemTextColor(textColor);
                wheelPicker.setSelectedItemTextColor(selectedTextColor);
                wheelPicker.setItemTextSize(textSize);
                wheelPicker.setVisibleItemCount(visibleItemCount);
            }
        }
    }

    private void updateViews() {
        dtSelector.setBackgroundColor(selectorColor);
    }


    public void setListener(Listener listener) {
        this.listener = listener;
    }

    public String getTimeAsString() {
        return  timePicker.getCurrentTime();
    }

    public String getDateAsString() {
        return  daysPicker.getCurrentDate();
    }


    public void selectDate(Calendar calendar) {
        if (calendar == null) {
            return;
        }
        Date date = calendar.getTime();
        int indexOfDay = daysPicker.findIndexOfDate(date);
        if (indexOfDay != -1) {
            daysPicker.setSelectedItemPosition(indexOfDay);
        }
    }

    private void updateListener() {
        String displayed = daysPicker.getCurrentDate();
        if (listener != null) {
            listener.onDateChanged(displayed);
        }
    }

    private void init(Context context, AttributeSet attrs) {
        TypedArray a = context.obtainStyledAttributes(attrs, R.styleable.SingleDateAndTimePicker);

        final Resources resources = getResources();
        textColor = a.getColor(R.styleable.SingleDateAndTimePicker_picker_textColor,
                resources.getColor(R.color.picker_default_text_color));
        selectedTextColor = a.getColor(R.styleable.SingleDateAndTimePicker_picker_selectedTextColor,
                resources.getColor(R.color.picker_default_selected_text_color));
        selectorColor = a.getColor(R.styleable.SingleDateAndTimePicker_picker_selectorColor,
                resources.getColor(R.color.picker_default_selector_color));
        selectorHeight = a.getDimensionPixelSize(R.styleable.SingleDateAndTimePicker_picker_selectorHeight, resources.getDimensionPixelSize(R.dimen.wheelSelectorHeight));
        textSize = a.getDimensionPixelSize(R.styleable.SingleDateAndTimePicker_picker_textSize,
                resources.getDimensionPixelSize(R.dimen.WheelItemTextSize));
        isCurved = a.getBoolean(R.styleable.SingleDateAndTimePicker_picker_curved, IS_CURVED_DEFAULT);
        isCyclic = a.getBoolean(R.styleable.SingleDateAndTimePicker_picker_cyclic, IS_CYCLIC_DEFAULT);
        visibleItemCount = a.getInt(R.styleable.SingleDateAndTimePicker_picker_visibleItemCount, VISIBLE_ITEM_COUNT_DEFAULT);

        a.recycle();
    }

    public interface Listener {
        void onDateChanged(String displayed);
    }
}
