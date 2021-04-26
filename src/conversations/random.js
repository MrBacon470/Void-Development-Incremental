import { startConversation, smallChatSlowdown } from './utils.js';

function singleMessage(msg, userConditions) {
	return {
		messages: [ { type: 'user', user: 0, content: msg } ],
		users: [ userConditions || {} ]
	}
}

let randomTopicProgress = 0;
let randomMod = Math.random();

export function update(delta) {
	if (window.player.activeChannel.category !== 'DMs') {
		randomTopicProgress += delta / 30 / smallChatSlowdown();
		if (randomMod < randomTopicProgress / (3 + window.player.activeConvos.length)) {
			randomTopicProgress = 0;
			startConversation("general", "general", Object.keys(conversations), Object.values(conversations));
			randomMod = Math.random();
		}
	}
}

// Random messages to send that might stir up a conversation
export const conversations = [
	'Why do systems have to be so annoying?',
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
	'Why does everyone here hate Javascript?',
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
	'im going to do a P2W Eternal speedrun!',
	'pt is killing di',
	'anyone up for playing among us?',
	'anyone up for playing minecraft?',
	'anyone up for watching me play the perfect tower?',
	'anyone up for watching me play tpt?',
	'anyone up for watching me play di?',
	'anyone up for watching me play stellaris?',
	'anyone up for watching me play binding of isaac?',
	'has anyone here played braid?',
	'has anyone here played limbo?',
	'has anyone here played super meat boy?',
	'has anyone here played terraria?',
	'has anyone here played the beginner\'s guide?',
	'has anyone here watched indie game: the movie?',
	'...!',
	'"Almost never" is an interesting concept'
].reduce((acc, curr, index) => {
	acc['nothing' + index] = typeof curr === 'string' ? singleMessage(curr) : curr;
	return acc;
}, {});
