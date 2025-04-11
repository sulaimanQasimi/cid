import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

interface User {
  id: number;
  name: string;
  email: string;
}

interface MeetingCreateProps {
  auth: {
    user: User;
  };
  users: User[];
}

const breadcrumbs = [
  {
    title: 'Meetings',
    href: route('meetings.index'),
  },
  {
    title: 'Create',
    href: route('meetings.create'),
  },
];

export default function Create({ auth, users }: MeetingCreateProps) {
  const { data, setData, post, processing, errors } = useForm({
    title: '',
    description: '',
    scheduled_at: '',
    duration_minutes: '',
    is_recurring: false,
    participants: [] as number[],
    offline_enabled: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setData(name as any, val);
  };

  const handleParticipantChange = (userId: number, checked: boolean) => {
    if (checked) {
      setData('participants' as any, [...data.participants, userId]);
    } else {
      setData('participants' as any, data.participants.filter(id => id !== userId));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('meetings.store'));
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Meeting" />
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold mb-6">Create Meeting</h1>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={data.title}
                  onChange={handleChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
                {errors.title && <div className="text-red-500 text-sm mt-1">{errors.title}</div>}
              </div>

              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={data.description}
                  onChange={handleChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors.description && <div className="text-red-500 text-sm mt-1">{errors.description}</div>}
              </div>

              <div className="mb-4">
                <label htmlFor="scheduled_at" className="block text-sm font-medium text-gray-700 mb-1">
                  Schedule Date & Time
                </label>
                <input
                  type="datetime-local"
                  id="scheduled_at"
                  name="scheduled_at"
                  value={data.scheduled_at}
                  onChange={handleChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors.scheduled_at && <div className="text-red-500 text-sm mt-1">{errors.scheduled_at}</div>}
              </div>

              <div className="mb-4">
                <label htmlFor="duration_minutes" className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  id="duration_minutes"
                  name="duration_minutes"
                  value={data.duration_minutes}
                  onChange={handleChange}
                  min="1"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                {errors.duration_minutes && <div className="text-red-500 text-sm mt-1">{errors.duration_minutes}</div>}
              </div>

              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_recurring"
                    checked={data.is_recurring}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Recurring meeting</span>
                </label>
                {errors.is_recurring && <div className="text-red-500 text-sm mt-1">{errors.is_recurring}</div>}
              </div>

              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="offline_enabled"
                    checked={data.offline_enabled}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Enable offline mode</span>
                </label>
                {errors.offline_enabled && <div className="text-red-500 text-sm mt-1">{errors.offline_enabled}</div>}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Participants
                </label>
                <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-md p-2">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id={`user-${user.id}`}
                        value={user.id}
                        checked={data.participants.includes(user.id)}
                        onChange={(e) => handleParticipantChange(user.id, e.target.checked)}
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <label htmlFor={`user-${user.id}`} className="ml-2 text-sm text-gray-700">
                        {user.name} ({user.email})
                      </label>
                    </div>
                  ))}
                </div>
                {errors.participants && <div className="text-red-500 text-sm mt-1">{errors.participants}</div>}
              </div>

              <div className="mb-4">
                <button
                  type="submit"
                  disabled={processing}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {processing ? 'Creating...' : 'Create Meeting'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
