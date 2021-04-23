<template>
<div class="channel-actions">
    <span>Debug Perks: Unlimited free users and heros!</span>
    <div class="h-fill"></div>
    <button v-on:click="createNewUser()">Create New User</button>
    <button v-on:click="createNewHero()">Create New Hero User</button>
</div>
</template>

<script>
import { heros, getRandomUser } from '../userdata.js';
import { addJoinMessage } from '../conversations.js';

export default {
	name: 'welcome',
    methods: {
        createNewUser() {
            const newUser = getRandomUser();
            this.player.users[newUser] = true;
            // Assume array is sorted, and use bst to insert new user into correct place
            this.player.sortedUsers.splice(this.sortedIndex(this.player.sortedUsers, newUser), 0, newUser);
            addJoinMessage(newUser);
        },
        createNewHero() {
            const remainingHeros = Object.keys(heros).filter(u => !this.player.heros[u] && u !== "667109969438441486");
            if (remainingHeros.length > 0) {
                const newUser = remainingHeros[Math.floor(Math.random() * remainingHeros.length)];
                if (this.player.roles[heros[newUser].role] == null) {
                    this.player.roles[heros[newUser].role] = [];
                }
                this.player.roles[heros[newUser].role].push(newUser);
                this.player.heros[newUser] = true;
                addJoinMessage(newUser);
            }
        },
        // https://stackoverflow.com/questions/1344500/efficient-way-to-insert-a-number-into-a-sorted-array-of-numbers
        sortedIndex(array, value) {
            var low = 0,
                high = array.length;

            while (low < high) {
                var mid = (low + high) >>> 1;
                if (array[mid] < value) low = mid + 1;
                else high = mid;
            }
            return low;
        }
    }
}
</script>

<style>
</style>
