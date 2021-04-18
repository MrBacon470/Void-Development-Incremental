import Vue from 'vue';
import App from './App.vue';
import Decimal from './break_eternity.js';
import { format, formatWhole, formatTime } from './numberFormatting.js';
import { updateConversations } from './conversations.js';
import PerfectScrollbar from 'vue2-perfect-scrollbar';
import "vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css"

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
						content: "Testerest",
						userId: 350057688182292482,
						first: true
					}],
					description: ":blobwave:"
				},
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
					ping: true,
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
	autosave: true,
	timePlayed: 0,
	currentTime: performance.now(),
	activeConvos: [],
	performedIntro: false,
	users: [
		667109969438441486,
		"Bob"
	]
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
} else {
	loadedData = Object.assign({}, JSON.parse(JSON.stringify(startData)), JSON.parse(atob(loadedData)));
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
	Object.assign(store, JSON.parse(JSON.stringify(startData)));
	fixData(loadedData, startData);
	store.currentTime = performance.now();
}

// Set up auto-saving every second
window.save = function() {
	if (store.autosave) {
		localStorage.setItem(storageKey, btoa(JSON.stringify(window.player)));
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

// Start Vue
window.vue = new Vue({
	render: h => h(App)
}).$mount('#app');

// Setup game loop
function update(currTime) {
	// TODO offline time doesn't work if using performance.now()
	const delta = Math.max(0, (currTime - store.currentTime) / 1000);

	updateConversations(delta);

	// Setup for next frame
	store.currentTime = currTime;
	requestAnimationFrame(update);
}
update(performance.now());
