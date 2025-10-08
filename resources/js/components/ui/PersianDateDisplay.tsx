import React from 'react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n/translate';
import moment from 'moment-jalaali';

interface PersianDateDisplayProps {
  date: string | Date | null;
  format?: 'full' | 'short' | 'date' | 'datetime';
  className?: string;
  showGregorian?: boolean;
  fallback?: string;
}

const PersianDateDisplay: React.FC<PersianDateDisplayProps> = ({
  date,
  format = 'date',
  className,
  showGregorian = false,
  fallback,
}) => {
  const { t } = useTranslation();
  
  if (!date) {
    return <span className={cn('text-gray-500 dark:text-gray-400', className)}>{fallback || t('persian_calendar.no_date')}</span>;
  }

  let momentDate: moment.Moment;

  // Handle different date formats
  if (typeof date === 'string') {
    // Try to parse as Persian date first
    if (date.includes('/')) {
      momentDate = moment(date, 'jYYYY/jMM/jDD');
    } else {
      // Try to parse as ISO date
      momentDate = moment(date);
    }
  } else {
    momentDate = moment(date);
  }

  if (!momentDate.isValid()) {
    return <span className={cn('text-gray-500 dark:text-gray-400', className)}>{fallback || t('persian_calendar.invalid_date')}</span>;
  }

  const formatDate = () => {
    switch (format) {
      case 'full':
        return momentDate.format('jYYYY/jMM/jDD - dddd، jD jMMMM jYYYY');
      case 'short':
        return momentDate.format('jYY/jMM/jDD');
      case 'datetime':
        return momentDate.format('jYYYY/jMM/jDD HH:mm');
      case 'date':
      default:
        return momentDate.format('jYYYY/jMM/jDD');
    }
  };

  const formatGregorian = () => {
    switch (format) {
      case 'full':
        return momentDate.format('YYYY/MM/DD - dddd، D MMMM YYYY');
      case 'short':
        return momentDate.format('YY/MM/DD');
      case 'datetime':
        return momentDate.format('YYYY/MM/DD HH:mm');
      case 'date':
      default:
        return momentDate.format('YYYY/MM/DD');
    }
  };

  return (
    <div className={cn('text-right', className)}>
      <div className="text-gray-900 dark:text-gray-100 font-medium">
        {formatDate()}
      </div>
      {showGregorian && (
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {t('persian_calendar.gregorian_label')}: {formatGregorian()}
        </div>
      )}
    </div>
  );
};

export default PersianDateDisplay;
