/// <reference types="moment" />

declare module 'moment-jalaali' {
  import * as momentLib from 'moment';
  
  interface MomentJalaali extends momentLib.Moment {
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
    isValid(): boolean;
    format(format?: string): string;
    toDate(): Date;
    clone(): MomentJalaali;
    isSame(other?: momentLib.MomentInput, granularity?: string): boolean;
    day(): number;
    day(day: number): MomentJalaali;
  }
  
  type MomentJalaaliConstructor = typeof momentLib & {
    (): MomentJalaali;
    (input?: momentLib.MomentInput): MomentJalaali;
    (input?: momentLib.MomentInput, format?: momentLib.MomentFormatSpecification, strict?: boolean): MomentJalaali;
    (input?: momentLib.MomentInput, format?: momentLib.MomentFormatSpecification, language?: string, strict?: boolean): MomentJalaali;
    Moment: {
      new (): MomentJalaali;
      new (input?: momentLib.MomentInput): MomentJalaali;
      new (input?: momentLib.MomentInput, format?: momentLib.MomentFormatSpecification, strict?: boolean): MomentJalaali;
      new (input?: momentLib.MomentInput, format?: momentLib.MomentFormatSpecification, language?: string, strict?: boolean): MomentJalaali;
      prototype: MomentJalaali;
    };
  };
  
  // Export Moment type that can be accessed as moment.Moment
  export namespace moment {
    type Moment = MomentJalaali;
  }
  
  const momentJalaali: MomentJalaaliConstructor;
  
  export = momentJalaali;
  export default momentJalaali;
  export type Moment = MomentJalaali;
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
