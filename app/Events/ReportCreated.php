<?php

namespace App\Events;

use App\Models\Report;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ReportCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * The report instance.
     *
     * @var \App\Models\Report
     */
    public $report;

    /**
     * Create a new event instance.
     *
     * @param  \App\Models\Report  $report
     * @return void
     */
    public function __construct(Report $report)
    {
        $this->report = $report;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        $reportableType = str_replace('\\', '.', $this->report->reportable_type);

        return [
            new PrivateChannel('reports'),
            new PrivateChannel("reports.{$reportableType}.{$this->report->reportable_id}"),
        ];
    }

    /**
     * Get the data to broadcast.
     *
     * @return array
     */
    public function broadcastWith(): array
    {
        return [
            'id' => $this->report->id,
            'code' => $this->report->code,
            'reportable_type' => $this->report->reportable_type,
            'reportable_id' => $this->report->reportable_id,
            'created_at' => $this->report->created_at,
            'created_by' => $this->report->created_by,
        ];
    }
}
