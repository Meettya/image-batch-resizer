###
Configuration settings
###

module.exports =

	im_command : "-adaptive-resize"

	remove_original_file : "no"
	
	prefix : "res_"
	size : "1920x1080"
	workers : "2"

	exclude_file_list : [
		".txt"
		".db"
		".DS_Store"
	]

	exclude_dir_list : [
		".AppleDouble"
		"Temporary Items"
		"Network Trash Folder"
	]