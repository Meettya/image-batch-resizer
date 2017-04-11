/*
 * This library created to encapsulate some filtration logic
 */

class FileFilter {
  constructor (options) {
    this.regexPatterns = {
      convertedFilesRegex: this.getConvertedFilesRegex(options.converted_prefix),
      excludeByExtensionRegex: this.getExcludeFilesTypeRegex(options.exclude_extension),
      excludeByNameRegex: this.getExcludeNamesRegex(options.exclude_names)
    }
  }

  /*
   * To filter file path
   *
   * All **NON-matched** by exclude patterns files will be pass this filter.
   */
  isFilterPassed (file) {
    for (let name of Object.keys(this.regexPatterns)) {
      if (file.match(this.regexPatterns[name])) {
        return false
      }
    }
    return true
  }

  /*
   * Regex patterns to skip files
   */
  getExcludeFilesTypeRegex (extentions) {
    let escapedExtentions = this.enumEscaper(extentions)

    return RegExp(`(?:${escapedExtentions.join('|')})$`, 'i')
  }

  getExcludeNamesRegex (names) {
    let escapedNames = this.enumEscaper(names)

    return RegExp(`/(?:${escapedNames.join('|')})`, 'i')
  }

  getConvertedFilesRegex (filePrefix) {
    return RegExp(`/${filePrefix}[^/]+$`, 'i')
  }

  /*
   * Prepare each array element (string) to be valid for Regex constructor
   */
  enumEscaper (inArray) {
    return inArray.map((element) => {
      return element.replace(/\\/g, '\\')
    })
  }
}

export default FileFilter
