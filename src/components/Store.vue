<template>
  <div class="upgradesParent">
    <span>Upgrades Store</span>
    <div id="grid">

      <button v-on:click="logSomething('test1')">Purchase Upgrade 1</button>
      <button v-on:click="logSomething('test2')">Purchase Upgrade 2</button>
    </div>
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
  .upgradesParent {
    justify-content: space-around;
    align-items: center;
    height: calc(100vh - 3em);
    display: flex;
    background-color: var(--background-secondary);
  }
  grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: 1fr;
  }
</style>