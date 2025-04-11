<?php

namespace App\Http\Controllers;

use App\Models\Meeting;
use App\Models\User;
use App\Models\MeetingSession;
use App\Models\MeetingMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;

class MeetingController extends Controller
{
    use AuthorizesRequests, ValidatesRequests;

    /**
     * Display a listing of the meetings.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', Meeting::class);

        $query = Meeting::query()
            ->with('creator')
            ->withCount('participants');

        // Filter by user's meetings or all meetings for admin
        if (!$request->user()->hasRole('admin')) {
            $query->where(function ($q) use ($request) {
                $q->where('created_by', $request->user()->id)
                  ->orWhereHas('participants', function ($q) use ($request) {
                      $q->where('user_id', $request->user()->id);
                  });
            });
        }

        // Search by title
        if ($request->has('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Sort
        $sortField = $request->input('sort', 'scheduled_at');
        $sortDirection = $request->input('direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        $meetings = $query->paginate(10)
            ->withQueryString();

        return Inertia::render('Meeting/Index', [
            'meetings' => $meetings,
            'filters' => $request->only(['search', 'status', 'sort', 'direction']),
        ]);
    }

    /**
     * Show the form for creating a new meeting.
     */
    public function create()
    {
        $this->authorize('create', Meeting::class);

        $users = User::select('id', 'name', 'email')->orderBy('name')->get();

        return Inertia::render('Meeting/Create', [
            'users' => $users,
        ]);
    }

    /**
     * Store a newly created meeting in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('create', Meeting::class);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'scheduled_at' => 'nullable|date',
            'duration_minutes' => 'nullable|integer|min:1',
            'is_recurring' => 'boolean',
            'participants' => 'nullable|array',
            'participants.*' => 'exists:users,id',
            'offline_enabled' => 'boolean',
        ]);

        // Generate a unique meeting code
        $validated['meeting_code'] = Str::random(10);
        $validated['created_by'] = $request->user()->id;
        $validated['status'] = 'scheduled';

        $meeting = Meeting::create($validated);

        // Filter out the creator from participants array to avoid duplicate entries
        $participantIds = isset($validated['participants'])
            ? array_filter($validated['participants'], fn($id) => $id != $request->user()->id)
            : [];

        // Add participants (excluding creator)
        foreach ($participantIds as $participantId) {
            $meeting->participants()->attach($participantId, [
                'role' => 'participant',
                'status' => 'invited',
            ]);
        }

        // Add the creator as a host
        $meeting->participants()->attach($request->user()->id, [
            'role' => 'host',
            'status' => 'invited',
        ]);

        return redirect()->route('meetings.index')
            ->with('message', 'Meeting created successfully');
    }

    /**
     * Display the specified meeting.
     */
    public function show($id)
    {
        $meeting = Meeting::with(['creator', 'participants'])
            ->findOrFail($id);

        $this->authorize('view', $meeting);

        return Inertia::render('Meeting/Show', [
            'meeting' => $meeting,
        ]);
    }

    /**
     * Show the form for editing the specified meeting.
     */
    public function edit($id)
    {
        $meeting = Meeting::with('participants')->findOrFail($id);

        $this->authorize('update', $meeting);

        $users = User::select('id', 'name', 'email')->orderBy('name')->get();
        $participants = $meeting->participants->pluck('id')->toArray();

        return Inertia::render('Meeting/Edit', [
            'meeting' => $meeting,
            'users' => $users,
            'selectedParticipants' => $participants,
        ]);
    }

    /**
     * Update the specified meeting in storage.
     */
    public function update(Request $request, $id)
    {
        $meeting = Meeting::findOrFail($id);

        $this->authorize('update', $meeting);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'scheduled_at' => 'nullable|date',
            'duration_minutes' => 'nullable|integer|min:1',
            'is_recurring' => 'boolean',
            'participants' => 'nullable|array',
            'participants.*' => 'exists:users,id',
            'offline_enabled' => 'boolean',
        ]);

        $meeting->update($validated);

        // Update participants
        if (isset($validated['participants'])) {
            // Get current participants excluding the host
            $currentParticipants = $meeting->participants()
                ->wherePivot('role', '!=', 'host')
                ->pluck('user_id')
                ->toArray();

            // Determine who to add and who to remove
            $toAdd = array_diff($validated['participants'], $currentParticipants);
            $toRemove = array_diff($currentParticipants, $validated['participants']);

            // Add new participants
            foreach ($toAdd as $participantId) {
                $meeting->participants()->attach($participantId, [
                    'role' => 'participant',
                    'status' => 'invited',
                ]);
            }

            // Remove participants
            if (!empty($toRemove)) {
                $meeting->participants()->detach($toRemove);
            }
        }

        return redirect()->route('meetings.index')
            ->with('message', 'Meeting updated successfully');
    }

    /**
     * Remove the specified meeting from storage.
     */
    public function destroy($id)
    {
        $meeting = Meeting::findOrFail($id);

        $this->authorize('delete', $meeting);

        $meeting->delete();

        return redirect()->route('meetings.index')
            ->with('message', 'Meeting deleted successfully');
    }

    /**
     * Join a meeting.
     */
    public function join($meetingCode)
    {
        $meeting = Meeting::where('meeting_code', $meetingCode)
            ->with(['creator', 'participants'])
            ->firstOrFail();

        $this->authorize('join', $meeting);

        $userId = Auth::id();
        $isParticipant = $meeting->participants()->where('user_id', $userId)->exists();

        if (!$isParticipant) {
            $meeting->participants()->attach($userId, [
                'role' => 'participant',
                'status' => 'joined',
                'joined_at' => now(),
            ]);
        } else {
            $meeting->participants()->updateExistingPivot($userId, [
                'status' => 'joined',
                'joined_at' => now(),
            ]);
        }

        // If the meeting status is scheduled, change it to in_progress
        if ($meeting->status === 'scheduled') {
            $meeting->update(['status' => 'in_progress']);
        }

        return Inertia::render('Meeting/Room', [
            'meeting' => $meeting->load('participants'),
            'user' => Auth::user(),
            'isOfflineEnabled' => $meeting->offline_enabled,
        ]);
    }

    /**
     * Leave a meeting.
     */
    public function leave(Request $request, $id)
    {
        $meeting = Meeting::findOrFail($id);
        $userId = $request->user()->id;

        $meeting->participants()->updateExistingPivot($userId, [
            'status' => 'left',
            'left_at' => now(),
        ]);

        // If no more participants are joined, mark as completed
        $activeParticipants = $meeting->participants()
            ->wherePivot('status', 'joined')
            ->count();

        if ($activeParticipants === 0) {
            $meeting->update(['status' => 'completed']);
        }

        return redirect()->route('meetings.index')
            ->with('message', 'You have left the meeting');
    }

    /**
     * Start a meeting immediately.
     */
    public function start(Request $request)
    {
        $this->authorize('create', Meeting::class);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'offline_enabled' => 'boolean',
        ]);

        // Generate a unique meeting code
        $meetingCode = Str::random(10);

        $meeting = Meeting::create([
            'title' => $validated['title'],
            'description' => 'Instant meeting',
            'meeting_code' => $meetingCode,
            'status' => 'in_progress',
            'created_by' => $request->user()->id,
            'offline_enabled' => $validated['offline_enabled'] ?? false,
        ]);

        // Add the creator as a host
        $meeting->participants()->attach($request->user()->id, [
            'role' => 'host',
            'status' => 'joined',
            'joined_at' => now(),
        ]);

        return redirect()->route('meetings.join', $meetingCode);
    }
}
