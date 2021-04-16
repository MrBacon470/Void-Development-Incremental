<template>
<div class="channel-list">
    <div class="channel-list-header">Void Development Incremental</div>
    <div v-for="(category, categoryID) in player.categories" :key="categoryID">
        <div class="channel-group-header" v-on:click="collapseTabGroup(categoryID)" :key="categoryID">
            <i class="fas fa-chevron-down"></i>
            <p>{{ category.title }}</p>
        </div>
        <div v-for="(channel, channelID) in category.channels" :key="categoryID + channelID"
            :class="{
                channel: true,
                'text-channel': category.type === 'text',
                'voice-channel': category.type === 'voice',
                active: player.activeChannel.category === categoryID && player.activeChannel.channel === channelID
            }" v-on:click="switchChannel(categoryID, channelID)">
            <i v-if="channel.ping" class="channel-ping"></i>
            <div class="channel-inner">
                <i :class="{
                    fas: true,
                    'fa-hashtag': category.type === 'text',
                    'fa-volume-up': category.type === 'voice'
                }"></i>
                <p>{{ channel.title }}</p>
            </div>
        </div>
    </div>
</div>
</template>

<script>
export default {
	name: 'channel-list',
    methods: {
        collapseTabGroup(group) {
            this.player.categories[group].collapsed = !this.player.categories[group].collapsed;
        },
        switchChannel(category, channel) {
            this.player.activeChannel = { category, channel };
        }
    }
}
</script>

<style>
.channel-list {
    display: flex;
    flex-direction: column;
    align-items: stretch;

    background-color: var(--background-secondary);
}

.channel-list-header {
    height: 3em;
    align-items: center;
    display: flex;
    justify-content: center;
    position: relative;
    color: var(--header-primary);
}

.channel-list-header::after {
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



.channel {
    margin-top: 0.1em;
    margin-bottom: 0.1em;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;
}

.channel-inner {
    margin-right: 0.5em;
    padding-left: 1em;
    padding-right: 1em;
    padding-top: 0.25em;
    padding-bottom: 0.25em;
    border-radius: 0.25em;
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-grow: 1;
}

.channel-inner > i {
    color: var(--text-muted);
    flex-basis: 1.6em;
}

.channel-inner > p {
    color: var(--channels-default);
}

.channel-inner > p:before {
    font-size: 1.25em;
}

.channel-inner:hover {
    background-color: var(--background-modifier-hover);
}

.channel-inner:hover > p {
    color: var(--interactive-hover);
}

.channel.selected > .channel-inner {
    background-color: var(--background-modifier-selected);
    cursor: auto;
}

.channel.selected > .channel-inner > p {
    color: var(--interactive-active);
}



.text-channel p {
    text-transform: lowercase;
}
.voice-channel p {
    text-transform: capitalize;
}


.channel-ping {
    width: 0.3em;
    margin-right: -0.3em;
    height: 0.6em;
    border-bottom-right-radius: 0.3em;
    border-top-right-radius: 0.3em;
    background-color: var(--interactive-active);
}

.channel.active p {
    color: var(--interactive-active);
}

.channel.collapsed:not(.active):not(.selected) {
    display: none;
}



.channel-group-header {
    margin-left: 1em;
    margin-right: 1em;
    margin-top: 2em;
    font-size: 0.7em;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;
}

.channel-group-header > i {
    font-size: 0.75em;
    margin-right: 1em;
    color: var(--channels-default);
    -webkit-transition: -webkit-transform .2s ease-out;
    transition: -webkit-transform .2s ease-out;
    transition: transform .2s ease-out;
    transition: transform .2s ease-out, -webkit-transform .2s ease-out;
}

.channel-group-header > p {
    text-transform: uppercase;
    color: var(--channels-default);
}

.channel-group-header:hover > * {
    color: var(--interactive-hover);
}

.channel-group-header.collapsed > i {
    -webkit-transform: rotate(-90deg);
    transform: rotate(-90deg);
}
</style>
