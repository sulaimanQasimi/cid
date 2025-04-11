import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

interface User {
  id: number;
  name: string;
  email: string;
}

interface Meeting {
  id: number;
  title: string;
  description: string;
  meeting_code: string;
  status: string;
  creator: User;
  participants_count: number;
}

interface MeetingIndexProps {
  auth: {
    user: User;
  };
  meetings: {
    data: Meeting[];
  };
  filters: {
    search: string;
    status: string;
    sort: string;
    direction: string;
  };
}

const breadcrumbs = [
  {
    title: 'Meetings',
    href: route('meetings.index'),
  },
];

export default function Index({ auth, meetings, filters }: MeetingIndexProps) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Meetings" />
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold mb-6">Meetings</h1>

          <div>
            {meetings.data.length === 0 ? (
              <p>No meetings found.</p>
            ) : (
              <div className="space-y-4">
                {meetings.data.map((meeting) => (
                  <div key={meeting.id} className="p-4 border rounded-lg">
                    <h2 className="text-xl font-semibold">{meeting.title}</h2>
                    <p className="text-gray-600">{meeting.description}</p>
                    <div className="mt-2">
                      <span className="text-gray-500 mr-2">Status: {meeting.status}</span>
                      <span className="text-gray-500">Participants: {meeting.participants_count}</span>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <a
                        href={route('meetings.show', meeting.id)}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                      >
                        View Details
                      </a>
                      <a
                        href={route('meetings.join', meeting.meeting_code)}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                      >
                        Join WebRTC Meeting
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}