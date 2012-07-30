# file\_filter.coffee

#### Classes
  
* [FileFilter](#FileFilter)
  




  # FileFilter module documentation #

This library created to encapsulate some logic




## Classes
  
### <a name="FileFilter">[FileFilter](FileFilter)</a>
    
    Class to encapsulate filtration logic

    
    
#### Instance Methods          
      
##### <a name="constructor">constructor(options)</a>
Options keys description

    converted_prefix    # skip converted files, detect by prefix
    exclude_extension   # ignore files, detect based on extension
    exclude_names       # ignore files or directory, detected by part of name


      
##### <a name="isFilterPassed">isFilterPassed(file)</a>
To filter file path.

All **NON-matched** by exclude patterns files will be pass this filter.

Return boolean `true` or `false`

      
    
    
  



