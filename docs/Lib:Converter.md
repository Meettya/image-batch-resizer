# converter.coffee

#### Classes
  
* [Converter](#Converter)
  




  # Converter module documentation #

This library created to simplify image convert tasks




## Classes
  
### <a name="Converter">[Converter](Converter)</a>
    
    This class resizes image files, recursively searching for images in selected directory.

    
    
#### Instance Methods          
      
##### <a name="constructor">constructor(options)</a>
Options keys description (see ./bin/image-batch-resizer and ./etc/config for values examples)

    size                  # New image size (add ">" to prevent upscale)
    directory             # Directory to start recursive search
    remove-original-file  # Remove original file after conversion ("yes"|"no")
    workers               # Number of workers (parallel jobs)
    prefix                # Prefix for resized images
    im_command            # ImageMagick command
    exclude_files :
      by_extension        # Array of excluded files extension
      by_ name            # Array of excluded files or directory names


      
##### <a name="doConvert">doConvert()</a>
Convert method.

Return `this` 

      
    
    
  



