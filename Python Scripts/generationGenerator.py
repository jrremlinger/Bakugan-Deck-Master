import os
from natsort import natsorted

# specify the directories you want to read
directories = [
    'assets/cards/01_BB', 
    'assets/cards/02_BR', 
    'assets/cards/03_AA', 
    'assets/cards/04_AV', 
    'assets/cards/05_FF', 
    'assets/cards/06_SV', 
    'assets/cards/07_SG', 
    'assets/cards/08_GG', 
    'assets/cards/09_EV', 
    'assets/cards/10_EV2',
    'assets/cards/11_LE',
]

# open a file to write the output
with open("assets/scripts/generate_card_db.js", "w") as out_file:
    out_file.write("function populateCardDB() {\n")
    current_index = 0
    for directory in directories:
        # use the os.listdir() function to get a list of all files in the directory
        # sort the list of filenames using the natsort package
        for filename in natsorted(os.listdir(directory)):
            # remove the last 4 characters from the file name
            filename = filename[:-4]
            # split the file name by underscore
            parts = filename.split("_")
            # write the output to the file
            out_file.write("card_db[" + str(current_index) + "].name = \"" + parts[4] + "\";\n")
            out_file.write("card_db[" + str(current_index) + "].set = \"" + parts[3] + "\";\n")
            out_file.write("card_db[" + str(current_index) + "].rarity = \"" + parts[2] + "\";\n")
            out_file.write("card_db[" + str(current_index) + "].setNumber = \"" + parts[1] + "\";\n")
            current_index += 1
    out_file.write("}\n")