<template>
<div>
    <div class="messages-header">
        <i :class="{
            fas: true,
            'fa-hashtag': channel.type === 'text',
            'fa-volume-up': channel.type === 'voice',
            'fa-bullhorn': channel.type === 'announcement'
        }"></i>
        <div class="channel-header">{{ channel.title }}</div>
        <div class="divider"></div>
        <div class="channel-description">{{ channel.description }}</div>
    </div>
    <div class="messages" v-if="channel.type !== 'voice' || channel.type !== 'announcement'">
        <div class="messages-fill"></div>
        <message v-for="(message, index) in channel.messages" :message="message" :key="index" />
        <form class="messages-footer" v-on:submit.prevent="sendMessage">
            <input class="messages-input" v-model="message" :placeholder="'Message #' + channel.title" ref="input" v-if="channel.type !== 'voice'"/>
        </form>
    </div>
</div>
</template>

<script>
import Message from './Message.vue';
import { addMessage } from '../conversations.js';

export default {
	name: 'channel',
	components: {
		Message
	},
    data() {
        return {
            message: ''
        }
    },
    mounted() {
        this.$refs.input.focus();
    },
    watch: {
        channel: function() {
            if (this.type === 'text') {
                this.$nextTick(() => this.$refs.input.focus());
            }
        }
    },
    computed: {
        channel() {
            const { category, channel } = this.player.activeChannel;
            return this.player.categories[category].channels[channel];
        }
    },
    methods: {
        sendMessage() {
            this.message = this.message.trim();
            if (this.message !== '') {
                const { category, channel } = this.player.activeChannel;
                addMessage(category, channel, {
                    content: this.message,
                    timestamp: Date.now(),
                    userId: 667109969438441486
                });
                this.message = '';
            }
        }
    }
}
</script>

<style>
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
    height: calc(100% - 3em);
}

.messages-fill {
    flex-grow: 1;
    padding-bottom: 1em;
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
</style>
