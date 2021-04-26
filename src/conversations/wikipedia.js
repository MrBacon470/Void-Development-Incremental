import wiki from 'wikijs';
import nlp from 'compromise';

const ignoredSections = [
	"External links",
	"See also",
	"Further reading"
];

window.wiki = wiki({ apiUrl: "https://en.wikipedia.org/w/api.php" });

export function getWikipedia(page, numSentences = 2) {
	return window.wiki.page(page)
		.then(page => Promise.all([page.content(), page.summary()]))
		.then(([ content, summary ]) => {
			content = content.filter(c => c.content && !ignoredSections.includes(c.title)).map(c => nlp(c.content).sentences().first(numSentences).text());
			summary = nlp(summary).sentences().first(numSentences).text();
			return { content, summary };
		})
		.catch(console.error);
}