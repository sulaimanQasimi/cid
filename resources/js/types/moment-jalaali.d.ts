import * as moment from 'moment';

declare module 'moment-jalaali' {
  interface MomentJalaali extends moment.Moment {
    jYear(): number;
    jYear(year: number): MomentJalaali;
    jMonth(): number;
    jMonth(month: number): MomentJalaali;
    jDate(): number;
    jDate(date: number): MomentJalaali;
    add(amount: number, unit: 'jYear' | 'jMonth' | 'jWeek' | 'jDay' | 'jHour' | 'jMinute' | 'jSecond' | 'jMillisecond'): MomentJalaali;
    subtract(amount: number, unit: 'jYear' | 'jMonth' | 'jWeek' | 'jDay' | 'jHour' | 'jMinute' | 'jSecond' | 'jMillisecond'): MomentJalaali;
    startOf(unit: 'jYear' | 'jMonth' | 'jWeek' | 'jDay' | 'jHour' | 'jMinute' | 'jSecond' | 'jMillisecond'): MomentJalaali;
    endOf(unit: 'jYear' | 'jMonth' | 'jWeek' | 'jDay' | 'jHour' | 'jMinute' | 'jSecond' | 'jMillisecond'): MomentJalaali;
  }
  
  const momentJalaali: typeof moment & {
    (): MomentJalaali;
    (input?: moment.MomentInput): MomentJalaali;
    (input?: moment.MomentInput, format?: moment.MomentFormatSpecification, strict?: boolean): MomentJalaali;
    (input?: moment.MomentInput, format?: moment.MomentFormatSpecification, language?: string, strict?: boolean): MomentJalaali;
  };
  
  export = momentJalaali;
}

declare module 'moment' {
  interface Moment {
    jYear(): number;
    jYear(year: number): Moment;
    jMonth(): number;
    jMonth(month: number): Moment;
    jDate(): number;
    jDate(date: number): Moment;
    add(amount: number, unit: 'jYear' | 'jMonth' | 'jWeek' | 'jDay' | 'jHour' | 'jMinute' | 'jSecond' | 'jMillisecond'): Moment;
    subtract(amount: number, unit: 'jYear' | 'jMonth' | 'jWeek' | 'jDay' | 'jHour' | 'jMinute' | 'jSecond' | 'jMillisecond'): Moment;
    startOf(unit: 'jYear' | 'jMonth' | 'jWeek' | 'jDay' | 'jHour' | 'jMinute' | 'jSecond' | 'jMillisecond'): Moment;
    endOf(unit: 'jYear' | 'jMonth' | 'jWeek' | 'jDay' | 'jHour' | 'jMinute' | 'jSecond' | 'jMillisecond'): Moment;
  }
}
