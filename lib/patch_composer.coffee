###
# PatchComposer module documentation #

This library created to remove non-specific behavior from Converter class
###

path      = require 'path'

class PatchComposer
  ###
  This class worked with patch 
  ###
  constructor: (@_new_file_prefix_) ->
    ### Option `new_file_prefix` {string}  ###

  makeCleanPair: (filepath) ->
    ###
    Method to create cleaned (remove unneeded dots e.t.c) name pairs

    Return array `[old_file_path, new_file_path]`
    ###

    filename_as_arr  = [ path.dirname(filepath), path.basename(filepath) ]

    cleaned_old_file_path = path.join filename_as_arr[0], filename_as_arr[1]
    new_file_path = path.join filename_as_arr[0], @_new_file_prefix_ + filename_as_arr[1]
    
    [cleaned_old_file_path, new_file_path]  

module.exports = PatchComposer