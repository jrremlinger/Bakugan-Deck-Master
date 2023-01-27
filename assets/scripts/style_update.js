$("#brawl_deck_total").css("min-width", $(".brawl_cardimg").width() + "px");
$("#brawl_deck_total").css("padding-top", $(".brawl_cardimg").height() / 3.1 + "px");
$(".faction_container").css("top", $(".brawl_character_1").height() / 4.3 + "px");

window.addEventListener("resize", function () {
console.log("resize");
	$("#brawl_deck_total").css("min-width", $(".brawl_cardimg").width() + "px");
	$("#brawl_deck_total").css("padding-top", $(".brawl_cardimg").height() / 3.1 + "px");

	
	$(".faction_container").css("top", $(".brawl_character_1").height() / 4.3 + "px");

	// set location of overlay buttons to be 50% of the screen width + half of the width of the card_overlay
	$("#brawl_overlay_buttons").css("left", (window.innerWidth / 2) + ($("#brawl_overlay_image").width() / 2) + ($("#brawl_overlay_buttons").width() / 2) + "px");
});

