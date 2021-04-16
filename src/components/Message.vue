<template>
<div :class="{ message: true, first: message.first }">
    <img class="pfp" :src="pfps[message.userId]" :alt="usernames[message.userId]">
    <p class="name">{{ usernames[message.userId] }}
        <span class="timestamp">{{ new Date(message.timestamp).toLocaleTimeString() }}</span>
    </p>
    <p class="text">{{ message.content }}</p>
</div>
</template>

<script>
import { pfps, usernames } from '../userdata.js';

export default {
	name: 'message',
    data() {
        return { pfps, usernames }
    },
    props: [
        'message'
    ]
}
</script>

<style>
.message {
    padding-left: 4.5em;
    padding-right: 1em;
    padding-top: 0.2em;
    padding-bottom: 0.2em;
    margin-right: 1em;
    position: relative;
}
.message.first {
    margin-top: 1em;
}
.message:nth-last-child(2) {
    margin-bottom: 30px;
}
.message:hover {
    background-color: var(--background-message-hover);
}
.message .pfp {
    position: absolute;
    left: 1em;
    width: 2.5em;
    height: 2.5em;
    border-radius: 1.25em;
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
}
.text {
    line-height: 1.375em;
    font-weight: 300;
    user-select: text;
}
</style>
