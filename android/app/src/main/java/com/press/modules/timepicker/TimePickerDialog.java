package com.press.modules.timepicker;

import android.content.Context;
import android.support.annotation.ColorInt;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.util.Log;
import android.view.View;
import android.widget.TextView;

import com.press.R;
import java.util.Calendar;
import java.util.Date;

/**
 * Created by leonacky on 3/10/17.
 */



public class TimePickerDialog extends BaseDialog {

    private Listener listener;
    private BottomSheetHelper bottomSheetHelper;
    private SingleDateAndTimePicker picker;

    @Nullable
    private String title, subtitle;

    private TimePickerDialog(Context context) {
        this(context, false);
    }

    private TimePickerDialog(Context context, boolean bottomSheet) {
        final int layout = bottomSheet ? R.layout.bottom_sheet_picker_bottom_sheet :
                R.layout.bottom_sheet_picker;
        this.bottomSheetHelper = new BottomSheetHelper(context, layout);


        this.bottomSheetHelper.setListener(new BottomSheetHelper.Listener() {
            @Override
            public void onOpen() {
            }

            @Override
            public void onLoaded(View view) {
                init(view);
            }

            @Override
            public void onClose() {
                TimePickerDialog.this.onClose();
            }
        });
    }


    private void init(View view) {
        picker = (SingleDateAndTimePicker) view.findViewById(R.id.picker);

        final TextView buttonOk = (TextView) view.findViewById(R.id.buttonOk);
        if (buttonOk != null) {
            buttonOk.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    okClicked = true;
                    close();
                }
            });

            if (mainColor != null) {
                buttonOk.setTextColor(mainColor);
            }
        }

        final View sheetContentLayout = view.findViewById(R.id.sheetContentLayout);
        if (sheetContentLayout != null) {
            sheetContentLayout.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {

                }
            });

            if (backgroundColor != null) {
                sheetContentLayout.setBackgroundColor(backgroundColor);
            }
        }

        final TextView titleTextView = (TextView) view.findViewById(R.id.sheetTitle);
        if (titleTextView != null) {
            titleTextView.setText(title);

            if (titleTextColor != null) {
                titleTextView.setTextColor(titleTextColor);
            }
        }

        final TextView subtitleTextView = (TextView) view.findViewById(R.id.subtitle);
        if (subtitleTextView != null) {
            subtitleTextView.setText(subtitle);

            if (titleTextColor != null) {
                titleTextView.setTextColor(titleTextColor);
            }
        }

        final View pickerTitleHeader = view.findViewById(R.id.pickerTitleHeader);
        if (mainColor != null && pickerTitleHeader != null) {
            pickerTitleHeader.setBackgroundColor(mainColor);
        }

        if (curved) {
            picker.setCurved(true);
            picker.setVisibleItemCount(7);
        } else {
            picker.setCurved(false);
            picker.setVisibleItemCount(5);
        }

        if (mainColor != null) {
            picker.setSelectedTextColor(mainColor);
        }
    }

    public TimePickerDialog setListener(Listener listener) {
        this.listener = listener;
        return this;
    }

    public TimePickerDialog setCurved(boolean curved) {
        this.curved = curved;
        return this;
    }

    public TimePickerDialog setTitle(@Nullable String title) {
        this.title = title;
        return this;
    }

    public TimePickerDialog setSubTitle(@Nullable String title) {
        this.subtitle = title;
        return this;
    }

    public TimePickerDialog setDefaultDate(Date defaultDate) {
        this.defaultDate = defaultDate;
        return this;
    }

    @Override
    public void display() {
        super.display();
        bottomSheetHelper.display();
    }

    @Override
    public void close() {
        super.close();
        bottomSheetHelper.hide();

        if (listener != null && okClicked) {
            listener.onDateSelected(picker.getDateAsString(), picker.getTimeAsString());
        }
    }

    public interface Listener {
        void onDateSelected(String dateString, String timeString);
    }

    public static class Builder {
        private final Context context;
        private TimePickerDialog dialog;

        @Nullable
        private Listener listener;

        @Nullable
        private String title;

        @Nullable
        private String subtitle;

        @Nullable
        private String currentDate;

        @Nullable
        private String currentTime;

        private boolean bottomSheet;

        private boolean curved;

        @ColorInt
        @Nullable
        private Integer backgroundColor = null;

        @ColorInt
        @Nullable
        private Integer mainColor = null;

        @ColorInt
        @Nullable
        private Integer titleTextColor = null;

        @Nullable
        private Date defaultDate;

        public Builder(Context context) {
            this.context = context;
        }

        public Builder title(@Nullable String title) {
            this.title = title;
            return this;
        }

        public Builder subtitle(@Nullable String title) {
            this.subtitle = title;
            return this;
        }

        public Builder bottomSheet() {
            this.bottomSheet = true;
            return this;
        }

        public Builder curved() {
            this.curved = true;
            return this;
        }

        public Builder listener(@Nullable Listener listener) {
            this.listener = listener;
            return this;
        }

        public Builder titleTextColor(@NonNull @ColorInt int titleTextColor) {
            this.titleTextColor = titleTextColor;
            return this;
        }

        public Builder backgroundColor(@NonNull @ColorInt int backgroundColor) {
            this.backgroundColor = backgroundColor;
            return this;
        }

        public Builder mainColor(@NonNull @ColorInt int mainColor) {
            this.mainColor = mainColor;
            return this;
        }


        public TimePickerDialog build() {
            final TimePickerDialog dialog = new TimePickerDialog(context, bottomSheet)
                    .setTitle(title)
                    .setSubTitle(subtitle)
                    .setListener(listener)
                    .setCurved(curved)
                    .setDefaultDate(defaultDate);

            if (mainColor != null) {
                dialog.setMainColor(mainColor);
            }

            if (backgroundColor != null) {
                dialog.setBackgroundColor(backgroundColor);
            }

            if (titleTextColor != null) {
                dialog.setTitleTextColor(titleTextColor);
            }

            return dialog;
        }

        public void display() {
            dialog = build();
            dialog.display();
        }

        public void close() {
            if (dialog != null) {
                dialog.close();
            }
        }
    }
}
