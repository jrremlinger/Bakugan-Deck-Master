let valid_deck_list = [];

function checkValidDecks() {
	valid_deck_list = [];

	// Check for local storage deck_(1-20). Add every one that exists to an array.
	for (var i = 1; i <= 20; i++) {
		if (localStorage.getItem("deck_" + i)) {
			let deck = JSON.parse(localStorage.getItem("deck_" + i));
			let name = localStorage.getItem("deck_" + i + "_name");
			valid_deck_list.push({
				deck: deck,
				name: name
			});
		}
	}

	// Make sure deck's have exactly 40 cards
	for (var i = 0; i < valid_deck_list.length; i++) {
		if (valid_deck_list[i].deck.length != 40) {
			valid_deck_list.splice(i, 1);
			i--;
		}
	}

	// Make sure for card.faction only uses at most 3 different factions.
	for(let i = 0; i < valid_deck_list.length; i++) {
		let factions = new Set();
		for (let obj of valid_deck_list[i].deck) {
			for (let faction of obj.faction) {
				factions.add(faction);
			}
		}
	
		valid_deck_list[i].factionList = Array.from(factions);
	
		if(factions.size > 3) {
			valid_deck_list.splice(i, 1);
			i--;
		}
	}

	// Show button for all items in valid_deck_list. Should display name and images based on factionList using jquery
	$("#deck_select").empty();
	for (var i = 0; i < valid_deck_list.length; i++) {
		let str = "<button onclick=\"tryDeck(" + i + ")\"><div><div>" + valid_deck_list[i].name + "</div><div><img class=\"svgImg\" src=\"assets/svg/BBP_" + valid_deck_list[i].factionList[0] + ".svg\" />";

		if(valid_deck_list[i].factionList.length > 1)
			str += "<img class=\"svgImg\" src=\"assets/svg/BBP_" + valid_deck_list[i].factionList[1] + ".svg\" />";
		else {
			str += "<img class=\"svgImg\" src=\"assets/svg/BBP_" + valid_deck_list[i].factionList[0] + ".svg\" />";
			str += "<img class=\"svgImg\" src=\"assets/svg/BBP_" + valid_deck_list[i].factionList[0] + ".svg\" />";
		}
		if(valid_deck_list[i].factionList.length > 2)
			str += "<img class=\"svgImg\" src=\"assets/svg/BBP_" + valid_deck_list[i].factionList[2] + ".svg\" />";
		else if (valid_deck_list[i].factionList.length > 1) {
			str += "<img class=\"svgImg\" src=\"assets/svg/BBP_" + valid_deck_list[i].factionList[1] + ".svg\" />";
		}
		
		str += "</div></div></button>";

		$("#deck_select").append(str);
	}
}

function tryDeck(x) {
	if (isValidDeck(valid_deck_list[x].deck)) {
		$("#deck_select_menu").hide();
		$("#brawl_ui").show();
		brawlInit(valid_deck_list[x]);
		loadedDeck = x;
	}
}