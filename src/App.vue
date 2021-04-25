<template>
<div class="app">
	<channel-list />
	<channel />
	<members-list />
</div>
</template>

<script>
import ChannelList from './components/ChannelList.vue';
import Channel from './components/Channel.vue';
import MembersList from './components/MembersList';

export default {
	name: 'App',
	components: {
		ChannelList, Channel, MembersList
	}
}
</script>

<style>
html {
    --header-primary: #fff;
    --header-secondary: #b9bbbe;
    --text-normal: #dcddde;
    --text-muted: #72767d;
    --text-link: #00b0f4;
    --channels-default: #8e9297;
    --interactive-normal: #b9bbbe;
    --interactive-hover: #dcddde;
    --interactive-active: #fff;
    --interactive-muted: #4f545c;
    --background-primary: #36393f;
    --background-secondary: #2f3136;
    --background-secondary-alt: #292b2f;
    --background-tertiary: #202225;
    --background-accent: #4f545c;
    --background-floating: #18191c;
    --background-mobile-primary: #36393f;
    --background-mobile-secondary: #2f3136;
    --background-modifier-hover: rgba(79,84,92,0.16);
    --background-modifier-active: rgba(79,84,92,0.24);
    --background-modifier-selected: rgba(79,84,92,0.32);
    --background-modifier-accent: hsla(0,0%,100%,0.06);
    --background-mentioned: rgba(250,166,26,0.05);
    --background-mentioned-hover: rgba(250,166,26,0.08);
    --background-message-hover: rgba(4,4,5,0.07);
    --background-help-warning: rgba(250,166,26,0.1);
    --background-help-info: rgba(0,176,244,0.1);
    --scrollbar-thin-thumb: #202225;
    --scrollbar-thin-track: transparent;
    --scrollbar-auto-thumb: #202225;
    --scrollbar-auto-track: #2e3338;
    --scrollbar-auto-scrollbar-color-thumb: #202225;
    --scrollbar-auto-scrollbar-color-track: #2f3136;
    --elevation-stroke: 0 0 0 1px rgba(4,4,5,0.15);
    --elevation-low: 0 1px 0 rgba(4,4,5,0.2),0 1.5px 0 rgba(6,6,7,0.05),0 2px 0 rgba(4,4,5,0.05);
    --elevation-medium: 0 4px 4px rgba(0,0,0,0.16);
    --elevation-high: 0 8px 16px rgba(0,0,0,0.24);
    --logo-primary: #fff;
    --focus-primary: #00b0f4;
    --radio-group-dot-foreground: #8ea1e1;
    --guild-header-text-shadow: 0 1px 1px rgba(0,0,0,0.4);
    --channeltextarea-background: #40444b;
    --activity-card-background: #202225;
    --textbox-markdown-syntax: #8e9297;
    --deprecated-card-bg: rgba(32,34,37,0.6);
    --deprecated-card-editable-bg: rgba(32,34,37,0.3);
    --deprecated-store-bg: #36393f;
    --deprecated-quickswitcher-input-background: #72767d;
    --deprecated-quickswitcher-input-placeholder: hsla(0,0%,100%,0.3);
    --deprecated-text-input-bg: rgba(0,0,0,0.1);
    --deprecated-text-input-border: rgba(0,0,0,0.3);
    --deprecated-text-input-border-hover: #040405;
    --deprecated-text-input-border-disabled: #202225;
    --deprecated-text-input-prefix: #dcddde;
    --user-status-online: #00ff00;
    --user-status-dnd: #ff0000;
    --user-status-idle: #ffff00;
    --user-status-offline: #1e1e1e;

    --background-secondary-modifier-hover: #34363C;
    --background-secondary-modifier-selected: #393C43;

    --color-influence: #5B85AA;
    --color-neg-influence: #F7BC9E;

    --color-unpurchasable: #E25822;
    --color-purchasable: #22E158;

    --color-default-pfp: rgba(79,84,92,0.75);
}

body {
    background: var(--background-primary);
    color: var(--text-normal);

    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

* {
    font-family: 'Whitney', 'Noto Sans', sans-serif;
    color: inherit;
    margin: 0;
}

strong {
    font-weight: 500;
}

button {
    outline: none;
    background: transparent;
    border: none;
    color: var(--interactive-normal);
    cursor: pointer;
}
button:hover {
    color: var(--interactive-hover);
}
button:active {
    color: var(--interactive-active);
}
button:disabled {
    color: var(--interactive-muted);
}

.app {
    display: grid;
    grid-template-columns: 15em 3fr 15em;
    min-height: 100vh;
}

::-webkit-scrollbar {
    width: 1em;
}

::-webkit-scrollbar-track {
    background-color: var(--scrollbar-auto-track);
    border-radius: .25em;
}

::-webkit-scrollbar-thumb {
    background-color: var(--scrollbar-auto-thumb);
    border-radius: .25em;
}
</style>
