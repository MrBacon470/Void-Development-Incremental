import Decimal from './break_eternity.js';
import { conversations as genericConversations, tryStartConversation as tryStartGenericConversation } from './conversations/generic.js';
import { conversations as heatedConversations, onAddMessage as heatedOnAddMessage, tryStartConversation as tryStartHeatedConversation } from './conversations/heated.js';
import { clean, branchSentiment } from './conversations/nlp.js';
import { conversations as randomConversations, update as updateRandom } from './conversations/random.js';
import { defaultTypingSpeed, defaultMessageDelay } from './conversations/utils.js';
import { welcomeMessages } from './conversations/welcome.js';

function handleResponse(activeConvo, index, message, response) {
	if (typeof response === "number") {
		activeConvo.nextMessage = response;
	} else if (typeof response === "object") {
		if (response.influence) {
			message.influence = response.influence;
		}
		if (typeof response.run === "function") {
			response.run();
		}
		if (response.goto != null) {
			activeConvo.nextMessage = response.goto;
		} else {
			activeConvo.nextMessage = -1;
		}
	}

	if (activeConvo.nextMessage < 0 || activeConvo.nextMessage >= conversations[activeConvo.convoId].messages.length) {
		window.player.activeConvos.splice(index, 1);
	}
}

function addMessage(category, channel, message, sender) {
	let messages = (category === "DMs" ? window.player.DMs : window.player.categories[category].channels)[channel].messages;

	// Duplicate message and strip out unnecessary data
	let { content, first, timestamp, userId, influence, stress, heat, joinMessage } = message;
	content = content?.replaceAll(/[^\x20-\x7F]/g, "");
	userId = sender || userId;
	timestamp = timestamp || Date.now();
	first = content && (messages.length === 0 ||
						messages[messages.length - 1].userId !== userId ||
						// separate messages if they're 7 minutes apart
						timestamp - messages[messages.length - 1].timestamp > 7 * 60 * 1000);

	// Apply message effects
	if (influence) {
		influence = new Decimal(influence);
		window.player.influence = window.player.influence.add(influence);
	}
	if (stress) {
		stress = new Decimal(stress);
		window.player.stress = window.player.stress.add(stress);
	}
	heatedOnAddMessage(category, channel, message);

	// Add message
	const id = window.player.nextMessageId++;
	messages.push({ id, content, first, timestamp, userId, influence, stress, heat, joinMessage });

	// Mark channel as pinged
	if (category != "DMs" && window.player.activeChannel.category != category || window.player.activeChannel.channel != channel) {
		window.player.categories[category].channels[channel].ping = true;
	}

	// Have chance to start new convo if message wasn't part of existing one
	if (category !== 'DMs' && content && Math.random() < (1 / (window.player.activeConvos.length + 2))) {
		const cleaned = clean(content);
		let sent = tryStartHeatedConversation(category, channel, cleaned, sender);
		if (!sent) {
			sent = tryStartGenericConversation(category, channel, cleaned);
		}
		if (!sent) {
			console.log("No conversation found for " + cleaned.text());
		}
	}
}

export function updateConversations(delta) {
	for (let index = window.player.activeConvos.length - 1; index >= 0; index--) {
		let activeConvo = window.player.activeConvos[index];
		const convo = conversations[activeConvo.convoId];
		let nextMessage = convo.messages[activeConvo.nextMessage];

		if (nextMessage.type === 'user' || (nextMessage.type === 'player' && nextMessage.optional)) {
			activeConvo.progress += delta;

			// Evaluation convo's next message's properties
			if (typeof nextMessage.content === 'function' || nextMessage.user === 'function' || typeof nextMessage.typingDuration === 'function') {
				nextMessage = Object.assign({}, nextMessage);
				if (typeof nextMessage.content === 'function') {
					nextMessage.content = nextMessage.content.call(activeConvo);
				}
				if (typeof nextMessage.user === 'function') {
					nextMessage.user = nextMessage.user.call(activeConvo);
				}
				if (typeof nextMessage.typingDuration === 'function') {
					nextMessage.typingDuration = nextMessage.typingDuration.call(activeConvo);
				}
			}

			// Determine if the convo's next message is ready to show
			let delay = nextMessage.delay == null ? defaultMessageDelay : nextMessage.delay;
			if (nextMessage.typingDuration || nextMessage.content) {
				delay += nextMessage.typingDuration || (nextMessage.content.length * defaultTypingSpeed);
			}
			if (activeConvo.progress >= delay) {
				// Time to show next message
				let user = nextMessage.user;
				if (typeof user === 'function') {
					user = user.call(activeConvo);
				}
				addMessage(activeConvo.category, activeConvo.channel, nextMessage, activeConvo.users[user]);
				activeConvo.progress = 0;

				// Prepare for next message
				if (typeof nextMessage.run === 'function') {
					nextMessage.run.call(activeConvo);
				}
				activeConvo.nextMessage = nextMessage.goto != null ? nextMessage.goto : activeConvo.nextMessage + 1;
				if (nextMessage.heat) {
					activeConvo.heat += nextMessage.heat;
				}
				if (typeof activeConvo.nextMessage === 'function') {
					activeConvo.nextMessage = activeConvo.nextMessage.call(activeConvo);
				}

				if (activeConvo.nextMessage < 0 || activeConvo.nextMessage >= convo.messages.length) {
					// No more messages left, remove the conversation
					window.player.activeConvos.splice(index, 1);
				}
			}
		}
	}

	// Add new topics randomly, based on how many active conversations there already are
	updateRandom(delta);
}

export function addJoinMessage(newUser) {
	addMessage('info', 'welcome', {
        joinMessage: Math.floor(Math.random() * welcomeMessages.length),
        userId: newUser
    });
}

export function sendPlayerMessage(message) {
	const { category, channel } = window.player.activeChannel;

	// Handle conversations waiting upon a player response
	// TODO using mentions to "target" responses at specific convos?
	let foundConvo = false;
	window.player.activeConvos.forEach((c, index) => {
		if (foundConvo) return;
		if (c.category !== category || c.channel !== channel) return;
		const nextMessage = conversations[c.convoId].messages[c.nextMessage];
		if (nextMessage.type === 'player' && (nextMessage.isValid == null || nextMessage.isValid(c, message))) {
			if (nextMessage.nlpType === 'sentiment') {
				foundConvo = branchSentiment(message.content, {
					positive: () => handleResponse(c, index, message, nextMessage.positive),
					neutral: () => handleResponse(c, index, message, nextMessage.neutral),
					negative: () => handleResponse(c, index, message, nextMessage.negative)
				});
			}
			// TODO other types of player response requests
		}
	});

	addMessage(category, channel, message);
}

export const conversations = {
	...randomConversations,
	...genericConversations,
	...heatedConversations,
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
		]
	}
};
