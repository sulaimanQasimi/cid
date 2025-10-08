import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n/translate';
import moment from 'moment-jalaali';

interface PersianDatePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  error?: string;
  className?: string;
  disabled?: boolean;
  id?: string;
}

const PersianDatePicker: React.FC<PersianDatePickerProps> = ({
  value = '',
  onChange,
  placeholder,
  label,
  required = false,
  error,
  className,
  disabled = false,
  id,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<moment.Moment | null>(null);
  const [currentMonth, setCurrentMonth] = useState<moment.Moment>(moment());
  const [displayValue, setDisplayValue] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Persian month names from translations
  const persianMonths = [
    t('persian_calendar.months.farvardin'),
    t('persian_calendar.months.ordibehesht'),
    t('persian_calendar.months.khordad'),
    t('persian_calendar.months.tir'),
    t('persian_calendar.months.mordad'),
    t('persian_calendar.months.shahrivar'),
    t('persian_calendar.months.mehr'),
    t('persian_calendar.months.aban'),
    t('persian_calendar.months.azar'),
    t('persian_calendar.months.dey'),
    t('persian_calendar.months.bahman'),
    t('persian_calendar.months.esfand')
  ];

  const persianWeekDays = [
    t('persian_calendar.weekdays.shanbe'),
    t('persian_calendar.weekdays.yekshanbe'),
    t('persian_calendar.weekdays.doshanbe'),
    t('persian_calendar.weekdays.seshanbe'),
    t('persian_calendar.weekdays.chaharshanbe'),
    t('persian_calendar.weekdays.panjshanbe'),
    t('persian_calendar.weekdays.jome')
  ];

  useEffect(() => {
    if (value) {
      const momentDate = moment(value, 'jYYYY/jMM/jDD');
      if (momentDate.isValid()) {
        setSelectedDate(momentDate);
        setDisplayValue(momentDate.format('jYYYY/jMM/jDD'));
      }
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDateSelect = (date: moment.Moment) => {
    setSelectedDate(date);
    setDisplayValue(date.format('jYYYY/jMM/jDD'));
    setIsOpen(false);
    if (onChange) {
      onChange(date.format('jYYYY/jMM/jDD'));
    }
  };

  const handlePrevMonth = () => {
    setCurrentMonth(currentMonth.clone().subtract(1, 'jMonth'));
  };

  const handleNextMonth = () => {
    setCurrentMonth(currentMonth.clone().add(1, 'jMonth'));
  };

  const getDaysInMonth = () => {
    const startOfMonth = currentMonth.clone().startOf('jMonth');
    const endOfMonth = currentMonth.clone().endOf('jMonth');
    const days = [];

    // Add empty cells for days before the first day of the month
    const firstDayOfWeek = startOfMonth.day();
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= endOfMonth.jDate(); day++) {
      const date = currentMonth.clone().jDate(day);
      days.push(date);
    }

    return days;
  };

  const isToday = (date: moment.Moment) => {
    return date.isSame(moment(), 'day');
  };

  const isSelected = (date: moment.Moment) => {
    return selectedDate && date.isSame(selectedDate, 'day');
  };

  const days = getDaysInMonth();

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {label && (
        <Label htmlFor={id} className="text-base font-medium flex items-center gap-2 text-gray-800 dark:text-gray-200 text-right" dir="rtl">
          {required && <span className="text-red-500">*</span>}
          {label}
          <Calendar className="h-4 w-4" />
        </Label>
      )}
      
      <div className="relative">
        <Input
          id={id}
          type="text"
          value={displayValue}
          onChange={(e) => setDisplayValue(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder || t('persian_calendar.select_date')}
          disabled={disabled}
          className={cn(
            'h-12 border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-500/20 bg-white dark:bg-gray-800 text-right',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
          )}
          readOnly
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled}
        >
          <Calendar className="h-4 w-4 text-gray-500" />
        </Button>
      </div>

      {error && (
        <p className="text-sm text-red-500 font-medium bg-red-50 p-2 rounded-lg border border-red-200 flex items-center gap-2 text-right mt-2">
          {error}
        </p>
      )}

      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handlePrevMonth}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            
            <div className="text-center">
              <div className="font-semibold text-gray-900 dark:text-gray-100">
                {persianMonths[currentMonth.jMonth()]} {currentMonth.jYear()}
              </div>
            </div>
            
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleNextMonth}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>

          {/* Week days */}
          <div className="grid grid-cols-7 gap-1 p-2">
            {persianWeekDays.map((day) => (
              <div
                key={day}
                className="h-8 flex items-center justify-center text-sm font-medium text-gray-500 dark:text-gray-400"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-1 p-2">
            {days.map((date, index) => (
              <div key={index} className="h-8 flex items-center justify-center">
                {date ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={cn(
                      'h-8 w-8 p-0 text-sm',
                      isToday(date) && 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 font-semibold',
                      isSelected(date) && 'bg-blue-500 text-white hover:bg-blue-600',
                      !isToday(date) && !isSelected(date) && 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    )}
                    onClick={() => handleDateSelect(date)}
                  >
                    {date.jDate()}
                  </Button>
                ) : (
                  <div className="h-8 w-8" />
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex justify-between p-2 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                const today = moment();
                handleDateSelect(today);
              }}
              className="text-sm"
            >
              {t('persian_calendar.today')}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-sm"
            >
              {t('persian_calendar.close')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersianDatePicker;
