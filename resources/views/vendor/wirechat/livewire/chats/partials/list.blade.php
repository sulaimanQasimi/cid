
@use('Namu\WireChat\Facades\WireChat')

<ul wire:loading.delay.long.remove wire:target="search" class="p-2 grid w-full spacey-y-2">
    @foreach ($conversations as $key=> $conversation)
    @php
    //$receiver =$conversation->getReceiver();
    $group = $conversation->isGroup() ? $conversation->group : null;
    $receiver = $conversation->isGroup() ? null : ($conversation->isPrivate() ? $conversation->peer_participant?->participantable : $this->auth);
    //$receiver = $conversation->isGroup() ? null : ($conversation->isPrivate() ? $conversation->peerParticipant()?->participantable : $this->auth);
    $lastMessage = $conversation->lastMessage;
    //mark isReadByAuth true if user has chat opened
    $isReadByAuth = $conversation?->readBy($conversation->auth_participant??$this->auth) || $selectedConversationId == $conversation->id;
    $belongsToAuth = $lastMessage?->belongsToAuth();


    @endphp

    <li x-data="{
        conversationID: @js($conversation->id),
        showUnreadStatus: @js(!$isReadByAuth),
        handleChatOpened(event) {
            // Hide unread dot
            if (event.detail.conversation== this.conversationID) {
                this.showUnreadStatus= false;
            }
            //update this so that the the selected conversation highlighter can be updated
            $wire.selectedConversationId= event.detail.conversation;
        },
        handleChatClosed(event) {
                // Clear the globally selected conversation.
                $wire.selectedConversationId = null;
                selectedConversationId = null;
        },
        handleOpenChat(event) {
            // Clear the globally selected conversation.
            if (this.showUnreadStatus==  event.detail.conversation== this.conversationID) {
                this.showUnreadStatus= false;
            }
    }
    }"  

    id="conversation-{{ $conversation->id }}" 
        wire:key="conversation-em-{{ $conversation->id }}-{{ $conversation->updated_at->timestamp }}"
        x-on:chat-opened.window="handleChatOpened($event)"
        x-on:chat-closed.window="handleChatClosed($event)">
        <a @if ($widget) tabindex="0" 
        role="button" 
        dusk="openChatWidgetButton"
        @click="$dispatch('open-chat',{conversation:@js($conversation->id)})"
        @keydown.enter="$dispatch('open-chat',{conversation:@js($conversation->id)})"
        @else
        wire:navigate href="{{ route(WireChat::viewRouteName(), $conversation->id) }}" @endif
            @style(['border-color:var(--wc-brand-primary)' => $selectedConversationId == $conversation?->id])
            class="py-4 flex gap-4 hover:bg-white/80 dark:hover:bg-gray-800/80 rounded-xl transition-all duration-200 relative w-full cursor-pointer px-4 mx-2 mb-2 border border-transparent hover:border-gray-200/50 dark:hover:border-gray-700/50 hover:shadow-sm"
            :class="$wire.selectedConversationId == conversationID &&
                'bg-white/90 dark:bg-gray-800/90 border-blue-200 dark:border-blue-800 shadow-md'">

            <div class="shrink-0 relative">
                <x-wirechat::avatar disappearing="{{ $conversation->hasDisappearingTurnedOn() }}"
                    group="{{ $conversation->isGroup() }}"
                    :src="$group ? $group?->cover_url : $receiver?->cover_url ?? null" class="w-12 h-12 ring-2 ring-white dark:ring-gray-800 shadow-sm" />
                @if (!$isReadByAuth)
                    <div class="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                @endif
            </div>

            <aside class="grid grid-cols-12 w-full">
                <div class="col-span-10 relative overflow-hidden w-full flex-nowrap">

                    {{-- name --}}
                    <div class="flex gap-2 mb-1 w-full items-center">
                        <h6 class="truncate font-semibold text-gray-900 dark:text-white text-base">
                            {{ $group ? $group?->name : $receiver?->display_name }}
                        </h6>

                        @if ($conversation->isSelfConversation())
                            <span class="text-sm text-gray-500 dark:text-gray-400">({{__('wirechat::chats.labels.you')  }})</span>
                        @endif

                    </div>

                    {{-- Message body --}}
                    @if ($lastMessage != null)
                        @include('wirechat::livewire.chats.partials.message-body')
                    @endif

                </div>

                {{-- Read status --}}
                {{-- Only show if AUTH is NOT onwer of message --}}
                @if ($lastMessage != null && !$lastMessage?->ownedBy($this->auth) && !$isReadByAuth)
                    <div x-show="showUnreadStatus" dusk="unreadMessagesDot" class="col-span-2 flex flex-col text-center my-auto">
                        {{-- Unread count or dot --}}
                        <span dusk="unreadDotItem" class="sr-only">unread dot</span>
                        <div class="w-2 h-2 bg-blue-500 rounded-full mx-auto animate-pulse"></div>
                    </div>
                @endif


            </aside>
        </a>

    </li>
    @endforeach

</ul>
