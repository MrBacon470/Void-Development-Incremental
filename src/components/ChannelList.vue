<template>
<div class="channel-list" v-if="player.activeChannel.category !== 'DMs'">
    <div class="channel-list-header">Void Development Incremental</div>
    <div class="channel-list-inner">
        <div v-for="(category, categoryID) in player.categories" :key="categoryID">
            <div class="channel-group-header" :class="{collapsed: category.collapsed}" v-on:click="collapseTabGroup(categoryID)" :key="categoryID">
                <i class="fas fa-chevron-down"></i>
                <p>{{ category.title }}</p>
            </div>
            <div v-for="(channel, channelID) in category.channels" :key="categoryID + channelID"
                :class="{
                    channel: true,
                    'text-channel': channel.type === 'text',
                    'voice-channel': channel.type === 'voice',
                    'announcement-channel': channel.type === 'announcement',
                    'store-channel': channel.type === 'store',
                    selected: player.activeChannel.category === categoryID && player.activeChannel.channel === channelID,
                    active: channel.ping,
                    collapsed: category.collapsed
                }" v-on:click="switchChannel(categoryID, channelID)">
                <i v-if="channel.ping" class="channel-ping"></i>
                <div class="channel-inner">
                    <i :class="{
                        fas: true,
                        'fa-hashtag': channel.type === 'text',
                        'fa-volume-up': channel.type === 'voice',
                        'fa-bullhorn': channel.type === 'announcement',
                        'fa-tag': channel.type === 'store'
                    }"></i>
                    <p>{{ channel.title }}</p>
                </div>
            </div>
        </div>
    </div>
    <div class="channel-list-footer">
        <div class="avatar">
            <img class="pfp" src="avatars/d0ce3ad8fb2a3fb06f58982cb0034a5b.png" alt="VoidCloud">
            <div class="status"></div>
        </div>
        <div class="data">
            <p class="name">VoidCloud</p>
            <p class="desc">{{ player.influence | numberFormatWhole }} <span class="influence">Influence</span></p>
        </div>
        <button>
            <i class="fas fa-cog"></i>
        </button>
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
            if (this.player.activeChannel.category != "DMs") {
                this.player.categories[this.player.activeChannel.category].channels[this.player.activeChannel.channel].ping = false;
            }
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
    bottom: 1px;
    left: 0;
    right: 0;
    height: 1px;
    -webkit-box-shadow: var(--elevation-low);
    box-shadow: var(--elevation-low);
    z-index: 1;
    pointer-events: none;
}

.channel-list-inner {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: stretch;
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


.channel-list-footer {
    background-color: var(--background-secondary-alt);

    --avatar-size: 2em;
    --circle-size: 0.6em;
    height: calc(var(--avatar-size));
    padding: 0.5em;

    display: flex;
    flex-direction: row;
    align-items: center;
}

.channel-list-footer > .avatar {
    height: 100%;
    position: relative;
}

.channel-list-footer > .avatar > .pfp {
    height: 100%;
    border-radius: 50%;
    margin-right: 0.5em;
}

.channel-list-footer > .avatar > .status {
    position: absolute;

    width: var(--circle-size);
    height: var(--circle-size);

    border-radius: calc(0.9 * var(--circle-size));

    border: calc(0.4 * var(--circle-size)) solid var(--background-secondary-alt);

    top: calc(var(--avatar-size) - 1.4 * var(--circle-size));
    left: calc(var(--avatar-size) - 1.4 * var(--circle-size));

    background-color: var(--user-status-online);
}

.channel-list-footer > .data {
    flex-grow: 1;
}

.channel-list-footer .name {
    font-size: 0.9em;
    font-weight: 500;
}

.channel-list-footer .desc {
    font-size: 0.8em;
    font-weight: 500;
}

.channel-list-footer .influence {
    color: var(--color-influence);
    font-weight: normal;
}

.channel-list-footer > button {
    font-size: 1em;
    height: 2em;
    width: 2em;
    border-radius: 0.25em;

    background: none;
    border: 0;

    cursor: pointer;
}

.channel-list-footer > button:hover {
    background-color: var(--background-modifier-hover);
}
</style>
