###
# FileFilter module documentation #

This library created to encapsulate some logic
###

class FileFilter
  ###
  Class to encapsulate filtration logic
  ###

  constructor: (options) ->
    ###
    Options keys description

        converted_prefix    # skip converted files, detect by prefix
        exclude_extension   # ignore files, detect based on extension
        exclude_names       # ignore files or directory, detected by part of name

    ###
    @_regex_patterns_ =
      converted_files_regex       : @_getConvertedFilesRegex options.converted_prefix
      exclude_by_extension_regex  : @_getExcludeFilesTypeRegex options.exclude_extension   
      exclude_by_name_regex       : @_getExcludeNamesRegex options.exclude_names  
  
  isFilterPassed: (file) ->
    ###
    To filter file path.
    
    All **NON-matched** by exclude patterns files will be pass this filter.

    Return boolean `true` or `false`
    ###
    # some premature optimization - array will be created at first method call
    itself = @isFilterPassed
    unless itself.regex_names?
      itself.regex_names = (pattern_name for own pattern_name of @_regex_patterns_)

    for pattern in itself.regex_names
      return false if file.match @_regex_patterns_[pattern]

    true
  
  ###
  Regex patterns to skip files
  ###
  _getExcludeFilesTypeRegex: (extentions) ->
    escaped_extentions = @_enumEscaper extentions
    RegExp "(?:#{escaped_extentions.join '|'})$", "i"

  _getExcludeNamesRegex: (names) ->
    escaped_names = @_enumEscaper names
    RegExp "/(?:#{escaped_names.join '|'})", "i"

  _getConvertedFilesRegex: (file_prefix) ->
    RegExp "/#{file_prefix}[^/]+$", 'i'

  ###
  Prepare each array element (string) to be valid for Regex constructor
  ###
  _enumEscaper : (in_array) ->
    in_array.map (element) ->
      element
        .replace /\\/g, '\\'


module.exports = FileFilter