<template>
<div :class="{ 'full-page': player.activeChannel.category === 'DMs' }">
    <div class="messages-header">
        <i :class="{
            fas: true,
            'fa-hashtag': channel.type === 'text',
            'fa-volume-up': channel.type === 'voice',
            'fa-bullhorn': channel.type === 'announcement',
            'fa-at': channel.type === 'DM',
            'fa-tag': channel.type === 'store'
        }"></i>
        <div class="channel-header">{{ channel.title }}</div>
        <div class="divider" v-if="channel.description"></div>
        <div class="channel-description">{{ channel.description }}</div>
    </div>
    <store v-if="this.player.activeChannel.category === 'info' && this.player.activeChannel.channel === 'store'" />
    <div class="messages" v-else-if="channel.type !== 'voice' && channel.type !== 'announcement'">
        <div class="messages-fill"></div>
        <DynamicScroller :items="channel.messages" :min-item-size="28" style="max-height: 100%; padding: 30px 0;" ref="scroll" :buffer="50">
            <template v-slot="{ item, active }">
                <DynamicScrollerItem :item="item" :active="active" :size-dependencies="[ item.id ]">
                    <message :message="item" />
                </DynamicScrollerItem>
            </template>
        </DynamicScroller>
        <welcome v-if="this.player.activeChannel.category === 'info' && this.player.activeChannel.channel === 'welcome'" />

        <form class="messages-footer" v-on:submit.prevent="sendMessage">
            <input class="messages-input" v-model="message" :placeholder="'Message ' + (channel.type === 'text' ? '#' : '@') + channel.title" ref="input" v-if="channel.type !== 'voice'"/>
        </form>
        <div class="typing-indicator-container" v-show="typing.length > 0">
            <span class="typing-indicator-dot"></span>
            <span class="typing-indicator-dot"></span>
            <span class="typing-indicator-dot"></span>
            <div class="typing-indicator" v-if="typing.length > 3"><b>Several people are typing...</b></div>
            <div class="typing-indicator" v-else-if="typing.length === 3"><b>{{ typing[0] }}</b>, {{ typing[1] }}, and {{ typing[2] }} are typing...</div>
            <div class="typing-indicator" v-else-if="typing.length === 2"><b>{{ typing[0] }}</b> and {{ typing[1] }} are typing...</div>
            <div class="typing-indicator" v-else-if="typing.length === 1"><b>{{ typing[0] }}</b> is typing...</div>
        </div>
    </div>
</div>
</template>

<script>
import Message from './Message.vue';
import Welcome from './Welcome.vue';
import store from './Store.vue';
import { sendPlayerMessage, conversations } from '../conversations.js';
import { heros } from '../userdata.js';
import Store from "@/components/Store";

export default {
	name: 'channel',
	components: {
    Store,
		Message, Welcome, store,
	},
    data() {
        return {
            message: '',
            scrollingToBottom: false
        }
    },
    mounted() {
        this.$refs.input.focus();
        this.$refs.scroll.scrollToBottom();
    },
    watch: {
        channel: {
            handler(newVal, oldVal) {
                const scroll = this.$refs.scroll.$el;
                if (newVal !== oldVal && this.channel.type === 'text') {
                    this.$nextTick(() => {
                        this.$refs.input.focus();
                        this.$refs.scroll.scrollToBottom();
                    });
                }
                if (newVal === oldVal && Math.abs(scroll.scrollTop + scroll.offsetHeight - scroll.scrollHeight) < 50) {
                    this.scrollingToBottom = true;
                }
            },
            deep: true
        }
    },
    computed: {
        channel() {
            const { category, channel } = this.player.activeChannel;
            return (category === 'DMs' ? this.player.DMs : this.player.categories[category].channels)[channel];
        },
        typing() {
            const { category, channel } = this.player.activeChannel;
            return this.player.activeConvos
                .filter(c => c.category === category && c.channel === channel)
                .filter(c => {
                    const nextMessage = conversations[c.convoId].messages[c.nextMessage];
                    return nextMessage && nextMessage.type === 'user' && (nextMessage.delay || 1) < c.progress;
                })
                .map(c => {
                    const nextMessage = conversations[c.convoId].messages[c.nextMessage];
                    let user = nextMessage.user;
                    if (typeof user === 'function') {
                        user = user.call(c);
                    }
                    user = c.users[user];
                    return user in heros ? heros[user].username : user;
                });
        }
    },
    updated() {
        if (this.scrollingToBottom) {
            this.$nextTick(() => this.$refs.scroll.scrollToBottom());
            this.scrollingToBottom = false;
        }
    },
    methods: {
        sendMessage() {
            this.message = this.message.trim();
            if (this.message !== '') {
                sendPlayerMessage({
                    content: this.message,
                    userId: "667109969438441486"
                });
                this.message = '';
                this.scrollingToBottom = true;
            }
        }
    }
}
</script>

<style>
.full-page {
    grid-column-start: 1;
    grid-column-end: 4;
}

.messages-header {
    height: 3em;
    display: flex;
    padding: 0 0.5em;
    align-items: center;
}

.messages-header i {
    flex-basis: 1.6em;
}

.messages-header {
    position: relative;
}

.channel-header {
    color: var(--header-primary);
}

.divider {
    width: 1px;
    height: 1.5em;
    margin: 0 1em;
    background: var(--background-modifier-accent);
}

.channel-description {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    font-size: 0.9em;
    line-height: 1.2em;
    padding-top: 0.2em;
    color: var(--header-secondary);
}

.messages-header::after {
    content: "";
    position: absolute;
    display: block;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 1px;
    -webkit-box-shadow: var(--elevation-low);
    box-shadow: var(--elevation-low);
    z-index: 1;
    pointer-events: none;
}

.messages {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 3em);
    position: relative;
}

.messages-fill {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: stretch;
}

.messages-footer {
    position: relative;
    flex-shrink: 0;
    padding: 0 1em;
}

.messages-input {
    position: relative;
    width: 100%;
    border-radius: 0.5em;
    box-sizing: border-box;
    outline: none;
    border: none;
    background: var(--channeltextarea-background);
    margin-bottom: 1.5em;
    max-height: 50vh;
    padding: 0 1em;
    min-height: 2.5em;
    color: var(--text-normal);
    font-weight: 400;
    font-size: 1em;
    line-height: 1.375em;
}

.typing-indicator-container {
    position: absolute;
    bottom: 1px;
    left: 16px;
    font-size: .9em;
    font-weight: 500;
    height: 1.5em;
    line-height: 1.2em;
    padding-left: 9px;
    display: flex;
    align-items: center;
}

.typing-indicator-dot {
    height: .5em;
    width: .5em;
    margin: 0 1px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

.typing-indicator-dot::before {
    content: "";
    position: absolute;
    height: 100%;
    width: 100%;
    background: white;
    border-radius: 50%;
    animation: 1s blink infinite;
    opacity: 0.5;
    transform: scale(.5);
}

.typing-indicator-dot:nth-of-type(1)::before {
    animation-delay: 0.1s;
}
.typing-indicator-dot:nth-of-type(2)::before {
    animation-delay: 0.2s;
}
.typing-indicator-dot:nth-of-type(3)::before {
    animation-delay: 0.3s;
}

.typing-indicator {
    min-width: 0;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    margin-left: 4px;
    display: inline-block;
}

.typing-indicator b {
    font-weight: 700;
}

@keyframes blink {
    30% {
        opacity: 0.5;
        transform: scale(.5);
    }

    65% {
        opacity: 1;
        transform: scale(1);
    }

    100% {
        opacity: 0.5;
        transform: scale(.5);
    }
}

.channel-actions {
    padding: 1em;
    margin: 0 1em;
    margin-bottom: .5em;
    display: flex;
    flex-shrink: 0;
    background: var(--background-secondary);
    border-radius: .5em;
}

.channel-actions .h-fill {
    flex-grow: 1;
}
</style>
