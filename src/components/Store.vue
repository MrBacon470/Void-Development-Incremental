<template>
  <div class="upgradesParent">
    <span class="upgradesHeader">Upgrades Store</span>
    <span class="upgradesCategoryHeader">Upgrade Category</span>
    <div class="upgradesGrid">
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
    justify-content: flex-start;
    align-items: center;
    height: calc(100vh - 3em);
    display: flex;
    background-color: var(--background-secondary);
    flex-direction: column;
  }
  .upgradesGrid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: 1fr;
  }
  .upgradesHeader {
    font-size: 4em;
    margin-top: 2em;
    margin-bottom: 2em;
  }
  .upgradesCategoryHeader {
    font-size: 2.5em;
    margin-bottom: 2em;
  }
</style>