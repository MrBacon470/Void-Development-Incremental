import { SentimentIntensityAnalyzer } from 'vader-sentiment';
import Decimal from './break_eternity.js';

function startConversation(convo) {
	if (Array.isArray(convo)) {
		let weights = convo.map(c => ({ convo: c, weight: getWeight(c) })).filter(c => c.weight !== 0);
		if (weights.length === 0) {
			return;
		}
		let totalWeight = weights.reduce((acc, curr) => acc + curr.weight, 0);
		let random = Math.random() * totalWeight;
		let weight = 0;
		for (let c in convo) {
			weight += c.weight;
			if (random <= weight) {
				convo = c.convo;
				break;
			}
		}
	} else if (getWeight(convo) === 0) {
		return;
	}
	let users = convo.users.map(u => {
		// TODO process users list based on users already in convos and stuff
		if (typeof u === 'string') {
			return u;
		}
	});
	window.player.activeConvos.push({ convoId: convo, users, nextMessage: 0, progress: 0 })
}

function getWeight(convoId) {
	const convo = conversations[convoId];
	if (typeof convo.weight === 'function') {
		return Math.max(convo.weight() || 0, 0);
	}
	return Math.max(convo.weight || 0, 0);
}

function updateConversations(delta) {
	for (let index = window.player.activeConvos.length - 1; index >= 0; index--) {
		let activeConvo = window.player.activeConvos[index];
		const convo = conversations[activeConvo.convoId];
		const nextMessage = convo.messages[activeConvo.nextMessage];

		if (nextMessage.type === 'user') {
			activeConvo.progress += delta;

			if (activeConvo.progress >= (nextMessage.delay || 1) + (nextMessage.typingDuration || (nextMessage.content.length * .05))) {
				// Time to show next message
				addMessage(convo.category, convo.channel, nextMessage, activeConvo.users[nextMessage.user]);
				activeConvo.progress = 0;
				activeConvo.nextMessage = nextMessage.goto != null ? nextMessage.goto : activeConvo.nextMessage + 1;
				if (typeof nextMessage.run === 'function') {
					nextMessage.run();
				}

				if (activeConvo.nextMessage >= convo.messages.length) {
					// No more messages left, remove the conversation
					window.player.activeConvos.splice(index, 1);
				}
			}
		}
	}
}

function addMessage(category, channel, message, sender) {
	let messages = (category === "DMs" ? window.player.DMs : window.player.categories[category].channels)[channel].messages;
	message.userId = sender || message.userId;
	message.timestamp = message.timestamp || Date.now();
	message.first = messages.length === 0 ||
					messages[messages.length - 1].userId !== message.userId ||
					// separate messages if they're 7 minutes apart
					message.timestamp - messages[messages.length - 1].timestamp > 7 * 60 * 1000;
	if (message.influence) {
		message.influence = new Decimal(message.influence);
		window.player.influence = window.player.influence.add(message.influence);
	}
	messages.push(message);
}

function handleResponse(convo, message, response) {
	if (typeof response === "number") {
		convo.nextMessage = response;
	} else if (typeof response === "object") {
		if (response.influence) {
			message.influence = response.influence;
		}
		if (typeof response.run === "function") {
			response.run();
		}
		if (response.goto != null) {
			convo.nextMessage = response.goto;
		} else {
			convo.nextMessage = Number.POSITIVE_INFINITY;
		}
	}
	// Returns true if this should be removed from the list of activeConvos
	return convo.nextMessage >= conversations[convo.convoId].messages.length;
}

function sendPlayerMessage(message) {
	// TODO using mentions to "target" responses at specific convos?
	let foundConvo = false;
	window.player.activeConvos.forEach((c, index) => {
		if (foundConvo) return;
		const nextMessage = conversations[c.convoId].messages[c.nextMessage];
		if (nextMessage.type === 'player') {
			if (nextMessage.nlpType === 'sentiment') {
				// TODO is vader-sentiment the fastest one available?
				// I chose it over sentiment because that one didn't recognize things like "sure" as positive,
				// and vader claims to support slang and modifiers (e.g. "not good") better. That probably
				// also means its slower though (haven't benchmarked)
				const sentiment = SentimentIntensityAnalyzer.polarity_scores(message.content);
				console.log("Sentiment of '" + message.content + "'' is " + sentiment.compound);
				if (sentiment.compound > 0.05 && nextMessage.positive != null) {
					if (handleResponse(c, message, nextMessage.positive)) {
						window.player.activeConvos.splice(index, 1);
					}
					foundConvo = true;
				} else if (sentiment.compound <= -.05 && nextMessage.negative != null) {
					if (handleResponse(c, message, nextMessage.negative)) {
						window.player.activeConvos.splice(index, 1);
					}
					foundConvo = true;
				} else if (nextMessage.neutral != null) {
					if (handleResponse(c, message, nextMessage.neutral)) {
						window.player.activeConvos.splice(index, 1);
					}
					foundConvo = true;
				}
			}
			// TODO other types of player response requests, using the "compromise" package
		}
	});

	// Have chance to start new convo if message wasn't part of existing one
	if (!foundConvo && Math.random() < (1 / window.player.activeConvos.length)) {
		// TODO parse message for specific topics
		// TODO if topic is mentioned but not handled uniquely, add generic "are we talking about <topic>? I might have to mute then" or smt
		// TODO if no topic is mentioned but a noun is, add generic "<noun>? I love <noun>!" or smt
		console.log("No conversation found for " + message.content);
	}

	const { category, channel } = window.player.activeChannel;
	addMessage(category, channel, message);
}

const conversations = {
	intro: {
		messages: [
			{ type: 'user', user: 0, content: 'Hey void, create discord server rq or else :ban:', delay: 0 },
			{ type: 'player', nlpType: 'sentiment', positive: { influence: 1, goto: 4 }, neutral: 2, negative: 3 },
			{ type: 'user', user: 0, content: 'Come on, it\'s a great idea! Please?', goto: 1 },
			{ type: 'user', user: 0, content: 'You don\'t have a choice in this matter >.<', goto: 1 },
			{ type: 'user', user: 0, content: 'Yay!', run: () => {
				setTimeout(() => window.player.activeChannel = { category: 'info', channel: 'welcome' }, 2000);
			}}
		],
		users: [
			'Bob'
		],
		category: 'DMs',
		channel: 'Bob'
	}
}

export { startConversation, updateConversations, sendPlayerMessage, conversations };
