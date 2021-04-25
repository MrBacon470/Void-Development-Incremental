import { SentimentIntensityAnalyzer } from 'vader-sentiment';
import wiki from 'wikijs';
import nlp from 'compromise';
import Decimal from './break_eternity.js';
import { heros } from './userdata.js';

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
				return true;
			}
		}
		return false;
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
	const activeConvo = { convoId: convo, users, category, channel, nextMessage: 0, progress: 0, ...extra };
	window.player.activeConvos.push(activeConvo);
	if (typeof conversations[convo].init === 'function') {
		conversations[convo].init.call(activeConvo);
	}
	return activeConvo;
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

		if (nextMessage.type === 'user' || (nextMessage.type === 'player' && nextMessage.optional)) {
			activeConvo.progress += delta;
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

			let delay = nextMessage.delay == null ? 1 : nextMessage.delay;
			if (nextMessage.typingDuration || nextMessage.content) {
				delay += nextMessage.typingDuration || (nextMessage.content.length * .05);
			}
			if (activeConvo.progress >= delay) {
				// Time to show next message
				let user = nextMessage.user;
				if (typeof user === 'function') {
					user = user.call(activeConvo);
				}
				addMessage(activeConvo.category, activeConvo.channel, nextMessage, activeConvo.users[user]);
				activeConvo.progress = 0;
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
	if (window.player.activeChannel.category !== 'DMs' && window.player.activeChannel.channel !== 'Bob') {
		randomTopicProgress += delta / 6;
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
	let { content, first, timestamp, userId, influence, stress, heat, joinMessage } = message;
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
	if (stress) {
		stress = new Decimal(stress);
		window.player.stress = window.player.stress.add(stress);
	}
	const id = window.player.nextMessageId++;
	messages.push({ id, content, first, timestamp, userId, influence, stress, heat, joinMessage });

	// Have chance to start new convo if message wasn't part of existing one
	if (Math.random() < (1 / (window.player.activeConvos.length + 2))) {
		const cleaned = nlp(message.content).match('(@hasQuestionMark|@hasComma|@hasQuote|@hasPeriod|@hasExclamation|@hasEllipses|@hasSemicolon|@hasSlash)').post(' ').trim().parent();
		// TODO parse message for specific topics
		const heatedTopics = cleaned.match('#Heated+').out('array').filter(topic => !window.player.activeConvos.some(c => c.topic === topic));
		if (heatedTopics.length > 0) {
			const topic = heatedTopics[Math.floor(Math.random() * heatedTopics.length)];
			const sentiment = SentimentIntensityAnalyzer.polarity_scores(message.content);
			console.log("Sentiment of '" + message.content + "'' is " + sentiment.compound);
			const heat = 2 - sentiment.compound;
			const activeConvo = startConversation(category, channel, 'heatedArgument', { topic: nlp(topic).match('#Uncountable').found ? topic : nlp(topic).nouns().toPlural().text(), heat });
			wiki()
				.page(topic)
				.then(page => Promise.all([page.content(), page.summary()]))
				.then(([ content, summary ]) => {
					activeConvo.content = content.filter(c => c.content && c.title !== "External links").map(c => c.content.replace(/[^\x20-\x7F]/g, ""));
					activeConvo.summary = nlp(summary).sentences().first(2).text();
					activeConvo.summary = activeConvo.summary.replace(/[^\x20-\x7F]/g, "");
				})
				.catch(console.error);
		} else {
			const nouns = cleaned.nouns().not('(#Plural|#Heated)').out('array');
			if (nouns.length > 0) {
				startConversation(category, channel, Object.keys(genericNounConversations).filter(id => !window.player.activeConvos.some(c => c.convoId === id)), { noun: nouns[Math.floor(Math.random() * nouns.length)] });
			} else {
				console.log("No conversation found for " + message.content);
			}
		}
	}
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
	return convo.message < 0 || convo.nextMessage >= conversations[convo.convoId].messages.length;
}

function addJoinMessage(newUser) {
	addMessage('info', 'welcome', {
        joinMessage: Math.floor(Math.random() * welcomeMessages.length),
        userId: newUser
    });
}

function branchSentiment(convo, index, message, { positive, negative, neutral }) {
	// TODO is vader-sentiment the fastest one available?
	// I chose it over sentiment because that one didn't recognize things like "sure" as positive,
	// and vader claims to support slang and modifiers (e.g. "not good") better. That probably
	// also means its slower though (haven't benchmarked)
	const sentiment = SentimentIntensityAnalyzer.polarity_scores(message.content);
	console.log("Sentiment of '" + message.content + "'' is " + sentiment.compound);
	if (sentiment.compound > 0.05 && positive != null) {
		if (handleResponse(convo, message, positive)) {
			window.player.activeConvos.splice(index, 1);
		}
		return true;
	} else if (sentiment.compound <= -.05 && negative != null) {
		if (handleResponse(convo, message, negative)) {
			window.player.activeConvos.splice(index, 1);
		}
		return true;
	} else if (neutral != null) {
		if (handleResponse(convo, message, neutral)) {
			window.player.activeConvos.splice(index, 1);
		}
		return true;
	}
	return false;
}

function sendPlayerMessage(message) {
	const { category, channel } = window.player.activeChannel;

	// TODO using mentions to "target" responses at specific convos?
	let foundConvo = false;
	window.player.activeConvos.forEach((c, index) => {
		if (foundConvo) return;
		if (c.category !== category || c.channel !== channel) return;
		if (c.topic != null && message.heat) { // heated conversation
			if (nlp(message.content).match(c.topic).found) {
				// Modify heat based on sentiment of message
				// TODO allow other users in the argument to respond to void?
				const sentiment = SentimentIntensityAnalyzer.polarity_scores(message.content);
				console.log("Sentiment of '" + message.content + "'' is " + sentiment.compound);
				c.heat -= sentiment.compound;
			}
		}
		const nextMessage = conversations[c.convoId].messages[c.nextMessage];
		if (nextMessage.type === 'player' && (nextMessage.isValid == null || nextMessage.isValid(c, message))) {
			if (nextMessage.nlpType === 'sentiment') {
				foundConvo = branchSentiment(c, index, message, nextMessage);
			}
			// TODO other types of player response requests, using the "compromise" package
		}
	});

	addMessage(category, channel, message);
}

function getDisplayName(user) {
	return user in heros ? heros[user].username : user;
}

function createArgument(content, extra) {
	return {
		type: 'user',
		user() { return this.nextUser; },
		goto() { return this.goto; },
		run: findNextMessage,
		delay: 0,
		typingDuration() { return conversations[this.convoId].messages[this.nextMessage].content().length * .05 / Math.max(1, this.heat); },
		content,
		...extra
	};
}

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
			users = Object.keys(window.player.users).filter(u => !activeConvo.users.includes(u));
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

// Setup NLP
window.nlp = nlp;
nlp.extend((Doc, world) => {
	world.addTags({
		Heated: {
			isA: 'Noun'
		},
	});
	// Create list of custom words to include as topics, nouncs, etc.
	// See list of tags here: https://observablehq.com/@spencermountain/compromise-tags
	world.addWords({
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
		'd&d': 'Noun',
		religion: ['Heated', 'Singular'],
		christianity: ['Heated', 'Uncountable'],
		systems: ['Heated', 'Plural'],
		guns: ['Heated', 'Plural'],
		abortion: ['Heated', 'Singular'],
		vaccines: ['Heated', 'Plural'],
		marijuana: ['Heated', 'Uncountable'],
		immigration: ['Heated', 'Uncountable'],
		'donald trump': ['Heated', 'LastName'],
		'cancel culture': ['Heated', 'Uncountable']
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

// Random messages to send that might stir up a conversation
// Right now that might happen only if the player responds
// TODO allow these to start topic-related conversations with same chance as player messages
const nothingConversations = [
	'I love shooting guns in my backyard',
	'Lowkey think vaccines are bad',
	'Did anyone else smoke some dank marijuana for 4/20?',
	'Immigration = ???. Discuss.',
	'God I hate Donald Trump, so glad he\'s gone',
	'Cancel culture is the worst',
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
			{ type: 'user', user: 1, content() { return `Pssh, ${this.noun} is so overrated. Get something new to like` }, delay: 2 },
			{ type: 'player', optional: true, delay: 10, isValid: (convo, message) => nlp(message.content).match(convo.noun).found, nlpType: 'sentiment', positive: 3, negative: { goto: 4, influence: -1 }, goto: -1 },
			{ type: 'user', user: 0, content() { return `THANK YOU void, finally someone understands` }, delay: 3, influence: 1, goto: -1 },
			{ type: 'user', user: 0, content() { return `jfc void, come on.` }, delay: 2 },
			{ type: 'user', user: 1, content() { return `lmao get trolled void and ${getDisplayName(this.users[0])}` }, delay: 2 }
		],
		users: [ {}, {} ]
	},
	{
		messages: [
			{ type: 'user', user: 0, content() { return `Hmm, I used to hate ${nlp(this.noun).nouns().toPlural().text()} but then I realized they're actually really easy to like` } }
		],
		users: [ {} ]
	},
	{
		messages: [
			{ type: 'user', user: 0, content() { return `oh man me and ${getDisplayName(this.users[1])} were just discussing this. Right @${getDisplayName(this.users[1])}?` } },
			{ type: 'user', user: 1, content() { return `who pinged me?` }, delay: 20 },
			{ type: 'user', user: 0, content() { return `me. Do you remember us talking about ${this.noun}?` } },
			{ type: 'user', user: 1, content() { return `no lol` } }
		],
		users: [ {}, {} ]
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
	},
	// TODO make arguments support multiple messages to be typed simultaneously
	heatedArgument: {
		init() {
			this.heat = this.heat == null ? this.heat : 2;
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
			createArgument(function() { return `Oh, we're talking about ${this.topic}? I might need to mute this channel ngl`; }, { heat: -1 }),
			createArgument(function() { return `Oh, we're talking about ${this.topic}? I might need to mute this channel ngl`; }, { heat: -1 }),
			createArgument(function() { return `for what it's worth, I personally like ${this.topic} a lot`; }),
			createArgument(function() { return `ugh I can't believe people are actually defending ${this.topic}`; }, { heat: 1 }),
			createArgument(function() { return this.content ? `I looked it up, and apparently "${nlp(this.content[Math.floor(Math.random() * this.content.length)]).sentences().first(3).text()}"` : "Someone should look into this, I don't think any of us know what we're talking about"; }),
			createArgument(function() { return this.content ? `I looked it up, and apparently "${nlp(this.content[Math.floor(Math.random() * this.content.length)]).sentences().first(3).text()}"` : "Someone should look into this, I don't think any of us know what we're talking about"; }),
			createArgument(function() { return this.summary ? `Did y'all know ${nlp(this.summary).first(1).toLowerCase().parent().text()}` : `I really wish I knew more about ${this.topic} lol`; }),
			createArgument(function() { return this.summary ? `Did y'all know ${nlp(this.summary).first(1).toLowerCase().parent().text()}` : `I really wish I knew more about ${this.topic} lol`; }),
			createArgument(function() { return `i like people that like ${this.topic} and i dislike people who dislike ${this.topic}`; }, { heat: -1 }),
			createArgument(function() { return `i dislike people that like ${this.topic} and i like people who dislike ${this.topic}`; }, { heat: -1 }),
			createArgument(function() { return `The more I've thought about it the more I've really liked ${this.topic}`; }),
			createArgument(function() { return `${this.topic} is so bad i'm going to start a rant about how bad it is by pinging everyone`; }, { stress: 1, heat: 1 })
		],
		users: [ {}, {} ]
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
	"Where's [!!{username}!!](usernameOnClick)? In the server!",
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
].map(message => id => message.replaceAll('[!!{username}!!](usernameOnClick)', `<b>${getDisplayName(id)}</b>`));

export { startConversation, updateConversations, sendPlayerMessage, conversations, welcomeMessages, addJoinMessage };
