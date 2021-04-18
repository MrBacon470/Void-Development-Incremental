<template>
<div class="channel-actions">
    <span>Debug Perks: Unlimited free users and heros!</span>
    <div class="h-fill"></div>
    <button v-on:click="createNewUser()">Create New User</button>
    <button v-on:click="createNewHero()">Create New Hero User</button>
</div>
</template>

<script>
import { userdata, getRandomUser } from '../userdata.js';
import { addJoinMessage } from '../conversations.js';

export default {
	name: 'welcome',
    methods: {
        createNewUser() {
            const newUser = getRandomUser();
            this.player.users.push(newUser);
            this.player.users.sort();
            addJoinMessage(newUser);
        },
        createNewHero() {
            const remainingHeros = Object.keys(userdata).filter(u => !this.player.users.includes(u));
            if (remainingHeros.length > 0) {
                const newUser = remainingHeros[Math.floor(Math.random() * remainingHeros.length)];
                this.player.users.push(newUser);
                addJoinMessage(newUser);
            }
        }
    }
}
</script>

<style>
</style>
