###
# Converter module documentation #

This library created to simplify image convert tasks
###

fs        = require 'fs'
path      = require 'path'
walk      = require 'walkdir'
chainGang = require 'chain-gang'
im        = require 'imagemagick'

libdir_path   = path.dirname fs.realpathSync __filename

PatchComposer   = require path.join libdir_path, '/patch_composer'
FileFilter      = require path.join libdir_path, '/file_filter'

class Converter
  ###
  This class resizes image files, recursively searching for images in selected directory.
  ###

  constructor: (options) ->
    ###
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
    
    ###

    @_new_size_             = options.size
    @_start_directory_      = options.directory

    @_remove_original_file_ = /^yes$/i.test options['remove-original-file']

    @_im_command_           = options.im_command

    @_chain_                = @_createChain options.workers
    @_filter_               = @_createFilter options
    @_path_composer_        = new PatchComposer options.prefix

  doConvert: ->
    ### 
    Convert method.

    Return `this` 
    ###
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
  Create FileFilter object
  options looks strange in constructor, so I move construction there
  ###
  _createFilter: (options, config) ->
    new FileFilter
          converted_prefix  : options.prefix
          exclude_extension : options.exclude_files.by_extension
          exclude_names     : options.exclude_files.by_name

  ###
  Create chainGang object to rule workers
  ###
  _createChain: (max_workers) ->
    chainGang.create workers: max_workers

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

  ###
  Callback for finder will continue only on right files
  ###
  _walkerCallback : (file, stat) =>
    
    if @_filter_.isFilterPassed file
      @_chain_.add @_converterJob, file
    
    null

  _converterJob : (worker) =>

    [ old_file_path, new_file_path ] = @_path_composer_.makeCleanPair worker.name

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