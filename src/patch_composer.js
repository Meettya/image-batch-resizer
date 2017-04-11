/*
 * This library created to remove non-specific behavior from Converter class
 */

import path from 'path'

class PathComposer {
  constructor (newFilePrefix) {
    this.newFilePrefix = newFilePrefix
  }

  /*
   * Method to create cleaned (remove unneeded dots e.t.c) name pairs
   */
  makeCleanPair (filepath) {
    let dirname, basename, cleanedOldFilePath, newFilePath

    dirname = path.dirname(filepath)
    basename = path.basename(filepath)
    cleanedOldFilePath = path.join(dirname, basename)
    newFilePath = path.join(dirname, `${this.newFilePrefix}${basename}`)

    return [cleanedOldFilePath, newFilePath]
  }
}

export default PathComposer
