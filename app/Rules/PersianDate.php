<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;
use Carbon\Carbon;
use Morilog\Jalali\Jalalian;

class PersianDate implements Rule
{
    /**
     * Create a new rule instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        if (empty($value)) {
            return true; // Let required rule handle empty values
        }

        // Check if it's a Persian date format (jYYYY/jMM/jDD)
        if (preg_match('/^\d{4}\/\d{2}\/\d{2}$/', $value)) {
            try {
                // Try to parse as Persian date
                $parts = explode('/', $value);
                if (count($parts) === 3) {
                    $year = (int) $parts[0];
                    $month = (int) $parts[1];
                    $day = (int) $parts[2];
                    
                    // Validate Persian date ranges
                    if ($year < 1300 || $year > 1500) {
                        return false;
                    }
                    
                    if ($month < 1 || $month > 12) {
                        return false;
                    }
                    
                    if ($day < 1 || $day > 31) {
                        return false;
                    }
                    
                    // Try to create a Jalalian date to validate
                    $jalalian = Jalalian::fromFormat('Y/m/d', $value);
                    return $jalalian !== null;
                }
            } catch (\Exception $e) {
                return false;
            }
        }

        // Check if it's a standard ISO date format
        try {
            Carbon::parse($value);
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return 'The :attribute must be a valid Persian date (YYYY/MM/DD) or standard date format.';
    }
}
