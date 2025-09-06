@use('Namu\WireChat\Facades\WireChat')


@php

   $isSameAsNext = ($message?->sendable_id === $nextMessage?->sendable_id) && ($message?->sendable_type === $nextMessage?->sendable_type);
   $isNotSameAsNext = !$isSameAsNext;
   $isSameAsPrevious = ($message?->sendable_id === $previousMessage?->sendable_id) && ($message?->sendable_type === $previousMessage?->sendable_type);
   $isNotSameAsPrevious = !$isSameAsPrevious;
@endphp

<div


{{-- We use style here to make it easy for dynamic and safe injection --}}
@style([
'background-color:var(--wc-brand-primary)' => $belongsToAuth==true
])

@class([
    'flex flex-wrap max-w-fit text-[15px] rounded-2xl p-3 flex flex-col shadow-sm transition-all duration-200 hover:shadow-md message-bubble',
    'text-white bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-200/50' => $belongsToAuth, // Background color for messages sent by the authenticated user
    'bg-white dark:bg-gray-800 dark:text-white border border-gray-200/60 dark:border-gray-700/60' => !$belongsToAuth,

    // Message styles based on position and ownership

    // RIGHT
    // First message on RIGHT
    'rounded-br-md rounded-tr-2xl' => ($isSameAsNext && $isNotSameAsPrevious && $belongsToAuth),

    // Middle message on RIGHT
    'rounded-r-md' => ($isSameAsPrevious && $belongsToAuth),

    // Standalone message RIGHT
    'rounded-br-xl rounded-r-xl' => ($isNotSameAsPrevious && $isNotSameAsNext && $belongsToAuth),

    // Last Message on RIGHT
    'rounded-br-2xl' => ($isNotSameAsNext && $belongsToAuth),

    // LEFT
    // First message on LEFT
    'rounded-bl-md rounded-tl-2xl' => ($isSameAsNext && $isNotSameAsPrevious && !$belongsToAuth),

    // Middle message on LEFT
    'rounded-l-md' => ($isSameAsPrevious && !$belongsToAuth),

    // Standalone message LEFT
    'rounded-bl-xl rounded-l-xl' => ($isNotSameAsPrevious && $isNotSameAsNext && !$belongsToAuth),

    // Last message on LEFT
    'rounded-bl-2xl' => ($isNotSameAsNext && !$belongsToAuth),
])
>
@if (!$belongsToAuth && $isGroup)
<div    
    @class([
        'shrink-0 font-semibold text-sm mb-1',
        'text-blue-600 dark:text-blue-400' => !$belongsToAuth,
        // Hide avatar if the next message is from the same user
        'hidden' => $isSameAsPrevious
    ])>
    {{ $message?->sendable?->display_name }}
</div>
@endif

<pre class="whitespace-pre-line tracking-normal text-sm md:text-base leading-relaxed"
    style="font-family: inherit;">
    {{$message?->body}}
</pre>

{{-- Display the created time based on different conditions --}}
<div class="flex items-center justify-end mt-1 gap-1">
    <span
    @class(['text-[11px] opacity-70',  'text-gray-500 dark:text-gray-400' => !$belongsToAuth,'text-blue-100' => $belongsToAuth])>
        @php
            // If the message was created today, show only the time (e.g., 1:00 AM)
            echo $message?->created_at->format('H:i');
        @endphp
    </span>
    @if ($belongsToAuth)
        <svg class="w-3 h-3 text-blue-100" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
        </svg>
    @endif
</div>

</div>
