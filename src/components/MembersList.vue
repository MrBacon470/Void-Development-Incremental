<template>
<div class="users-list">
    <div v-for="(role, roleID) in roles" :key="roleID">
        <div class="role-header">
            <p>{{ role.title }} &#8212; {{ Object.keys(usersByRole[roleID]).length }}</p>
        </div>
        <div v-for="(user, userID) in usersByRole[roleID]" :key="userID" :status="user.status" class="user" v-on:click="openProfile(userID)">
            <div class="user-inner">
                <div class="avatar">
                    <img class="pfp" :src="user.profileImage" :alt="user.username">
                    <div class="status"></div>
                </div>
                <div class="user-text">
                    <p class="name" :style="{ color: role.color }">{{ user.username }}</p>
                    <p class="desc" v-if="user.playing != null">Playing <strong>{{ user.playing }}</strong></p>
                    <p class="desc" v-else-if="user.customStatus != null">{{ user.customStatus }}</p>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import { userdata, roles } from '../userdata.js';

export default {
    name: 'members-list',
    data() {
        return { userdata, roles }
    },
    computed: {
        usersByRole() {
            const users = Object.keys(userdata);
            return Object.keys(roles).reduce((acc, curr) => {
                acc[curr] = users.filter(user => userdata[user].role === curr).reduce((acc, curr) => {
                    acc[curr] = userdata[curr];
                    return acc;
                }, {});
                return acc;
            }, {});
        }
    },
    methods: {
        openProfile(/*userID*/) {

        }
    }
}
</script>

<style>
.users-list {
    display: flex;
    flex-direction: column;
    align-items: stretch;

    background-color: var(--background-secondary);
}

.role-header {
    margin-left: 1em;
    margin-right: 1em;
    margin-top: 2em;
    font-size: 0.7em;
    display: flex;
    flex-direction: row;
    align-items: center;
}

.role-header > p {
    text-transform: uppercase;
    color: var(--channels-default);
}

.user {
    --avatar-size: 2em;
    --circle-size: 0.6em;

    margin-top: 0.1em;
    padding: 0.5em 0.2em;
    margin-bottom: 0.1em;
    height: var(--avatar-size);
}

.user.selected > .user-inner {
    background-color: var(--background-modifier-selected);
    cursor: auto;
}

.user.selected > .user-inner > p {
    color: var(--interactive-active);
}

.user-inner {
    padding: 0.25em;
    border-radius: 0.25em;
    margin-left: 0.5em;
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;
    height: 100%;
    cursor: pointer;
}

.user-inner:hover {
    background-color: var(--background-modifier-hover);
}

.user-inner > .avatar {
    height: 100%;
    position: relative;
}

.user-inner > .avatar > .pfp {
    height: 100%;
    border-radius: 50%;
    margin-right: 0.5em;
}

.user-inner > .avatar > .status {
    position: absolute;

    width: var(--circle-size);
    height: var(--circle-size);

    border-radius: calc(0.9 * var(--circle-size));

    border: calc(0.4 * var(--circle-size)) solid var(--background-secondary);

    top: calc(var(--avatar-size) - 1.4 * var(--circle-size));
    left: calc(var(--avatar-size) - 1.4 * var(--circle-size));
}

.user-inner:hover > .avatar > .status {
    border: calc(0.4 * var(--circle-size)) solid var(--background-secondary-modifier-hover);
}

.user.selected > .user-inner > .avatar > .status {
    border: calc(0.4 * var(--circle-size)) solid var(--background-secondary-modifier-selected);
}

.user-inner .user-text {
    overflow: hidden;
    white-space: nowrap;
}

.user-inner .name, .user-inner .desc {
    overflow: hidden;
    text-overflow: ellipsis;
}
.user-inner .desc {
    color: var(--channels-default);
    font-size: 0.75em;
}

.user[status="Online"] > .user-inner > .avatar > .status {
    background-color: var(--user-status-online);
}

.user[status="DND"] > .user-inner > .avatar > .status {
    background-color: var(--user-status-dnd);
}

.user[status="Offline"] > .user-inner > .avatar > .status {
    background-color: var(--user-status-offline);
}

.user[status="Idle"] > .user-inner > .avatar > .status {
    background-color: var(--user-status-idle);
}
</style>
