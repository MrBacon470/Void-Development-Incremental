import nlp from 'compromise';
import { SentimentIntensityAnalyzer } from 'vader-sentiment';

// Setup nlp
window.nlp = nlp;
window.nlp.extend((Doc, world) => {
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
		teleport: 'Verb',
		ngl: 'Acronym',
		pssh: 'Interjection',
	});
});

export function getSentiment(str) {
	// TODO is vader-sentiment the fastest one available?
	// I chose it over sentiment because that one didn't recognize things like "sure" as positive,
	// and vader claims to support slang and modifiers (e.g. "not good") better. That probably
	// also means its slower though (haven't benchmarked)
	const sentiment = SentimentIntensityAnalyzer.polarity_scores(str);
	console.log("Sentiment of '" + str + "' is " + sentiment.compound);
	return sentiment.compound;
}

export function clean(str) {
	return nlp(str.replaceAll(/[>#@]\w*/g, '')).match('(@hasQuestionMark|@hasComma|@hasQuote|@hasPeriod|@hasExclamation|@hasEllipses|@hasSemicolon|@hasSlash)').post(' ').trim().parent();
}

// Runs different functions based on sentiment of a string. If a message is
//  positive or negative but that function isn't defined, it'll run
//  neutral if neutral is defined.
// Returns false if no branch is picked due to functions being not defined
export function branchSentiment(str, { positive, neutral, negative }) {
	const sentiment = getSentiment(str);
	if (sentiment > 0.05 && positive != null) {
		positive();
		return true;
	} else if (sentiment <= -.05 && negative != null) {
		negative();
		return true;
	} else if (neutral != null) {
		neutral();
		return true;
	}
	return false;
}
