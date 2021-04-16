const data = {
  pfps: {
    350057688182292482: "https://cdn.discordapp.com/avatars/350057688182292482/4033eea2a3b4cb76aa7b2cb44fc854bd.webp?size=128",
    667109969438441486: "https://cdn.discordapp.com/avatars/667109969438441486/8c1305df7b7a59043d71856f1af42419.png?size=128",
    708748287909298318: "https://cdn.discordapp.com/avatars/708748287909298318/a_371eb402927697221fe3b59b0a315537.gif?size=1024",
    543817742487388179: "https://cdn.discordapp.com/avatars/543817742487388179/801863b7b703ca8481108f20fa95bc31.png?size=128",
    366022305668923402: "https://cdn.discordapp.com/avatars/366022305668923402/2d139cf3e0b984d49fbc24704c3142f9.webp?size=1024"
  },
  usernames: {
    350057688182292482: "TheMKeyHolder",
    667109969438441486: "VoidCloud",
    708748287909298318: "Flamening",
    543817742487388179: "Avocado.NET",
    366022305668923402: "Kuak@"
  }
  
}
Vue.component("message", {
  props: ["userid", "content", "timestamp", "first", "data"],
  template: `
    <div :class="{message: true, first: first}">
      <img class="pfp" :src="data.pfps[userid]" alt=" ">
      <p class="name">{{data.usernames[userid]}} <span class="timestamp">{{new Date(timestamp).toLocaleString()}}</span></p>
      <p class="text">{{content}}</p>
    </div>
  `
})
Vue.component("channel", {
  props: ["name", "data", "player"],
  template: `
    <div class="message-list">
    <div class="messages-header">
      <i id="messages-header-type" class="fas"></i>
      <div id="messages-header-channel">{{name}}</div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<div class="text">{{player[name].description}}</div>
    </div>
    <div id="messages" class="messages" v-if="!player.isVoice">
      <div class="messages-fill">
      <div class="messages-channel selected" :chid="name">
      <div v-for="msg in player[name].messages">
        <message :userid="msg.userId" :content="msg.content" :first="msg.first" :timestamp="msg.timestamp" :data="data"></message>  
      </div>
      </div>
      </div>
      <div class="messages-footer">
      <input id="messages-input" class="messages-input" :placeholder="'Message #' +name"/>
      </div>
    </div>
    </div>
  `
})
let app = new Vue({
  el: ".app",
  data: {
    player,
    data
  }
})



console.log("unpog")
