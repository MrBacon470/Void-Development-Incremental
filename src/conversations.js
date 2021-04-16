let activeConvos = []

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
	activeConvos.push({ convo })
}

function getWeight(convo) {
	if (typeof convo.weight === 'function') {
		return Math.max(convo.weight() || 0, 0);
	}
	return Math.max(convo.weight || 0, 0);
}

function updateConversations() {
    /*
    for (let activeConvo in activeConvos) {

    }
    */
}

function addMessage(category, channel, message) {
	let messages = window.player.categories[category].channels[channel].messages;
	message.first = messages.length === 0 ||
					messages[messages.length - 1].userId !== message.userId ||
					// separate messages if they're 7 minutes apart
					message.timestamp - messages[messages.length - 1].timestamp > 7 * 60 * 1000;
	messages.push(message);
}

export { startConversation, updateConversations, addMessage };
