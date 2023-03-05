function isValidDeck(deck) {
	let flag = true;

	// Make sure deck's have exactly 40 cards
	if (deck.length != 40) {
		flag = false;
	}

	// Make sure for card.faction only uses at most 3 different factions.
	let factions = new Set();
	for (let obj of deck) {
		for (let faction of obj.faction) {
			factions.add(faction);
		}
	}

	if(factions.size > 3) {
		flag = false;
	}

	// Make sure deck has no more than 3 copies of a single card
	let cardCounts = {};
	for (let card of deck) {
		let cardString = JSON.stringify(card);
		if (cardCounts[cardString]) {
			cardCounts[cardString]++;
		} else {
			cardCounts[cardString] = 1;
		}
	}

	for (let count of Object.values(cardCounts)) {
		if (count > 3) {
			flag = false;
			break;
		}
	}

	return flag;
}