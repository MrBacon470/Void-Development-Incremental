# Adding New Conversations

## Random messages (defined in [random.js](https://github.com/MrBacon470/Void-Development-Incremental/blob/main/src/conversations/random.js))

Currently these are the easiest to add to, as all of them are just single messages that get randomly chosen from a large array. To add more simply add more elements to the array.

> Note: Eventually that may change to allow random multi-message conversations as well, although the list of single-message conversations will probably still remain, it'll just be one part of the random conversations array

### Example

```js
export const conversations = [
    'convo1',
    'convo2'
]
```

## Generic conversations (defined in [generic.js](https://github.com/MrBacon470/Void-Development-Incremental/blob/main/src/conversations/generic.js))

The conversations are defined at the bottom of the file - an array of objects, where each object is a conversation that can be randomly chosen so long as there are enough users in the server.

The initial state of these conversations will contain a property called `noun` which is the topic this conversation is about.

Each conversation object must have a messages and users properties, and an optional init function:
- `messages` array

	The messages array will contain a list of objects with various properties. These properties may apply to all messages:
	- `type: string` - one of 'player' or 'user', indicating if it's a message that will be automatically sent or a response from the player
	- `run: function` - an optional function that runs when this message is sent, with `this` being the current state of the conversation.
	- `goto: number | function() => number` - by default, the next message in the conversation is the next one in the array. This optional property overrides that behavior to go to the specified index. This can be used to make more complex conversations with loops or branches. Can also be a function that gets called with `this` being the current state of the conversation.
	- `influence: number | string | Decimal | function() => number | string | Decimal` - an amount of influence this message will give or remove
	- `stress: number | string | Decimal | function() => number | string | Decimal` - an amount of stress this message will give or remove
	- `delay: number = 2` - how long to wait for a player response if `optional` is true, or how long before a user waits before starting to type
	- `weight: number | function() => number = 1` - An optional weighting to give certain messages higher or lower priority compared to others. Set to 0 to disable messages completely. This is currently only used to disabled generic conversations that require more users than are currently available.

	These properties may apply to a message of type 'user':
	- `user: number` - if this message will be sent by a user, this is the index of the user speaking this message inside the conversation's users array.
	- `content: string | function() => string` - the text content of the message getting sent. Can also be a function that gets called with `this` being the current state of the conversation.
	- `typingDuration: number | function() => number` - by default the user will type at a rate of 10 characters per second, but this field can override that number by giving the number of seconds the user will take. Can also be a function that gets called with `this` being the current state of the conversation.

	These properties may apply to a message of type 'player':
	- `optional: bool = false` - if set to true, a player response will be automatically skipped after `delay` seconds
	- `isValid: function(conversation, message) => bool` - a function that returns true if the given player message is a valid response to this conversation. If left undefined, any message is assumed valid.
	- `nlpType: string` - one of 'sentiment' (more coming soon?), indicating for a player response how to handle the player response.
		- sentiment: Analyze the positive vs negative sentiment of the player message and respond appropriately based on its classification as either positive, negative, or neutral
	- `positive: response` - if this is a player response message with `nlpType` of sentiment, this is the response to handle the player responding positively
	- `neutral: response` - if this is a player response message with `nlpType` of sentiment, this is the response to handle the player responding neutrally
	- `negative: response` - if this is a player response message with `nlpType` of sentiment, this is the response to handle the player responding negatively

	You may have noticed a couple fields were of type "response". Responses can be either a number, which will act like an object with a `goto` property set to that number, or it can be an object with a subset of message properties: `run`, `goto`, `influence`, and `stress`

- `users` array

	Each item in this array represents one participant in the conversation. It can either be a string, in which case it will use that user (ID of a hero or display name for a non-hero). Otherwise, it can be an object to select a random user

	> Note: At some point I may add support for properties on the random user object to select for specific types of users

- `init` function

	An optional function that runs when a new conversation is started using this object. `this` will refer to the current state of this new conversation.

### Example 1 - A branching conversation

```js
{
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
```

> Note: this is actually the intro conversation rather than a generic conversation. It's still a good demonstration of various concepts generic conversations can apply though

This message has a single (non-player) participant, and it's Bob specifically. The conversation starts with a basic message from Bob asking void to create a discord server. From here the conversation waits on a player response and branches thusly:

- If the player responds positively, the message gains +1 influence and the conversation moves to the message at index 4
- If the player responds neutrally, the conversation moves on to index 2, which has Bob respond and then moves back to index 1 (waiting for the player to respond again)
- If the player responds negatively, the conversation moves on to index 3, which has Bob respond and then moves back to index 1 (waiting for the player to respond again)

While it's a little harder to follow due to the `goto`s, the end result is a conversation that keeps looping until the player responds positively. At that point Bob says 'Yay!', and a function runs that starts a timeout that changes what channel is currently being displayed after 2 seconds (2000 ms).

### Example 2 - Using the `init` function

```js
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
}
```

This example does several things. When it's first started, it will lookup the conversation topic (`this.noun`) on wikipedia, and if it succeeds it will choose a random section or the summary and add it to the conversation state.

The conversation only has a single message, said by user 0. The content field is a function so we can access the current conversation state. In this case we use a ternary to decide on a message based on whether or not wikipedia has given us a result or not. Note the use of template strings to insert the values of `this.noun` and `this.wikiContent` into the message. We also override delay and typing duration to better simulate someone googling something and then copy/pasting, rather than typing it out.

Finally, the users array tells us it will need a single user that can be chosen completely at random.

## Heated arguments (defined in [heated.js](https://github.com/MrBacon470/Void-Development-Incremental/blob/main/src/conversations/heated.js))

Heated arguments are a little different in that there's actually only one conversation, but it's very dynamic and can make the conversation continue indefinitely based on a "heat" value that's stored in the conversation (this starts at 2, and if it hits 0 the argument ends). Each message sent, either by the conversation or otherwise, will impact the heat based on its sentiment - negative messages increase the heat and positive messages lower it. Additionally, a message may have a `heat` property on it to override how much heat it gains/loses. Keep in mind if heat is being increased by a negative sentiment, it will be slightly nerfed so conversations don't continue forever.

Ultimately what this means is that you don't need to add new conversations, and the users array and init function are all already done for you - notably, while they start with 2 users, the users list will expand based on heat, and one of them will actually get replaced by the user that started the argument, unless it was the player.

So let's look at the messages array. What's tricky about this array is that arguments actually have two sides - a "for" and "against". The way this is handled is by making even messages the "pro" messages and the odd ones "against". This also means you need an equal number of for and against messages. In some cases a message may make sense to be said by a user on either side of the argument, in which case you can just duplicate the message twice. Because of this, messages also can't really use the `weight` property because it may put the switch the evenness or oddness of the messages.

Finally, when creating the actual argument messages, there's a lot of data that they need in order for the heated arguments to work. Fortunately, there's a `createArgument` function you can use to fill that all in for you. All you have to do is give it the `content` string or, most likely, function for your message. If you want the message to also have a specific heat, stress, or other value, you can provide those in an optional object as the 2nd argument.

p.s. arguments' states will already have values for `this.topic`, which is the topic being argued, and `this.nextUser` and `this.lastUser` for the current person talking and last person who talked, respectively. Additionally `this.summary` and `this.wikiContent` may contain the summary and content sections for the wikipedia page over `this.topic`, respectively. The user fields may be an id if it's for a user hero, so you can use the utility function `getDisplayName(user)` to get the correct value to display.

### Example 1 - Showing wikipedia content

```js
createArgument(function() { return this.wikiContent ? `I looked up ${this.topic}, and apparently "${this.wikiContent[Math.floor(Math.random() * this.wikiContent.length)]}"` : `Someone should look into ${this.topic}, I don't think any of us know what we're talking about`; })
```

Important to note is that `this.wikiContent` and `this.summary` may not equal anything if wikipedia doesn't have an article for the given topic, or if it hasn't been returned yet. Make sure to provide an alternative message in the event wikipedia data doesn't exist.

Also note that `this.summary` is just the first 2 sentences of the article, and `this.wikiContent` is an array of the first 2 sentences of each section in the article, which has already filtered out sections like 'External links' that don't *really* have displayable content.

### Example 2 - Responding to the last message sender

```js
createArgument(function() { return this.nextUser === this.lastUser ? `Anyone disagree with me on ${this.topic}?` : `Tell us how you really feel about ${this.topic}, ${getDisplayName(this.users[this.lastUser])}`; })
```

This one is fairly straight-forward, just keep in mind sometimes the same person will send a message twice in a row, and it might look weird if they're "responding" to themselves. Also remember to use `getDisplayName` so it handles heroes and non-hero users properly.

### Example 3 - Adding extra data to messages

```js
createArgument(function() { return `${this.topic} is so bad i'm going to start a rant about how bad it is by pinging everyone`; }, { stress: 1 })
```

In this example, this message will increase the stress of the server by 1. Remember by default the conversation's `heat` will be based on the sentiment of the message content, and you can use this extra data object to override that as well.

# Adding heated argument topics

At the top of [generic.js](https://github.com/MrBacon470/Void-Development-Incremental/blob/main/src/conversations/generic.js) our natural language processor is "extended" with an additional "Heated" tag, and a couple words are added with this Heated tag. These words will, for the most part, work with both singular or plural versions of that word, although the program isn't perfect. Giving it the most accurate tags you can will help a lot. You can see a list of most of the tags [here](https://observablehq.com/@spencermountain/compromise-tags). The most important ones, in my opinion, are 'Singular', 'Plural', and 'Uncountable', although 'Organization' and 'Person' may also be useful in certain contexts.

Also, while this game is made in good fun try to avoid topics that are *so* heated that seeing a fake message voicing their support or non-support for said topic can bring genuine frustration to the player.

### Example - Uncountable

```js
christianity: ['Heated', 'Uncountable']
```

Marking Christianity as uncountable means it won't try to look for words like "christianities".

### Example - Singular/Plural

```js
vaccines: ['Heated', 'Plural']
```

Marking vaccines as plural means it will also look for "vaccine".

> Note: The library doing this processing for us isn't perfect.

### Example - Multi-word

```js
'donald trump': ['Heated', 'Person']
```

You can use apostrophes or quotation marks to use multi-word phrases.

# Adding Welcome Messages

Welcome messages are stored in an array called `welcomeMessages` in [welcome.js](https://github.com/MrBacon470/Void-Development-Incremental/blob/main/src/conversations/welcome.js)

### Example

```js
export const welcomeMessages = [
    '[!!{username}!!](usernameOnClick) Welcome :blobwavestill:',
    'Hey where did you come from, [!!{username}!!](usernameOnClick) Just Appeared'
]
```

### Why `[!!{username}!!](usernameOnClick)`?

Some string needs to get used to represent where the username should go, and the original list of discord messages uses that format so we just didn't change it lol.
