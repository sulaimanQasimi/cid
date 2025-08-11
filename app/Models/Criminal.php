<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use App\Models\Traits\HasVisitors;
/**
 * @property int $id
 * @property string $photo
 * @property string $number
 * @property string $name
 * @property string $father_name
 * @property string $grandfather_name
 * @property string $id_card_number
 * @property string $phone_number
 * @property string $original_residence
 * @property string $current_residence
 * @property string $crime_type
 * @property string $arrest_location
 * @property string $arrested_by
 * @property string $arrest_date
 * @property string $referred_to
 * @property string $final_verdict
 * @property string $notes
 * @property int $department_id
 * @property int $created_by
 * @property int $visits_count
 * @property int $unique_visitors_count
 * @property int $today_visits_count
 * @property int $this_week_visits_count
 * @property int $this_month_visits_count
 */
class Criminal extends Model
{
    use HasFactory, HasVisitors;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'photo',
        'number',
        'name',
        'father_name',
        'grandfather_name',
        'id_card_number',
        'phone_number',
        'original_residence',
        'current_residence',
        'crime_type',
        'arrest_location',
        'arrested_by',
        'arrest_date',
        'referred_to',
        'final_verdict',
        'notes',
        'department_id',
        'created_by',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'arrest_date' => 'date',
    ];

    /**
     * Get the department that the criminal belongs to.
     */
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    /**
     * Get the user who created the criminal record.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the reports for this criminal.
     */
    public function reports(): MorphMany
    {
        return $this->morphMany(Report::class, 'reportable');
    }
}
