<template>
<div class="users-list">
    <div class="role-header">
        <!--Will put JS soon:tm: (avocado5182)-->
        <p>Developer &#8212; 1</p>
    </div>
    <div class="user" uid="void" status="DND" onclick="openProfile(this.attributes.uid.value)">
        <div class="user-inner">
            <div class="avatar">
                <img class="pfp" src="https://cdn.discordapp.com/avatars/667109969438441486/8c1305df7b7a59043d71856f1af42419.png?size=128" alt=" ">
                <div class="status"></div>
            </div>
            <div class="user-text">
                <p class="name">VoidCloud</p>
                <p class="desc">Playing <strong>Void Development Incremental</strong></p>
            </div>
        </div>
    </div>
    <div class="role-header">
        <!--Will put JS soon:tm: (avocado5182)-->
        <p>Staff-Admin &#8212; 2</p>
    </div>
    <div class="user" uid="lepoggres" status="Online" onclick="openProfile(this.attributes.uid.value)">
        <div class="user-inner">
            <div class="avatar">
                <img class="pfp" src="https://cdn.discordapp.com/avatars/543817742487388179/801863b7b703ca8481108f20fa95bc31.png?size=128" alt=" ">
                <div class="status"></div>
            </div>
            <div class="user-text">
                <p class="name">Avocado.NET</p>
                <p class="desc">Testing Long Names</p>
            </div>
        </div>
    </div>
    <div class="user" uid="flamer" status="Idle" onclick="openProfile(this.attributes.uid.value)">
        <div class="user-inner">
            <div class="avatar">
                <img class="pfp" src="https://cdn.discordapp.com/avatars/708748287909298318/a_371eb402927697221fe3b59b0a315537.gif?size=1024" alt=" ">
                <div class="status"></div>
            </div>
            <div class="user-text">
                <p class="name">Flamening</p>
                <p class="desc">Idle Status.js</p>
            </div>
        </div>
    </div>
    <div class="role-header">
        <!--Will put JS soon:tm: (avocado5182)-->
        <p>Kuaka Coin Salesman &#8212; 1</p>
    </div>
    <div class="user" uid="kuaka" status="Offline" onclick="openProfile(this.attributes.uid.value)">
        <div class="user-inner">
            <div class="avatar">
                <img class="pfp" src="https://cdn.discordapp.com/avatars/366022305668923402/2d139cf3e0b984d49fbc24704c3142f9.webp?size=1024" alt=" ">
                <div class="status"></div>
            </div>
            <div class="user-text">
                <p class="name">Kauk@</p>
                <p class="desc">Swag Coin</p>
            </div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    name: 'members-list',
    methods: {
        openProfile(user) {
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
