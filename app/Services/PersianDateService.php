<?php

namespace App\Services;

use Carbon\Carbon;
use Morilog\Jalali\Jalalian;

class PersianDateService
{
    /**
     * Convert Persian date to Carbon instance
     *
     * @param string $persianDate
     * @return Carbon|null
     */
    public static function toCarbon($persianDate)
    {
        if (empty($persianDate)) {
            return null;
        }

        try {
            // Check if it's already a standard date format
            if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $persianDate)) {
                return Carbon::parse($persianDate);
            }

            // Check if it's a Persian date format (jYYYY/jMM/jDD)
            if (preg_match('/^\d{4}\/\d{2}\/\d{2}$/', $persianDate)) {
                $parts = explode('/', $persianDate);
                if (count($parts) === 3) {
                    $year = (int) $parts[0];
                    $month = (int) $parts[1];
                    $day = (int) $parts[2];
                    
                    // Create Jalalian date and convert to Carbon
                    $jalalian = Jalalian::fromFormat('Y/m/d', $persianDate);
                    return $jalalian->toCarbon();
                }
            }

            // Try to parse as standard date
            return Carbon::parse($persianDate);
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Convert Carbon instance to Persian date string
     *
     * @param Carbon|\DateTime|string|null $date
     * @return string|null
     */
    public static function fromCarbon($date)
    {
        if (!$date) {
            return null;
        }

        try {
            // Convert to Carbon if it's not already
            if (!$date instanceof Carbon) {
                $date = Carbon::parse($date);
            }
            
            $jalalian = Jalalian::fromCarbon($date);
            return $jalalian->format('Y/m/d');
        } catch (\Exception $e) {
            return $date instanceof Carbon ? $date->format('Y-m-d') : null;
        }
    }

    /**
     * Validate if the date is a valid Persian date
     *
     * @param string $date
     * @return bool
     */
    public static function isValidPersianDate($date)
    {
        if (empty($date)) {
            return true;
        }

        try {
            // Check if it's a Persian date format
            if (preg_match('/^\d{4}\/\d{2}\/\d{2}$/', $date)) {
                $parts = explode('/', $date);
                if (count($parts) === 3) {
                    $year = (int) $parts[0];
                    $month = (int) $parts[1];
                    $day = (int) $parts[2];
                    
                    // Basic range validation
                    if ($year < 1300 || $year > 1500) {
                        return false;
                    }
                    
                    if ($month < 1 || $month > 12) {
                        return false;
                    }
                    
                    if ($day < 1 || $day > 31) {
                        return false;
                    }
                    
                    // Try to create Jalalian date
                    $jalalian = Jalalian::fromFormat('Y/m/d', $date);
                    return $jalalian !== null;
                }
            }

            // Check if it's a standard date
            try {
                Carbon::parse($date);
                return true;
            } catch (\Exception $e) {
                return false;
            }
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Convert Persian date to database format (Y-m-d)
     *
     * @param string $persianDate
     * @return string|null
     */
    public static function toDatabaseFormat($persianDate)
    {
        $carbon = self::toCarbon($persianDate);
        return $carbon ? $carbon->format('Y-m-d') : null;
    }

    /**
     * Get current Persian date
     *
     * @return string
     */
    public static function now()
    {
        $jalalian = Jalalian::now();
        return $jalalian->format('Y/m/d');
    }
}
