let card_db = [...Array(1257)].map(() => ({}));
populateCardDB()

// Init values to prevent errors
for (let i = 0; i < card_db.length; i++) {
	card_db[i].faction = [];
	card_db[i].type = "";
	// card_db[i].setNumber = parseInt(card_db[i].setNumber);
}

// Loop through all cards in card_db
for (let i = 0; i < card_db.length; i++) {
	if (card_db[i].set == "BB") {
		// Set card types
		if (card_db[i].setNumber <= 137) 
			card_db[i].type = "ACTION";
		else if (card_db[i].setNumber <= 186)
			card_db[i].type = "FLIP";
		else if (card_db[i].setNumber <= 215)
			card_db[i].type = "HERO";
		else if (card_db[i].setNumber <= 281)
			card_db[i].type = "EVO";

		// Set card factions
		if (card_db[i].setNumber < 29 || (card_db[i].setNumber >= 138 && card_db[i].setNumber < 146) || (card_db[i].setNumber >= 187 && card_db[i].setNumber < 194) || (card_db[i].setNumber >= 216 && card_db[i].setNumber < 229)) 
			card_db[i].faction = [ "AQUOS" ];
		if (card_db[i].setNumber >= 229 && card_db[i].setNumber < 237) 
			card_db[i].faction = [ "AURELUS" ];
		if ((card_db[i].setNumber >= 29 && card_db[i].setNumber < 58) || (card_db[i].setNumber >= 146 && card_db[i].setNumber < 155) || (card_db[i].setNumber >= 194 && card_db[i].setNumber < 200) || (card_db[i].setNumber >= 237 && card_db[i].setNumber < 248)) 
			card_db[i].faction = [ "DARKUS" ];
		if ((card_db[i].setNumber >= 58 && card_db[i].setNumber < 84) || (card_db[i].setNumber >= 155 && card_db[i].setNumber < 166) || (card_db[i].setNumber >= 200 && card_db[i].setNumber < 205) || (card_db[i].setNumber >= 248 && card_db[i].setNumber < 259)) 
			card_db[i].faction = [ "HAOS" ];
		if ((card_db[i].setNumber >= 84 && card_db[i].setNumber < 111) || (card_db[i].setNumber >= 166 && card_db[i].setNumber < 175) || (card_db[i].setNumber >= 205 && card_db[i].setNumber < 212) || (card_db[i].setNumber >= 259 && card_db[i].setNumber < 271))
			card_db[i].faction = [ "PYRUS" ];
		if ((card_db[i].setNumber >= 111 && card_db[i].setNumber < 138) || (card_db[i].setNumber >= 175 && card_db[i].setNumber < 187) || (card_db[i].setNumber >= 212 && card_db[i].setNumber < 216) || (card_db[i].setNumber >= 271 && card_db[i].setNumber < 282)) 
			card_db[i].faction = [ "VENTUS" ];
	}

	if (card_db[i].set == "BR") {
		// Set card types
		if (card_db[i].setNumber <= 59)
			card_db[i].type = "ACTION";
		else if (card_db[i].setNumber <= 76)
			card_db[i].type = "FLIP";
		else if (card_db[i].setNumber <= 84)
			card_db[i].type = "HERO";
		else if (card_db[i].setNumber <= 165)
			card_db[i].type = "EVO";

		// Set card factions
		if (card_db[i].setNumber <= 12 || (card_db[i].setNumber >= 60 && card_db[i].setNumber <= 63) || card_db[i].setNumber == 77 || (card_db[i].setNumber >= 85 && card_db[i].setNumber <= 97)) 
			card_db[i].faction = [ "AQUOS" ];
		if (card_db[i].setNumber >= 98 && card_db[i].setNumber <= 107)
			card_db[i].faction = [ "AURELUS" ];
		if ((card_db[i].setNumber >= 13 && card_db[i].setNumber <= 24) || (card_db[i].setNumber >= 64 && card_db[i].setNumber <= 66) || card_db[i].setNumber == 78 || (card_db[i].setNumber >= 108 && card_db[i].setNumber <= 120))
			card_db[i].faction = [ "DARKUS" ];
		if ((card_db[i].setNumber >= 25 && card_db[i].setNumber <= 35) || (card_db[i].setNumber >= 67 && card_db[i].setNumber <= 70) || (card_db[i].setNumber >= 79 && card_db[i].setNumber <= 80) || (card_db[i].setNumber >= 121 && card_db[i].setNumber <= 134))
			card_db[i].faction = [ "HAOS" ];
		if ((card_db[i].setNumber >= 36 && card_db[i].setNumber <= 47) || (card_db[i].setNumber >= 71 && card_db[i].setNumber <= 73) || (card_db[i].setNumber >= 81 && card_db[i].setNumber <= 83) || (card_db[i].setNumber >= 135 && card_db[i].setNumber <= 149))
			card_db[i].faction = [ "PYRUS" ];
		if ((card_db[i].setNumber >= 48 && card_db[i].setNumber <= 59) || (card_db[i].setNumber >= 74 && card_db[i].setNumber <= 76) || card_db[i].setNumber == 84 || (card_db[i].setNumber >= 150 && card_db[i].setNumber <= 165))
			card_db[i].faction = [ "VENTUS" ];
	}

	if (card_db[i].set == "AA") {
		// Set card types
		if (card_db[i].setNumber <= 50)
			card_db[i].type = "ACTION";
		else if (card_db[i].setNumber <= 66)
			card_db[i].type = "FLIP";
		else if (card_db[i].setNumber <= 76)
			card_db[i].type = "HERO";
		else if (card_db[i].setNumber <= 161)
			card_db[i].type = "EVO";

		// Set card factions
		if (card_db[i].setNumber <= 9 || (card_db[i].setNumber >= 51 && card_db[i].setNumber <= 53) || card_db[i].setNumber == 67 || card_db[i].setNumber == 73 || (card_db[i].setNumber >= 77 && card_db[i].setNumber <= 89)) 
			card_db[i].faction = [ "AQUOS" ];
		if ((card_db[i].setNumber >= 10 && card_db[i].setNumber <= 13) || (card_db[i].setNumber >= 54 && card_db[i].setNumber <= 55) || card_db[i].setNumber == 68 || (card_db[i].setNumber >= 90 && card_db[i].setNumber <= 102))
			card_db[i].faction = [ "AURELUS" ];
		if ((card_db[i].setNumber >= 14 && card_db[i].setNumber <= 21) || (card_db[i].setNumber >= 56 && card_db[i].setNumber <= 58) || (card_db[i].setNumber >= 69 && card_db[i].setNumber <= 70) || (card_db[i].setNumber >= 103 && card_db[i].setNumber <= 119))
			card_db[i].faction = [ "DARKUS" ];
		if ((card_db[i].setNumber >= 22 && card_db[i].setNumber <= 30) || (card_db[i].setNumber >= 59 && card_db[i].setNumber <= 60) || (card_db[i].setNumber >= 71 && card_db[i].setNumber <= 72) || (card_db[i].setNumber >= 120 && card_db[i].setNumber <= 134))
			card_db[i].faction = [ "HAOS" ];
		if ((card_db[i].setNumber >= 31 && card_db[i].setNumber <= 39) || (card_db[i].setNumber >= 61 && card_db[i].setNumber <= 63) || card_db[i].setNumber == 74 || (card_db[i].setNumber >= 135 && card_db[i].setNumber <= 148))
			card_db[i].faction = [ "PYRUS" ];
		if ((card_db[i].setNumber >= 40 && card_db[i].setNumber <= 50) || (card_db[i].setNumber >= 64 && card_db[i].setNumber <= 66) || (card_db[i].setNumber >= 75 && card_db[i].setNumber <= 76) || (card_db[i].setNumber >= 149 && card_db[i].setNumber <= 161))
			card_db[i].faction = [ "VENTUS" ];
	}

	if (card_db[i].set == "AV") {
		// Set card types
		if (card_db[i].setNumber <= 60)
			card_db[i].type = "ACTION";
		else if (card_db[i].setNumber <= 70)
			card_db[i].type = "FLIP";
		else if (card_db[i].setNumber <= 75)
			card_db[i].type = "FLIP HERO";
		else if (card_db[i].setNumber <= 85)
			card_db[i].type = "HERO";
		else if (card_db[i].setNumber <= 116)
			card_db[i].type = "BAKU-GEAR";
		else if (card_db[i].setNumber <= 157)
			card_db[i].type = "EVO";

		// Set card factions
		if (card_db[i].setNumber <= 8 || card_db[i].setNumber == 61 || card_db[i].setNumber == 76 || (card_db[i].setNumber >= 86 && card_db[i].setNumber <= 91) || (card_db[i].setNumber >= 117 && card_db[i].setNumber <= 121))
			card_db[i].faction = [ "AQUOS" ];
		if (card_db[i].setNumber == 92 || (card_db[i].setNumber >= 122 && card_db[i].setNumber <= 127))
			card_db[i].faction = [ "AURELUS" ];
		if ((card_db[i].setNumber >= 9 && card_db[i].setNumber <= 16) || card_db[i].setNumber == 62 || card_db[i].setNumber == 72 || card_db[i].setNumber == 77 || (card_db[i].setNumber >= 93 && card_db[i].setNumber <= 98) || (card_db[i].setNumber >= 128 && card_db[i].setNumber <= 136))
			card_db[i].faction = [ "DARKUS" ];
		if ((card_db[i].setNumber >= 17 && card_db[i].setNumber <= 24) || card_db[i].setNumber == 63 || card_db[i].setNumber == 73 || card_db[i].setNumber == 78 || (card_db[i].setNumber >= 99 && card_db[i].setNumber <= 104) || (card_db[i].setNumber >= 137 && card_db[i].setNumber <= 141))
			card_db[i].faction = [ "HAOS" ];
		if ((card_db[i].setNumber >= 25 && card_db[i].setNumber <= 32) || card_db[i].setNumber == 64 || card_db[i].setNumber == 74 || card_db[i].setNumber == 79 || (card_db[i].setNumber >= 105 && card_db[i].setNumber <= 110) || (card_db[i].setNumber >= 142 && card_db[i].setNumber <= 150))
			card_db[i].faction = [ "PYRUS" ];
		if ((card_db[i].setNumber >= 33 && card_db[i].setNumber <= 40) || card_db[i].setNumber == 65 || card_db[i].setNumber == 75 || card_db[i].setNumber == 80 || (card_db[i].setNumber >= 111 && card_db[i].setNumber <= 116) || (card_db[i].setNumber >= 151 && card_db[i].setNumber <= 157))
			card_db[i].faction = [ "VENTUS" ];

		// Set fusion factions
		if ((card_db[i].setNumber >= 41 && card_db[i].setNumber <= 44) || card_db[i].setNumber == 66 || card_db[i].setNumber == 81)
			card_db[i].faction = [ "DARKUS", "AQUOS" ];
		if ((card_db[i].setNumber >= 45 && card_db[i].setNumber <= 48) || card_db[i].setNumber == 67 || card_db[i].setNumber == 82)
			card_db[i].faction = [ "PYRUS", "DARKUS" ];
		if ((card_db[i].setNumber >= 49 && card_db[i].setNumber <= 52) || card_db[i].setNumber == 68 || card_db[i].setNumber == 83)
			card_db[i].faction = [ "HAOS", "PYRUS" ];
		if ((card_db[i].setNumber >= 53 && card_db[i].setNumber <= 56) || card_db[i].setNumber == 69 || card_db[i].setNumber == 84)
			card_db[i].faction = [ "VENTUS", "HAOS" ];
		if ((card_db[i].setNumber >= 57 && card_db[i].setNumber <= 60) || card_db[i].setNumber == 70 || card_db[i].setNumber == 85)
			card_db[i].faction = [ "AQUOS", "VENTUS" ];
	}

	if (card_db[i].set == "FF") {
		// Set card types
		if (card_db[i].setNumber <= 66)
			card_db[i].type = "ACTION";
		else if (card_db[i].setNumber <= 86)
			card_db[i].type = "FLIP";
		else if (card_db[i].setNumber <= 96)
			card_db[i].type = "HERO";
		else if (card_db[i].setNumber <= 123)
			card_db[i].type = "BAKU-GEAR";
		else if (card_db[i].setNumber <= 149)
			card_db[i].type = "EVO";

		// Set card factions
		if (card_db[i].setNumber <= 8 || (card_db[i].setNumber >= 67 && card_db[i].setNumber <= 68) || card_db[i].setNumber == 87 || (card_db[i].setNumber >= 97 && card_db[i].setNumber <= 98) || card_db[i].setNumber == 124 || (card_db[i].setNumber >= 126 && card_db[i].setNumber <= 127))
			card_db[i].faction = [ "AQUOS" ];
		if ((card_db[i].setNumber >= 99 && card_db[i].setNumber <= 100) || (card_db[i].setNumber >= 128 && card_db[i].setNumber <= 130))
			card_db[i].faction = [ "AURELUS" ]; 
		if ((card_db[i].setNumber >= 9 && card_db[i].setNumber <= 16) || (card_db[i].setNumber >= 69 && card_db[i].setNumber <= 70) || card_db[i].setNumber == 88 || (card_db[i].setNumber >= 101 && card_db[i].setNumber <= 102) || (card_db[i].setNumber >= 131 && card_db[i].setNumber <= 136))
			card_db[i].faction = [ "DARKUS" ];
		if ((card_db[i].setNumber >= 17 && card_db[i].setNumber <= 24) || (card_db[i].setNumber >= 71 && card_db[i].setNumber <= 72) || card_db[i].setNumber == 89 || (card_db[i].setNumber >= 103 && card_db[i].setNumber <= 104) || (card_db[i].setNumber >= 137 && card_db[i].setNumber <= 140))
			card_db[i].faction = [ "HAOS" ];
		if ((card_db[i].setNumber >= 25 && card_db[i].setNumber <= 32) || (card_db[i].setNumber >= 73 && card_db[i].setNumber <= 74) || card_db[i].setNumber == 90 || (card_db[i].setNumber >= 105 && card_db[i].setNumber <= 106) || (card_db[i].setNumber >= 142 && card_db[i].setNumber <= 144))
			card_db[i].faction = [ "PYRUS" ];
		if ((card_db[i].setNumber >= 33 && card_db[i].setNumber <= 41) || (card_db[i].setNumber >= 75 && card_db[i].setNumber <= 76) || card_db[i].setNumber == 91 || (card_db[i].setNumber >= 107 && card_db[i].setNumber <= 108) || card_db[i].setNumber == 145 || (card_db[i].setNumber >= 147 && card_db[i].setNumber <= 149))
			card_db[i].faction = [ "VENTUS" ];

		// Set fusion factions
		if ((card_db[i].setNumber >= 42 && card_db[i].setNumber <= 46) || (card_db[i].setNumber >= 77 && card_db[i].setNumber <= 78) || card_db[i].setNumber == 92 || (card_db[i].setNumber >= 109 && card_db[i].setNumber <= 111))
			card_db[i].faction = [ "DARKUS", "AQUOS" ];
		if ((card_db[i].setNumber >= 47 && card_db[i].setNumber <= 51) || (card_db[i].setNumber >= 79 && card_db[i].setNumber <= 80) || card_db[i].setNumber == 93 || (card_db[i].setNumber >= 112 && card_db[i].setNumber <= 114) || card_db[i].setNumber == 141)
			card_db[i].faction = [ "PYRUS", "DARKUS" ];
		if ((card_db[i].setNumber >= 52 && card_db[i].setNumber <= 56) || (card_db[i].setNumber >= 81 && card_db[i].setNumber <= 82) || card_db[i].setNumber == 94 || (card_db[i].setNumber >= 115 && card_db[i].setNumber <= 117))
			card_db[i].faction = [ "HAOS", "PYRUS" ];
		if ((card_db[i].setNumber >= 57 && card_db[i].setNumber <= 61) || (card_db[i].setNumber >= 83 && card_db[i].setNumber <= 84) || card_db[i].setNumber == 95 || (card_db[i].setNumber >= 118 && card_db[i].setNumber <= 120) || card_db[i].setNumber == 146)
			card_db[i].faction = [ "VENTUS", "HAOS" ];
		if ((card_db[i].setNumber >= 62 && card_db[i].setNumber <= 66) || (card_db[i].setNumber >= 85 && card_db[i].setNumber <= 86) || card_db[i].setNumber == 96 || (card_db[i].setNumber >= 121 && card_db[i].setNumber <= 123) || card_db[i].setNumber == 125)
			card_db[i].faction = [ "AQUOS", "VENTUS" ];
	}

	if (card_db[i].set == "SV") {
		// Set card types
		if (card_db[i].setNumber <= 76)
			card_db[i].type = "ACTION";
		else if (card_db[i].setNumber <= 92)
			card_db[i].type = "FLIP";
		else if (card_db[i].setNumber <= 103)
			card_db[i].type = "HERO";
		else if (card_db[i].setNumber <= 130)
			card_db[i].type = "BAKU-GEAR";
		else if (card_db[i].setNumber <= 148)
			card_db[i].type = "EVO";

		// Set card factions
		if (card_db[i].setNumber <= 10 || (card_db[i].setNumber >= 77 && card_db[i].setNumber <= 78) || card_db[i].setNumber == 93 || (card_db[i].setNumber >= 104 && card_db[i].setNumber <= 107) || (card_db[i].setNumber >= 131 && card_db[i].setNumber <= 133))
			card_db[i].faction = [ "AQUOS" ];
		if ((card_db[i].setNumber >= 11 && card_db[i].setNumber <= 20) || (card_db[i].setNumber >= 79 && card_db[i].setNumber <= 80) || card_db[i].setNumber == 94 || (card_db[i].setNumber >= 108 && card_db[i].setNumber <= 111) || card_db[i].setNumber == 134 || card_db[i].setNumber == 136)
			card_db[i].faction = [ "DARKUS" ];
		if ((card_db[i].setNumber >= 21 && card_db[i].setNumber <= 30) || (card_db[i].setNumber >= 81 && card_db[i].setNumber <= 82) || card_db[i].setNumber == 95 || (card_db[i].setNumber >= 112 && card_db[i].setNumber <= 115) || card_db[i].setNumber == 137)
			card_db[i].faction = [ "HAOS" ];
		if ((card_db[i].setNumber >= 31 && card_db[i].setNumber <= 40) || (card_db[i].setNumber >= 83 && card_db[i].setNumber <= 84) || card_db[i].setNumber == 96 || (card_db[i].setNumber >= 116 && card_db[i].setNumber <= 119) || (card_db[i].setNumber >= 140 && card_db[i].setNumber <= 141))
			card_db[i].faction = [ "PYRUS" ];
		if ((card_db[i].setNumber >= 41 && card_db[i].setNumber <= 50) || (card_db[i].setNumber >= 85 && card_db[i].setNumber <= 86) || card_db[i].setNumber == 97 || (card_db[i].setNumber >= 120 && card_db[i].setNumber <= 123) || (card_db[i].setNumber >= 143 && card_db[i].setNumber <= 145))
			card_db[i].faction = [ "VENTUS" ];
		if (card_db[i].setNumber == 76 || card_db[i].setNumber == 87 || card_db[i].setNumber == 98 || (card_db[i].setNumber >= 124 && card_db[i].setNumber <= 125) || card_db[i].setNumber == 148)
			card_db[i].faction = [ "AURELUS" ];

		// Set fusion factions
		if ((card_db[i].setNumber >= 51 && card_db[i].setNumber <= 55) || card_db[i].setNumber == 88 || card_db[i].setNumber == 99 || card_db[i].setNumber == 126 || card_db[i].setNumber == 135)
			card_db[i].faction = [ "DARKUS", "AQUOS" ];
		if ((card_db[i].setNumber >= 56 && card_db[i].setNumber <= 60) || card_db[i].setNumber == 89 || card_db[i].setNumber == 100)
			card_db[i].faction = [ "PYRUS", "DARKUS" ];
		if ((card_db[i].setNumber >= 61 && card_db[i].setNumber <= 65) || card_db[i].setNumber == 90 || card_db[i].setNumber == 101)
			card_db[i].faction = [ "HAOS", "PYRUS" ];
		if ((card_db[i].setNumber >= 66 && card_db[i].setNumber <= 70) || card_db[i].setNumber == 91 || card_db[i].setNumber == 102 || card_db[i].setNumber == 129 || card_db[i].setNumber == 146)
			card_db[i].faction = [ "VENTUS", "HAOS" ];
		if ((card_db[i].setNumber >= 71 && card_db[i].setNumber <= 75) || card_db[i].setNumber == 92 || card_db[i].setNumber == 103 || card_db[i].setNumber == 130 || card_db[i].setNumber == 138)
			card_db[i].faction = [ "AQUOS", "VENTUS" ];
		if (card_db[i].setNumber == 138)
			card_db[i].faction = [ "HAOS", "AURELUS" ];
		if (card_db[i].setNumber == 147)
			card_db[i].faction = [ "VENTUS", "AURELUS" ];
	}

	if (card_db[i].set == "SG") {
		// Set card types
		if (card_db[i].setNumber <= 101)
			card_db[i].type = "ACTION";
		else if (card_db[i].setNumber <= 132)
			card_db[i].type = "FLIP";
		else if (card_db[i].setNumber <= 160)
			card_db[i].type = "HERO";
		else if (card_db[i].setNumber <= 165)
			card_db[i].type = "BAKU-GEAR";
		else if (card_db[i].setNumber <= 206)
			card_db[i].type = "GEOGAN";
		else if (card_db[i].setNumber <= 225)
			card_db[i].type = "EVO";

		// Set card factions
		if (card_db[i].setNumber <= 12 || card_db[i].setNumber == 104 || (card_db[i].setNumber >= 134 && card_db[i].setNumber <= 135) ||  (card_db[i].setNumber >= 166 && card_db[i].setNumber <= 173) || (card_db[i].setNumber >= 208 && card_db[i].setNumber <= 209))
			card_db[i].faction = [ "AQUOS" ];
		if ((card_db[i].setNumber >= 13 && card_db[i].setNumber <= 25) || card_db[i].setNumber == 107 || (card_db[i].setNumber >= 178 && card_db[i].setNumber <= 188) || card_db[i].setNumber == 199 || card_db[i].setNumber == 214)
			card_db[i].faction = [ "DARKUS" ];
		if ((card_db[i].setNumber >= 26 && card_db[i].setNumber <= 30) || card_db[i].setNumber == 109 || (card_db[i].setNumber >= 189 && card_db[i].setNumber <= 193) || (card_db[i].setNumber >= 217 && card_db[i].setNumber <= 218))
			card_db[i].faction = [ "HAOS" ];
		if ((card_db[i].setNumber >= 36 && card_db[i].setNumber <= 49) || card_db[i].setNumber == 113 || (card_db[i].setNumber >= 195 && card_db[i].setNumber <= 196) || card_db[i].setNumber == 200 || card_db[i].setNumber == 221)
			card_db[i].faction = [ "PYRUS" ];
		if ((card_db[i].setNumber >= 51 && card_db[i].setNumber <= 59) || (card_db[i].setNumber >= 115 && card_db[i].setNumber <= 116) || (card_db[i].setNumber >= 201 && card_db[i].setNumber <= 206) || card_db[i].setNumber == 225)
			card_db[i].faction = [ "VENTUS" ];
		if ((card_db[i].setNumber >= 174 && card_db[i].setNumber <= 176) || (card_db[i].setNumber >= 211 && card_db[i].setNumber <= 212))
			card_db[i].faction = [ "AURELUS" ];
		if ((card_db[i].setNumber >= 64 && card_db[i].setNumber <= 67) || (card_db[i].setNumber >= 150 && card_db[i].setNumber <= 151))
			card_db[i].faction = [ "AQUOS", "HAOS" ];
		if (card_db[i].setNumber >= 71 && card_db[i].setNumber <= 72)
			card_db[i].faction = [ "DARKUS", "HAOS" ];
		if ((card_db[i].setNumber >= 79 && card_db[i].setNumber <= 83) || (card_db[i].setNumber >= 125 && card_db[i].setNumber <= 126) || card_db[i].setNumber == 156 || card_db[i].setNumber == 163)
			card_db[i].faction = [ "DARKUS", "VENTUS" ];
		if ((card_db[i].setNumber >= 87 && card_db[i].setNumber <= 93) || (card_db[i].setNumber >= 128 && card_db[i].setNumber <= 129) || card_db[i].setNumber == 157 || card_db[i].setNumber == 164)
			card_db[i].faction = [ "PYRUS", "AQUOS" ];
		if ((card_db[i].setNumber >= 96 && card_db[i].setNumber <= 101) || (card_db[i].setNumber >= 131 && card_db[i].setNumber <= 132) || card_db[i].setNumber == 160 || card_db[i].setNumber == 165)
			card_db[i].faction = [ "PYRUS", "VENTUS" ];
	}

	if (card_db[i].set == "GG") {
		// Set card types
		if (card_db[i].setNumber <= 79)
			card_db[i].type = "ACTION";
		else if (card_db[i].setNumber <= 196 && card_db[i].setNumber != 139)
			card_db[i].type = "GEOGAN";
		else if (card_db[i].setNumber == 139 || card_db[i].setNumber <= 217)
			card_db[i].type = "EVO";

		// Set card factions
		if (card_db[i].setNumber <= 6 || (card_db[i].setNumber >= 133 && card_db[i].setNumber <= 137) || (card_db[i].setNumber >= 142 && card_db[i].setNumber <= 145) || card_db[i].setNumber == 201)
			card_db[i].faction = [ "AQUOS" ];
		if ((card_db[i].setNumber >= 11 && card_db[i].setNumber <= 20) || (card_db[i].setNumber >= 157 && card_db[i].setNumber <= 161) || (card_db[i].setNumber >= 166 && card_db[i].setNumber <= 167) || (card_db[i].setNumber >= 206 && card_db[i].setNumber <= 209))
			card_db[i].faction = [ "DARKUS" ];
		if ((card_db[i].setNumber >= 21 && card_db[i].setNumber <= 26) || (card_db[i].setNumber >= 168 && card_db[i].setNumber <= 176))
			card_db[i].faction = [ "HAOS" ];
		if ((card_db[i].setNumber >= 31 && card_db[i].setNumber <= 36) || (card_db[i].setNumber >= 178 && card_db[i].setNumber <= 185) || card_db[i].setNumber == 217)
			card_db[i].faction = [ "PYRUS" ];
		if ((card_db[i].setNumber >= 41 && card_db[i].setNumber <= 46) || card_db[i].setNumber == 165 || (card_db[i].setNumber >= 186 && card_db[i].setNumber <= 196))
			card_db[i].faction = [ "VENTUS" ];
		if (card_db[i].setNumber == 139 || (card_db[i].setNumber >= 146 && card_db[i].setNumber <= 155))
			card_db[i].faction = [ "AURELUS" ];
		if (card_db[i].setNumber == 51 || card_db[i].setNumber == 52)
			card_db[i].faction = [ "AQUOS", "HAOS" ];
		if (card_db[i].setNumber == 58 || card_db[i].setNumber == 60)
			card_db[i].faction = [ "DARKUS", "HAOS" ];
		if (card_db[i].setNumber == 65)
			card_db[i].faction = [ "DARKUS", "VENTUS" ];
		if (card_db[i].setNumber == 79)
			card_db[i].faction = [ "PYRUS", "VENTUS" ];
	}

	if (card_db[i].set == "EV") {
		// Set card types
		if (card_db[i].setNumber <= 7)
			card_db[i].type = "GEOGAN";
		else if (card_db[i].setNumber <= 144)
			card_db[i].type = "EVO";

		// Set card factions
		if (card_db[i].setNumber == 1 || card_db[i].setNumber == 44 || card_db[i].setNumber == 144)
			card_db[i].faction = [ "AQUOS" ];
		if (card_db[i].setNumber == 2)
			card_db[i].faction = [ "AURELUS" ];
		if (card_db[i].setNumber >= 3 && card_db[i].setNumber <= 4)
			card_db[i].faction = [ "DARKUS" ];
		if ((card_db[i].setNumber >= 5 && card_db[i].setNumber <= 6) || (card_db[i].setNumber >= 77 && card_db[i].setNumber <= 89))
			card_db[i].faction = [ "HAOS" ];
		if (card_db[i].setNumber >= 93 && card_db[i].setNumber <= 101)
			card_db[i].faction = [ "PYRUS" ];
		if (card_db[i].setNumber == 7 || card_db[i].setNumber == 143)
			card_db[i].faction = [ "VENTUS" ];

	}

	if (card_db[i].set == "EV2") {
		// Set card types
		if (card_db[i].setNumber <= 48 || card_db[i].setNumber == 189)
			card_db[i].type = "GEOGAN";
		else if (card_db[i].setNumber <= 63)
			card_db[i].type = "EVO";
		
		// Set card factions
		if (card_db[i].setNumber == 36 || card_db[i].setNumber == 42)
			card_db[i].faction = [ "AQUOS" ];
		if (card_db[i].setNumber == 38)
			card_db[i].faction = [ "DARKUS" ];
		if (card_db[i].setNumber == 40)
			card_db[i].faction = [ "PYRUS" ];
		if (card_db[i].setNumber >= 48 && card_db[i].setNumber <= 189)
			card_db[i].faction = [ "VENTUS" ];
	}

	if (card_db[i].set == "LE") {
		// Set card types
		if (card_db[i].setNumber <= 5)
			card_db[i].type = "BAKU-GEAR";
		else if (card_db[i].setNumber <= 10)
			card_db[i].type = "GEOGAN";
		else if (card_db[i].setNumber <= 19)
			card_db[i].type = "EVO";

		// Set card factions
		if (card_db[i].setNumber >= 2 && card_db[i].setNumber <= 3)
			card_db[i].faction = [ "AQUOS" ];
		if (card_db[i].setNumber == 4)
			card_db[i].faction = [ "PYRUS", "AURELUS" ];
		if (card_db[i].setNumber == 5 || card_db[i].setNumber == 8)
			card_db[i].faction = [ "VENTUS" ];
		if ((card_db[i].setNumber >= 9 && card_db[i].setNumber <= 10) || card_db[i].setNumber == 17)
			card_db[i].faction = [ "PYRUS" ];
		if (card_db[i].setNumber == 11)
			card_db[i].faction = [ "DARKUS" ];
		if (card_db[i].setNumber >= 13 && card_db[i].setNumber <= 15)
			card_db[i].faction = [ "AURELUS" ];
		if (card_db[i].setNumber == 19)
			card_db[i].faction = [ "PYRUS", "DARKUS" ];
	}
}