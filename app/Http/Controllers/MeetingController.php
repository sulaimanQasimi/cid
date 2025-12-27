<?php

namespace App\Http\Controllers;

use App\Models\Meeting;
use App\Models\User;
use App\Rules\PersianDate;
use App\Services\PersianDateService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\RedirectResponse;

class MeetingController extends Controller
{
    /**
     * Meeting status constants
     */
    private const STATUS_SCHEDULED = 'scheduled';

    /**
     * Normalize members array to handle both old format (objects with id/name) and new format (strings).
     * Returns a clean array of member names.
     *
     * @param array|null $members
     * @return array
     */
    private function normalizeMembers(?array $members): array
    {
        if (!is_array($members) || empty($members)) {
            return [];
        }

        $memberNames = array_map(function($member) {
            if (is_array($member) && isset($member['name'])) {
                return $member['name'];
            }
            return is_string($member) ? $member : '';
        }, $members);

        return array_values(array_filter($memberNames));
    }

    /**
     * Sanitize and prepare members array from validated input.
     *
     * @param array|null $members
     * @return array
     */
    private function prepareMembers(?array $members): array
    {
        if (!isset($members) || !is_array($members)) {
            return [];
        }

        return array_values(array_filter(
            array_map(function($name) {
                // Trim and sanitize member names
                return trim(strip_tags($name));
            }, $members),
            fn($name) => !empty($name)
        ));
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Meeting::class);

        $validated = $request->validate([
            'search' => 'nullable|string|max:255',
            'per_page' => 'nullable|integer|min:5|max:100',
            'page' => 'nullable|integer|min:1',
        ]);

        $query = Meeting::with(['creator:id,name'])
            ->where('created_by', Auth::id());

        // Apply search filter
        if (! empty($validated['search'])) {
            $query->where(function ($q) use ($validated) {
                $q->where('title', 'like', '%'.$validated['search'].'%')
                    ->orWhere('description', 'like', '%'.$validated['search'].'%')
                    ->orWhere('meeting_code', 'like', '%'.$validated['search'].'%');
            });
        }

        // Sort by newest first
        $query->orderBy('created_at', 'desc');

        // Get paginated results
        $perPage = $validated['per_page'] ?? 10;

        $meetings = $query->paginate($perPage)
            ->through(function ($meeting) {
                $members = $this->normalizeMembers($meeting->members);
                
            return [
                'id' => $meeting->id,
                'title' => $meeting->title,
                'description' => $meeting->description,
                'meeting_code' => $meeting->meeting_code,
                'start_date' => $meeting->start_date,
                'end_date' => $meeting->end_date,
                'scheduled_at' => $meeting->scheduled_at,
                'status' => $meeting->status,
                'members' => $members,
                'member_count' => count($members),
                'created_by' => $meeting->created_by,
                'created_at' => $meeting->created_at,
                'creator' => $meeting->creator,
                'can_view' => Auth::user()->can('view', $meeting),
                'can_update' => Auth::user()->can('update', $meeting),
                'can_delete' => Auth::user()->can('delete', $meeting),
            ];
            });

        return Inertia::render('Meeting/Index', [
            'meetings' => $meetings,
            'filters' => [
                'search' => $validated['search'] ?? '',
                'per_page' => $perPage,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $this->authorize('create', Meeting::class);

        return Inertia::render('Meeting/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $this->authorize('create', Meeting::class);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => ['required', 'string', new PersianDate()],
            'end_date' => ['required', 'string', new PersianDate()],
            'members' => 'nullable|array',
            'members.*' => 'required|string|max:255',
        ]);

        // Convert Persian dates to database format
        $startDate = PersianDateService::toDatabaseFormat($validated['start_date']);
        $endDate = PersianDateService::toDatabaseFormat($validated['end_date']);

        if (! $startDate) {
            return redirect()
                ->back()
                ->withErrors(['start_date' => 'Invalid date format. Please use Persian date format (YYYY/MM/DD).'])
                ->withInput();
        }

        if (! $endDate) {
            return redirect()
                ->back()
                ->withErrors(['end_date' => 'Invalid date format. Please use Persian date format (YYYY/MM/DD).'])
                ->withInput();
        }

        // Validate date range
        if ($endDate < $startDate) {
            return redirect()
                ->back()
                ->withErrors(['end_date' => 'End date must be after or equal to start date.'])
                ->withInput();
        }

        try {
            DB::transaction(function () use ($validated, $startDate, $endDate) {
                $membersArray = $this->prepareMembers($validated['members'] ?? null);

                // Generate unique meeting code
                $meetingCode = 'MTG-' . strtoupper(uniqid());

                Meeting::create([
                    'title' => $validated['title'],
                    'description' => $validated['description'] ?? null,
                    'start_date' => $startDate,
                    'end_date' => $endDate,
                    'members' => !empty($membersArray) ? $membersArray : null,
                    'meeting_code' => $meetingCode,
                    'status' => self::STATUS_SCHEDULED,
                    'created_by' => Auth::id(),
                ]);
            });

            return redirect()
                ->route('meetings.index')
                ->with('success', 'Meeting created successfully.');

        } catch (\Exception $e) {
            Log::error('Failed to create meeting', [
                'error' => $e->getMessage(),
                'data' => $validated,
            ]);

            return redirect()
                ->back()
                ->with('error', 'Failed to create meeting. Please try again.')
                ->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Meeting $meeting): Response
    {
        $this->authorize('view', $meeting);

        $meeting->loadMissing(['creator:id,name']);

        $members = $this->normalizeMembers($meeting->members);

        return Inertia::render('Meeting/Show', [
            'meeting' => [
                'id' => $meeting->id,
                'title' => $meeting->title,
                'description' => $meeting->description,
                'meeting_code' => $meeting->meeting_code,
                'start_date' => $meeting->start_date,
                'end_date' => $meeting->end_date,
                'scheduled_at' => $meeting->scheduled_at,
                'duration_minutes' => $meeting->duration_minutes,
                'status' => $meeting->status,
                'members' => $members,
                'is_recurring' => $meeting->is_recurring,
                'offline_enabled' => $meeting->offline_enabled,
                'created_by' => $meeting->created_by,
                'created_at' => $meeting->created_at,
                'creator' => $meeting->creator,
            ],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Meeting $meeting): Response
    {
        $this->authorize('update', $meeting);

        $members = $this->normalizeMembers($meeting->members);

        return Inertia::render('Meeting/Edit', [
            'meeting' => [
                'id' => $meeting->id,
                'title' => $meeting->title,
                'description' => $meeting->description,
                'start_date' => $meeting->start_date ? PersianDateService::fromCarbon($meeting->start_date) : null,
                'end_date' => $meeting->end_date ? PersianDateService::fromCarbon($meeting->end_date) : null,
                'scheduled_at' => $meeting->scheduled_at,
                'duration_minutes' => $meeting->duration_minutes,
                'status' => $meeting->status,
                'members' => $members,
                'is_recurring' => $meeting->is_recurring,
                'offline_enabled' => $meeting->offline_enabled,
            ],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Meeting $meeting): RedirectResponse
    {
        $this->authorize('update', $meeting);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => ['required', 'string', new PersianDate()],
            'end_date' => ['required', 'string', new PersianDate()],
            'members' => 'nullable|array',
            'members.*' => 'required|string|max:255',
        ]);

        // Convert Persian dates to database format
        $startDate = PersianDateService::toDatabaseFormat($validated['start_date']);
        $endDate = PersianDateService::toDatabaseFormat($validated['end_date']);

        if (! $startDate) {
            return redirect()
                ->back()
                ->withErrors(['start_date' => 'Invalid date format. Please use Persian date format (YYYY/MM/DD).'])
                ->withInput();
        }

        if (! $endDate) {
            return redirect()
                ->back()
                ->withErrors(['end_date' => 'Invalid date format. Please use Persian date format (YYYY/MM/DD).'])
                ->withInput();
        }

        // Validate date range
        if ($endDate < $startDate) {
            return redirect()
                ->back()
                ->withErrors(['end_date' => 'End date must be after or equal to start date.'])
                ->withInput();
        }

        try {
            DB::transaction(function () use ($meeting, $validated, $startDate, $endDate) {
                $membersArray = $this->prepareMembers($validated['members'] ?? null);

                $meeting->update([
                    'title' => $validated['title'],
                    'description' => $validated['description'] ?? null,
                    'start_date' => $startDate,
                    'end_date' => $endDate,
                    'members' => !empty($membersArray) ? $membersArray : null,
                ]);
            });

            return redirect()
                ->route('meetings.show', $meeting)
                ->with('success', 'Meeting updated successfully.');

        } catch (\Exception $e) {
            Log::error('Failed to update meeting', [
                'error' => $e->getMessage(),
                'meeting_id' => $meeting->id,
                'data' => $validated,
            ]);

            return redirect()
                ->back()
                ->with('error', 'Failed to update meeting. Please try again.')
                ->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Meeting $meeting): RedirectResponse
    {
        $this->authorize('delete', $meeting);

        try {
            $meeting->delete();

            return redirect()
                ->route('meetings.index')
                ->with('success', 'Meeting deleted successfully.');

        } catch (\Exception $e) {
            Log::error('Failed to delete meeting', [
                'error' => $e->getMessage(),
                'meeting_id' => $meeting->id,
            ]);

            return redirect()
                ->back()
                ->with('error', 'Failed to delete meeting. Please try again.');
        }
    }
}
