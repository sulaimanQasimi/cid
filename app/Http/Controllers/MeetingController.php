<?php

namespace App\Http\Controllers;

use App\Models\Meeting;
use App\Models\User;
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
            ->where(function ($q) {
                $userId = Auth::id();
                $q->where('created_by', $userId)
                    ->orWhereRaw('JSON_SEARCH(members, "one", ?, NULL, "$[*].id") IS NOT NULL', [$userId]);
            });

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
                $members = $meeting->members ?? [];
                $memberCount = is_array($members) ? count($members) : 0;
                
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
                    'member_count' => $memberCount,
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

        $users = User::orderBy('name')->get(['id', 'name', 'email']);

        return Inertia::render('Meeting/Create', [
            'users' => $users,
        ]);
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
            'start_date' => 'required|string',
            'end_date' => 'required|string',
            'members' => 'nullable|array',
            'members.*.id' => 'required|integer|exists:users,id',
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
                // Prepare members JSON with user names
                $membersJson = [];
                if (isset($validated['members']) && is_array($validated['members'])) {
                    foreach ($validated['members'] as $member) {
                        $user = User::find($member['id']);
                        if ($user) {
                            $membersJson[] = [
                                'id' => $user->id,
                                'name' => $user->name,
                            ];
                        }
                    }
                }

                // Generate unique meeting code
                $meetingCode = 'MTG-' . strtoupper(uniqid());

                $meeting = Meeting::create([
                    'title' => $validated['title'],
                    'description' => $validated['description'] ?? null,
                    'start_date' => $startDate,
                    'end_date' => $endDate,
                    'members' => ! empty($membersJson) ? $membersJson : null,
                    'meeting_code' => $meetingCode,
                    'status' => 'scheduled',
                    'created_by' => Auth::id(),
                ]);

                return $meeting;
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

        $meeting->load(['creator:id,name']);

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
                'members' => $meeting->members ?? [],
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

        $users = User::orderBy('name')->get(['id', 'name', 'email']);

        // Get selected member IDs from JSON
        $selectedMemberIds = [];
        if ($meeting->members && is_array($meeting->members)) {
            $selectedMemberIds = array_column($meeting->members, 'id');
        }

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
                'members' => $meeting->members ?? [],
                'is_recurring' => $meeting->is_recurring,
                'offline_enabled' => $meeting->offline_enabled,
            ],
            'users' => $users,
            'selectedMemberIds' => $selectedMemberIds,
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
            'start_date' => 'required|string',
            'end_date' => 'required|string',
            'members' => 'nullable|array',
            'members.*.id' => 'required|integer|exists:users,id',
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
                // Prepare members JSON with user names
                $membersJson = [];
                if (isset($validated['members']) && is_array($validated['members'])) {
                    foreach ($validated['members'] as $member) {
                        $user = User::find($member['id']);
                        if ($user) {
                            $membersJson[] = [
                                'id' => $user->id,
                                'name' => $user->name,
                            ];
                        }
                    }
                }

                $meeting->update([
                    'title' => $validated['title'],
                    'description' => $validated['description'] ?? null,
                    'start_date' => $startDate,
                    'end_date' => $endDate,
                    'members' => ! empty($membersJson) ? $membersJson : null,
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
