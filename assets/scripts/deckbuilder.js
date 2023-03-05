let selectedCard = 0;
let selectedDeck = 0;
let deck = [];

function cardClickListener() {
	$(".cardimg").click(function() {
		// Set the card overlay image to the card that was clicked without the /thumbnail/thumb_ part
		$("#card_overlay_image").attr("src", $(this).attr("src").replace("thumbnail/thumb_", ""));
		// Set selected card to be the card that was clicked by comparing the number within it to the card_db array set numbers and the set name
		selectedCard = card_db.filter(card => card.setNumber == $(this).attr("src").split("_")[3] && card.set == $(this).attr("src").split("_")[5])[0];
		// Update card overlay text to reflect the selected card amount
		$("#card_overlay_amount").text("Amount in Deck: " + deck.filter(card => card.name == selectedCard.name).length);

		// Show the overlay
		$("#card_overlay").show();
		$("#card_overlay").css("opacity", 1);

		// Add click function to close the overlay when the background is clicked
		$("#card_overlay").click(function(event) {
			if (event.target == this) {
				$("#card_overlay").css("opacity", 0);
				setTimeout(function() {
					$("#card_overlay").hide();
				}, 200);
			}
		});
	});
}

// This function is called when the the deckbuilder menu is opened
function deckBuilderInit(x) {
	// Set the selected deck to the selectedDeck variable
	selectedDeck = x;

	// Check if the localstorage for deck_selectedDeck_name exists, if it does, load that name
	if (localStorage.getItem("deck_" + selectedDeck + "_name") != null) {
		// Load the deck name from localstorage
		$("#header_bar_input").val(localStorage.getItem("deck_" + selectedDeck + "_name"));
	} else {
		// Set the deck name to "Deck #" where # is the selected deck
		$("#header_bar_input").val("Deck " + selectedDeck);
	}

	// Check if the localstorage for deck_selectedDeck exists, if it does, load that deck
	if (localStorage.getItem("deck_" + selectedDeck) != null) {
		// Load the deck from localstorage
		deck = JSON.parse(localStorage.getItem("deck_" + selectedDeck));
		changeSaveState(2);
	} else {
		// Create a new deck
		changeSaveState(0);
		deck = [];
	}

	deckBuilder();
	updateDeckList();
}

function deckBuilder() {
	// Check which factions should be shown by checking the filter_bar_factions_checkbox elements
	let factions = [];
	for (let i = 1; i < 7; i++) {
		if (document.getElementById("filter_bar_factions_checkbox_" + i).checked) {
			factions.push(document.getElementById("filter_bar_factions_checkbox_" + i).value);
		}
	}
	
	// Check which types should be shown by checking the filter_bar_types_checkbox elements
	let types = [];
	for (let i = 1; i < 8; i++) {
		if (document.getElementById("filter_bar_types_checkbox_" + i).checked) {
			types.push(document.getElementById("filter_bar_types_checkbox_" + i).value);
		}
	}

	// Check which sets should be shown
	let sets = [];
	for (let i = 1; i < 12; i++) {
		if (document.getElementById("filter_bar_sets_checkbox_" + i).checked) {
			sets.push(document.getElementById("filter_bar_sets_checkbox_" + i).value);
		}
	}
	
	// fully populate factions and types arrays if the search bar checkbox is checked
	if (document.getElementById("search_bar_checkbox").checked) {
		factions = [ "AQUOS", "AURELUS", "DARKUS", "HAOS", "PYRUS", "VENTUS" ];
		types = [ "ACTION", "FLIP", "FLIP HERO", "HERO", "BAKU-GEAR", "GEOGAN", "EVO"  ];
		sets = [ "BB", "BR", "AA", "AV", "FF", "SV", "SG", "GG", "EV", "EV2", "LE" ];
	}

	// Check which cards should be shown by checking the factions, types, and sets arrays
	let cards = [];
	for (let i = 0; i < card_db.length; i++) {
		// Check the cards factions and check if any of them are in the factions array
		let factionCheck = false;
		for (let j = 0; j < card_db[i].faction.length; j++) {
			if (factions.includes(card_db[i].faction[j])) 
				factionCheck = true;
		}
		// Check the cards set and type
		if (factionCheck && types.includes(card_db[i].type) && sets.includes(card_db[i].set)) {
			cards.push(card_db[i]);
		}
	}

	// Remove cards that don't contain the text in the search bar in their name property and is not case sensitive
	let search = document.getElementById("search_bar_input").value;
	for (let i = 0; i < cards.length; i++) {
		if (!cards[i].name.toLowerCase().includes(search.toLowerCase())) {
			cards.splice(i, 1);
			i--;
		}
	}

	// Display the cards. Cards of different sets have different source folder locations
	$("#card_list_cards").empty();
	for (let i = 0; i < cards.length; i++) {
		$("#card_list_cards").append(`<img class=\"cardimg\" src=\"${buildCardPath(cards[i])}" />`);
	}

	cardClickListener();
}

// Code for listing cards currently added to the deck, not allowing more than 3 of a single card. Deck size can also not be greater than 40
function addCardToDeck(card) {
	if (deck.length < 40) {
		let match = deck.find(d => JSON.stringify(d) === JSON.stringify(card));
		if (match) {
			if (deck.filter(x => JSON.stringify(x) == JSON.stringify(card)).length < 3) {
				deck.push(card);
				updateDeckList();
				deckBuilder();
				if (JSON.stringify(deck) == JSON.stringify(JSON.parse(localStorage.getItem("deck_" + selectedDeck))))
					changeSaveState(2);
				else
					changeSaveState(1);
			}
		} else {
			deck.push(card);
			updateDeckList();
			deckBuilder();
			if (JSON.stringify(deck) == JSON.stringify(JSON.parse(localStorage.getItem("deck_" + selectedDeck))))
				changeSaveState(2);
			else
				changeSaveState(1);
		}
	}
}

function removeCardFromDeck(card) {
	let match = deck.find(d => JSON.stringify(d) === JSON.stringify(card));
	if (match) {
		let index = deck.indexOf(match);
    	deck.splice(index, 1);
		updateDeckList();
		deckBuilder();
		if (JSON.stringify(deck) == JSON.stringify(JSON.parse(localStorage.getItem("deck_" + selectedDeck))))
			changeSaveState(2);
		else
			changeSaveState(1);
	}
}

// Sort the deck by their index number in card_db
function sortDeck() {
	deck.sort((a, b) => {
		let aIndex = -1;
		let bIndex = -1;
		card_db.forEach((c, i) => {
			if (a.set === c.set && a.setNumber === c.setNumber) aIndex = i;
			if (b.set === c.set && b.setNumber === c.setNumber) bIndex = i;
		});
		return aIndex - bIndex;
	});
}

// updateDeckList to display the cards in the deck sorted by their setNumber. Duplicate cards should be displayed as one.
function updateDeckList() {
	sortDeck();

	// Display cards, if there are cards with the same setNumber and set from card_db, display them as one.
	$("#builder_deck_list_cards").empty();
	let amountLocationDiv = null;
	for (let i = 0; i < deck.length; i++) {
		// Check if the card is the first card of its setNumber and set
		if (i == 0 || deck[i].name != deck[i - 1].name) {
		// if (i == 0 || (deck[i].setNumber != deck[i - 1].setNumber && deck[i].set != deck[i - 1].set)) {

			// Use different ID for flip cards
			if (deck[i].type == "FLIP") 
				amountLocationDiv = "<div class=\"builder_deck_list_card_amount_flip\">"
			else if (deck[i].type == "BAKU-GEAR") 
				amountLocationDiv = "<div class=\"builder_deck_list_card_amount_gear\">"
			else 
				amountLocationDiv = "<div class=\"builder_deck_list_card_amount\">";

			$("#builder_deck_list_cards").append(
				`<div class=\"builder_deck_list_card\"><img class=\"cardimg\" src=\"${buildCardPath(deck[i])}\" />` +
				amountLocationDiv +
				getCardAmountInDeck(deck[i]) +
				"</div>" +
				"</div>"
			);
		}
	}
	
	// Update the overlay card amount text
	$("#card_overlay_amount").html("Amount in Deck: " + getCardAmountInDeck(selectedCard));

	// Update deck total text
	$("#builder_deck_list_title").html("Deck Total: " + deck.length + ". This deck is " + (isValidDeck(deck) ? "Valid!" : "not Valid."));

	cardClickListener();
}

// Get the amount of a single card in the deck. Make sure it takes into account cards added when the deck is loaded from localstorage
function getCardAmountInDeck(card) {
	let amount = 0;
	for (let i = 0; i < deck.length; i++) {
		if (deck[i].name == card.name) {
			amount++;
		}
	}
	return amount;
}

function changeSaveState(newState) {
	let newColor = "";
	if (newState == 0) 
		newColor = "red";
	if (newState == 1) 
		newColor = "orange";
	if (newState == 2) 
		newColor = "lime";
	$("#header_bar_button_save").css("background-color", newColor);
}

// On page load, check for localStorage of deck_selectedDeck_name. If it exists then set the html element to that value
for (let i = 1; i < 21; i++) {
	if (localStorage.getItem("deck_" + i + "_name") != null) {
		$("#deck_list_button_" + i).html(localStorage.getItem("deck_" + i + "_name"));
	}
}

$('.filtercheckbox').change(function() {
	// code to run every time a checkbox is checked or unchecked
	deckBuilder();
});

$("#search_bar_input").on("input", function() {
	// code to run every time a character is typed
	deckBuilder();
});

// Add click event listener to the add card button to add the selected card to the deck
$("#card_overlay_button_add").click(function() {
	addCardToDeck(selectedCard);
});

// Add click event listener to the remove card button to remove the selected card from the deck
$("#card_overlay_button_remove").click(function() {
	removeCardFromDeck(selectedCard);
});

// Save the deck into localstorage if the save button is clicked
$("#header_bar_button_save").click(function() {
	if (deck.length == 0) {
		localStorage.removeItem("deck_" + selectedDeck );
		changeSaveState(0);
	} else {
		localStorage.setItem("deck_" + selectedDeck, JSON.stringify(deck));
		localStorage.setItem("deck_" + selectedDeck + "_name", $("#header_bar_input").val());
		changeSaveState(2);
	}
});

// Load the deck from local storage if the load button is clicked
$("#header_bar_button_load").click(function() {
	// Check if there is a deck saved in local storage for selected deck. If so, load it, if not, do nothing
	if (localStorage.getItem("deck_" + selectedDeck) != null) {	
		deck = JSON.parse(localStorage.getItem("deck_" + selectedDeck));
		updateDeckList();
		deckBuilder();
		changeSaveState(2);
	}
});

// Clear the deck without deleting local storage
$("#header_bar_button_clear").click(function() {
	deck = [];
	updateDeckList();
	deckBuilder();
	changeSaveState(1);
});

// Clear the deck and delete local storage
$("#header_bar_button_delete").click(function() {
	if(confirm("Are you sure you want to fully delete this deck?")) {
		deck = [];
		updateDeckList();
		deckBuilder();
		localStorage.removeItem("deck_" + selectedDeck );
		localStorage.removeItem("deck_" + selectedDeck + "_name");
		// Set visual text for deck name to default
		$("#deck_list_button_" + selectedDeck).html("Deck " + selectedDeck);
		$("#header_bar_input").val("Deck " + selectedDeck);
		changeSaveState(0);
	}
});

// Open import export menu
$("#header_bar_button_port").click(function() {
	$("#menu_deck_builder").hide();

	//create a string of text consisting of the pattern setnumber setname with no spaces and commas to separate
	let deckString = "";
	for (let i = 0; i < deck.length; i++) {
		deckString += deck[i].setNumber + " " + deck[i].set;
		if (i != deck.length - 1) {
			deckString += ",";
		}
	}

	$("#menu_deck_port_textbox_text").val(deckString);
	$("#menu_deck_port").show();
});

// Save deck from textbox string
$("#menu_deck_port_buttons_save").click(function() {
	const deckString = $("#menu_deck_port_textbox_text").val();
	const deckList = deckString.split(",");

	// Clear current deck
	deck = [];

	// Loop through deck list and add cards to deck array
	for (let i = 0; i < deckList.length; i++) {
		const [setNumber, set] = deckList[i].split(" ");
		const card = card_db.find((c) => c.setNumber === setNumber && c.set === set);
		if (card) {
			deck.push(card);
		}
	}

	updateDeckList();
	deckBuilder();

	//if deck is different from local storage, change save state to orange
	if (JSON.stringify(deck) != localStorage.getItem("deck_" + selectedDeck)) {
		changeSaveState(1);
	} else {
		changeSaveState(2);
	}

	$("#menu_deck_port").hide();
	$("#menu_deck_builder").show();
});

// Copy the deck to clipboard
$("#menu_deck_port_buttons_copy").click(function() {
	const textBox = document.querySelector("#menu_deck_port_textbox_text");
	textBox.select();
	navigator.clipboard.writeText(textBox.value);
});

// paste from clipboard to textbox
$("#menu_deck_port_buttons_paste").click(async function() {
	const textBox = document.querySelector("#menu_deck_port_textbox_text");
	textBox.focus();
	textBox.value = await navigator.clipboard.readText();
});

$("#menu_deck_port_buttons_cancel").click(function() {
	$("#menu_deck_builder").show();
	$("#menu_deck_port").hide();
});

// Update the local storage for deck_selectedDeck_name when the name is changed
$("#header_bar_input").change(function() {
	localStorage.setItem("deck_" + selectedDeck + "_name", $("#header_bar_input").val());
	$("#deck_list_button_" + selectedDeck).html(localStorage.getItem("deck_" + selectedDeck + "_name"));
});