import { SentimentIntensityAnalyzer } from 'vader-sentiment';
import nlp from 'compromise';
import Decimal from './break_eternity.js';
import { userdata } from './userdata.js';

function startConversation(category, channel, convo, extra) {
	// If convo is an array, choose a random one
	if (Array.isArray(convo)) {
		let weights = convo.map(c => ({ convo: c, weight: getWeight(c) })).filter(c => c.weight !== 0);
		if (weights.length === 0) {
			return;
		}
		let totalWeight = weights.reduce((acc, curr) => acc + curr.weight, 0);
		let random = Math.random() * totalWeight;
		let weight = 0;
		for (let c of weights) {
			weight += c.weight;
			if (random <= weight) {
				convo = c.convo;
				break;
			}
		}
	} else if (getWeight(convo) === 0) {
		return;
	}

	// Pick users for conversation
	// TODO optimize
	let conversingUsers = Object.keys(window.player.heros).filter(user => {
		for (let c of window.player.activeConvos) {
			if (c.users.includes(user)) {
				return false;
			}
		}
		return true;
	});
	conversingUsers = [...conversingUsers, ...conversations[convo].users.filter(u => typeof u === 'string')];
	let users = conversations[convo].users.map(u => {
		if (typeof u === 'object') {
			let users = Object.keys(window.player.heros).filter(u => !conversingUsers.includes(u));
			// TODO apply filters based on options stored in object
			// Might mean moving the hero user prioritization from the conversingUsers construction
			if (users.length === 0) {
				users = Object.keys(window.player.heros).filter(u => !conversations[convo].users.includes(u));
				if (users.length === 0) {
					users = window.player.sortedUsers;
				}
			}
			u = users[Math.floor(Math.random() * users.length)];
		}
		conversingUsers.push(u);
		return u;
	});

	// Add to list of active conversations
	window.player.activeConvos.push({ convoId: convo, users, category, channel, nextMessage: 0, progress: 0, ...extra })
}

function getWeight(convoId) {
	const convo = conversations[convoId];
	let weight = convo.weight;
	if (typeof weight === 'function') {
		weight = weight.call(convo);
	}
	return Math.max(weight == null ? 1 : weight, 0);
}

let randomTopicProgress = 0;
let randomMod = Math.random();
function updateConversations(delta) {
	for (let index = window.player.activeConvos.length - 1; index >= 0; index--) {
		let activeConvo = window.player.activeConvos[index];
		const convo = conversations[activeConvo.convoId];
		let nextMessage = convo.messages[activeConvo.nextMessage];

		if (nextMessage.type === 'user') {
			activeConvo.progress += delta;
			if (typeof nextMessage.content === 'function') {
				convo.messages[activeConvo.nextMessage] = nextMessage = Object.assign({}, nextMessage);
				nextMessage.content = nextMessage.content.call(activeConvo);
			}

			if (activeConvo.progress >= (nextMessage.delay || 1) + (nextMessage.typingDuration || (nextMessage.content.length * .05))) {
				// Time to show next message
				addMessage(activeConvo.category, activeConvo.channel, nextMessage, activeConvo.users[nextMessage.user]);
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

	// Add new topics randomly, based on how many active conversations there already are
	if (window.player.activeChannel.category !== 'DMs' && window.player.activeChannel.channel !== 'Bob') {
		randomTopicProgress += delta / 30;
		if (randomMod < randomTopicProgress / (1 + window.player.activeConvos.length)) {
			randomTopicProgress = 0;
			startConversation("general", "general", Object.keys(nothingConversations));
			randomMod = Math.random();
		}
	}
}

function addMessage(category, channel, message, sender) {
	let messages = (category === "DMs" ? window.player.DMs : window.player.categories[category].channels)[channel].messages;
	// Duplicate message and strip out unnecessary data
	let { content, first, timestamp, userId, influence, joinMessage } = message;
	userId = sender || userId;
	timestamp = timestamp || Date.now();
	first = content && (messages.length === 0 ||
						messages[messages.length - 1].userId !== userId ||
						// separate messages if they're 7 minutes apart
						timestamp - messages[messages.length - 1].timestamp > 7 * 60 * 1000);
	if (influence) {
		influence = new Decimal(influence);
		window.player.influence = window.player.influence.add(influence);
	}
	const id = window.player.nextMessageId++;
	messages.push({ id, content, first, timestamp, userId, influence, joinMessage });
}

// Utility function for creating a single-message conversation
function singleMessage(msg, userConditions) {
	return {
		messages: [ { type: 'user', user: 0, content: msg } ],
		users: [ userConditions || {} ]
	}
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

function addJoinMessage(newUser) {
	addMessage('info', 'welcome', {
        joinMessage: welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)](newUser in userdata ? userdata[newUser].username : newUser),
        userId: newUser
    });
}

function sendPlayerMessage(message) {
	const { category, channel } = window.player.activeChannel;

	// TODO using mentions to "target" responses at specific convos?
	let foundConvo = false;
	window.player.activeConvos.forEach((c, index) => {
		if (foundConvo) return;
		if (c.category !== category || c.channel !== channel) return;
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
	if (!foundConvo && Math.random() < (1 / (window.player.activeConvos.length + 1))) {
		// TODO parse message for specific topics
		// TODO if topic is mentioned but not handled uniquely, add generic "are we talking about <topic>? I might have to mute then" or smt
		const nouns = nlp(message.content, customWords).match('(@hasQuestionMark|@hasComma|@hasQuote|@hasPeriod|@hasExclamation|@hasEllipses|@hasSemicolon|@hasSlash)').post(' ').trim().parent().nouns().not('#Plural').out('array');
		if (nouns.length > 0) {
			startConversation(category, channel, Object.keys(genericNounConversations), { noun: nouns[Math.floor(Math.random() * nouns.length)] });
		} else {
			console.log("No conversation found for " + message.content);
		}
	}

	addMessage(category, channel, message);
}

// Setup NLP
window.nlp = nlp;
// Create list of custom words to include as topics, nouncs, etc.
// See list of tags here: https://observablehq.com/@spencermountain/compromise-tags
// Note that topic are any Person, Place, or Organization (or children within those)
const customWords = {
	discord: 'Company',
	minecraft: 'Noun',
	mojang: 'Company',
	unity: 'Noun',
	photoshop: 'Noun',
	'id software': 'Company',
	'square enix': 'Company',
	'unreal engine': 'Noun',
	'ue4': 'Noun',
	nintendo: 'Company',
	'dungeons and dragons': 'Noun',
	'd&d': 'Noun'
}
window.customWords = customWords;

// Random messages to send that might stir up a conversation
// Right now that might happen only if the player responds
// TODO allow these to start topic-related conversations with same chance as player messages
const nothingConversations = [
	'Can we send memes in #general?',
	'Howdy :texas:',
	'Are hotdogs considered sandwiches?',
	'Are ice cream sandwiches considered sandwiches?',
	'Are pizzas considered sandwiches?',
	'Are hamburgers considered sandwiches?',
	'This server is really nice',
	'DAE remember chemcremental?',
	'Is cereal a soup?',
	'Would you rather drink a melted crayon, or snort a crushed crayon',
	'Would you rather be able to teleport or turn invisible?',
	'Anyone here see last night\'s game?',
	'Guys I\'m so excited for the next Minecraft update',
	'Anyone else hyped for the next season of Fortnite?',
	'Swag',
	'We do a little trolling',
	'Hey chat',
	'gm',
	'gn',
	':ban:',
	'Why does everyone here hate Java?',
	'Why does everyone here hate C#?',
	'Why does everyone here hate Python?',
	'Why does everyone here hate Javscript?',
	'dead',
	'rip chat',
	'hello',
	'how is everyone :P',
	'amogus',
	'is this loss?',
	'f missed active chat',
	'lasted',
	'We do a large amount of trolling',
	'We do a minuscule amount of tomfoolery',
	'hi',
	'hey',
	'Is this the better Jacorb Server?',
	'Gamening',
	'I think cereal is a broth',
	'Is Void Dead?',
	'Dead Chat XD',
	'Update when?',
	'hello',
	'?ban',
	'>level',
	'why is everyone afk in the vc?',
	'a',
	'does anyone still play Chemcremental?',
	'anyone remember plasma clicker?',
	'lol',
	'lmao',
	'im going to do a P2W Eternal speedrun!'
].reduce((acc, curr, index) => {
	acc['nothing' + index] = typeof curr === 'string' ? singleMessage(curr) : curr;
	return acc;
}, {});

const genericNounConversations = [
	{
		messages: [
			{ type: 'user', user: 0, content() { return `${this.noun}? I love ${this.noun}!` } },
			{ type: 'user', user: 1, content() { return `Pssh, ${this.noun} is so overrated. Get something new to like` }, delay: 2 }
		],
		users: [ {}, {} ]
	},
	{
		messages: [
			{ type: 'user', user: 0, content() { return `Hmm, I used to hate ${this.noun} but then I realized it's actually really easy to like` } }
		],
		users: [ {} ]
	}
].reduce((acc, curr, index) => {
	acc['genericNoun' + index] = {
		...curr,
		weight() {
			return this.users.length > window.player.sortedUsers.length + Object.keys(window.player.heros).length ? 0 : curr.weight || 1;
		}
	};
	return acc;
}, {});

const conversations = {
	...nothingConversations,
	...genericNounConversations,
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
}

const welcomeMessages = [
	// Extended list from https://gist.github.com/fourjr/0f47ce8a000c29cd4e24f8aeb7edd8e0
	"[!!{username}!!](usernameOnClick) just joined the server - glhf!",
	"[!!{username}!!](usernameOnClick) just joined. Everyone, look busy!",
	"[!!{username}!!](usernameOnClick) just joined. Can I get a heal?",
	"[!!{username}!!](usernameOnClick) joined your party.",
	"[!!{username}!!](usernameOnClick) joined. You must construct additional pylons.",
	"Ermagherd. [!!{username}!!](usernameOnClick) is here.",
	"Welcome, [!!{username}!!](usernameOnClick). Stay awhile and listen.",
	"Welcome, [!!{username}!!](usernameOnClick). We hope you brought pizza.",
	"Welcome [!!{username}!!](usernameOnClick). Leave your weapons by the door.",
	"A wild [!!{username}!!](usernameOnClick) appeared.",
	"Swoooosh. [!!{username}!!](usernameOnClick) just landed.",
	"Brace yourselves. [!!{username}!!](usernameOnClick) just joined the server.",
	"[!!{username}!!](usernameOnClick) just joined. Hide your bananas.",
	"[!!{username}!!](usernameOnClick) just arrived. Seems OP - please nerf.",
	"[!!{username}!!](usernameOnClick) just slid into the server.",
	"A [!!{username}!!](usernameOnClick) has spawned in the server.",
	"Big [!!{username}!!](usernameOnClick) showed up!",
	"Where’s [!!{username}!!](usernameOnClick)? In the server!",
	"[!!{username}!!](usernameOnClick) hopped into the server. Kangaroo!!",
	"[!!{username}!!](usernameOnClick) just showed up. Hold my beer.",
	"Challenger approaching - [!!{username}!!](usernameOnClick) has appeared!",
	"It's a bird! It's a plane! Nevermind, it's just [!!{username}!!](usernameOnClick).",
	"It's [!!{username}!!](usernameOnClick)! Praise the sun! \\[T]/",
	"Never gonna give [!!{username}!!](usernameOnClick) up. Never gonna let [!!{username}!!](usernameOnClick) down.",
	"Ha! [!!{username}!!](usernameOnClick) has joined! You activated my trap card!",
	"Cheers, love! [!!{username}!!](usernameOnClick)'s here!",
	"Hey! Listen! [!!{username}!!](usernameOnClick) has joined!",
	"We've been expecting you [!!{username}!!](usernameOnClick)",
	"It's dangerous to go alone, take [!!{username}!!](usernameOnClick)!",
	"[!!{username}!!](usernameOnClick) has joined the server! It's super effective!",
	"Cheers, love! [!!{username}!!](usernameOnClick) is here!",
	"[!!{username}!!](usernameOnClick) is here, as the prophecy foretold.",
	"[!!{username}!!](usernameOnClick) has arrived. Party's over.",
	"Ready player [!!{username}!!](usernameOnClick)",
	"[!!{username}!!](usernameOnClick) is here to kick butt and chew bubblegum. And [!!{username}!!](usernameOnClick) is all out of gum.",
	"Hello. Is it [!!{username}!!](usernameOnClick) you're looking for?",
	"[!!{username}!!](usernameOnClick) has joined. Stay a while and listen!",
	"Roses are red, violets are blue, [!!{username}!!](usernameOnClick) joined this server with you",
].map(message => id => message.replaceAll('[!!{username}!!](usernameOnClick)', `<b>${id in userdata ? userdata[id].username : id}</b>`));

export { startConversation, updateConversations, sendPlayerMessage, conversations, welcomeMessages, addJoinMessage };
