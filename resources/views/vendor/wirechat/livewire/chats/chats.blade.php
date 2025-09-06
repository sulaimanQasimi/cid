@use('Namu\WireChat\Facades\WireChat')

<div x-data="{ selectedConversationId: '{{ request()->conversation ?? $selectedConversationId }}' }"
    x-on:open-chat.window="selectedConversationId= $event.detail.conversation; $wire.selectedConversationId= $event.detail.conversation;"
    x-init=" setTimeout(() => {
         conversationElement = document.getElementById('conversation-' + selectedConversationId);
    
         // Scroll to the conversation element
         if (conversationElement) {
             conversationElement.scrollIntoView({ behavior: 'smooth' });
         }
     }, 200);"
    class="flex flex-col bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm transition-all h-full overflow-hidden w-full sm:p-3">

    @php
        /* Show header if any of these conditions are true  */
        $showHeader = $showNewChatModalButton || $allowChatsSearch || $showHomeRouteButton || !empty($title);
    @endphp

    {{-- include header --}}
    @includeWhen($showHeader, 'wirechat::livewire.chats.partials.header')

    <main x-data
        @scroll.self.debounce="
           {{-- Detect when scrolled to the bottom --}}
            // Calculate scroll values
            scrollTop = $el.scrollTop;
            scrollHeight = $el.scrollHeight;
            clientHeight = $el.clientHeight;

            // Check if the user is at the bottom of the scrollable element
            if ((scrollTop + clientHeight) >= (scrollHeight - 1) && $wire.canLoadMore) {
                // Trigger load more if we're at the bottom
                await $nextTick();
                $wire.loadMore();
            }
            "
        class="overflow-y-auto py-2 grow h-full relative" style="contain:content">

        {{-- loading indicator --}}

        @if (count($conversations) > 0)
            {{-- include list item --}}
            @include('wirechat::livewire.chats.partials.list')


            {{-- include load more if true --}}
            @includeWhen($canLoadMore, 'wirechat::livewire.chats.partials.load-more-button')
        @else
            <div class="w-full flex flex-col items-center h-full justify-center text-center p-8">
                <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                    <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                    </svg>
                </div>
                <h6 class="font-semibold text-gray-700 dark:text-white text-lg mb-2">{{ __('wirechat::chats.labels.no_conversations_yet')  }}</h6>
                <p class="text-gray-500 dark:text-gray-400 text-sm">Start a new conversation to get chatting!</p>
            </div>
        @endif
    </main>



</div>
