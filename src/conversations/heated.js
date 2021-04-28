import nlp from 'compromise';
import Decimal from '../break_eternity.js';
import { getSentiment } from './nlp.js';
import { defaultTypingSpeed, getDisplayName, startConversation, smallChatSlowdown } from './utils.js';
import { getWikipedia } from './wikipedia.js';

// Add Heated tag and a couple heated topics to our natural language processing tool
nlp.extend((Doc, world) => {
	world.addTags({
		Heated: {
			isA: 'Noun'
		},
	});

	world.addWords({
		religion: ['Heated', 'Singular'],
		christianity: ['Heated', 'Uncountable'],
		systems: ['Heated', 'Plural'],
		guns: ['Heated', 'Plural'],
		abortion: ['Heated', 'Singular'],
		vaccines: ['Heated', 'Plural'],
		marijuana: ['Heated', 'Uncountable'],
		immigration: ['Heated', 'Uncountable'],
		'donald trump': ['Heated', 'Person'],
		'cancel culture': ['Heated', 'Uncountable'],
		'mental health': ['Heated', 'Uncountable']
	});
});

/*
TODO once we get some more positive conversations lmao
"we need more <side>"-type messages
const polarArguments = [
	["capitalism", "communism"],
	["evolution", "creationism"],
	["liberal", "conservative"],
	["democrat", "republican"],
	["modernity", "tradition"],
	["tpt mods", "di mods"]
]
*/

// After sending a argument message, figure out if the argument should continue
//  and if so, pick the next message to send and who should say it
// (also adds a new user to the argument if it's heated enough)
function findNextMessage(activeConvo) {
	activeConvo = activeConvo || this;

	if (activeConvo.heat <= 0) {
		activeConvo.goto = -1;
		return;
	}

	const convo = conversations[activeConvo.convoId];
	const previousMessage = activeConvo.nextMessage;
	// TODO use heat to match "worse" messages
	do {
		activeConvo.goto = Math.floor(Math.random() * convo.messages.length);
	} while (activeConvo.goto === previousMessage);

	// Add a new user to the argument
	if (activeConvo.heat > activeConvo.users.length) {
		let users = Object.keys(window.player.heros).filter(u => {
			if (activeConvo.users.includes(u)) {
				return false;
			}
			for (let c of window.player.activeConvos) {
				if (c.users.includes(u)) {
					return false;
				}
			}
			return true;
		});
		if (users.length === 0) {
			users = Object.keys(window.player.heros).filter(u => !activeConvo.users.includes(u));
		}
		if (users.length === 0) {
			users = window.player.sortedUsers.filter(u => !activeConvo.users.includes(u));
		}
		if (users.length !== 0) {
			const user = users[Math.floor(Math.random() * users.length)];
			activeConvo.users.push(user);
			(activeConvo.usersAgainst.length > activeConvo.usersFor.length ? activeConvo.usersFor : activeConvo.usersAgainst).push(activeConvo.users.length - 1);
		}
	}

	// Find user to say the message
	const pro = activeConvo.goto % 2 === 0;
	activeConvo.lastUser = activeConvo.nextUser;
	activeConvo.nextUser = (pro ? activeConvo.usersFor : activeConvo.usersAgainst)[Math.floor(Math.random() * (pro ? activeConvo.usersFor : activeConvo.usersAgainst).length)];
}

// Utility function for creating an argument message with proper value look-ups,
//  no delay, and that runs findNextMessage afterwards
function createArgument(content, extra) {
	return {
		type: 'user',
		user() { return this.nextUser; },
		goto() { return this.goto; },
		run: findNextMessage,
		delay: .5,
		typingDuration() { return conversations[this.convoId].messages[this.nextMessage].content().length * defaultTypingSpeed / Decimal.max(1, this.heat / smallChatSlowdown()).sqrt().toNumber(); },
		content,
		...extra
	};
}

// When a message gets sent, increase or decrease the heat of any active arguments
export function onAddMessage(category, channel, message) {
	if (!message.content || window.player.activeConvos.length === 0) {
		return;
	}

	const heat = message.heat ?? -getSentiment(message.content);
	window.player.activeConvos.forEach(c => {
		if (c.category !== category || c.channel !== channel) return;
		if (c.topic != null && c.heat) { // heated conversation
			let modifier = .25; // Only affect heat by a quarter sentiment of any random message
			if (nlp(message.content).match(c.topic).found) {
				// If an message mentions the argument topic, make the sentiment affect it at 100% effectiveness
				modifier = 1;
			}

			// If using sentiment, lower any heat gain
			if (message.heat == null && heat > 0) {
				modifier /= 1.25;
			}

			// Modify heat based on sentiment of message
			c.heat += heat * modifier;
		}
	});
}

// Look at a message and attempt to start a heated conversation from it
// Returns true if the conversation is successfully started
export function tryStartConversation(category, channel, cleaned, sender) {
	if (Object.keys(window.player.heros).length + window.player.sortedUsers.length < conversations.heatedArgument.users.length) {
		return false;
	}

	const heatedTopics = cleaned.match('#Heated+').out('array')
		.map(topic => nlp(topic).match('#Uncountable').found ? topic : nlp(topic).nouns().toPlural().toLowerCase().text())
		.filter(topic => !window.player.activeConvos.some(c => c.topic === topic));
	if (heatedTopics.length > 0) {
		let topic = heatedTopics[Math.floor(Math.random() * heatedTopics.length)];
		const sentiment = getSentiment(cleaned.text());
		const heat = 2 - sentiment;
		const users = conversations.heatedArgument.users.slice();
		if (sender) {
			if (sentiment > 0) {
				users[0] = sender;
			} else {
				users[1] = sender;
			}
		}
		const activeConvo = startConversation(category, channel, 'heatedArgument', conversations.heatedArgument, { topic, heat, users });
		getWikipedia(topic).then(({ content, summary }) => {
			activeConvo.wikiContent = content;
			activeConvo.summary = summary;
		});
		return true;
	}
	return false;
}

// Heated conversations that continue on until the heat dies down
// TODO make arguments support multiple messages to be typed simultaneously
export const conversations = {
	heatedArgument: {
		init() {
			this.heat = this.heat ?? 2;
			this.usersFor = this.usersFor || [ 0 ];
			this.usersAgainst = this.usersAgainst || [ 1 ];
			this.nextMessage = this.nextMessage || 0;
			findNextMessage(this);
			if (this.lastUser == null) {
				this.lastUser = "667109969438441486";
			}
		},
		messages: [
			// duplicated arguments are due to having versions for each side of the argument
			// Even arguments will be said by a "pro" user and odd arguments by an "against" user
			// TODO make the ones with ternaries just use a weight() function to set them to 0 weight if their requirement is not met
			createArgument(function() { return `Oh, we're talking about ${this.topic}? I might need to mute this channel ngl`; }, { heat: -1 }),
			createArgument(function() { return `Oh, we're talking about ${this.topic}? I might need to mute this channel ngl`; }, { heat: -1 }),
			createArgument(function() { return `for what it's worth, I personally like ${this.topic} a lot`; }),
			createArgument(function() { return `ugh I can't believe people are actually defending ${this.topic}`; }),
			createArgument(function() { return this.wikiContent ? `I looked up ${this.topic}, and apparently "${this.wikiContent[Math.floor(Math.random() * this.wikiContent.length)]}"` : `Someone should look into ${this.topic}, I don't think any of us know what we're talking about`; }),
			createArgument(function() { return this.wikiContent ? `I looked up ${this.topic}, and apparently "${this.wikiContent[Math.floor(Math.random() * this.wikiContent.length)]}"` : `Someone should look into ${this.topic}, I don't think any of us know what we're talking about`; }),
			createArgument(function() { return this.summary ? `Speaking of ${this.topic}, did y'all know ${nlp(this.summary).first(1).toLowerCase().parent().text()}` : `I really wish I knew more about ${this.topic} lol`; }),
			createArgument(function() { return this.summary ? `Speaking of ${this.topic}, did y'all know ${nlp(this.summary).first(1).toLowerCase().parent().text()}` : `I really wish I knew more about ${this.topic} lol`; }),
			createArgument(function() { return `i like people that like ${this.topic} and i dislike people who dislike ${this.topic}`; }, { heat: -1 }),
			createArgument(function() { return `i dislike people that like ${this.topic} and i like people who dislike ${this.topic}`; }, { heat: -1 }),
			createArgument(function() { return `The more I've thought about it the more I've really liked ${this.topic}`; }),
			createArgument(function() { return `${this.topic} is so bad i'm going to start a rant about how bad it is by pinging everyone`; }, { stress: 1 }),
			createArgument(function() { return this.nextUser === this.lastUser ? `Anyone disagree with me on ${this.topic}?` : `Tell us how you really feel about ${this.topic}, ${getDisplayName(this.users[this.lastUser])}`; }),
			createArgument(function() { return this.nextUser === this.lastUser ? `Anyone disagree with me on ${this.topic}?` : `I'm not sure I see your point about ${this.topic} ${getDisplayName(this.users[this.lastUser])} lol`; })
		],
		users: [ {}, {} ]
	}
};
