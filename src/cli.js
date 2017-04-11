/*
 * Image Batch Resizer CLI module main part
 *
 */

import colors from 'colors'
import extend from 'whet.extend'
import optimist from 'optimist'
import os from 'os'

import Config from '../etc/config'
import Theme from '../etc/theme'

import Packg from '../package'

import Converter from './converter'

// enable some colors at output
colors.setTheme(Theme)

/*
 * Read convertor version
 */
function getVersion () {
  return Packg.version
}

/*
 * Naive CPU core counter.
 * FIXME: if HT used - user get x2 workers but how detect real cores?
 */
function calculateWorkers () {
  return os.cpus().length
}

function getWarningTextOnRemove () {
  return `${'WARNING!!!'.bold} You have selected to ${'REMOVE ORIGINAL FILES'.bold}\nIf you are not SURE about deleting these files - ${'stop script IMMEDIATELY'.bold}!!!\n`.warn
}

function getLongDefinition () {
  return `\nImage batch resizer v.${getVersion()}\nThis script asynchronously resizes image files, recursively searching for images in selected directory.\nUsage: image-batch-resizer -d [start directory]`
}

function readArgs () {
  let res

  try {
    res = argvParser(Config)
  } catch (err) {
    console.error(`${err}`.error)
    optimist.showHelp()
    process.exit(1)
  }
  return res
}

/*
 * This argv parser with usage info and some verification
 */
function argvParser (config) {
  let argvInput = optimist
    .usage(getLongDefinition().help)
    .describe('d', 'Directory to start recursive search')
    .options('d', {
      alias: ['dir', 'directory'],
      demand: true
    })
    .describe('p', 'Prefix for resized images')
    .options('p', {
      alias: 'prefix',
      demand: false,
      default: config.prefix
    })
    .describe('R', 'Remove original file after conversion ("yes"|"no")')
    .options('R', {
      alias: 'remove-original-file',
      demand: false,
      default: config.remove_original_file
    })
    .describe('s', 'New image size (add ">" to prevent upscale)')
    .options('s', {
      alias: 'size',
      demand: false,
      default: config.size
    })
    .describe('w', 'Number of workers (parallel jobs) (integer|"auto")')
    .options('w', {
      alias: 'workers',
      demand: false,
      default: config.workers
    })
    .argv

  if (!(/^(yes|no)$/i.test(argvInput['remove-original-file']))) {
    throw Error(`--remove-original-file key is |${argvInput['remove-original-file']}|\n      this key value MUST be 'yes' OR 'no' only!`)
  }

  if (!(/^(auto|\d+)$/i.test(argvInput.workers))) {
    throw Error(`--workers key is |${argvInput.workers}|\n      this key value MUST be integer OR 'auto' only!`)
  }

  return argvInput
}

/*
 * Main command
 */
function run () {
  let parsed = readArgs()
  let options = extend({}, Config, parsed)

  if (/^auto$/i.test(options.workers)) {
    options.workers = calculateWorkers()
  }

  if (/^yes$/i.test(options['remove-original-file'])) {
    console.log(getWarningTextOnRemove())
  }

  new Converter(options).doConvert()
}

export { run }
