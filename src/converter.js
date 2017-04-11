
/*
 * This library created to simplify image convert tasks
 */

import queue from 'queue'
import fs from 'fs'
import im from 'imagemagick'
import walk from 'walkdir'

import FileFilter from './file_filter'
import PatchComposer from './patch_composer'

class Converter {
  constructor (options) {
    this.imCommand = options.im_command
    this.newSize = options.size
    this.startDirectory = options.directory

    this.filter = this.createFilter(options)
    this.pathComposer = new PatchComposer(options.prefix)
    this.queue = this.createQueue(options.workers)

    this.isRemoveOriginalFile = /^yes$/i.test(options['remove-original-file'])

    this.walkerCallback = this.walkerCallback.bind(this)
    this.converterJob = this.converterJob.bind(this)
  }

  /*
   * Main method
   */
  doConvert () {
    let walker, errStr

    // check to ensure is start "directory" ARE existing and its directory
    fs.lstat(this.startDirectory, (err, stats) => {
      errStr = this.lstatChecker(err, stats)
      if (errStr) {
        console.warn(`${errStr}`.error)
        process.exit(1)
      }
      // ignite async finder and setup event "on file fined"
      walker = walk(this.startDirectory)
      walker.on('file', this.walkerCallback)
    })
    return this
  }

  /*
   * Create FileFilter object
   * options looks strange in constructor, so I move construction there
   */
  createFilter (options, config) {
    return new FileFilter({
      converted_prefix: options.prefix,
      exclude_extension: options.exclude_files.by_extension,
      exclude_names: options.exclude_files.by_name
    })
  }

  /*
   * Create async queue to limit converter workers
   */
  createQueue (maxWorkers) {
    return queue({concurrency: maxWorkers, autostart: true})
  }

  /*
   *  Checker for lstat returned data
   */
  lstatChecker (err, stats) {
    if (err) {
      return `ERROR: not exists directory |${this.startDirectory}|`
    } else if (!stats.isDirectory()) {
      return `ERROR: isn\`t directory |${this.startDirectory}|`
    }
  }

  /*
   * Callback for finder will continue only on right files
   */
  walkerCallback (file, stat) {
    if (this.filter.isFilterPassed(file)) {
      this.queue.push((cb) => {
        this.converterJob(file, cb)
      })
    }
  }

 /*
  * Command for async job
  */
  converterJob (file, cb) {
    let imArgs
    let [ oldFilePath, newFilePath ] = this.pathComposer.makeCleanPair(file)

    // check if it always converted
    fs.stat(newFilePath, (err, stats) => {
      if (!err && stats && stats.isFile()) {
        console.log(`== ${oldFilePath}`.fileEqual)
        return cb()
      }
      console.log(`>> ${oldFilePath}`.fileIn)

      imArgs = [ oldFilePath, this.imCommand, this.newSize, newFilePath ]
      im.convert(imArgs, (err, stdout, stderr) => {
        if (err) {
          console.error(`\n${oldFilePath}\n${err}`.error)
          return cb()
        }

        console.log(`<< ${newFilePath}`.fileOut)
        // fork for delete original file if it needed
        if (this.isRemoveOriginalFile) {
          this.fileRemover(oldFilePath, cb)
        } else {
          cb()
        }
      })
    })
  }

  /*
   * Async file remover
   */
  fileRemover (filename, cb) {
    fs.unlink(filename, (err) => {
      if (err) {
        console.error(`\n${filename}\n${err}`.error)
      } else {
        console.log(`-- ${filename}`.fileDelete)
      }
      cb()
    })
  }
}

export default Converter
