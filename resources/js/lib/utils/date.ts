/**
 * Format a date string to Persian date format
 * @param dateString - ISO date string
 * @param options - Intl.DateTimeFormatOptions for customization
 * @returns Formatted Persian date string
 */
export const formatPersianDate = (
  dateString: string, 
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    calendar: 'persian'
  }
): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('fa-IR', options);
  } catch (error) {
    console.error('Error formatting Persian date:', error);
    return dateString;
  }
};

/**
 * Format a date string to Persian date with time
 * @param dateString - ISO date string
 * @returns Formatted Persian date and time string
 */
export const formatPersianDateTime = (dateString: string): string => {
  return formatPersianDate(dateString, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    calendar: 'persian'
  });
};

/**
 * Format a date string to Persian date only (yyyy/mm/dd format)
 * @param dateString - ISO date string
 * @returns Formatted Persian date string in yyyy/mm/dd format
 */
export const formatPersianDateOnly = (dateString: string): string => {
  return formatPersianDate(dateString, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    calendar: 'persian'
  });
};
