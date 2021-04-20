<template>
  <div class="channel-actions">
    <span>Upgrades Store</span>
    <div class="h-fill"></div>
    <button v-on:click="logSomething('test1')">Purchase Upgrade 1</button>
    <button v-on:click="logSomething('test2')">Purchase Upgrade 2</button>
  </div>
</template>

<script>
export default {
name: "store",
  methods: {
    logSomething(x) {
      console.log(x);
    }
  }
}
</script>

<style scoped>

</style>