fs        = require 'fs'
path      = require 'path'
walk      = require 'walkdir'
chainGang = require 'chain-gang'
im        = require 'imagemagick'


class Converter

  constructor: (options, config) ->

    @_new_size_             = options.size
    @_max_workers_          = options.workers
    @_new_file_prefix_      = options.prefix
    @_start_directory_      = options.directory

    @_remove_original_file_ = !!(options['remove-original-file'].match /^yes$/i)

    @_exclude_file_list_    = config.exclude_file_list
    @_exclude_dir_list_     = config.exclude_dir_list

    @_im_command_           = config.im_command

    # chain object to direct workers
    @_chain_                = @_createChain()

  doConvert: ->
    # check to ensure is start "directory" ARE existing and its directory
    fs.lstat @_start_directory_, (err, stats) =>

      if (err_str = @_lstatChecker err, stats)
        console.warn "#{err_str}".error
        process.exit 1

      # ignite async finder and setup event "on file fined"
      walker = walk @_start_directory_
      walker.on 'file', @_walkerCallback

    this
  
  ###
  Thats all!
  Internal methods above this line
  ###

  ###
  Create chainGang object to rule workers
  ###
  _createChain: ->
    chainGang.create workers: @_max_workers_

  ###
  Regex patterns to skip files
  ###
  _getExcludeFilesRegex: ->
    escaped_filelist = @_exclude_file_list_.map (element) -> element.replace /\./g, '\\.'
    RegExp "(?:#{escaped_filelist.join '|'})$", "i"

  _getExcludeDirsRegex: ->
    escaped_dirlist = @_exclude_dir_list_.map (element) -> 
      element.replace /\./g, '\\.'
      element.replace /\s/g, '\\s'
    RegExp "/(?:#{escaped_dirlist.join '|'})/", "i"

  _getConvertedFilesRegex: ->
    RegExp "/#{@_new_file_prefix_}[^/]+$", 'i'

  ###
  Some black magic to avoid re-creations regex on each finder loop
  (functions IS object, so it CAN have a properties - simple!)
  (and as other object it can be extended by |extends| - perfect!)
  ###
  _regexToObjectAppender: (object) ->
    new_properties_list = 
      exclude_files_regex   : @_getExcludeFilesRegex()
      converted_files_regex : @_getConvertedFilesRegex()
      exclude_dirs_regex    : @_getExcludeDirsRegex()

    # |extends| is good practice to add some more properties
    object extends new_properties_list
    null

  ###
  Callback for finder will continue only on right files
  ###
  _walkerCallback : (file, stat) =>
    
    if @_isFileShouldToBeConverted file
      @_chain_.add @_converterJob, file
    
    null

  ###
  File checker
  ###
  _isFileShouldToBeConverted : (file) ->
    itself = @_isFileShouldToBeConverted

    # some optimize work for regex
    unless itself.exclude_dirs_regex?
      @_regexToObjectAppender itself

    properties_names = [
                'exclude_dirs_regex'     # ignore files placed in wrong dirs
                'exclude_files_regex'    # ignore non-images files
                'converted_files_regex'  # skip converted files
      ]

    for property in properties_names
      return false if file.match itself[property]

    true

  ###
  Checker for lstat returned data
  ###
  _lstatChecker : (err, stats) ->
    if err
      "ERROR: not exists directory |#{@_start_directory_}|"
    else if not stats.isDirectory()
      "ERROR: isn`t directory |#{@_start_directory_}|"
    else 
      null


  _converterJob : (worker) =>

    [old_file_path, new_file_path] = @_filesPatchCompiller worker.name

    # check if it always converted
    fs.exists new_file_path, (exists) =>

      # if prefixed file exists - just info it and finish worker
      if exists
        console.log "== #{old_file_path}".file_equal
        return worker.finish()

      # or proceed converting
      console.log ">> #{old_file_path}".file_in

      im_options = ["#{old_file_path}", "#{@_im_command_}", "#{@_new_size_}", "#{new_file_path}"]
      im.convert im_options, (err, stdout, stderr) =>
        if err
          console.error "\n#{old_file_path}\n#{err}".error
          return worker.finish()

        console.log "<< #{new_file_path}".file_out

        # fork for delete original file if it needed
        if @_remove_original_file_
          @_fileRemover old_file_path, worker

        else
          worker.finish()
    
    null     

  ###
  Simply filepath compiler, its clean up old path and create new one
  ###
  _filesPatchCompiller: (filepath) ->
        # create new name for file
    filename_as_arr  = [ path.dirname(filepath), path.basename(filepath) ]

    cleaned_old_file_path = path.join filename_as_arr[0], filename_as_arr[1]
    new_file_path = path.join filename_as_arr[0], @_new_file_prefix_ + filename_as_arr[1]
    
    [cleaned_old_file_path, new_file_path]

  ###
  Async file remover
  ###
  _fileRemover: (filename, worker) ->

    fs.unlink "#{filename}", (err) ->
      if err
        console.error "\n#{filename}\n#{err}".error
        return worker.finish()

      console.log "-- #{filename}".file_delete
      return worker.finish()

    null

module.exports = Converter