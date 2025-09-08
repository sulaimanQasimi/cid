declare module 'react-persian-datepicker' {
  import { Component } from 'react';

  interface DatePickerProps {
    value?: any;
    onChange?: (date: any) => void;
    inputFormat?: string;
    inputPlaceholder?: string;
    inputClass?: string;
    calendarStyles?: {
      calendarContainer?: string;
      dayPickerContainer?: string;
      monthsList?: string;
      daysOfWeek?: string;
      dayWrapper?: string;
      selected?: string;
      heading?: string;
    };
  }

  export class DatePicker extends Component<DatePickerProps> {}
}
