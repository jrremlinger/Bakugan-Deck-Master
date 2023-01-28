// Test deck immdeiately
localStorage.setItem("deck_1", `
	[{"name":"Inferno Wings","set":"BB","rarity":"SR","setNumber":"99","faction":["PYRUS"],"type":"ACTION"},
	{"name":"Inferno Wings","set":"BB","rarity":"SR","setNumber":"99","faction":["PYRUS"],"type":"ACTION"},
	{"name":"Might of Cyndeus","set":"BB","rarity":"RA","setNumber":"104","faction":["PYRUS"],"type":"ACTION"},
	{"name":"Might of Cyndeus","set":"BB","rarity":"RA","setNumber":"104","faction":["PYRUS"],"type":"ACTION"},
	{"name":"Might of Cyndeus","set":"BB","rarity":"RA","setNumber":"104","faction":["PYRUS"],"type":"ACTION"},
	{"name":"Pact of Darkness","set":"BB","rarity":"SR","setNumber":"152","faction":["DARKUS"],"type":"FLIP"},
	{"name":"Pact of Darkness","set":"BB","rarity":"SR","setNumber":"152","faction":["DARKUS"],"type":"FLIP"},
	{"name":"Pact of Darkness","set":"BB","rarity":"SR","setNumber":"152","faction":["DARKUS"],"type":"FLIP"},
	{"name":"Twisting Inferno","set":"BR","rarity":"RA","setNumber":"47","faction":["PYRUS"],"type":"ACTION"},
	{"name":"Twisting Inferno","set":"BR","rarity":"RA","setNumber":"47","faction":["PYRUS"],"type":"ACTION"},
	{"name":"Razor Tusk","set":"AV","rarity":"RA","setNumber":"15","faction":["DARKUS"],"type":"ACTION"},
	{"name":"Haos Deflection","set":"AV","rarity":"RA","setNumber":"23","faction":["HAOS"],"type":"ACTION"},
	{"name":"Haos Deflection","set":"AV","rarity":"RA","setNumber":"23","faction":["HAOS"],"type":"ACTION"},
	{"name":"Haos Deflection","set":"AV","rarity":"RA","setNumber":"23","faction":["HAOS"],"type":"ACTION"},
	{"name":"Haocrescents","set":"AV","rarity":"CO","setNumber":"24","faction":["HAOS"],"type":"ACTION"},
	{"name":"Haocrescents","set":"AV","rarity":"CO","setNumber":"24","faction":["HAOS"],"type":"ACTION"},
	{"name":"Haocrescents","set":"AV","rarity":"CO","setNumber":"24","faction":["HAOS"],"type":"ACTION"},
	{"name":"Pyrus Vortex","set":"AV","rarity":"CO","setNumber":"26","faction":["PYRUS"],"type":"ACTION"},
	{"name":"Pyrus Vortex","set":"AV","rarity":"CO","setNumber":"26","faction":["PYRUS"],"type":"ACTION"},
	{"name":"Pyrus Vortex","set":"AV","rarity":"CO","setNumber":"26","faction":["PYRUS"],"type":"ACTION"},
	{"name":"Darkus Ash","set":"AV","rarity":"CO","setNumber":"45","faction":["PYRUS","DARKUS"],"type":"ACTION"},
	{"name":"Darkus Ash","set":"AV","rarity":"CO","setNumber":"45","faction":["PYRUS","DARKUS"],"type":"ACTION"},
	{"name":"Darkus Ash","set":"AV","rarity":"CO","setNumber":"45","faction":["PYRUS","DARKUS"],"type":"ACTION"},
	{"name":"Shadowflame","set":"AV","rarity":"RA","setNumber":"46","faction":["PYRUS","DARKUS"],"type":"ACTION"},
	{"name":"Shadowflame","set":"AV","rarity":"RA","setNumber":"46","faction":["PYRUS","DARKUS"],"type":"ACTION"},
	{"name":"Shadowflame","set":"AV","rarity":"RA","setNumber":"46","faction":["PYRUS","DARKUS"],"type":"ACTION"},
	{"name":"Pyrobliterator","set":"AV","rarity":"CO","setNumber":"51","faction":["HAOS","PYRUS"],"type":"ACTION"},
	{"name":"Pyrobliterator","set":"AV","rarity":"CO","setNumber":"51","faction":["HAOS","PYRUS"],"type":"ACTION"},
	{"name":"Pyrobliterator","set":"AV","rarity":"CO","setNumber":"51","faction":["HAOS","PYRUS"],"type":"ACTION"},
	{"name":"Pyruportal","set":"AV","rarity":"CO","setNumber":"67","faction":["PYRUS","DARKUS"],"type":"FLIP"},
	{"name":"Pyruportal","set":"AV","rarity":"CO","setNumber":"67","faction":["PYRUS","DARKUS"],"type":"FLIP"},
	{"name":"Cosmic Fireball","set":"AV","rarity":"CO","setNumber":"68","faction":["HAOS","PYRUS"],"type":"FLIP"},
	{"name":"Dragonoid, Skater Supreme","set":"AV","rarity":"RA","setNumber":"79","faction":["PYRUS"],"type":"HERO"},
	{"name":"Dragonoid, Skater Supreme","set":"AV","rarity":"RA","setNumber":"79","faction":["PYRUS"],"type":"HERO"},
	{"name":"Dragonoid, Skater Supreme","set":"AV","rarity":"RA","setNumber":"79","faction":["PYRUS"],"type":"HERO"},
	{"name":"Twilight Axes","set":"AV","rarity":"SR","setNumber":"95","faction":["DARKUS"],"type":"BAKU-GEAR"},
	{"name":"Twilight Axes","set":"AV","rarity":"SR","setNumber":"95","faction":["DARKUS"],"type":"BAKU-GEAR"},
	{"name":"Ruinous Blade","set":"FF","rarity":"CO","setNumber":"49","faction":["PYRUS","DARKUS"],"type":"ACTION"},
	{"name":"Ruinous Blade","set":"FF","rarity":"CO","setNumber":"49","faction":["PYRUS","DARKUS"],"type":"ACTION"},
	{"name":"Ruinous Blade","set":"FF","rarity":"CO","setNumber":"49","faction":["PYRUS","DARKUS"],"type":"ACTION"}]`
);

$(window).on("load", function() {
	checkValidDecks();
	tryDeck(0);
});



let hand = [];
let batch = [];
let heros = [];
let enemyHeros = [];
let discard = [];
let expandedCard = null;
let expandedCharacter = null;
let characters = [];

function brawlInit(x) {
	// load a copy of activedeck
	activeDeck = JSON.parse(JSON.stringify(x));

	batch = [];
	discard = [];
	heros = [];
	expandedCard = null;
	expandedCharacter = null;
	enemyHeros = [];
	
	$("#energy_current").html("0");
	$("#energy_total").html("0");

	shuffleDeck();

	hand = activeDeck.deck.slice(0, 6);
	// hand.push(card_db[263], card_db[264], card_db[265], card_db[202], card_db[203], card_db[204], card_db[876], card_db[877], card_db[878]);

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
		$("#brawl_overlay_image").removeClass("enemy_hero");

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
		$("#brawl_overlay_image").removeClass("enemy_hero");

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

			$("#energy_cost").on("input", function() {
				if ($(this).val() > parseInt($("#energy_current").html())) {
					$(this).val(parseInt($("#energy_current").html()));
				}
			});
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

			$("#energy_cost").on("input", function() {
				if ($(this).val() > parseInt($("#energy_current").html())) {
					$(this).val(parseInt($("#energy_current").html()));
				}
			});
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
				<button onclick=\"gearFromHand(0, 0)\">Baku-Gear (${characters[0].gear1 ? characters[0].gear1.name : "Empty"})</button>
			`);

			if (characters[0].gear1) {
				$("#brawl_overlay_buttons").append(`
					<button onclick=\"gearFromHand(0, 1)\">Dual-Gear (${characters[0].gear2 ? characters[0].gear2.name : "Empty"})</button>
				`);
			}

			$("#brawl_overlay_buttons").append(`
				<button onclick="setOverlayButtons(4)">Back</button>`
			);
			$("#energy_cost").on("input", function() {
				if ($(this).val() > parseInt($("#energy_current").html())) {
					$(this).val(parseInt($("#energy_current").html()));
				}
			});
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
				<button onclick=\"gearFromHand(1, 0)\">Baku-Gear (${characters[1].gear1 ? characters[1].gear1.name : "Empty"})</button>
			`);

			if (characters[1].gear1) {
				$("#brawl_overlay_buttons").append(`
					<button onclick=\"gearFromHand(1, 1)\">Dual-Gear (${characters[1].gear2 ? characters[1].gear2.name : "Empty"})</button>
				`);
			}

			$("#brawl_overlay_buttons").append(`
				<button onclick="setOverlayButtons(4)">Back</button>`
			);
			$("#energy_cost").on("input", function() {
				if ($(this).val() > parseInt($("#energy_current").html())) {
					$(this).val(parseInt($("#energy_current").html()));
				}
			});
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
				<button onclick=\"gearFromHand(2, 0)\">Baku-Gear (${characters[2].gear1 ? characters[2].gear1.name : "Empty"})</button>
			`);

			if (characters[2].gear1) {
				$("#brawl_overlay_buttons").append(`
					<button onclick=\"gearFromHand(2, 1)\">Dual-Gear (${characters[2].gear2 ? characters[2].gear2.name : "Empty"})</button>
				`);
			}

			$("#brawl_overlay_buttons").append(`
				<button onclick="setOverlayButtons(4)">Back</button>`
			);
			$("#energy_cost").on("input", function() {
				if ($(this).val() > parseInt($("#energy_current").html())) {
					$(this).val(parseInt($("#energy_current").html()));
				}
			});
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
			$("#energy_cost").on("input", function() {
				if ($(this).val() > parseInt($("#energy_current").html())) {
					$(this).val(parseInt($("#energy_current").html()));
				}
			});
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
			$("#energy_cost").on("input", function() {
				if ($(this).val() > parseInt($("#energy_current").html())) {
					$(this).val(parseInt($("#energy_current").html()));
				}
			});
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
			$("#energy_cost").on("input", function() {
				if ($(this).val() > parseInt($("#energy_current").html())) {
					$(this).val(parseInt($("#energy_current").html()));
				}
			});
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
				<button onclick=\"discardFromCharacter()\">Destroy Evo</button>
			`);
			break;
		case 19: // Character gear menu
			$("#brawl_overlay_buttons").append(`
				<div style="color: white;">${characters[expandedCharacter].gear1.name.replace(/\(.*/, "").trim()}</div>
				<button onclick=\"handFromCharacter(1)\">Send to Hand</button>
				<button onclick=\"discardFromCharacter(1)\">Destroy Baku-Gear</button>
			`);
			break;
		case 20: // Character dual-gear menu
			$("#brawl_overlay_buttons").append(`
				<div style="color: white;">${characters[expandedCharacter].gear2.name.replace(/\(.*/, "").trim()}</div>
				<button onclick=\"handFromCharacter(2)\">Send to Hand</button>
				<button onclick=\"discardFromCharacter(2)\">Destroy Dual-Gear</button>
			`);
			break;
	}
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

	updateUI();
	hideOverlay();
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

	updateUI();
	hideOverlay();
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
	updateUI();
	$("#brawl_overlay").css("opacity", 0);
	setTimeout(function() {
		$("#brawl_overlay").hide();
	}, 200);
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

	// update UI
	updateUI();

	$("#brawl_overlay").css("opacity", 0);
	setTimeout(function() {
		$("#brawl_overlay").hide();
	}, 200);
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

	// update UI
	updateUI();

	$("#brawl_overlay").css("opacity", 0);
	setTimeout(function() {
		$("#brawl_overlay").hide();
	}, 200);
}

function handFromBatch() {
	$("#brawl_overlay_buttons").children("button").prop("disabled", true);
	// add card to hand
	hand.push(batch[expandedCard]);

	// remove card from batch
	batch.splice(expandedCard, 1);

	// update UI
	updateUI();

	$("#brawl_overlay").css("opacity", 0);
	setTimeout(function() {
		$("#brawl_overlay").hide();
	}, 200);
}

function discardFromBatch() {
	$("#brawl_overlay_buttons").children("button").prop("disabled", true);
	// add card to discard pile
	discard.push(batch[expandedCard]);

	// remove card from batch
	batch.splice(expandedCard, 1);

	// update UI
	updateUI();

	$("#brawl_overlay").css("opacity", 0);
	setTimeout(function() {
		$("#brawl_overlay").hide();
	}, 200);
}

function discardHero() {
	$("#brawl_overlay_buttons").children("button").prop("disabled", true);
	// add hero to discard pile
	discard.push(heros[expandedCard]);

	if (enemyHeros.includes(expandedCard))
		enemyHeros.splice(enemyHeros.indexOf(expandedCard), 1);

	// remove card from heros
	heros.splice(expandedCard, 1);

	// update UI
	updateUI();

	$("#brawl_overlay").css("opacity", 0);
	setTimeout(function() {
		$("#brawl_overlay").hide();
	}, 200);
}

function gearFromHand(character, slot) {
	$("#brawl_overlay_buttons").children("button").prop("disabled", true);
	manageEnergy(4, parseInt($("#energy_cost").val()));

	addGear(characters[character], slot, hand[expandedCard]);

	// remove card from hand
	hand.splice(expandedCard, 1);

	// update UI
	updateUI();

	$("#brawl_overlay").css("opacity", 0);
	setTimeout(function() {
		$("#brawl_overlay").hide();
	}, 200);
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

	// update UI
	updateUI();

	$("#brawl_overlay").css("opacity", 0);
	setTimeout(function() {
		$("#brawl_overlay").hide();
	}, 200);
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

	$("#brawl_overlay").css("opacity", 0);
	setTimeout(function() {
		$("#brawl_overlay").hide();
	}, 200);

	// Add card to heros list
	heros.push(hand[expandedCard]);
	
	// remove card from hand
	hand.splice(expandedCard, 1);

	// update UI
	updateUI();

}

function discardFromHand() {
	$("#brawl_overlay_buttons").children("button").prop("disabled", true);

	// add card to discard pile
	discard.push(hand[expandedCard]);

	// remove card from hand
	hand.splice(expandedCard, 1);

	$("#brawl_overlay").css("opacity", 0);
	setTimeout(function() {
		$("#brawl_overlay").hide();
	}, 200);

	// update ui
	updateUI();
}

function energizeFromHand(x) {
	$("#brawl_overlay_buttons").children("button").prop("disabled", true);

	// add 1 energy to total and available
	manageEnergy(2);
	if (x > 0) {
		manageEnergy(0);
	}

	$("#brawl_overlay").css("opacity", 0);
	setTimeout(function() {
		$("#brawl_overlay").hide();
	}, 200);

	// remove card from hand
	hand.splice(expandedCard, 1);

	// update ui
	updateUI();
}

function energizeFromHero(x) {
	$("#brawl_overlay_buttons").children("button").prop("disabled", true);

	// add 1 energy to total and available
	manageEnergy(2);
	if (x > 0) {
		manageEnergy(0);
	}

	$("#brawl_overlay").css("opacity", 0);
	setTimeout(function() {
		$("#brawl_overlay").hide();
	}, 200);

	// Remove enemyHero for index
	if (enemyHeros.includes(expandedCard))
		enemyHeros.splice(enemyHeros.indexOf(expandedCard), 1);

	// remove card from hero
	heros.splice(expandedCard, 1);

	// update ui
	updateUI();
}

function energizeFromBatch(x) {
	$("#brawl_overlay_buttons").children("button").prop("disabled", true);

	// add 1 energy to total and available
	manageEnergy(2);
	if (x > 0) {
		manageEnergy(0);
	}

	$("#brawl_overlay").css("opacity", 0);
	setTimeout(function() {
		$("#brawl_overlay").hide();
	}, 200);

	// remove card from batch
	batch.splice(expandedCard, 1);

	// update ui
	updateUI();
}

function actionFromHand() {
	// change #brawl_overlay_buttons to allow the player to choose energy cose via a number box. also show a back buttont o rerun Showoverlaybuttons(0)
	// when the player clicks use, send card to the batch, remove it from hand, and subtract the energy cost from available energy
	$("#brawl_overlay_buttons").children("button").prop("disabled", true);
	
	manageEnergy(4, parseInt($("#energy_cost").val()));
	
	$("#brawl_overlay").css("opacity", 0);
	setTimeout(function() {
		$("#brawl_overlay").hide();
	}, 200);

	// add card to batch
	batch.push(hand[expandedCard]);

	// remove card from hand
	hand.splice(expandedCard, 1);

	// update UI
	updateUI();
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
			$("#energy_current").html(parseInt($("#energy_current").html()) - 1);
			break;
		case 2: // Add total energy
			$("#energy_total").html(parseInt($("#energy_total").html()) + 1);
			break;
		case 3: // Subtract total energy
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
		expandedCard = discard[discard.length - 1];
		$("#brawl_overlay_image").attr("src", buildCardPath(expandedCard, true));
		setOverlayButtons(-1);

		$("#brawl_overlay").show();
		$("#brawl_overlay").css("opacity", 1);
		$("#brawl_overlay").click(function(event) {
			if (event.target == this) {
				hideOverlay()
			}
		});
	}
}

function hideOverlay() {
	$("#brawl_overlay").css("opacity", 0);
	setTimeout(function() {
		$("#brawl_overlay").hide();
		$("#character_container").hide();
		$("#brawl_overlay_image").show();
		$(".overlay_cc").show();
	}, 200);
}