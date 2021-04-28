import Vue from 'vue';
import App from './App.vue';
import Decimal from './break_eternity.js';
import { format, formatWhole, formatTime } from './numberFormatting.js';
import { updateConversations } from './conversations.js';
import { welcomeMessages } from './conversations/welcome.js';
import { roles } from './userdata.js';
import PerfectScrollbar from 'vue2-perfect-scrollbar';
import VueVirtualScroller from 'vue-virtual-scroller';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

window.Decimal = Decimal;

// Load data from localStorage
const storageKey = 'VDI';
let startData = {
	categories: {
		info: {
			title: '-={info}=-',
			collapsed: false,
			channels: {
				announcements: {
					title: 'announcements',
					type: 'announcement',
					messages: [],
					description: "Announcements Here :P"
				},
				welcome: {
					title: 'welcome',
					type: 'text',
					messages: [
						{
							timestamp: Date.now(),
							joinMessage: Math.floor(Math.random() * welcomeMessages.length),
							userId: 'Bob',
							id: 0
						}
					],
					description: ":blobwave:"
				},
				store: {
					title: 'store',
					type:'store',
					description: "Purchase Upgrades Here"
				}
			}
		},
		general: {
			title: '-={General Chatting}=-',
			collapsed: false,
			channels: {
				general: {
					title: 'general',
					type: 'text',
					description: "This is where you talk about things | Be nice :)",
					ping: false,
					messages: []
				}
			}
		},
		voice: {
			title: '-={vcs}=-',
			collapsed: false,
			channels: {
				general: {
					title: 'General',
					type: 'voice',
					description: "Place where you can talk and listen to music!",
					users: [
						350057688182292482
					]
				}
			}
		}
	},
	DMs: {
		Bob: {
			title: 'Bob',
			type: 'DM',
			messages: []
		}
	},
	activeChannel: {
		category: 'DMs',
		channel: 'Bob'
	},
	influence: new Decimal(0),
	stress: new Decimal(0),
	autosave: true,
	timePlayed: 0,
	currentTime: performance.now(),
	activeConvos: [],
	performedIntro: false,
	// TODO re-construct roles list from heros list in fixData
	roles: {
		...Object.keys(roles).reduce((acc, curr) => {
			acc[curr] = [];
			return acc;
		}, {}),
		developer: [
			"667109969438441486"
		]
	},
	heros: {},
	users: {
		"Bob": true
	},
	sortedUsers: [
		"Bob"
	],
	nextMessageId: 1
}
function fixData(data, startData) {
	for (let dataKey in startData) {
		if (startData[dataKey] == null) {
			if (data[dataKey] === undefined) {
				data[dataKey] = null;
			}
		} else if (Array.isArray(startData[dataKey])) {
			if (data[dataKey] === undefined) {
				data[dataKey] = startData[dataKey].slice();
			} else {
				fixData(data[dataKey], startData[dataKey]);
			}
		} else if (startData[dataKey] instanceof Decimal) { // Convert to Decimal
			if (data[dataKey] == undefined) {
				data[dataKey] = startData[dataKey];
			} else {
				data[dataKey] = new Decimal(data[dataKey]);
			}
		} else if ((!!startData[dataKey]) && (typeof startData[dataKey] === "object")) {
			if (data[dataKey] == undefined || (typeof data[dataKey] !== "object")) {
				data[dataKey] = Object.assign({}, startData[dataKey]);
			} else {
				fixData(data[dataKey], startData[dataKey]);
			}
		} else {
			if (data[dataKey] == undefined) {
				data[dataKey] = startData[dataKey];
			}
		}
	}
}
let loadedData = localStorage.getItem(storageKey);
if (loadedData == null) {
	loadedData = JSON.parse(JSON.stringify(startData));
	fixData(loadedData, startData);
} else {
	try {
		loadedData = Object.assign({}, JSON.parse(JSON.stringify(startData)), JSON.parse(decodeURIComponent(escape(atob(loadedData)))));
	} catch {
		console.log("Error while parsing save. Starting fresh.");
		loadedData = JSON.parse(JSON.stringify(startData));
	}
	fixData(loadedData, startData);
	// Update influence values on messages to Decimals
	for (let category in loadedData.categories) {
		for (let channel in loadedData.categories[category].channels) {
			for (let message of loadedData.categories[category].channels[channel].messages || []) {
				if (message.influence) {
					message.influence = new Decimal(message.influence);
				}
			}
		}
	}
}
let store = window.player = Vue.observable(loadedData);
Vue.prototype.player = store;

// Setup first conversation
if (!store.performedIntro) {
	store.performedIntro = true;
	store.activeConvos.push({ convoId: "intro", users: [ 'Bob' ], category: 'DMs', channel: 'Bob', nextMessage: 0, progress: 0 });
}

// Hard reset function!
window.hardReset = function() {
	store.autosave = false;
	localStorage.removeItem(storageKey);
	location.reload();
}

// Set up auto-saving every second
window.save = function() {
	if (store.autosave) {
		localStorage.setItem(storageKey, btoa(unescape(encodeURIComponent(JSON.stringify(window.player)))));
	}
}
setInterval(window.save, 1000);

// Setup Vue
Vue.filter('numberFormat', function (value) {
	return format(value);
});
Vue.filter('numberFormatWhole', function (value) {
	return formatWhole(value);
});
Vue.filter('timeFormat', function (value) {
	return formatTime(value);
});
Vue.use(PerfectScrollbar);
Vue.use(VueVirtualScroller);

// Start Vue
window.vue = new Vue({
	render: h => h(App)
}).$mount('#app');

// Setup game loop
function update(currTime) {
	// TODO offline time doesn't work if using performance.now()
	let delta = Math.max(0, (currTime - store.currentTime) / 1000);
	store.timePlayed += delta;
	if (store.devSpeed) {
		delta *= store.devSpeed;
	}

	updateConversations(delta);

	// Setup for next frame
	store.currentTime = currTime;
	requestAnimationFrame(update);
}
update(performance.now());
