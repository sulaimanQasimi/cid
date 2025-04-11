import type { route as routeFn } from 'ziggy-js';
import { Channel, PresenceChannel } from 'laravel-echo';

declare global {
    const route: typeof routeFn;
    interface Window {
        Echo: {
            private(channel: string): Channel;
            channel(channel: string): Channel;
            join(channel: string): PresenceChannel;
            leave(channel: string): void;
        };
        Pusher: any;
    }
}

export {};
