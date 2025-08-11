<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use App\Models\Traits\HasVisitors;

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
