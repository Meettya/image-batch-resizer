fs        = require 'fs'
path      = require 'path'
walk      = require 'walkdir'
chainGang = require 'chain-gang'
im        = require 'imagemagick'


class Converter

  constructor: (options) ->
    @_new_size_         = "#{options.size}>" # do not upscale!
    @_max_workers_      = options.workers
    @_new_file_prefix_  = options.prefix
    @_start_directory_  = options.directory

    @_exclude_file_list = ['.txt', '.db', '.DS_Store']
    @_exclude_dir_list  = ['.AppleDouble', 'Temporary Items', 'Network Trash Folder']

    @_im_command_       = '-adaptive-resize'
    @_chain_            = null

  doConvert: ->
    # check to ensure is start directory ARE existing and its directory
    fs.lstat @_start_directory_, (err, stats) =>

      @_lstatChecker err, stats

      # ok, we are have works, so - create chain object
      @_chain_ = @_createChain()

      # and some optimize work for regex
      @_optimizeFinderCallbackRegex()

      # ignite async finder and setup event on file fined
      # now try walk
      finder = walk @_start_directory_
      finder.on 'file', @_finderCallback

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
    escaped_filelist = @_exclude_file_list.map (element) -> element.replace /\./g, '\\.'
    RegExp "(?:#{escaped_filelist.join '|'})$", "i"

  _getExcludeDirsRegex: ->
    escaped_dirlist = @_exclude_dir_list.map (element) -> 
      element.replace /\./g, '\\.'
      element.replace /\s/g, '\\s'
    RegExp "/(?:#{escaped_dirlist.join '|'})/", "i"

  _getConvertedFilesRegex: ->
    RegExp "/#{@_new_file_prefix_}[^/]+$", 'i'

  ###
  Some black magic to avoid re-creations regex on each finder loop
  (functions IS object, so it CAN have a properties - simple!)
  ###
  _optimizeFinderCallbackRegex: ->
    @_finderCallback.exclude_files_regex = @_getExcludeFilesRegex()
    @_finderCallback.converted_files_regex = @_getConvertedFilesRegex()
    @_finderCallback.exclude_dirs_regex = @_getExcludeDirsRegex()
    null

  ###
  Callback for finder
  ###
  _finderCallback : (file, stat) =>
    self = @_finderCallback 
    # ignore files placed in wrong dirs
    return null if file.match self.exclude_dirs_regex
    # ignore non-images files
    return null if file.match self.exclude_files_regex
    # skip converted files
    return null if file.match self.converted_files_regex

    @_chain_.add @_converterJob, file


  ###
  Checker for lstat returned data
  exit process if 'directory' not exists or its not directory
  ###
  _lstatChecker : (err, stats) ->
    if err
      console.warn "ERROR: not exists directory |#{@_start_directory_}|".error
      process.exit 1

    unless stats.isDirectory()
      console.warn "ERROR: isn`t directory |#{@_start_directory_}|".error
      process.exit 1 

    null


  _converterJob : (worker) =>

    [old_file_path, new_file_path] = @_filesPatchCompiller worker.name

    console.log ">> #{old_file_path}".verbose

    # check if it always converted
    fs.exists new_file_path, (exists) =>

      # if prefixed file exists - just info it and finish worker
      if exists
        console.log "== #{old_file_path}\n   #{new_file_path}".data
        return worker.finish()

      # or proceed converting
      im_options = ["#{old_file_path}", "#{@_im_command_}", "#{@_new_size_}", "#{new_file_path}"]
      im.convert im_options, (err, stdout, stderr) ->
        if err
          console.error "\n#{old_file_path}\n#{err}".error
          return worker.finish()

        console.log "<< #{new_file_path}".out
        worker.finish()

  ###
  Simply filepath compiler, its clean up old path and create new one
  ###
  _filesPatchCompiller: (filepath) ->
        # create new name for file
    filename_as_arr  = [ path.dirname(filepath), path.basename(filepath) ]

    cleaned_old_file_path = path.join filename_as_arr[0], filename_as_arr[1]
    new_file_path = path.join filename_as_arr[0], @_new_file_prefix_ + filename_as_arr[1]
    
    [cleaned_old_file_path, new_file_path]

module.exports = Converter