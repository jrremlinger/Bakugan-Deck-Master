import os

# Set the directory path
directory_path = 'assets/convert'

# Get all the file names in the directory
file_names = os.listdir(directory_path)

# Iterate through each file name
for file_name in file_names:
	
	# remove .png from the end of the file name
	new_file_name = file_name[:-4]
	# Split the string at "ENG" and remove all _ from the first part of the string
	new_file_name = new_file_name.split('ENG')[0].replace('_', ' ')

	# create a copy of file_name. remove all characters before "ENG"
	name_part_1 = file_name.split('ENG')[1][:-4]

	# Add .png to the end of the file name
	new_file_name = "ENG" + name_part_1 + "_" + new_file_name + '.png'

	# Remove any space before .png
	new_file_name = new_file_name.replace(' .png', '.png')

	# Build the full path for the original file
	original_file_path = os.path.join(directory_path, file_name)

	# Build the full path for the new file
	new_file_path = os.path.join(directory_path, new_file_name)

	# Rename the file
	os.rename(original_file_path, new_file_path)