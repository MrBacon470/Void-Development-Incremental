import { heros } from '../userdata.js';

function getWeight(conversation) {
	let weight = conversation.weight;
	if (typeof weight === 'function') {
		weight = weight.call(conversation);
	}
	return Math.max(weight == null ? 1 : weight, 0);
}

function pickConversation(convoIdArray, conversationArray) {
	let weights = conversationArray.map((c, index) => ({ convoId: convoIdArray[index], conversation: c, weight: getWeight(c) })).filter(c => c.weight !== 0);
	if (weights.length === 0) {
		return;
	}
	let totalWeight = weights.reduce((acc, curr) => acc + curr.weight, 0);
	let random = Math.random() * totalWeight;
	let weight = 0;
	for (let c of weights) {
		weight += c.weight;
		if (random <= weight) {
			return { convoId: c.convoId, conversation: c.conversation };
		}
	}
}

function pickUsers(conversation, users) {
	const availableHeros = Object.keys(window.player.heros).filter(user => {
		if (users.includes(user)) {
			return false;
		}
		for (let c of window.player.activeConvos) {
			if (c.users.includes(user)) {
				return false;
			}
		}
		return true;
	});
	const takenUsers = users.slice();

	return users.map(u => {
		if (typeof u === 'object') {
			let availableUsers = availableHeros;
			if (availableUsers.length === 0) {
				availableUsers = Object.keys(window.player.heros).filter(u => !takenUsers.includes(u));
			}
			if (availableUsers.length === 0) {
				availableUsers = window.player.sortedUsers.filter(u => !takenUsers.includes(u));
			}
			if (availableUsers.length === 0) {
				availableUsers = window.player.sortedUsers;
			}
			// TODO apply filters based on options stored in object
			u = availableUsers[Math.floor(Math.random() * availableUsers.length)];
		}
		if (availableHeros.includes(u)) {
			availableHeros.splice(availableHeros.indexOf(u), 1);
		}
		takenUsers.push(u);
		return u;
	});
}

export const defaultTypingSpeed = .1; // How long it takes to type one character
export const defaultMessageDelay = 2; // How long it takes for an NPC to "read" a message before they start typing a response

export function getDisplayName(user) {
	return user in heros ? heros[user].username : user;
}

// I'd rather this be in conversations.js but it needs to be put here to prevent dependency cycles
export function startConversation(category, channel, convoId, conversation, extra) {
	// If conversation is an array, pick one using weights
	if (Array.isArray(conversation)) {
		const result = pickConversation(convoId, conversation);
		convoId = result.convoId;
		conversation = result.conversation;
	}
	if (conversation == null || getWeight(conversation) === 0) {
		return;
	}

	// Pick users for conversation
	const users = pickUsers(conversation, extra?.users || conversation.users);
	if (extra) {
		delete extra.users;
	}

	// Add to list of active conversations
	const activeConvo = { convoId, users, category, channel, nextMessage: 0, progress: 0, ...extra };
	window.player.activeConvos.push(activeConvo);
	if (typeof conversation.init === 'function') {
		conversation.init.call(activeConvo);
	}
	return activeConvo;
}

export function smallChatSlowdown() {
	let total_users = 1 + Object.keys(window.player.heros).length + Object.keys(window.player.users).length;
	return 1 + Math.pow(total_users, 0.6) / 60;
}
