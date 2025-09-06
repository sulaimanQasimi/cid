@use('Namu\WireChat\Facades\WireChat')

@php
    $group = $conversation->group;
@endphp

<header
    class="w-full sticky inset-x-0 flex pb-[5px] pt-[7px] top-0 z-10 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">

    <div class="flex w-full items-center px-3 py-3 lg:px-6 gap-3 md:gap-5">

        {{-- Return --}}
        <a @if ($this->isWidget()) @click="$dispatch('close-chat',{conversation: {{json_encode($conversation->id)}} })"
            dusk="return_to_home_button_dispatch"
        @else
            href="{{ route(WireChat::indexRouteName(), $conversation->id) }}"
            dusk="return_to_home_button_link" @endif
            @class([
                'shrink-0 cursor-pointer p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200',
                'lg:hidden' => !$this->isWidget(),
            ]) id="chatReturn">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.6"
                stroke="currentColor" class="w-5 h-5 text-gray-600 dark:text-gray-300">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
        </a>

        {{-- Receiver wirechat::Avatar --}}
        <section class="grid grid-cols-12 w-full">
            <div class="shrink-0 col-span-11 w-full truncate overflow-h-hidden relative">

                {{-- Group --}}
                @if ($conversation->isGroup())
                    <x-wirechat::actions.show-group-info conversation="{{ $conversation->id }}"
                        widget="{{ $this->isWidget() }}">
                        <div class="flex items-center gap-3 cursor-pointer group">
                            <x-wirechat::avatar disappearing="{{ $conversation->hasDisappearingTurnedOn() }}"
                                :group="true" :src="$group?->cover_url ?? null "
                                class="h-10 w-10 lg:w-12 lg:h-12 ring-2 ring-white dark:ring-gray-800 shadow-md" />
                            <div class="flex flex-col">
                                <h6 class="font-semibold text-lg text-gray-900 dark:text-white w-full truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {{ $group?->name }}
                                </h6>
                                <p class="text-sm text-gray-500 dark:text-gray-400">Group chat</p>
                            </div>
                        </div>
                    </x-wirechat::actions.show-group-info>
                @else
                    {{-- Not Group --}}
                    <x-wirechat::actions.show-chat-info conversation="{{ $conversation->id }}"
                        widget="{{ $this->isWidget() }}">
                        <div class="flex items-center gap-3 cursor-pointer group">
                            <x-wirechat::avatar disappearing="{{ $conversation->hasDisappearingTurnedOn() }}"
                                :group="false" :src="$receiver?->cover_url ?? null"
                                class="h-10 w-10 lg:w-12 lg:h-12 ring-2 ring-white dark:ring-gray-800 shadow-md" />
                            <div class="flex flex-col">
                                <h6 class="font-semibold text-lg text-gray-900 dark:text-white w-full truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    {{ $receiver?->display_name }} @if ($conversation->isSelfConversation())
                                        ({{ __('wirechat::chat.labels.you') }})
                                    @endif
                                </h6>
                                <p class="text-sm text-gray-500 dark:text-gray-400">Online</p>
                            </div>
                        </div>
                    </x-wirechat::actions.show-chat-info>
                @endif


            </div>

            {{-- Header Actions --}}
            <div class="flex gap-1 items-center ml-auto col-span-1">
                <x-wirechat::dropdown align="right" width="48">
                    <x-slot name="trigger">
                        <button class="cursor-pointer inline-flex p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 text-gray-600 dark:text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                stroke-width="1.9" stroke="currentColor" class="size-5 w-5 h-5">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                            </svg>

                        </button>
                    </x-slot>
                    <x-slot name="content">


                        @if ($conversation->isGroup())
                            {{-- Open group info button --}}
                            <x-wirechat::actions.show-group-info conversation="{{ $conversation->id }}"
                                widget="{{ $this->isWidget() }}">
                                <button class="w-full text-start">
                                    <x-wirechat::dropdown-link>
                                        {{ __('wirechat::chat.actions.open_group_info.label') }}
                                    </x-wirechat::dropdown-link>
                                </button>
                            </x-wirechat::actions.show-group-info>
                        @else
                            {{-- Open chat info button --}}
                            <x-wirechat::actions.show-chat-info conversation="{{ $conversation->id }}"
                                widget="{{ $this->isWidget() }}">
                                <button class="w-full text-start">
                                    <x-wirechat::dropdown-link>
                                        {{ __('wirechat::chat.actions.open_chat_info.label') }}
                                    </x-wirechat::dropdown-link>
                                </button>
                            </x-wirechat::actions.show-chat-info>
                        @endif


                        @if ($this->isWidget())
                            <x-wirechat::dropdown-link @click="$dispatch('close-chat',{conversation: {{json_encode($conversation->id)}} })">
                                @lang('wirechat::chat.actions.close_chat.label')
                            </x-wirechat::dropdown-link>
                        @else
                            <x-wirechat::dropdown-link href="{{ route(WireChat::indexRouteName()) }}" class="shrink-0">
                                @lang('wirechat::chat.actions.close_chat.label')
                            </x-wirechat::dropdown-link>
                        @endif


                        {{-- Only show delete and clear if conversation is NOT group --}}
                        @if (!$conversation->isGroup())
                            <button class="w-full" wire:click="clearConversation"
                                wire:confirm="{{ __('wirechat::chat.actions.clear_chat.confirmation_message') }}">

                                <x-wirechat::dropdown-link>
                                    @lang('wirechat::chat.actions.clear_chat.label')
                                </x-wirechat::dropdown-link>
                            </button>

                            <button wire:click="deleteConversation"
                                wire:confirm="{{ __('wirechat::chat.actions.delete_chat.confirmation_message') }}"
                                class="w-full text-start">

                                <x-wirechat::dropdown-link class="text-red-500 dark:text-red-500">
                                    @lang('wirechat::chat.actions.delete_chat.label')
                                </x-wirechat::dropdown-link>

                            </button>
                        @endif


                        @if ($conversation->isGroup() && !$this->auth->isOwnerOf($conversation))
                            <button wire:click="exitConversation"
                                wire:confirm="{{ __('wirechat::chat.actions.exit_group.confirmation_message') }}"
                                class="w-full text-start ">

                                <x-wirechat::dropdown-link class="text-red-500 dark:text-gray-500">
                                    @lang('wirechat::chat.actions.exit_group.label')
                                </x-wirechat::dropdown-link>

                            </button>
                        @endif

                    </x-slot>
                </x-wirechat::dropdown>

            </div>
        </section>


    </div>

</header>
