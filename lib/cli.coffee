###
# Image Batch Resizer CLI module documentation #

This is main part - CLI module
###

path        = require 'path'
fs          = require 'fs'
optimist    = require 'optimist'
os          = require 'os'

root_path   = path.join (path.dirname fs.realpathSync __filename), '..'

Converter   = require path.join root_path, './lib', '/converter'

# enable some colors at output
theme = require path.join root_path, './etc', '/theme'
require('colors').setTheme theme

class CLI
  ###
  This is cli worker
  ###

  @run: ->
    ###
    CLI entry point

    ###

    config = @::_getConfig()

    argv = 
      try
        @::_argvParser config
      catch error
        console.error "#{error}".error
        optimist.showHelp()
        process.exit 1

    options = config extends argv

    options.workers = @::_calculateWorkers() if /^auto$/i.test options.workers

    if /^yes$/i.test options['remove-original-file']
      @::_printWarningOnRemove()

    my_converter = new Converter options
    my_converter.doConvert()

  ###
  This argv parser with usage info and some verification
  ###
  _argvParser: (config) ->

    version = @_getVersion()

    # long definition for argv parser
    usage_string = 
      """

      Image batch resizer v.#{version}

      This script asynchronously resizes image files, recursively searching for images in selected directory.
      Usage: image-batch-resizer -d [start directory]
      """

    argv  = optimist
              .usage(usage_string.help)
              .describe('d', 'Directory to start recursive search')
              .options('d',
                alias   : ['dir', 'directory']
                demand  : true
              )
              .describe('p', 'Prefix for resized images')
              .options('p',
                alias   : 'prefix'
                demand  : false
                default : config.prefix
              )
              .describe('R', 'Remove original file after conversion ("yes"|"no")')
              .options('R',
                alias   : 'remove-original-file'
                demand  : false
                default : config.remove_original_file
              )
              .describe('s', 'New image size (add ">" to prevent upscale)')
              .options('s',
                alias   : 'size'
                demand  : false
                default : config.size
              )          
              .describe('w', 'Number of workers (parallel jobs) (integer|"auto")')
              .options('w',
                alias   : 'workers'
                demand  : false
                default : config.workers
              )       
              .argv

    unless /^(yes|no)$/i.test argv['remove-original-file']
      throw Error """
                  --remove-original-file key is |#{argv['remove-original-file']}|
                          this key value MUST be 'yes' OR 'no' only!
                  """
    unless /^(auto|\d+)$/i.test argv.workers
      throw Error """
                  --workers key is |#{argv.workers}|
                          this key value MUST be integer OR 'auto' only!
                  """   

    argv

  ###
  Some magic variable, but it ok for now
  ###
  _getConfig: ->
    require path.join root_path, './etc', '/config'

  _getVersion: ->
    (require path.join root_path, 'package.json')['version']

  ###
  Warning label if --remove-original-file key setted to 'yes'
  ###
  _printWarningOnRemove: ->
    console.log """

            #{'WARNING!!!'.bold} You have selected to #{'REMOVE ORIGINAL FILES'.bold}
            If you are not SURE about deleting these files - #{'stop script IMMEDIATELY'.bold}!!!

            """.warn
    null

  ###
  Naive CPU core counter.
  FIXME: if HT used - user get x2 workers but how detect real cores?
  ###
  _calculateWorkers: ->
    os.cpus().length

module.exports = CLI
