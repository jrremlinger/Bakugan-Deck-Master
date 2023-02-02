let hand = [];
let batch = [];
let heros = [];
let enemyHeros = [];
let discard = [];
let expandedCard = null;
let expandedCharacter = null;
let characters = [];
let selectedCharacter = null;
let amountFromDeck = 0;
let revealedCards = [];
let damageTaken = 0;
let flippedCards = [];

function brawlInit(x) {
	// UI fix
	$("#brawl_deck_total").css("min-width", $(".brawl_cardimg").width() + "px");
	$("#brawl_deck_total").css("padding-top", $(".brawl_cardimg").height() / 3.1 + "px");
	$(".faction_container").css("top", $(".brawl_character_1").height() / 4.3 + "px");	// Possible not needed

	// load a copy of activedeck
	activeDeck = JSON.parse(JSON.stringify(x));

	batch = [];
	discard = [];
	heros = [];
	expandedCard = null;
	expandedCharacter = null;
	enemyHeros = [];
	selectedCharacter = null;
	amountFromDeck = 0;
	revealedCards = [];
	damageTaken = 0;
	flippedCards = [];
	
	$("#energy_current").html("0");
	$("#energy_total").html("0");

	shuffleDeck();

	hand = activeDeck.deck.slice(0, 6);
	
	//  remove cards from deck
	activeDeck.deck.splice(0, 6);

	// Character setup
	characters = [
		{
			"faction": factionFlatten(activeDeck)[0],
			"evo": null,
			"gear1": null,
			"gear2": null,
		},
		{
			"faction": factionFlatten(activeDeck)[1],
			"evo": null,
			"gear1": null,
			"gear2": null,
		},
		{
			"faction": factionFlatten(activeDeck)[2],
			"evo": null,
			"gear1": null,
			"gear2": null,
		},
	];

	// Set character faction icons
	$("#faction_1").attr("src", "assets/svg/BBP_" + characters[0].faction + ".svg");
	$("#faction_2").attr("src", "assets/svg/BBP_" + characters[1].faction + ".svg");
	$("#faction_3").attr("src", "assets/svg/BBP_" + characters[2].faction + ".svg");

	updateUI();
}

function factionFlatten(x) {
	let factionsFlat = [ x.factionList[0] ];

	if(x.factionList.length > 1)
		factionsFlat.push(x.factionList[1]);
	else {
		factionsFlat.push(x.factionList[0]);
		factionsFlat.push(x.factionList[0]);
	}
	if(x.factionList.length > 2)
		factionsFlat.push(x.factionList[2]);
	else if (x.factionList.length > 1) {
		factionsFlat.push(x.factionList[1]);
	}

	return factionsFlat;
}

function shuffleDeck() {
    for (let i = activeDeck.deck.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [activeDeck.deck[i], activeDeck.deck[j]] = [activeDeck.deck[j], activeDeck.deck[i]];
    }
}

function updateUI() {
	// Update deck size
	$("#brawl_deck_total").text(activeDeck.deck.length);

	sortHand();

	// Update hand
	$("#brawl_hand_column").empty();
	for(let i = 0; i < hand.length; i++) {
		$("#brawl_hand_column").append(
			`<img class=\"brawl_cardimg hand_expandable\" src=\"${buildCardPath(hand[i])}" />`
		);
	}

	// Update heros
	$("#brawl_hero_column").empty();
	if (heros.length > 0) {
		for(let i = 0; i < heros.length; i++) {
			$("#brawl_hero_column").append(
				`<img class="brawl_cardimg hero_expandable${enemyHeros.includes(i) ? " enemy_hero" : ""}" src=\"${buildCardPath(heros[i])}" />`
			);
		}
	} else {
		$("#brawl_hero_column").append(
			`<img class="brawl_cardimg" src=\"assets/cards/Hero.png" />`
		);
	}

	// Update batch
	$("#brawl_batch").empty();
	if (batch.length > 0) {
		for(let i = 0; i < batch.length; i++) {
			$("#brawl_batch").append(
				`<img class="brawl_cardimg batch_expandable" src=\"${buildCardPath(batch[i])}" />`
			);
		}
	} else {
		$("#brawl_batch").append(
			`<img class="brawl_cardimg" src=\"assets/cards/Batch.png" />`
		);
	}

	// if character gear 2 is not empty, but gear 1 is, swap them
	for(let i = 0; i < characters.length; i++) {
		if (characters[i].gear2 != null && characters[i].gear1 == null) {
			characters[i].gear1 = characters[i].gear2;
			characters[i].gear2 = null;
		}
	}

	// Update characters
	for(let i = 0; i < characters.length; i++) {
		if (characters[i].evo == null) {
			$(`#character${i+1} .brawl_character_1`).attr("src", "assets/cards/BBPCC-Dark.png");
			$(`#character${i+1} .faction_container`).show();
		} else {
			$(`#character${i+1} .brawl_character_1`).attr("src", buildCardPath(characters[i].evo));
			$(`#character${i+1} .faction_container`).hide();
		}
		if (characters[i].gear1 == null)
			$(`#character${i+1} .brawl_character_2`).hide();
		else {
			$(`#character${i+1} .brawl_character_2`).show();
			$(`#character${i+1} .brawl_character_2`).attr("src", buildCardPath(characters[i].gear1));
		}
		if (characters[i].gear2 == null)
			$(`#character${i+1} .brawl_character_3`).hide();
		else {
			$(`#character${i+1} .brawl_character_3`).show();
			$(`#character${i+1} .brawl_character_3`).attr("src", buildCardPath(characters[i].gear2));
		}
	}

	// Make discard pile show highest index of discard array
	if (discard.length > 0)
		$("#brawl_discard").attr("src", buildCardPath(discard[discard.length - 1]));
	else
		$("#brawl_discard").attr("src", "assets/cards/Discard.png");

	// Create click listeners
	createListeners();
}

function createListeners() {
	$(".hand_expandable").click(function() {
		// get the clicked card  based on the index of the clicked element and comparing it to the hand
		expandedCard = $(this).index("#brawl_hand_column > *");

		setOverlayButtons(0);

		// Set the card overlay image to the card that was clicked without the /thumbnail/thumb_ part
		$("#brawl_overlay_image").attr("src", buildCardPath(hand[expandedCard], true));

		// Show the overlay
		$("#brawl_overlay").show();
		$("#brawl_overlay").css("opacity", 1);

		// Add click function to close the overlay when the background is clicked
		$("#brawl_overlay").click(function(event) {
			if (event.target == this) {
				hideOverlay()
			}
		});
	});

	$(".hero_expandable").click(function() {
		expandedCard = $(this).index("#brawl_hero_column > *");
		setOverlayButtons(12);

		$("#brawl_overlay_image").removeClass("enemy_hero")
		if (enemyHeros.includes(expandedCard))
			$("#brawl_overlay_image").addClass("enemy_hero");
			

		$("#brawl_overlay_image").attr("src", buildCardPath(heros[expandedCard], true));
		$("#brawl_overlay").show();
		$("#brawl_overlay").css("opacity", 1);

		$("#brawl_overlay").click(function(event) {
			if (event.target == this) {
				hideOverlay()
			}
		});
	});

	$(".batch_expandable").click(function() {
		expandedCard = $(this).index("#brawl_batch > *");
		setOverlayButtons(13);

		$("#brawl_overlay_image").attr("src", buildCardPath(batch[expandedCard], true));
		$("#brawl_overlay").show();
		$("#brawl_overlay").css("opacity", 1);

		$("#brawl_overlay").click(function(event) {
			if (event.target == this) {
				hideOverlay()
			}
		});
	});
}

function setOverlayButtons(x = 0) {
	if (x == 28)
		amountFromDeck = $("#deck_amnt_input").val();
	$("#brawl_overlay_buttons").empty();

	switch (x) {
		case 0: // Card in hand
			if (hand[expandedCard].type == "ACTION" || hand[expandedCard].type == "GEOGAN") {
				$("#brawl_overlay_buttons").append(
					"<button onclick=\"setOverlayButtons(1)\">Use</button>"
				);
			} else if (hand[expandedCard].type == "HERO") {
				$("#brawl_overlay_buttons").append(
					"<button onclick=\"setOverlayButtons(3)\">Play Hero</button>"
				);
			} else if (hand[expandedCard].type == "BAKU-GEAR") {
				$("#brawl_overlay_buttons").append(
					"<button onclick=\"setOverlayButtons(4)\">Attach Baku-Gear</button>"
				);
			} else if (hand[expandedCard].type == "EVO") {
				$("#brawl_overlay_buttons").append(
					"<button onclick=\"setOverlayButtons(8)\">Play Evo</button>"
				);
			}
			$("#brawl_overlay_buttons").append(
				"<button onclick=\"revealFromHand()\">Reveal</button>"
			);
			$("#brawl_overlay_buttons").append(
				"<button onclick=\"setOverlayButtons(15)\">Send to Deck</button>"
			);
			$("#brawl_overlay_buttons").append(
				"<button onclick=\"setOverlayButtons(2)\">Energize</button>"
			);
			$("#brawl_overlay_buttons").append(
				"<button onclick=\"discardFromHand()\">Discard</button>"
			);
			break;
		case 1: // Play action from hand
			// Append DOM elements to allow user to enter a number for energy cost, then button to continue, or hit back button
			$("#brawl_overlay_buttons").append(`
				<div style=\"display: flex; align-items: center;\">
					<span style=\"color: white;\">Cost: </span>
					<input type=\"number\" id=\"energy_cost\" min=\"0\" max="${parseInt($("#energy_current").html()) * 10}" value=\"0\">
					<div style="white-space: nowrap; color: white;">(${$("#energy_current").html()} Available)</div>
				</div>`
			);
			$("#brawl_overlay_buttons").append(`
				<button onclick=\"actionFromHand()\">Use</button>
				<button onclick=\"setOverlayButtons(0)\">Back</button>`
			);

			energyCostEvent();
			break;
		case 2: // Energize card in hand
			$("#brawl_overlay_buttons").append(`
				<button onclick=\"energizeFromHand(1)\">Energize\nCharged</button>
				<button onclick=\"energizeFromHand(0)\">Energize\nUncharged</button>
				<button onclick=\"setOverlayButtons(0)\">Back</button>`
			);
			break;
		case 3: // Play hero from hand
			$("#brawl_overlay_buttons").append(`
				<div style=\"display: flex; align-items: center;\">
					<span style=\"color: white;\">Cost: </span>
					<input type=\"number\" id=\"energy_cost\" min=\"0\" max="${parseInt($("#energy_current").html()) * 10}" value=\"0\">
					<div style="white-space: nowrap; color: white;">(${$("#energy_current").html()} Available)</div>
				</div>`
			);
			$("#brawl_overlay_buttons").append(`
				<button onclick=\"heroFromHand()\">Play Hero</button>
				<button onclick=\"setOverlayButtons(0)\">Back</button>`
			);

			energyCostEvent();
			break;
		case 4: // Play Gear from hand
			$("#brawl_overlay_buttons").append(`
				<div style="display: flex; align-items: center; color: white;">Choose a Character: </div>`
			);

			$("#brawl_overlay_buttons").append(`
				<button onclick="setOverlayButtons(5);">Character 1 <img style="height: 20px;" src="assets/svg/BBP_${characters[0].faction}.svg" /></button>
				<button onclick="setOverlayButtons(6);">Character 2 <img style="height: 20px;" src="assets/svg/BBP_${characters[1].faction}.svg" /></button>
				<button onclick="setOverlayButtons(7);">Character 3 <img style="height: 20px;" src="assets/svg/BBP_${characters[2].faction}.svg" /></button>
			`);

			$("#brawl_overlay_buttons").append(`
				<button onclick="setOverlayButtons(0)">Back</button>`
			);
			break;
		case 5: // Gear menu 2
			$("#brawl_overlay_buttons").append(`
				<div style=\"display: flex; align-items: center;\">
					<span style=\"color: white;\">Cost: </span>
					<input type=\"number\" id=\"energy_cost\" min=\"0\" max="${parseInt($("#energy_current").html()) * 10}" value=\"0\">
					<div style="white-space: nowrap; color: white;">(${$("#energy_current").html()} Available)</div>
				</div>`
			);

			$("#brawl_overlay_buttons").append(`
				<button onclick=\"gearFromHand(0, 0)\">Baku-Gear (${characters[0].gear1 ? characters[0].gear1.name.replace(/\(.*/, "").trim() : "Empty"})</button>
			`);

			if (characters[0].gear1) {
				$("#brawl_overlay_buttons").append(`
					<button onclick=\"gearFromHand(0, 1)\">Dual-Gear (${characters[0].gear2 ? characters[0].gear2.name.replace(/\(.*/, "").trim() : "Empty"})</button>
				`);
			}

			$("#brawl_overlay_buttons").append(`
				<button onclick="setOverlayButtons(4)">Back</button>`
			);
			energyCostEvent();
			break;
		case 6: // Gear menu 3
			$("#brawl_overlay_buttons").append(`
				<div style=\"display: flex; align-items: center;\">
					<span style=\"color: white;\">Cost: </span>
					<input type=\"number\" id=\"energy_cost\" min=\"0\" max="${parseInt($("#energy_current").html()) * 10}" value=\"0\">
					<div style="white-space: nowrap; color: white;">(${$("#energy_current").html()} Available)</div>
				</div>`
			);

			$("#brawl_overlay_buttons").append(`
				<button onclick=\"gearFromHand(1, 0)\">Baku-Gear (${characters[1].gear1 ? characters[1].gear1.name.replace(/\(.*/, "").trim() : "Empty"})</button>
			`);

			if (characters[1].gear1) {
				$("#brawl_overlay_buttons").append(`
					<button onclick=\"gearFromHand(1, 1)\">Dual-Gear (${characters[1].gear2 ? characters[1].gear2.name.replace(/\(.*/, "").trim() : "Empty"})</button>
				`);
			}

			$("#brawl_overlay_buttons").append(`
				<button onclick="setOverlayButtons(4)">Back</button>`
			);
			energyCostEvent();
			break;
		case 7: // Gear menu 4
			$("#brawl_overlay_buttons").append(`
				<div style=\"display: flex; align-items: center;\">
					<span style=\"color: white;\">Cost: </span>
					<input type=\"number\" id=\"energy_cost\" min=\"0\" max="${parseInt($("#energy_current").html()) * 10}" value=\"0\">
					<div style="white-space: nowrap; color: white;">(${$("#energy_current").html()} Available)</div>
				</div>`
			);

			$("#brawl_overlay_buttons").append(`
				<button onclick=\"gearFromHand(2, 0)\">Baku-Gear (${characters[2].gear1 ? characters[2].gear1.name.replace(/\(.*/, "").trim() : "Empty"})</button>
			`);

			if (characters[2].gear1) {
				$("#brawl_overlay_buttons").append(`
					<button onclick=\"gearFromHand(2, 1)\">Dual-Gear (${characters[2].gear2 ? characters[2].gear2.name.replace(/\(.*/, "").trim() : "Empty"})</button>
				`);
			}

			$("#brawl_overlay_buttons").append(`
				<button onclick="setOverlayButtons(4)">Back</button>`
			);
			energyCostEvent();
			break;
		case 8: // Play Evo from hand
			$("#brawl_overlay_buttons").append(`
				<div style="display: flex; align-items: center; color: white;">Choose a valid Character: </div>`
			);

			if (characters[0].faction == hand[expandedCard].faction) 
				$("#brawl_overlay_buttons").append(`<button onclick="setOverlayButtons(9);">Character 1 <img style="height: 20px;" src="assets/svg/BBP_${characters[0].faction}.svg" /></button>`);
			else if (characters[1].faction == hand[expandedCard].faction)
				$("#brawl_overlay_buttons").append(`<button onclick="setOverlayButtons(10);">Character 2 <img style="height: 20px;" src="assets/svg/BBP_${characters[1].faction}.svg" /></button>`);
			else if (characters[2].faction == hand[expandedCard].faction)
				$("#brawl_overlay_buttons").append(`<button onclick="setOverlayButtons(11);">Character 3 <img style="height: 20px;" src="assets/svg/BBP_${characters[2].faction}.svg" /></button>`);

			$("#brawl_overlay_buttons").append(`
				<button onclick="setOverlayButtons(0)">Back</button>`
			);
			break;
		case 9: // Evo menu 2
			$("#brawl_overlay_buttons").append(`
				<div style=\"display: flex; align-items: center;\">
					<span style=\"color: white;\">Cost: </span>
					<input type=\"number\" id=\"energy_cost\" min=\"0\" max="${parseInt($("#energy_current").html()) * 10}" value=\"0\">
					<div style="white-space: nowrap; color: white;">(${$("#energy_current").html()} Available)</div>
				</div>`
			);

			$("#brawl_overlay_buttons").append(`
				<button onclick=\"evoFromHand(0)\">Evolve (${characters[0].evo ? characters[0].evo.name.replace(/\(.*/, "").trim() : "Empty"})</button>
			`);

			$("#brawl_overlay_buttons").append(`
				<button onclick="setOverlayButtons(8)">Back</button>`
			);
			energyCostEvent();
			break;
		case 10: // Evo menu 3
			$("#brawl_overlay_buttons").append(`
				<div style=\"display: flex; align-items: center;\">
					<span style=\"color: white;\">Cost: </span>
					<input type=\"number\" id=\"energy_cost\" min=\"0\" max="${parseInt($("#energy_current").html()) * 10}" value=\"0\">
					<div style="white-space: nowrap; color: white;">(${$("#energy_current").html()} Available)</div>
				</div>`
			);

			$("#brawl_overlay_buttons").append(`
				<button onclick=\"evoFromHand(1)\">Evolve (${characters[1].evo ? characters[1].evo.name.replace(/\(.*/, "").trim() : "Empty"})</button>
			`);

			$("#brawl_overlay_buttons").append(`
				<button onclick="setOverlayButtons(8)">Back</button>`
			);
			energyCostEvent();
			break;
		case 11: // Evo menu 4
			$("#brawl_overlay_buttons").append(`
				<div style=\"display: flex; align-items: center;\">
					<span style=\"color: white;\">Cost: </span>
					<input type=\"number\" id=\"energy_cost\" min=\"0\" max="${parseInt($("#energy_current").html()) * 10}" value=\"0\">
					<div style="white-space: nowrap; color: white;">(${$("#energy_current").html()} Available)</div>
				</div>`
			);

			$("#brawl_overlay_buttons").append(`
				<button onclick=\"evoFromHand(2)\">Evolve (${characters[2].evo ? characters[2].evo.name.replace(/\(.*/, "").trim() : "Empty"})</button>
			`);

			$("#brawl_overlay_buttons").append(`
				<button onclick="setOverlayButtons(8)">Back</button>`
			);
			energyCostEvent();
			break;
		case 12: // Active Hero
			$("#brawl_overlay_buttons").append(
				"<button onclick=\"toggleControl()\">Toggle Enemy Control</button>"
			);
			$("#brawl_overlay_buttons").append(
				"<button onclick=\"handFromHero()\">Send to Hand</button>"
			);
			$("#brawl_overlay_buttons").append(
				"<button onclick=\"setOverlayButtons(17)\">Energize</button>"
			);
			$("#brawl_overlay_buttons").append(
				"<button onclick=\"discardHero()\">Destroy</button>"
			);
			break;
		case 13: // Batch actions
			$("#brawl_overlay_buttons").append(
				"<button onclick=\"handFromBatch()\">Send to Hand</button>"
			);
			$("#brawl_overlay_buttons").append(
				"<button onclick=\"setOverlayButtons(14)\">Send to Deck</button>"
			);
			$("#brawl_overlay_buttons").append(
				"<button onclick=\"setOverlayButtons(16)\">Energize</button>"
			);
			$("#brawl_overlay_buttons").append(
				"<button onclick=\"discardFromBatch()\">Discard</button>"
			);
			break;
		case 14: // Batch send deck
			$("#brawl_overlay_buttons").append(
				"<button onclick=\"deckFromBatch(1)\">Top of Deck</button>"
			);
			$("#brawl_overlay_buttons").append(
				"<button onclick=\"deckFromBatch()\">Bottom of Deck</button>"
			);
			$("#brawl_overlay_buttons").append(
				"<button onclick=\"deckFromBatch(3)\">Shuffle</button>"
			);
			$("#brawl_overlay_buttons").append(`
				<button onclick="setOverlayButtons(13)">Back</button>`
			);
			break;
		case 15: // Hand send deck
			$("#brawl_overlay_buttons").append(
				"<button onclick=\"deckFromHand(1)\">Top of Deck</button>"
			);
			$("#brawl_overlay_buttons").append(
				"<button onclick=\"deckFromHand()\">Bottom of Deck</button>"
			);
			$("#brawl_overlay_buttons").append(
				"<button onclick=\"deckFromHand(3)\">Shuffle</button>"
			);
			$("#brawl_overlay_buttons").append(`
				<button onclick="setOverlayButtons(0)">Back</button>`
			);
			break;
		case 16: // Energize card from batch
			$("#brawl_overlay_buttons").append(`
				<button onclick=\"energizeFromBatch(1)\">Energize\nCharged</button>
				<button onclick=\"energizeFromBatch(0)\">Energize\nUncharged</button>
				<button onclick=\"setOverlayButtons(13)\">Back</button>`
			);
			break;
		case 17: // Energize card from hero
			$("#brawl_overlay_buttons").append(`
				<button onclick=\"energizeFromHero(1)\">Energize\nCharged</button>
				<button onclick=\"energizeFromHero(0)\">Energize\nUncharged</button>
				<button onclick=\"setOverlayButtons(12)\">Back</button>`
			);
			break;
		case 18: // Character evo menu
			$("#brawl_overlay_buttons").append(`
				<div style="color: white;">${characters[expandedCharacter].evo.name.replace(/\(.*/, "").trim()}</div>
				<button onclick=\"handFromCharacter()\">Send to Hand</button>
				<button onclick=\"setOverlayButtons(49)\">Energize</button>
				<button onclick=\"discardFromCharacter()\">Destroy Evo</button>
			`);
			break;
		case 19: // Character gear menu
			$("#brawl_overlay_buttons").append(`
				<div style="color: white;">${characters[expandedCharacter].gear1.name.replace(/\(.*/, "").trim()}</div>
				<button onclick=\"handFromCharacter(1)\">Send to Hand</button>
				<button onclick=\"setOverlayButtons(50)\">Energize</button>
				<button onclick=\"discardFromCharacter(1)\">Destroy Baku-Gear</button>
			`);
			break;
		case 20: // Character dual-gear menu
			$("#brawl_overlay_buttons").append(`
				<div style="color: white;">${characters[expandedCharacter].gear2.name.replace(/\(.*/, "").trim()}</div>
				<button onclick=\"handFromCharacter(2)\">Send to Hand</button>
				<button onclick=\"setOverlayButtons(51)\">Energize</button>
				<button onclick=\"discardFromCharacter(2)\">Destroy Dual-Gear</button>
			`);
			break;
		case 21: // Discard pile menu
			expandedCard = discard.length - 1;
			$("#brawl_overlay_image").attr("src", buildCardPath(discard[expandedCard], true));
		
			$("#brawl_overlay_buttons").append(`
				<button onclick="searchDiscard()">Search</button>
				<button onclick="discardChangeSelected()">Top Card</button>
				<button onclick="discardChangeSelected(1)">Choose Random</button>
			`);
			break;
		case 22: // Discard card menu
			if (discard[expandedCard].type == "ACTION" || discard[expandedCard].type == "GEOGAN") {
				$("#brawl_overlay_buttons").append(
					"<button onclick=\"setOverlayButtons(23)\">Use</button>"
				);
			} else if (discard[expandedCard].type == "HERO") {
				$("#brawl_overlay_buttons").append(
					"<button onclick=\"setOverlayButtons(23)\">Play Hero</button>"
				);
			} else if (discard[expandedCard].type == "BAKU-GEAR") {
				$("#brawl_overlay_buttons").append(
					"<button onclick=\"setOverlayButtons(24)\">Attach Baku-Gear</button>"
				);
			} else if (discard[expandedCard].type == "EVO") {
				$("#brawl_overlay_buttons").append(
					"<button onclick=\"setOverlayButtons(24)\">Play Evo</button>"
				);
			}

			$("#brawl_overlay_buttons").append(`
				<button onclick="handFromDiscard()">Send to Hand</button>
				<button onclick="setOverlayButtons(25)">Send to Deck</button>
				<button onclick="setOverlayButtons(26)">Energize</button>
				<button onclick="setOverlayButtons(21)">Back</button>
			`);
			break;
		case 23: // Use from Discard
			$("#brawl_overlay_buttons").append(`
				<div style=\"display: flex; align-items: center;\">
					<span style=\"color: white;\">Cost: </span>
					<input type=\"number\" id=\"energy_cost\" min=\"0\" max="${parseInt($("#energy_current").html()) * 10}" value=\"0\">
					<div style="white-space: nowrap; color: white;">(${$("#energy_current").html()} Available)</div>
				</div>`
			);

			if (discard[expandedCard].type == "ACTION" || discard[expandedCard].type == "GEOGAN") {
				$("#brawl_overlay_buttons").append(
					"<button onclick=\"playFromDiscard()\">Use</button>"
				);
			} else if (discard[expandedCard].type == "HERO") {
				$("#brawl_overlay_buttons").append(`
					<button onclick=\"playFromDiscard()\">Play Hero</button>`
				);
			} else if (discard[expandedCard].type == "BAKU-GEAR") {
				$("#brawl_overlay_buttons").append(`
					<button onclick=\"playFromDiscard()\">Baku-Gear (${characters[selectedCharacter].gear1 ? characters[selectedCharacter].gear1.name.replace(/\(.*/, "").trim() : "Empty"})</button>
				`);

				if (characters[selectedCharacter].gear1) {
					$("#brawl_overlay_buttons").append(`
						<button onclick=\"playFromDiscard(1)\">Dual-Gear (${characters[selectedCharacter].gear2 ? characters[selectedCharacter].gear2.name.replace(/\(.*/, "").trim() : "Empty"})</button>
					`);
				}
			} else if (discard[expandedCard].type == "EVO") {
				$("#brawl_overlay_buttons").append(`
					<button onclick=\"playFromDiscard()\">Evolve (${characters[selectedCharacter].evo ? characters[selectedCharacter].evo.name.replace(/\(.*/, "").trim() : "Empty"})</button>
				`);
			}
			
			$("#brawl_overlay_buttons").append(`
				<button onclick=\"setOverlayButtons(22)\">Back</button>`
			);

			energyCostEvent();
			break;
		case 24: // Discard character select
			$("#brawl_overlay_buttons").append(`
				<div style="display: flex; align-items: center; color: white;">Choose a Character: </div>`
			);
			if ((characters[0].faction == discard[expandedCard].faction && discard[expandedCard].type == "EVO") || discard[expandedCard].type == "BAKU-GEAR") {
				$("#brawl_overlay_buttons").append(`
					<button onclick="selectedCharacter = 0; setOverlayButtons(23);">Character 1 <img style="height: 20px;" src="assets/svg/BBP_${characters[0].faction}.svg" /></button>
				`);
			} 
			if ((characters[1].faction == discard[expandedCard].faction && discard[expandedCard].type == "EVO") || discard[expandedCard].type == "BAKU-GEAR") {
				$("#brawl_overlay_buttons").append(`
					<button onclick="selectedCharacter = 1; setOverlayButtons(23);">Character 2 <img style="height: 20px;" src="assets/svg/BBP_${characters[1].faction}.svg" /></button>
				`);
			}
			if ((characters[2].faction == discard[expandedCard].faction && discard[expandedCard].type == "EVO") || discard[expandedCard].type == "BAKU-GEAR") {
				$("#brawl_overlay_buttons").append(`
					<button onclick="selectedCharacter = 2; setOverlayButtons(23);">Character 3 <img style="height: 20px;" src="assets/svg/BBP_${characters[2].faction}.svg" /></button>
				`);
			}

			$("#brawl_overlay_buttons").append(`
				<button onclick="setOverlayButtons(22)">Back</button>`
			);
			break;
		case 25: // Discard to deck options
			$("#brawl_overlay_buttons").append(`
				<button onclick="deckFromDiscard(1)">Top of Deck</button>
				<button onclick="deckFromDiscard()">Bottom of Deck</button>
				<button onclick="deckFromDiscard(3)">Shuffle</button>
				<button onclick="setOverlayButtons(22)">Back</button>
			`);
			break;
		case 26: // Discard to energy
			$("#brawl_overlay_buttons").append(`
				<button onclick=\"energizeFromDiscard(1)\">Energize\nCharged</button>
				<button onclick=\"energizeFromDiscard(0)\">Energize\nUncharged</button>
				<button onclick=\"setOverlayButtons(22)\">Back</button>
			`);
			break;
		case 27: // Deck menu
			if (activeDeck.deck.length > 0) {
				damageTaken = 0;
				flippedCards = [];
				$("#brawl_overlay_image").hide();
				$("#brawl_overlay_buttons").append(`
					<div style="color: white;">Target all cards: </div>
					<button onclick="setOverlayButtons(30);">Damage Menu</button>
					<button onclick="setBackBehaviour(0);searchDeck();">Search Deck</button>
					<button onclick="shuffleDeck(); hideOverlay();">Shuffle</button>
					<div style="display: flex">
						<div style="color: white;">Target top </div>
						<input type="number" id="deck_amnt_input" min="0" max="${activeDeck.deck.length}" value="1">
						<div style="color: white;"> cards</div>
					</div>
					<button onclick="drawFromDeck()">Draw</button>
					<button onclick="revealFromDeck();">Reveal</button>
					<button onclick="setOverlayButtons(28);">Energize</button>
					<button onclick="discardFromDeck();">Discard</button>
				`);
				deckAmountEvent();
			} else
				hideOverlay();
			break;
		case 28: // Energize deck
			$("#brawl_overlay_buttons").append(`
				<button onclick="energizeFromDeck(1)">Energize\nCharged</button>
				<button onclick="energizeFromDeck(0)">Energize\nUncharged</button>
				<button onclick="setOverlayButtons(27)">Back</button>
			`);
			break;
		case 29: // Deck search to hand
			$("#brawl_overlay_buttons").append(`
				<button onclick="drawFromDeck(${expandedCard})">Send to Hand</button>
				<button onclick="searchDeck()">Back</button>
			`);
			break;
		case 30: // Damage menu
			expandedCard = discard.length - 1;
			if (discard.length > 0) 
				$("#brawl_overlay_image").attr("src", buildCardPath(discard[expandedCard], true));
			else
				$("#brawl_overlay_image").attr("src", "assets/cards/Discard.png");
			$("#brawl_overlay_image").show();
			$("#brawl_overlay_buttons").append(`
				<div style="color: white;">Remaining cards: ${activeDeck.deck.length}</div>
				<div style="color: white;">Damage Taken: ${damageTaken}</div>
				<button onclick="takeDamage();">Flip Card</button>
			`);
			if (flippedCards.length > 0) {
				$("#brawl_overlay_buttons").append(`
					<button onclick="setBackBehaviour(1);searchDeck(1);">View Flipped Cards</button>
					<button onclick="setOverlayButtons(31);">Interact Flipped Card</button>
				`);
			}
			$("#brawl_overlay_buttons").append(`
				<button onclick="setOverlayButtons(27);">Back</button>
			`);
			break;
		case 31: // Flipped card options
			if (discard[expandedCard].type == "ACTION" || discard[expandedCard].type == "GEOGAN" || discard[expandedCard].type == "FLIP" ) {
				$("#brawl_overlay_buttons").append(
					"<button onclick=\"setOverlayButtons(32)\">Use</button>"
				);
			} else if (discard[expandedCard].type == "HERO" || discard[expandedCard].type == "FLIP HERO") {
				$("#brawl_overlay_buttons").append(
					"<button onclick=\"setOverlayButtons(32)\">Play Hero</button>"
				);
			} else if (discard[expandedCard].type == "BAKU-GEAR") {
				$("#brawl_overlay_buttons").append(
					"<button onclick=\"setOverlayButtons(33)\">Attach Baku-Gear</button>"
				);
			} else if (discard[expandedCard].type == "EVO") {
				$("#brawl_overlay_buttons").append(
					"<button onclick=\"setOverlayButtons(33)\">Play Evo</button>"
				);
			}

			$("#brawl_overlay_buttons").append(`
				<button onclick="handFromFlip()">Send to Hand</button>
				<button onclick="setOverlayButtons(34)">Energize</button>
				<button onclick="setOverlayButtons(30)">Back</button>
			`);
			break;
		case 32: // Use flipped card
			$("#brawl_overlay_buttons").append(`
				<div style=\"display: flex; align-items: center;\">
					<span style=\"color: white;\">Cost: </span>
					<input type=\"number\" id=\"energy_cost\" min=\"0\" max="${parseInt($("#energy_current").html()) * 10}" value=\"0\">
					<div style="white-space: nowrap; color: white;">(${$("#energy_current").html()} Available)</div>
				</div>`
			);

			if (discard[expandedCard].type == "ACTION" || discard[expandedCard].type == "GEOGAN" || discard[expandedCard].type == "FLIP") {
				$("#brawl_overlay_buttons").append(
					"<button onclick=\"playFromDiscard(0, 1)\">Use</button>"
				);
			} else if (discard[expandedCard].type == "HERO" || discard[expandedCard].type == "FLIP HERO") {
				$("#brawl_overlay_buttons").append(`
					<button onclick=\"playFromDiscard(0, 1)\">Play Hero</button>`
				);
			} else if (discard[expandedCard].type == "BAKU-GEAR") {
				$("#brawl_overlay_buttons").append(`
					<button onclick=\"playFromDiscard(0, 1)\">Baku-Gear (${characters[selectedCharacter].gear1 ? characters[selectedCharacter].gear1.name.replace(/\(.*/, "").trim() : "Empty"})</button>
				`);

				if (characters[selectedCharacter].gear1) {
					$("#brawl_overlay_buttons").append(`
						<button onclick=\"playFromDiscard(1, 1)\">Dual-Gear (${characters[selectedCharacter].gear2 ? characters[selectedCharacter].gear2.name.replace(/\(.*/, "").trim() : "Empty"})</button>
					`);
				}
			} else if (discard[expandedCard].type == "EVO") {
				$("#brawl_overlay_buttons").append(`
					<button onclick=\"playFromDiscard(0, 1)\">Evolve (${characters[selectedCharacter].evo ? characters[selectedCharacter].evo.name.replace(/\(.*/, "").trim() : "Empty"})</button>
				`);
			}
			
			$("#brawl_overlay_buttons").append(`
				<button onclick=\"setOverlayButtons(31)\">Back</button>`
			);

			energyCostEvent();
			break;
		case 33: // Flipped card character select
			$("#brawl_overlay_buttons").append(`
				<div style="display: flex; align-items: center; color: white;">Choose a Character: </div>`
			);
			if ((characters[0].faction == discard[expandedCard].faction && discard[expandedCard].type == "EVO") || discard[expandedCard].type == "BAKU-GEAR") {
				$("#brawl_overlay_buttons").append(`
					<button onclick="selectedCharacter = 0; setOverlayButtons(32);">Character 1 <img style="height: 20px;" src="assets/svg/BBP_${characters[0].faction}.svg" /></button>
				`);
			} 
			if ((characters[1].faction == discard[expandedCard].faction && discard[expandedCard].type == "EVO") || discard[expandedCard].type == "BAKU-GEAR") {
				$("#brawl_overlay_buttons").append(`
					<button onclick="selectedCharacter = 1; setOverlayButtons(32);">Character 2 <img style="height: 20px;" src="assets/svg/BBP_${characters[1].faction}.svg" /></button>
				`);
			}
			if ((characters[2].faction == discard[expandedCard].faction && discard[expandedCard].type == "EVO") || discard[expandedCard].type == "BAKU-GEAR") {
				$("#brawl_overlay_buttons").append(`
					<button onclick="selectedCharacter = 2; setOverlayButtons(32);">Character 3 <img style="height: 20px;" src="assets/svg/BBP_${characters[2].faction}.svg" /></button>
				`);
			}

			$("#brawl_overlay_buttons").append(`
				<button onclick="setOverlayButtons(31)">Back</button>`
			);
			break;
		case 34: // Energize flipped card
			$("#brawl_overlay_buttons").append(`
				<button onclick=\"energizeFromDiscard(1, 1)\">Energize\nCharged</button>
				<button onclick=\"energizeFromDiscard(0, 1)\">Energize\nUncharged</button>
				<button onclick=\"setOverlayButtons(31)\">Back</button>
			`);
			break;
		case 35: // Flip search menu
			expandedCard = flippedCards[expandedCard];

			if (discard[expandedCard].type == "ACTION" || discard[expandedCard].type == "GEOGAN") {
				$("#brawl_overlay_buttons").append(
					"<button onclick=\"setOverlayButtons(36)\">Use</button>"
				);
			} else if (discard[expandedCard].type == "HERO" || discard[expandedCard].type == "FLIP HERO") {
				$("#brawl_overlay_buttons").append(
					"<button onclick=\"setOverlayButtons(36)\">Play Hero</button>"
				);
			} else if (discard[expandedCard].type == "BAKU-GEAR") {
				$("#brawl_overlay_buttons").append(
					"<button onclick=\"setOverlayButtons(37)\">Attach Baku-Gear</button>"
				);
			} else if (discard[expandedCard].type == "EVO") {
				$("#brawl_overlay_buttons").append(
					"<button onclick=\"setOverlayButtons(37)\">Play Evo</button>"
				);
			}

			$("#brawl_overlay_buttons").append(`
				<button onclick="handFromFlip()">Send to Hand</button>
				<button onclick="setOverlayButtons(38)">Energize</button>
				<button onclick="searchDeck(1)">Back</button>
			`);
			break;
		case 36: // Use flipped card from search menu
			$("#brawl_overlay_buttons").append(`
				<div style=\"display: flex; align-items: center;\">
					<span style=\"color: white;\">Cost: </span>
					<input type=\"number\" id=\"energy_cost\" min=\"0\" max="${parseInt($("#energy_current").html()) * 10}" value=\"0\">
					<div style="white-space: nowrap; color: white;">(${$("#energy_current").html()} Available)</div>
				</div>`
			);

			if (discard[expandedCard].type == "ACTION" || discard[expandedCard].type == "GEOGAN") {
				$("#brawl_overlay_buttons").append(
					"<button onclick=\"playFromDiscard(0, 1)\">Use</button>"
				);
			} else if (discard[expandedCard].type == "HERO" || discard[expandedCard].type == "FLIP HERO") {
				$("#brawl_overlay_buttons").append(`
					<button onclick=\"playFromDiscard(0, 1)\">Play Hero</button>`
				);
			} else if (discard[expandedCard].type == "BAKU-GEAR") {
				$("#brawl_overlay_buttons").append(`
					<button onclick=\"playFromDiscard(0, 1)\">Baku-Gear (${characters[selectedCharacter].gear1 ? characters[selectedCharacter].gear1.name.replace(/\(.*/, "").trim() : "Empty"})</button>
				`);

				if (characters[selectedCharacter].gear1) {
					$("#brawl_overlay_buttons").append(`
						<button onclick=\"playFromDiscard(1, 1)\">Dual-Gear (${characters[selectedCharacter].gear2 ? characters[selectedCharacter].gear2.name.replace(/\(.*/, "").trim() : "Empty"})</button>
					`);
				}
			} else if (discard[expandedCard].type == "EVO") {
				$("#brawl_overlay_buttons").append(`
					<button onclick=\"playFromDiscard(0, 1)\">Evolve (${characters[selectedCharacter].evo ? characters[selectedCharacter].evo.name.replace(/\(.*/, "").trim() : "Empty"})</button>
				`);
			}
			
			$("#brawl_overlay_buttons").append(`
				<button onclick=\"setOverlayButtons(35)\">Back</button>`
			);

			energyCostEvent();
			break;
		case 37: // Flipped card character select
			$("#brawl_overlay_buttons").append(`
				<div style="display: flex; align-items: center; color: white;">Choose a Character: </div>`
			);
			if ((characters[0].faction == discard[expandedCard].faction && discard[expandedCard].type == "EVO") || discard[expandedCard].type == "BAKU-GEAR") {
				$("#brawl_overlay_buttons").append(`
					<button onclick="selectedCharacter = 0; setOverlayButtons(36);">Character 1 <img style="height: 20px;" src="assets/svg/BBP_${characters[0].faction}.svg" /></button>
				`);
			} 
			if ((characters[1].faction == discard[expandedCard].faction && discard[expandedCard].type == "EVO") || discard[expandedCard].type == "BAKU-GEAR") {
				$("#brawl_overlay_buttons").append(`
					<button onclick="selectedCharacter = 1; setOverlayButtons(36);">Character 2 <img style="height: 20px;" src="assets/svg/BBP_${characters[1].faction}.svg" /></button>
				`);
			}
			if ((characters[2].faction == discard[expandedCard].faction && discard[expandedCard].type == "EVO") || discard[expandedCard].type == "BAKU-GEAR") {
				$("#brawl_overlay_buttons").append(`
					<button onclick="selectedCharacter = 2; setOverlayButtons(36);">Character 3 <img style="height: 20px;" src="assets/svg/BBP_${characters[2].faction}.svg" /></button>
				`);
			}

			$("#brawl_overlay_buttons").append(`
				<button onclick="setOverlayButtons(35)">Back</button>`
			);
			break;
		case 38: // Energize flipped card
			$("#brawl_overlay_buttons").append(`
				<button onclick=\"energizeFromDiscard(1, 1)\">Energize\nCharged</button>
				<button onclick=\"energizeFromDiscard(0, 1)\">Energize\nUncharged</button>
				<button onclick=\"setOverlayButtons(35)\">Back</button>
			`);
			break;
		case 39: // Revealed single card options
			$("#brawl_overlay_image").show();
			if (activeDeck.deck[expandedCard].type == "ACTION" || activeDeck.deck[expandedCard].type == "GEOGAN") {
				$("#brawl_overlay_buttons").append(
					"<button onclick=\"setOverlayButtons(40)\">Use</button>"
				);
			} else if (activeDeck.deck[expandedCard].type == "HERO") {
				$("#brawl_overlay_buttons").append(
					"<button onclick=\"setOverlayButtons(40)\">Play Hero</button>"
				);
			} else if (activeDeck.deck[expandedCard].type == "BAKU-GEAR") {
				$("#brawl_overlay_buttons").append(
					"<button onclick=\"setOverlayButtons(41)\">Attach Baku-Gear</button>"
				);
			} else if (activeDeck.deck[expandedCard].type == "EVO") {
				$("#brawl_overlay_buttons").append(
					"<button onclick=\"setOverlayButtons(41)\">Play Evo</button>"
				);
			}

			$("#brawl_overlay_buttons").append(`
				<button onclick="drawFromDeck(${expandedCard});">Send to Hand</button>
				<button onclick="setOverlayButtons(43);">Return to Deck</button>
				<button onclick="setOverlayButtons(42);">Energize</button>
				<button onclick="discardFromDeck(${expandedCard});">Discard</button>
				<button onclick="setOverlayButtons(27)">Back</button>
			`);
			break;
		case 40: // Use single revealed card
			$("#brawl_overlay_buttons").append(`
				<div style=\"display: flex; align-items: center;\">
					<span style=\"color: white;\">Cost: </span>
					<input type=\"number\" id=\"energy_cost\" min=\"0\" max="${parseInt($("#energy_current").html()) * 10}" value=\"0\">
					<div style="white-space: nowrap; color: white;">(${$("#energy_current").html()} Available)</div>
				</div>`
			);

			if (activeDeck.deck[expandedCard].type == "ACTION" || activeDeck.deck[expandedCard].type == "GEOGAN") {
				$("#brawl_overlay_buttons").append(
					"<button onclick=\"playFromDeck()\">Use</button>"
				);
			} else if (activeDeck.deck[expandedCard].type == "HERO") {
				$("#brawl_overlay_buttons").append(`
					<button onclick=\"playFromDeck()\">Play Hero</button>`
				);
			} else if (activeDeck.deck[expandedCard].type == "BAKU-GEAR") {
				$("#brawl_overlay_buttons").append(`
					<button onclick=\"playFromDeck()\">Baku-Gear (${characters[selectedCharacter].gear1 ? characters[selectedCharacter].gear1.name.replace(/\(.*/, "").trim() : "Empty"})</button>
				`);

				if (characters[selectedCharacter].gear1) {
					$("#brawl_overlay_buttons").append(`
						<button onclick=\"playFromDeck(1)\">Dual-Gear (${characters[selectedCharacter].gear2 ? characters[selectedCharacter].gear2.name.replace(/\(.*/, "").trim() : "Empty"})</button>
					`);
				}
			} else if (activeDeck.deck[expandedCard].type == "EVO") {
				$("#brawl_overlay_buttons").append(`
					<button onclick=\"playFromDeck()\">Evolve (${characters[selectedCharacter].evo ? characters[selectedCharacter].evo.name.replace(/\(.*/, "").trim() : "Empty"})</button>
				`);
			}
			
			$("#brawl_overlay_buttons").append(`
				<button onclick=\"setOverlayButtons(39)\">Back</button>`
			);

			energyCostEvent();
			break;
		case 41: // Character select for single revealed card
			$("#brawl_overlay_buttons").append(`
				<div style="display: flex; align-items: center; color: white;">Choose a Character: </div>`
			);
			if ((characters[0].faction == activeDeck.deck[expandedCard].faction && activeDeck.deck[expandedCard].type == "EVO") || activeDeck.deck[expandedCard].type == "BAKU-GEAR") {
				$("#brawl_overlay_buttons").append(`
					<button onclick="selectedCharacter = 0; setOverlayButtons(40);">Character 1 <img style="height: 20px;" src="assets/svg/BBP_${characters[0].faction}.svg" /></button>
				`);
			} 
			if ((characters[1].faction == activeDeck.deck[expandedCard].faction && activeDeck.deck[expandedCard].type == "EVO") || activeDeck.deck[expandedCard].type == "BAKU-GEAR") {
				$("#brawl_overlay_buttons").append(`
					<button onclick="selectedCharacter = 1; setOverlayButtons(40);">Character 2 <img style="height: 20px;" src="assets/svg/BBP_${characters[1].faction}.svg" /></button>
				`);
			}
			if ((characters[2].faction == activeDeck.deck[expandedCard].faction && activeDeck.deck[expandedCard].type == "EVO") || activeDeck.deck[expandedCard].type == "BAKU-GEAR") {
				$("#brawl_overlay_buttons").append(`
					<button onclick="selectedCharacter = 2; setOverlayButtons(40);">Character 3 <img style="height: 20px;" src="assets/svg/BBP_${characters[2].faction}.svg" /></button>
				`);
			}

			$("#brawl_overlay_buttons").append(`
				<button onclick="setOverlayButtons(39)">Back</button>`
			);
			break;
		case 42: // energize single revealed card
			$("#brawl_overlay_buttons").append(`
				<button onclick=\"energizeFromDeck(1)\">Energize\nCharged</button>
				<button onclick=\"energizeFromDeck(0)\">Energize\nUncharged</button>
				<button onclick=\"setOverlayButtons(39)\">Back</button>
			`);
			break;
		case 43: // Return to deck single revealed card
			$("#brawl_overlay_buttons").append(`
				<button onclick="deckFromSingleReveal(1)">Top of Deck</button>
				<button onclick="deckFromSingleReveal()">Bottom of Deck</button>
				<button onclick="deckFromSingleReveal(3)">Shuffle</button>
				<button onclick="setOverlayButtons(39)">Back</button>
			`);
			break;
		case 44: // card menu from revealed cards
			if (revealedCards[expandedCard].type == "ACTION" || revealedCards[expandedCard].type == "GEOGAN") {
				$("#brawl_overlay_buttons").append(
					"<button onclick=\"setOverlayButtons(45)\">Use</button>"
				);
			} else if (revealedCards[expandedCard].type == "HERO") {
				$("#brawl_overlay_buttons").append(
					"<button onclick=\"setOverlayButtons(45)\">Play Hero</button>"
				);
			} else if (revealedCards[expandedCard].type == "BAKU-GEAR") {
				$("#brawl_overlay_buttons").append(
					"<button onclick=\"setOverlayButtons(46)\">Attach Baku-Gear</button>"
				);
			} else if (revealedCards[expandedCard].type == "EVO") {
				$("#brawl_overlay_buttons").append(
					"<button onclick=\"setOverlayButtons(46)\">Play Evo</button>"
				);
			}

			$("#brawl_overlay_buttons").append(`
				<button onclick="handFromRevealed()">Send to Hand</button>
				<button onclick="setOverlayButtons(47)">Return to Deck</button>
				<button onclick="setOverlayButtons(48)">Energize</button>
				<button onclick="exitExpandedReveal();">Back</button>
			`);
			break;
		case 45: // use revealed card
			$("#brawl_overlay_buttons").append(`
				<div style=\"display: flex; align-items: center;\">
					<span style=\"color: white;\">Cost: </span>
					<input type=\"number\" id=\"energy_cost\" min=\"0\" max="${parseInt($("#energy_current").html()) * 10}" value=\"0\">
					<div style="white-space: nowrap; color: white;">(${$("#energy_current").html()} Available)</div>
				</div>`
			);

			if (revealedCards[expandedCard].type == "ACTION" || revealedCards[expandedCard].type == "GEOGAN") {
				$("#brawl_overlay_buttons").append(
					"<button onclick=\"playFromRevealed()\">Use</button>"
				);
			} else if (revealedCards[expandedCard].type == "HERO") {
				$("#brawl_overlay_buttons").append(`
					<button onclick=\"playFromRevealed()\">Play Hero</button>`
				);
			} else if (revealedCards[expandedCard].type == "BAKU-GEAR") {
				$("#brawl_overlay_buttons").append(`
					<button onclick=\"playFromRevealed()\">Baku-Gear (${characters[selectedCharacter].gear1 ? characters[selectedCharacter].gear1.name.replace(/\(.*/, "").trim() : "Empty"})</button>
				`);

				if (characters[selectedCharacter].gear1) {
					$("#brawl_overlay_buttons").append(`
						<button onclick=\"playFromRevealed(1)\">Dual-Gear (${characters[selectedCharacter].gear2 ? characters[selectedCharacter].gear2.name.replace(/\(.*/, "").trim() : "Empty"})</button>
					`);
				}
			} else if (revealedCards[expandedCard].type == "EVO") {
				$("#brawl_overlay_buttons").append(`
					<button onclick=\"playFromRevealed()\">Evolve (${characters[selectedCharacter].evo ? characters[selectedCharacter].evo.name.replace(/\(.*/, "").trim() : "Empty"})</button>
				`);
			}

			$("#brawl_overlay_buttons").append(`
				<button onclick="setOverlayButtons(44)">Back</button>
			`);
			break;
		case 46: // Character menu from revealed cards
			$("#brawl_overlay_buttons").append(`
				<div style="display: flex; align-items: center; color: white;">Choose a Character: </div>`
			);
			if ((characters[0].faction == revealedCards[expandedCard].faction && revealedCards[expandedCard].type == "EVO") || revealedCards[expandedCard].type == "BAKU-GEAR") {
				$("#brawl_overlay_buttons").append(`
					<button onclick="selectedCharacter = 0; setOverlayButtons(45);">Character 1 <img style="height: 20px;" src="assets/svg/BBP_${characters[0].faction}.svg" /></button>
				`);
			} 
			if ((characters[1].faction == revealedCards[expandedCard].faction && revealedCards[expandedCard].type == "EVO") || revealedCards[expandedCard].type == "BAKU-GEAR") {
				$("#brawl_overlay_buttons").append(`
					<button onclick="selectedCharacter = 1; setOverlayButtons(45);">Character 2 <img style="height: 20px;" src="assets/svg/BBP_${characters[1].faction}.svg" /></button>
				`);
			}
			if ((characters[2].faction == revealedCards[expandedCard].faction && revealedCards[expandedCard].type == "EVO") || revealedCards[expandedCard].type == "BAKU-GEAR") {
				$("#brawl_overlay_buttons").append(`
					<button onclick="selectedCharacter = 2; setOverlayButtons(45);">Character 3 <img style="height: 20px;" src="assets/svg/BBP_${characters[2].faction}.svg" /></button>
				`);
			}
			$("#brawl_overlay_buttons").append(`
				<button onclick="setOverlayButtons(44)">Back</button>
			`);
			break;
		case 47: // Deck menu from revealed cards
			$("#brawl_overlay_buttons").append(`
				<button onclick="deckFromReveal(1)">Top of Deck</button>
				<button onclick="deckFromReveal()">Bottom of Deck</button>
				<button onclick="deckFromReveal(3)">Shuffle</button>
				<button onclick="setOverlayButtons(44)">Back</button>
			`);
			break;
		case 48: // Energize menu from revealed cards
			$("#brawl_overlay_buttons").append(`
				<button onclick=\"energizeRevealed(1)\">Energize\nCharged</button>
				<button onclick=\"energizeRevealed(0)\">Energize\nUncharged</button>
				<button onclick="setOverlayButtons(44)">Back</button>
			`);
			break;
		case 49: // Character evo energize menu
			$("#brawl_overlay_buttons").append(`
				<button onclick=\"energizeFromCharacter(0, 1)\">Energize\nCharged</button>
				<button onclick=\"energizeFromCharacter(0, 0)\">Energize\nUncharged</button>
				<button onclick="setOverlayButtons(18)">Back</button>
			`);
			break;
		case 50: // Character gear energize menu
			$("#brawl_overlay_buttons").append(`
				<button onclick=\"energizeFromCharacter(1, 1)\">Energize\nCharged</button>
				<button onclick=\"energizeFromCharacter(1, 0)\">Energize\nUncharged</button>
				<button onclick="setOverlayButtons(19)">Back</button>
			`);
			break;
		case 51: // Character dual-gear energize menu
			$("#brawl_overlay_buttons").append(`
				<button onclick=\"energizeFromCharacter(2, 1)\">Energize\nCharged</button>
				<button onclick=\"energizeFromCharacter(2, 0)\">Energize\nUncharged</button>
				<button onclick="setOverlayButtons(20)">Back</button>
			`);
			break;
	}
}

function deckFromReveal(x = 0) {
	$("#brawl_overlay_buttons").children("button").prop("disabled", true);

	if (x == 0)
		activeDeck.deck.unshift(revealedCards[expandedCard]);
	else if (x == 1)
		activeDeck.deck.push(revealedCards[expandedCard]);
	else if (x == 3) {
		activeDeck.deck.push(revealedCards[expandedCard]);
		shuffleDeck();
	}

	revealedCards.splice(expandedCard, 1);
	updateUI();
	updateRevealedCards();
	startDragEvents();
	exitExpandedReveal();
	$("#brawl_overlay_buttons").children("button").prop("disabled", false);
}

function playFromRevealed(x = 0) {
	$("#brawl_overlay_buttons").children("button").prop("disabled", true);

	manageEnergy(4, parseInt($("#energy_cost").val()));

	if (revealedCards[expandedCard].type == "ACTION" || revealedCards[expandedCard].type == "GEOGAN")
		batch.push(revealedCards[expandedCard]);
	else if (revealedCards[expandedCard].type == "HERO")
		heros.push(revealedCards[expandedCard]);
	else if (revealedCards[expandedCard].type == "BAKU-GEAR") {
		if (x == 0) {
			if (characters[selectedCharacter].gear1) {
				discard.push(characters[selectedCharacter].gear1);
			}
			characters[selectedCharacter].gear1 = revealedCards[expandedCard];
		}
		else if (x == 1) {
			if (characters[selectedCharacter].gear2)
				discard.push(characters[selectedCharacter].gear2);
			characters[selectedCharacter].gear2 = revealedCards[expandedCard];
		}
	}
	else if (revealedCards[expandedCard].type == "EVO") {
		if (characters[selectedCharacter].evo)
			discard.push(characters[selectedCharacter].evo);
		characters[selectedCharacter].evo = revealedCards[expandedCard];
	}

	revealedCards.splice(expandedCard, 1);
	updateUI();
	updateRevealedCards();
	startDragEvents();
	exitExpandedReveal();
	$("#brawl_overlay_buttons").children("button").prop("disabled", false);
}

function energizeRevealed(charged) {
	$("#brawl_overlay_buttons").children("button").prop("disabled", true);
	manageEnergy(2);
		if (charged) 
			manageEnergy(0);

	revealedCards.splice(expandedCard, 1);
	updateUI();
	updateRevealedCards();
	startDragEvents();
	exitExpandedReveal();
	$("#brawl_overlay_buttons").children("button").prop("disabled", false);
}

function handFromRevealed() {
	$("#brawl_overlay_buttons").children("button").prop("disabled", true);

	hand.push(revealedCards[expandedCard]);
	revealedCards.splice(expandedCard, 1);
	updateUI();
	updateRevealedCards();
	startDragEvents();
	exitExpandedReveal();
	
	$("#brawl_overlay_buttons").children("button").prop("disabled", false);
}

function revealOverlay() {
	$("#brawl_overlay_buttons").children("button").prop("disabled", true);

	
	amountFromDeck = parseInt($("#deck_amnt_input").val());
	$("#reveal_overlay_title").html(`Re-Order Cards (Bottom to Top)`);
	
	revealedCards = [];
	for (var i = 0; i < amountFromDeck; i++) {
		revealedCards.push(activeDeck.deck.pop());
	}

	revealedCards.reverse();

	$("#reveal_overlay").show();
	$("#brawl_overlay_image").hide();
	$("#brawl_overlay_buttons").hide();
	
	updateRevealedCards()
	startDragEvents();
}

function startDragEvents() {
	var startX, endX;
	var threshold = 100;
	var minDistance = 20;

	$('.card_drag').on('mousedown touchstart', function(e) {
		startX = (e.type === 'mousedown') ? e.clientX : e.originalEvent.touches[0].clientX;
	});

	$('.card_drag').on('mouseup touchend', function(e) {
		endX = (e.type === 'mouseup') ? e.clientX : e.originalEvent.changedTouches[0].clientX;
		var swipeDistance = endX - startX;
		if (Math.abs(swipeDistance) < threshold && Math.abs(swipeDistance) > minDistance) {
			var cardIndex = $(this).index();
			var swipeDirection = (swipeDistance > 0) ? 'right' : 'left';
			if (swipeDirection === 'left' && cardIndex > 0) {
				// swap the card with the one to its left in the array
				var temp = revealedCards[cardIndex - 1];
				revealedCards[cardIndex - 1] = revealedCards[cardIndex];
				revealedCards[cardIndex] = temp;
				// update the order of the cards in the HTML
				$('.card_drag').off('touchstart');
				$('.card_drag').off('touchend');
				updateRevealedCards();
				startDragEvents();
			} else if (swipeDirection === 'right' && cardIndex < revealedCards.length - 1) {
				// swap the card with the one to its right in the array
				var temp = revealedCards[cardIndex + 1];
				revealedCards[cardIndex + 1] = revealedCards[cardIndex];
				revealedCards[cardIndex] = temp;
				// update the order of the cards in the HTML
				$('.card_drag').off('touchstart');
				$('.card_drag').off('touchend');
				updateRevealedCards();
				startDragEvents();
			}
		}
	});
}

function updateRevealedCards() {
	//append picture of all cards into discard overlay
	$("#reveal_overlay_cards").empty();
	for (var i = 0; i < revealedCards.length; i++) {
		$("#reveal_overlay_cards").append(`
			<img class="card_drag" onclick="expandRevealedCard(${i})" src=\"${buildCardPath(revealedCards[i])}" />
		`);
	}
}

function exitExpandedReveal() {
	$("#reveal_overlay").show();
	$("#brawl_overlay_image").hide();
	$("#brawl_overlay_buttons").hide();
}

function expandRevealedCard(x) {
	expandedCard = x;
	$("#reveal_overlay").hide();
	$("#brawl_overlay_image").attr("src", buildCardPath(revealedCards[expandedCard], true));
	$("#brawl_overlay_image").show();
	setOverlayButtons(44);
	$("#brawl_overlay_buttons").show();
}

function exitReveal() {
	if (revealedCards.length > 0) {
		for (var i = 0; i < revealedCards.length; i++) {
			activeDeck.deck.push(revealedCards[i]);
		}
		revealedCards = [];
	}

	setOverlayButtons(27);

	$("#reveal_overlay").hide();
	$("#brawl_overlay_buttons").show();
	$("#brawl_overlay_buttons").children("button").prop("disabled", false);
}

function deckFromSingleReveal(pos) {
	$("#brawl_overlay_buttons").children("button").prop("disabled", true);
	let tempCard = activeDeck.deck.splice(expandedCard, 1)[0];

	// add card to deck
	if (pos == 1) {
		activeDeck.deck.push(tempCard);
	} else if (!pos) {
		activeDeck.deck.unshift(tempCard);
	} else {
		// push card to deck then shuffle
		activeDeck.deck.push(tempCard);
		shuffleDeck();
	}

	hideOverlay();
}

function revealFromDeck() {
	amountFromDeck = parseInt($("#deck_amnt_input").val());
	if (amountFromDeck == 1) {
		expandedCard = activeDeck.deck.length - 1;
		$("#brawl_overlay_image").attr("src", buildCardPath(activeDeck.deck[expandedCard]));
		setOverlayButtons(39);
	} else {
		revealOverlay();
	}
}

function playFromDeck(x = 0) {
	$("#brawl_overlay_buttons").children("button").prop("disabled", true);

	manageEnergy(4, parseInt($("#energy_cost").val()));

	if (activeDeck.deck[expandedCard].type == "ACTION" || activeDeck.deck[expandedCard].type == "GEOGAN")
		batch.push(activeDeck.deck[expandedCard]);
	else if (activeDeck.deck[expandedCard].type == "HERO")
		heros.push(activeDeck.deck[expandedCard]);
	else if (activeDeck.deck[expandedCard].type == "BAKU-GEAR") {
		if (x == 0) {
			if (characters[selectedCharacter].gear1) {
				discard.push(characters[selectedCharacter].gear1);
			}
			characters[selectedCharacter].gear1 = activeDeck.deck[expandedCard];
		}
		else if (x == 1) {
			if (characters[selectedCharacter].gear2)
				discard.push(characters[selectedCharacter].gear2);
			characters[selectedCharacter].gear2 = activeDeck.deck[expandedCard];
		}
	}
	else if (activeDeck.deck[expandedCard].type == "EVO") {
		if (characters[selectedCharacter].evo)
			discard.push(characters[selectedCharacter].evo);
		characters[selectedCharacter].evo = activeDeck.deck[expandedCard];
	}
	
	activeDeck.deck.splice(expandedCard, 1);

	hideOverlay();
}

function setBackBehaviour(x = 0) {
	if (x == 0)
		$("#deck_overlay_menu button").attr("onclick", "setOverlayButtons(27);exitDeckSearch();");
	else
		$("#deck_overlay_menu button").attr("onclick", "setOverlayButtons(30);exitDeckSearch();");
}

function handFromFlip() {
	flippedCards.pop();
	hand.push(discard[expandedCard]);
	discard.splice(expandedCard, 1);

	setOverlayButtons(30);
	updateUI();
}

function takeDamage() {
	if (activeDeck.deck.length > 0) {
		$("#brawl_overlay_buttons").children("button").prop("disabled", true);
		damageTaken += 1;
		// add card to discard, and put the index of the card now in discard into flippedCards array
		flippedCards.push(discard.length);
		discard.push(activeDeck.deck.pop());
		setOverlayButtons(30);
		updateUI();
		$("#brawl_overlay_buttons").children("button").prop("disabled", false);
	}
}

function searchDeck(x = 0) {
	$("#brawl_overlay_buttons").children("button").prop("disabled", true);

	if (x == 0)
		$("#deck_overlay_title").html(`Deck (Bottom to Top)<br>Total: ${activeDeck.deck.length}`);
	else
		$("#deck_overlay_title").html(`Flipped (First to Last)<br>Total: ${flippedCards.length}`);
	
		$("#deck_overlay").show();
	$("#brawl_overlay_image").hide();
	$("#brawl_overlay_buttons").hide();
	
	//append picture of all cards into discard overlay
	$("#deck_overlay_cards").empty();
	if (x == 0) {
		for (var i = 0; i < activeDeck.deck.length; i++) {
			$("#deck_overlay_cards").append(`
				<img src=\"${buildCardPath(activeDeck.deck[i])}" />
			`);
		}
	} else {
		for (var i = 0; i < flippedCards.length; i++) {
			$("#deck_overlay_cards").append(`
				<img src=\"${buildCardPath(discard[flippedCards[i]])}" />
			`);
		}
	}

	//add click event to each card
	if (x == 0) {
		$("#deck_overlay_cards").children("img").click(function() {
			expandedCard = $(this).index();
			$("#brawl_overlay_image").attr("src", buildCardPath(activeDeck.deck[expandedCard], true));
			$("#brawl_overlay_image").show();
			setOverlayButtons(29);
			exitDeckSearch();
		});
	} else {
		$("#deck_overlay_cards").children("img").click(function() {
			expandedCard = $(this).index();
			$("#brawl_overlay_image").attr("src", buildCardPath(discard[flippedCards[expandedCard]], true));
			$("#brawl_overlay_image").show();
			setOverlayButtons(35);
			exitDeckSearch();
		});
	}
}

function drawFromDeck(index = -1) {
	amountFromDeck = parseInt($("#deck_amnt_input").val());

	if (index != -1)
		hand.push(activeDeck.deck.splice(index, 1)[0]);
	else {
		// draw cards from deck equaling parsed amount in deck_amnt_input
		for (var i = 0; i < amountFromDeck; i++) {
			hand.push(activeDeck.deck.pop());
		}
	}
	hideOverlay();
}

function energizeFromDeck(charged, index = -1) {
	if (index != -1) {
		manageEnergy(2);
		if (charged) 
			manageEnergy(0);
		activeDeck.deck.splice(index, 1);
	} else {
		for (var i = 0; i < amountFromDeck; i++) {
			manageEnergy(2);
			if (charged) 
				manageEnergy(0);
			
			activeDeck.deck.pop();
		}
	}
	hideOverlay();
}

function discardFromDeck(index = -1) {
	// discard cards from deck equaling parsed amount in deck_amnt_input
	amountFromDeck = parseInt($("#deck_amnt_input").val());

	if (index != -1)
		discard.push(activeDeck.deck.splice(index, 1)[0]);
	else {
		for (var i = 0; i < amountFromDeck; i++) {
			discard.push(activeDeck.deck.pop());
		}
	}
	hideOverlay();
}

function searchDiscard() {
	$("#brawl_overlay_buttons").children("button").prop("disabled", true);

	$("#discard_overlay_title").html(`Discard Pile (Bottom to Top)<br>Total: ${discard.length}`);

	$("#discard_overlay").show();
	$("#brawl_overlay_image").hide();
	$("#brawl_overlay_buttons").hide();
	
	//append picture of all cards into discard overlay
	$("#discard_overlay_cards").empty();
	for (var i = 0; i < discard.length; i++) {
		$("#discard_overlay_cards").append(`
			<img src=\"${buildCardPath(discard[i])}" />
		`);
	}

	//add click event to each card
	$("#discard_overlay_cards").children("img").click(function() {
		expandedCard = $(this).index();
		$("#brawl_overlay_image").attr("src", buildCardPath(discard[expandedCard], true));
		setOverlayButtons(22);
		exitDiscardSearch();
	});
}

function energizeFromDiscard(x,  y = 0) {
	$("#brawl_overlay_buttons").children("button").prop("disabled", true);

	// add 1 energy to total and available
	manageEnergy(2);
	if (x > 0) {
		manageEnergy(0);
	}

	// remove card from hero
	flippedCards.pop();
	discard.splice(expandedCard, 1);

	if (y == 0)
		hideOverlay();
	else {
		setOverlayButtons(30);
		updateUI();
	}
}

function deckFromDiscard(pos) {
	$("#brawl_overlay_buttons").children("button").prop("disabled", true);
	// add card to deck
	if (pos == 1) {
		activeDeck.deck.push(discard[expandedCard]);
	} else if (!pos) {
		activeDeck.deck.unshift(discard[expandedCard]);
	} else {
		// push card to deck then shuffle
		activeDeck.deck.push(discard[expandedCard]);
		shuffleDeck();
	}

	// remove card from discard
	discard.splice(expandedCard, 1);

	hideOverlay();
}

function handFromDiscard() {
	$("#brawl_overlay_buttons").children("button").prop("disabled", true);

	hand.push(discard[expandedCard]);
	discard.splice(expandedCard, 1);

	hideOverlay();
}

function playFromDiscard(x = 0, y = 0) {
	$("#brawl_overlay_buttons").children("button").prop("disabled", true);

	manageEnergy(4, parseInt($("#energy_cost").val()));

	if (discard[expandedCard].type == "ACTION" || discard[expandedCard].type == "GEOGAN" || discard[expandedCard].type == "FLIP")
		batch.push(discard[expandedCard]);
	else if (discard[expandedCard].type == "HERO" || discard[expandedCard].type == "FLIP HERO")
		heros.push(discard[expandedCard]);
	else if (discard[expandedCard].type == "BAKU-GEAR") {
		if (x == 0) {
			if (characters[selectedCharacter].gear1) {
				discard.push(characters[selectedCharacter].gear1);
			}
			characters[selectedCharacter].gear1 = discard[expandedCard];
		}
		else if (x == 1) {
			if (characters[selectedCharacter].gear2)
				discard.push(characters[selectedCharacter].gear2);
			characters[selectedCharacter].gear2 = discard[expandedCard];
		}
	}
	else if (discard[expandedCard].type == "EVO") {
		if (characters[selectedCharacter].evo)
			discard.push(characters[selectedCharacter].evo);
		characters[selectedCharacter].evo = discard[expandedCard];
	}
	
	// remove expanded card from flipped cards
	// flippedCards.splice(flippedCards.indexOf(expandedCard), 1);
	flippedCards.pop();
	discard.splice(expandedCard, 1);

	if (y == 0)
		hideOverlay();
	else {
		setOverlayButtons(30);
		updateUI();
	}
}

function energizeFromCharacter(x = 0, charged = 0) {
	$("#brawl_overlay_buttons").children("button").prop("disabled", true);

	manageEnergy(2);
	if (charged > 0) {
		manageEnergy(0);
	}

	if (x == 0) {
		characters[expandedCharacter].evo = null;
	} else if (x == 1) {
		characters[expandedCharacter].gear1 = null;
	}
	else if (x == 2) {
		characters[expandedCharacter].gear2 = null;
	}

	characterOverlay(expandedCharacter);
	updateUI();
}

function discardFromCharacter(x = 0) {
	$("#brawl_overlay_buttons").children("button").prop("disabled", true);

	if (x == 0) {
		discard.push(characters[expandedCharacter].evo);
		characters[expandedCharacter].evo = null;
	} else if (x == 1) {
		discard.push(characters[expandedCharacter].gear1);
		characters[expandedCharacter].gear1 = null;
	} else if (x == 2) {
		discard.push(characters[expandedCharacter].gear2);
		characters[expandedCharacter].gear2 = null;
	}

	characterOverlay(expandedCharacter);
	updateUI();
}

function handFromCharacter(x = 0) {
	$("#brawl_overlay_buttons").children("button").prop("disabled", true);

	if (x == 0) {
		hand.push(characters[expandedCharacter].evo);
		characters[expandedCharacter].evo = null;
	} else if (x == 1) {
		hand.push(characters[expandedCharacter].gear1);
		characters[expandedCharacter].gear1 = null;
	} else if (x == 2) {
		hand.push(characters[expandedCharacter].gear2);
		characters[expandedCharacter].gear2 = null;
	}

	characterOverlay(expandedCharacter);
	updateUI();
}

function toggleControl() {
	// if expanded card is in enemyHeros, remove it
	if (enemyHeros.includes(expandedCard)) {
		enemyHeros.splice(enemyHeros.indexOf(expandedCard), 1);
		$("#brawl_overlay_image").removeClass("enemy_hero");
	} else {
		enemyHeros.push(expandedCard);
		$("#brawl_overlay_image").addClass("enemy_hero");
	}
	updateUI();
}

function handFromHero() {
	$("#brawl_overlay_buttons").children("button").prop("disabled", true);
	// add card to hand
	hand.push(heros[expandedCard]);

	if (enemyHeros.includes(expandedCard))
		enemyHeros.splice(enemyHeros.indexOf(expandedCard), 1);

	// remove card from deck
	heros.splice(expandedCard, 1);
	// update UI
	hideOverlay();
}

function deckFromBatch(pos) {
	$("#brawl_overlay_buttons").children("button").prop("disabled", true);
	// add card to deck
	if (pos == 1) {
		activeDeck.deck.push(batch[expandedCard]);
	} else if (!pos) {
		activeDeck.deck.unshift(batch[expandedCard]);
	} else {
		// push card to deck then shuffle
		activeDeck.deck.push(batch[expandedCard]);
		shuffleDeck();
	}

	// remove card from batch
	batch.splice(expandedCard, 1);

	hideOverlay();
}

function deckFromHand(pos) {
	$("#brawl_overlay_buttons").children("button").prop("disabled", true);
	// add card to deck
	if (pos == 1) {
		activeDeck.deck.push(hand[expandedCard]);
	} else if (!pos) {
		activeDeck.deck.unshift(hand[expandedCard]);
	} else {
		// push card to deck then shuffle
		activeDeck.deck.push(hand[expandedCard]);
		shuffleDeck();
	}

	// remove card from hand
	hand.splice(expandedCard, 1);

	hideOverlay();
}

function handFromBatch() {
	$("#brawl_overlay_buttons").children("button").prop("disabled", true);
	// add card to hand
	hand.push(batch[expandedCard]);

	// remove card from batch
	batch.splice(expandedCard, 1);

	hideOverlay();
}

function discardFromBatch() {
	$("#brawl_overlay_buttons").children("button").prop("disabled", true);
	// add card to discard pile
	discard.push(batch[expandedCard]);

	// remove card from batch
	batch.splice(expandedCard, 1);

	hideOverlay();
}

function discardHero() {
	$("#brawl_overlay_buttons").children("button").prop("disabled", true);
	// add hero to discard pile
	discard.push(heros[expandedCard]);

	if (enemyHeros.includes(expandedCard))
		enemyHeros.splice(enemyHeros.indexOf(expandedCard), 1);

	// remove card from heros
	heros.splice(expandedCard, 1);

	hideOverlay();
}

function gearFromHand(character, slot) {
	$("#brawl_overlay_buttons").children("button").prop("disabled", true);
	manageEnergy(4, parseInt($("#energy_cost").val()));

	addGear(characters[character], slot, hand[expandedCard]);

	// remove card from hand
	hand.splice(expandedCard, 1);

	hideOverlay();
}

function addGear(character, slot, card) {
	// if this character and selected slot gear is not null, discard it
	if (slot == 0 && character.gear1 != null)
		discard.push(character.gear1);
	else if (slot == 1 && character.gear2 != null)
		discard.push(character.gear2);
	

	// Add card to gear list
	if (slot == 0) {
		character.gear1 = card;
	} else if (slot == 1) {
		character.gear2 = card;
	}
}

function evoFromHand(character) {	
	$("#brawl_overlay_buttons").children("button").prop("disabled", true);
	manageEnergy(4, parseInt($("#energy_cost").val()));
	
	addEvo(characters[character], hand[expandedCard]);

	// remove card from hand
	hand.splice(expandedCard, 1);

	hideOverlay();
}

function addEvo(character, card) {
	// if this character and selected slot gear is not null, discard it
	if (character.evo != null)
		discard.push(character.evo);
	
	// Set evo of character to card
	character.evo = card;
}

function heroFromHand() {
	$("#brawl_overlay_buttons").children("button").prop("disabled", true);
	manageEnergy(4, parseInt($("#energy_cost").val()));

	// Add card to heros list
	heros.push(hand[expandedCard]);
	
	// remove card from hand
	hand.splice(expandedCard, 1);

	hideOverlay();
}

function discardFromHand() {
	$("#brawl_overlay_buttons").children("button").prop("disabled", true);

	// add card to discard pile
	discard.push(hand[expandedCard]);

	// remove card from hand
	hand.splice(expandedCard, 1);

	hideOverlay();
}

function energizeFromHand(x) {
	$("#brawl_overlay_buttons").children("button").prop("disabled", true);

	// add 1 energy to total and available
	manageEnergy(2);
	if (x > 0) {
		manageEnergy(0);
	}

	// remove card from hand
	hand.splice(expandedCard, 1);

	hideOverlay();
}

function energizeFromHero(x) {
	$("#brawl_overlay_buttons").children("button").prop("disabled", true);

	// add 1 energy to total and available
	manageEnergy(2);
	if (x > 0) {
		manageEnergy(0);
	}

	// Remove enemyHero for index
	if (enemyHeros.includes(expandedCard))
		enemyHeros.splice(enemyHeros.indexOf(expandedCard), 1);

	// remove card from hero
	heros.splice(expandedCard, 1);

	hideOverlay();
}

function energizeFromBatch(x) {
	$("#brawl_overlay_buttons").children("button").prop("disabled", true);

	// add 1 energy to total and available
	manageEnergy(2);
	if (x > 0) {
		manageEnergy(0);
	}

	// remove card from batch
	batch.splice(expandedCard, 1);

	hideOverlay();
}

function actionFromHand() {
	// change #brawl_overlay_buttons to allow the player to choose energy cose via a number box. also show a back buttont o rerun Showoverlaybuttons(0)
	// when the player clicks use, send card to the batch, remove it from hand, and subtract the energy cost from available energy
	$("#brawl_overlay_buttons").children("button").prop("disabled", true);
	
	manageEnergy(4, parseInt($("#energy_cost").val()));
	

	// add card to batch
	batch.push(hand[expandedCard]);

	// remove card from hand
	hand.splice(expandedCard, 1);

	hideOverlay();
}

function sortHand() {
	// sort hand based on hand[i].name alphabetically
	hand.sort(function(a, b) {
		if(a.name < b.name) { return -1; }
		if(a.name > b.name) { return 1; }
		return 0;
	});

	// sort hand based on hand[i].faction. faction is an array of 1-2 elements, sort by the first element
	hand.sort(function(a, b) {
		if(a.faction[0] < b.faction[0]) { return -1; }
		if(a.faction[0] > b.faction[0]) { return 1; }
		return 0;
	});

	// sort hand based on hand[i].type. Where the order goes is based on the order of the array below
	let typeOrder = [ "ACTION", "FLIP", "FLIP HERO", "HERO", "BAKU-GEAR", "GEOGAN", "EVO"  ];
	hand.sort(function(a, b) {
		if(typeOrder.indexOf(a.type) < typeOrder.indexOf(b.type)) { return -1; }
		if(typeOrder.indexOf(a.type) > typeOrder.indexOf(b.type)) { return 1; }
		return 0;
	});
}

function buildCardPath(x, flag = false) {
	if (!flag) {
		switch (x.set) {
			case "BB": root = "assets/cards/01_BB/thumbnail/thumb_ENG_"; break;
			case "BR": root = "assets/cards/02_BR/thumbnail/thumb_ENG_"; break;
			case "AA": root = "assets/cards/03_AA/thumbnail/thumb_ENG_"; break;
			case "AV": root = "assets/cards/04_AV/thumbnail/thumb_ENG_"; break;
			case "FF": root = "assets/cards/05_FF/thumbnail/thumb_ENG_"; break;
			case "SV": root = "assets/cards/06_SV/thumbnail/thumb_ENG_"; break;
			case "SG": root = "assets/cards/07_SG/thumbnail/thumb_ENG_"; break;
			case "GG": root = "assets/cards/08_GG/thumbnail/thumb_ENG_"; break;
			case "EV": root = "assets/cards/09_EV/thumbnail/thumb_ENG_"; break;
			case "EV2": root = "assets/cards/10_EV2/thumbnail/thumb_ENG_"; break;
			case "LE": root = "assets/cards/11_LE/thumbnail/thumb_ENG_"; break;
		}
	} else {
		switch (x.set) {
			case "BB": root = "assets/cards/01_BB/ENG_"; break;
			case "BR": root = "assets/cards/02_BR/ENG_"; break;
			case "AA": root = "assets/cards/03_AA/ENG_"; break;
			case "AV": root = "assets/cards/04_AV/ENG_"; break;
			case "FF": root = "assets/cards/05_FF/ENG_"; break;
			case "SV": root = "assets/cards/06_SV/ENG_"; break;
			case "SG": root = "assets/cards/07_SG/ENG_"; break;
			case "GG": root = "assets/cards/08_GG/ENG_"; break;
			case "EV": root = "assets/cards/09_EV/ENG_"; break;
			case "EV2": root = "assets/cards/10_EV2/ENG_"; break;
			case "LE": root = "assets/cards/11_LE/ENG_"; break;
		}
	}

	return root + x.setNumber + "_" + x.rarity + "_" + x.set + "_" + x.name + ".png";
}

function resetBrawl() {
	// prompt user with yes or no to reset brawl
	if(confirm("Are you sure you want to reset brawl?")) {
		tryDeck(loadedDeck);
	}
}

function manageEnergy(x = 0, y = 0) {
	switch (x) {
		case -1: //  charge energy
			$("#energy_current").html($("#energy_total").html());
			break;
		case 0: // Add 1 available energy
			$("#energy_current").html(parseInt($("#energy_current").html()) + 1);
			break;
		case 1: // subtract 1 available energy
			if (parseInt($("#energy_current").html()) <= 0) return; // if current energy is 0, do nothing (don't go negative
			$("#energy_current").html(parseInt($("#energy_current").html()) - 1);
			break;
		case 2: // Add total energy
			$("#energy_total").html(parseInt($("#energy_total").html()) + 1);
			break;
		case 3: // Subtract total energy
			if (parseInt($("#energy_total").html()) <= 0) return;
			// if current energy is equal or greater than total, subtract one from current
			if (parseInt($("#energy_current").html()) >= parseInt($("#energy_total").html())) 
				$("#energy_current").html(parseInt($("#energy_current").html()) - 1);
			$("#energy_total").html(parseInt($("#energy_total").html()) - 1);
			break;
		case 4: // Subtract Y energy
			$("#energy_current").html(parseInt($("#energy_current").html()) - y);
			break;
	}
}

function clearBatch() {
	// Add batch cards to the discard array
	discard = discard.concat(batch);

	// clear batch
	batch = [];

	// update UI
	updateUI();
}

function characterOverlay(character = 0) {
	// check if character has a gear or evo attacged
	if (characters[character].evo || characters[character].gear1 || characters[character].gear2) {
		expandedCharacter = character;
		
		if (!characters[character].evo)
			$("#cc_evo").hide();
		else
			$("#cc_evo").attr("src", buildCardPath(characters[character].evo, true));
		if (!characters[character].gear1)
			$("#cc_gear1").hide();
		else
			$("#cc_gear1").attr("src", buildCardPath(characters[character].gear1, true));
		if (!characters[character].gear2)
			$("#cc_gear2").hide();
		else
			$("#cc_gear2").attr("src", buildCardPath(characters[character].gear2, true));
			
		
		setOverlayButtons(-1);
		$("#character_container").show();
		$("#brawl_overlay_image").hide();
		$("#brawl_overlay").show();
		$("#brawl_overlay").css("opacity", 1);

		$("#brawl_overlay").click(function(event) {
			if (event.target == this) {
				hideOverlay()
			}
		});
	}
}

function discardOverlay() {
	if (discard.length > 0) {
		setOverlayButtons(21);

		$("#brawl_overlay").show();
		$("#brawl_overlay").css("opacity", 1);
		$("#brawl_overlay").click(function(event) {
			if (event.target == this) {
				hideOverlay();
			}
		});
	}
}

function discardChangeSelected(x = 0) {
	if (x == 0) {
		expandedCard = discard.length - 1;
		$("#brawl_overlay_image").attr("src", buildCardPath(discard[expandedCard], true));
		setOverlayButtons(22);
	} else if (x == 1) {
		expandedCard = Math.floor(Math.random() * discard.length);
		$("#brawl_overlay_image").attr("src", buildCardPath(discard[expandedCard], true));
		setOverlayButtons(22);
	}
}

function hideOverlay() {
	$("#brawl_overlay_image").removeClass("enemy_hero");

	if (revealedCards.length > 0) {
		for (var i = 0; i < revealedCards.length; i++) {
			activeDeck.deck.push(revealedCards[i]);
		}
		revealedCards = [];
	}
	updateUI();

	selectedCharacter = null;
	expandedCard = null;
	expandedCharacter = null;

	$("#brawl_overlay").css("opacity", 0);
	setTimeout(function() {
		$("#brawl_overlay").hide();
		$("#discard_overlay").hide();
		$("#deck_overlay").hide();
		$("#reveal_overlay").hide();
		$("#character_container").hide();
		$("#brawl_overlay_image").show();
		$("#brawl_overlay_buttons").show();
		$(".overlay_cc").show();
	}, 200);
}

function exitDiscardSearch() {
	$("#discard_overlay").hide();
	$("#brawl_overlay_image").show();
	$("#brawl_overlay_buttons").show();
	$("#brawl_overlay_buttons").children("button").prop("disabled", false);
}

function exitDeckSearch(x = 0) {
	$("#deck_overlay").hide();
	$("#brawl_overlay_buttons").show();
	$("#brawl_overlay_buttons").children("button").prop("disabled", false);
}

function energizeDiscardPile() {
	// energize discard pile
	for (var i = 0; i < discard.length; i++) {
		manageEnergy(2);
	}

	discard = [];

	// update UI
	hideOverlay();
}

function deckOverlay() {
	if (activeDeck.deck.length > 0) {
		amountFromDeck = 0;
		revealedCards = [];
		hasTakenDamage = false;
		setOverlayButtons(27);

		$("#brawl_overlay").show();
		$("#brawl_overlay").css("opacity", 1);
		$("#brawl_overlay").click(function(event) {
			if (event.target == this) {
				hideOverlay();
			}
		});
	}
}

function energyCostEvent() {
	$("#energy_cost").on("input", function() {
		if ($(this).val() > parseInt($("#energy_current").html())) {
			$(this).val(parseInt($("#energy_current").html()));
		}
	});
}

function deckAmountEvent() {
	$("#deck_amnt_input").on("input", function() {
		if ($(this).val() > activeDeck.deck.length) {
			$(this).val(activeDeck.deck.length);
		}
	});
}

function revealFromHand() {
	setOverlayButtons(-1);
	// html with class hand_expandable change src to assets\cards\BBPAC.png
	$(".hand_expandable").each(function() {
		$(this).attr("src", "assets/cards/BBPAC.png");
	});
}