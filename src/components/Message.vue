<template>
<div :class="{ message: true, first: message.first }">
    <div class="message-inner">
        <img class="pfp" v-if="message.first && profileImage" :src="profileImage" :alt="username">
        <div class="pfp fa fa-user" v-else-if="message.first" :style="{ backgroundColor: pickColor(message.userId) }"></div>
        <p class="short-timestamp" v-if="!message.first">{{ timeFormat.format(timestamp) }}</p>
        <p class="name" :style="{ color: roleColor }">{{ username }}
            <span class="timestamp" v-if="isToday(timestamp)">Today at {{ timeFormat.format(timestamp) }}</span>
            <span class="timestamp" v-else-if="isYesterday(timestamp)">Yesterday at {{ timeFormat.format(timestamp) }}</span>
            <span class="timestamp" v-else>{{ dateFormat.format(timestamp) }}</span>
        </p>
        <p class="text welcome" v-if="message.joinMessage != null">
            <i class="fa fa-arrow-right" />
            <span v-html="content"></span>
            <span class="timestamp" v-if="isToday(timestamp)">Today at {{ timeFormat.format(timestamp) }}</span>
            <span class="timestamp" v-else-if="isYesterday(timestamp)">Yesterday at {{ timeFormat.format(timestamp) }}</span>
            <span class="timestamp" v-else>{{ dateFormat.format(timestamp) }}</span>
        </p>
        <p class="text" v-else>{{ content }}<span v-if="message.influence" :class="{
            'change-influence': true,
            gain: message.influence.gt(0),
            loss: message.influence.lt(0)
        }">{{ message.influence.abs() | numberFormatWhole }} influence</span></p>
    </div>
</div>
</template>

<script>
import { heros, roles } from '../userdata.js';
import { welcomeMessages } from '../conversations.js';

export default {
	name: 'message',
    data() {
        return {
            dateFormat: new Intl.DateTimeFormat('en-US', { year: '2-digit', month: '2-digit', day: 'numeric' }),
            timeFormat: new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric' })
        }
    },
    computed: {
        username() {
            return this.message.userId in heros ? heros[this.message.userId].username : this.message.userId;
        },
        profileImage() {
            return this.message.userId in heros ? heros[this.message.userId].profileImage : '';
        },
        roleColor() {
            return this.message.userId in heros ? roles[heros[this.message.userId].role].color : 'white';
        },
        timestamp() {
            return new Date(this.message.timestamp);
        },
        content() {
            return this.message.content || welcomeMessages[this.message.joinMessage] && welcomeMessages[this.message.joinMessage](this.message.userId);
        }
    },
    props: [
        'message'
    ],
    methods: {
        pickColor(str) {
            let hash = 0;
              for (var i = 0; i < str.length; i++) {
                hash = str.charCodeAt(i) + ((hash << 5) - hash);
              }
            return `hsl(${hash % 360}, 100%, 80%)`;
        },
        isToday(date) {
            const today = new Date();
            return date.getDate() === today.getDate() &&
                   date.getMonth() === today.getMonth() &&
                   date.getFullYear() === today.getFullYear()
        },
        isYesterday(date) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            return date.getDate() === yesterday.getDate() &&
                   date.getMonth() === yesterday.getMonth() &&
                   date.getFullYear() === yesterday.getFullYear()
        }
    }
}
</script>

<style>
.message .message-inner {
    padding-left: 4.5em;
    padding-right: 1em;
    padding-top: 0.2em;
    padding-bottom: 0.2em;
    margin-right: 1em;
    position: relative;
}
.message.first .message-inner {
    margin-top: 1em;
}
.message .message-inner:hover {
    background-color: var(--background-message-hover);
}
.message .pfp {
    position: absolute;
    font-size: 2em;
    left: .5em;
    width: 1.25em;
    height: 1.25em;
    border-radius: 1.25em;
    overflow: hidden;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    color: var(--color-default-pfp);
}
.message .name {
    line-height: 1.375em;
    color: var(--header-primary);
}
.message:not(.first) .pfp, .message:not(.first) .name {
    display: none;
}
.message .timestamp {
    font-size: 0.75em;
    margin-left: 0.5em;
    color: var(--text-muted);
    white-space: nowrap;
}
.message .short-timestamp {
    font-size: 0.75em;
    color: var(--text-muted);
    white-space: nowrap;
    text-align: center;
    position: absolute;
    left: 0;
    top: 0.6em;
    width: 6em;
    display: none;
}
.message:hover .short-timestamp {
    display: block;
}
.text {
    line-height: 1.375em;
    font-weight: 300;
    user-select: text;
    word-break: break-word;
}

.change-influence {
    margin-left: 1em;
    font-size: .9em;
}
.change-influence.gain {
    color: var(--color-influence);
}
.change-influence.loss {
    color: var(--color-neg-influence);
}
.change-influence.loss::before {
    content: "-";
}

.welcome {
    position: relative;
}

.welcome i {
    color: green;
    position: absolute;
    left: -2.5em;
    top: 50%;
    transform: translateY(-50%);
}
</style>
