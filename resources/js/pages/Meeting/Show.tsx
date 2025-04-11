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
  scheduled_at: string | null;
  duration_minutes: number | null;
  status: string;
  created_by: number;
  creator: User;
  participants: {
    id: number;
    user: User;
    pivot: {
      role: string;
      status: string;
      joined_at: string | null;
      left_at: string | null;
    };
  }[];
}

interface MeetingShowProps {
  auth: {
    user: User;
  };
  meeting: Meeting;
}

const breadcrumbs = [
  {
    title: 'Meetings',
    href: route('meetings.index'),
  },
  {
    title: 'Details',
    href: '#',
  },
];

export default function Show({ auth, meeting }: MeetingShowProps) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Meeting: ${meeting.title}`} />
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">{meeting.title}</h1>
                <p className="mt-1 text-sm text-gray-500">Created by {meeting.creator.name}</p>
              </div>
              <div>
                <span className="px-2 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
                  {meeting.status}
                </span>
              </div>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Description</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {meeting.description || 'No description provided.'}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Meeting Code</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {meeting.meeting_code}
                  </dd>
                </div>
                {meeting.scheduled_at && (
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Scheduled At</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {new Date(meeting.scheduled_at).toLocaleString()}
                    </dd>
                  </div>
                )}
                {meeting.duration_minutes && (
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Duration</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {meeting.duration_minutes} minutes
                    </dd>
                  </div>
                )}
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Participants</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                      {meeting.participants.map((participant) => (
                        <li key={participant.id} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                          <div className="w-0 flex-1 flex items-center">
                            <span className="ml-2 flex-1 w-0 truncate">
                              {participant.user.name} ({participant.pivot.role})
                            </span>
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            <span className="font-medium text-indigo-600">
                              {participant.pivot.status}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              </dl>
            </div>
            <div className="px-4 py-5 sm:px-6 flex justify-end space-x-3">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Join Meeting
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
