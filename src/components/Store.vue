<template>
  <div class="upgradesParent">
    <p class="upgradesHeader">Upgrades Store</p>
    <p class="upgradesCategoryHeader" style="color:var(--color-influence);">Influential Upgrades</p>
    <div class="upgradesGrid">
      <button id="upgrade1" class="unpurchasable" v-on:click="logSomething('test1')">Purchase Upgrade 1</button>
      <button id="upgrade2" class="purchasable" v-on:click="logSomething('test2')">Purchase Upgrade 2</button>
    </div>
    <p class="upgradesCategoryHeader">Upgrade Category 2</p>
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
    },
   /* mounted() {
      window.setInterval(function() {
        if(window.player.influence > new Decimal(100)) {

        }
      },1000)
    }*/
  }
}

//TODO Code to set Upgrade Color based on costs and currency

</script>

<style scoped>
  .upgradesParent {
    justify-content: flex-start;
    flex-start: left;
    height: calc(100vh - 3em);
    display: flex;
    background-color: var(--background-secondary);
    flex-direction: column;
  }
  .upgradesGrid {
    display: flex;
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: 1fr;
    margin-bottom: 2em;
  }
  .upgradesHeader {
    font-size: 2em;
    margin-top: 1em;
    margin-bottom: 1em;
  }
  .upgradesCategoryHeader {
    font-size: 1.5em;
    margin-bottom: 0.5em;
  }
  .unpurchasable {
    color: red;
  }
  .purchasable {
    color: green;
  }
</style>