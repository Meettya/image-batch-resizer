###
Configuration settings
###

module.exports =

  im_command : "-adaptive-resize"

  remove_original_file : "no"
  
  prefix        : "res_"
  size          : "1920x1080>"
  workers       : "2"

  exclude_files : 
    
    by_extension : [
        ".txt"
        ".db"
      ]
    
    by_name : [
        ".DS_Store"
        ".AppleDouble"
        "Temporary Items"
        "Network Trash Folder"
      ]