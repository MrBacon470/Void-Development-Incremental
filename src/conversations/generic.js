import nlp from 'compromise';
import { getWikipedia } from './wikipedia.js';
import { getDisplayName, startConversation } from './utils.js';

export function tryStartConversation(category, channel, cleaned) {
	const nouns = cleaned.nouns().not('(#Plural|#Heated|#Uncountable)').out('array');
	if (nouns.length > 0) {
		const convoId = Object.keys(conversations).filter(id => !window.player.activeConvos.some(c => c.convoId === id));
		const noun = nouns[Math.floor(Math.random() * nouns.length)];
		startConversation(category, channel, convoId, convoId.map(c => conversations[c]), { noun });
		return true;
	}
	return false;
}

// Generic conversations that can pop up for any topic
export const conversations = [
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
		init() {
			getWikipedia(this.noun).then(({ content, summary }) => {
				const contents = [...content, summary];
				this.wikiContent = contents[Math.floor(Math.random() * contents.length)];
			});
		},
		messages: [
			{ type: 'user', user: 0, content() { return this.wikiContent ? `I looked up ${this.noun} on wikipedia and you won't believe what it said: ${this.wikiContent}` : `I've actually been meaning to do some research on ${this.noun}` }, delay: 10, typingDuration: 3 }
		],
		users: [ {} ]
	},
	{
		messages: [
			{ type: 'user', user: 0, content() { return `oh man me and ${getDisplayName(this.users[1])} were just discussing ${this.noun}. Right @${getDisplayName(this.users[1])}?` } },
			{ type: 'user', user: 1, content() { return `who pinged me?` }, delay: 20 },
			{ type: 'user', user: 0, content() { return `me. Do you remember us talking about ${this.noun}?` } },
			{ type: 'user', user: 1, content() { return `no lol` } }
		],
		users: [ {}, {} ]
	}
].reduce((acc, curr, index) => {
	acc['generic' + index] = {
		...curr,
		weight() {
			return this.users.length > window.player.sortedUsers.length + Object.keys(window.player.heros).length ? 0 : curr.weight || 1;
		}
	};
	return acc;
}, {});
