'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * This library created to encapsulate some filtration logic
 */

var FileFilter = function () {
  function FileFilter(options) {
    _classCallCheck(this, FileFilter);

    this.regexPatterns = {
      convertedFilesRegex: this.getConvertedFilesRegex(options.converted_prefix),
      excludeByExtensionRegex: this.getExcludeFilesTypeRegex(options.exclude_extension),
      excludeByNameRegex: this.getExcludeNamesRegex(options.exclude_names)
    };
  }

  /*
   * To filter file path
   *
   * All **NON-matched** by exclude patterns files will be pass this filter.
   */


  _createClass(FileFilter, [{
    key: 'isFilterPassed',
    value: function isFilterPassed(file) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = Object.keys(this.regexPatterns)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var name = _step.value;

          if (file.match(this.regexPatterns[name])) {
            return false;
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return true;
    }

    /*
     * Regex patterns to skip files
     */

  }, {
    key: 'getExcludeFilesTypeRegex',
    value: function getExcludeFilesTypeRegex(extentions) {
      var escapedExtentions = this.enumEscaper(extentions);

      return RegExp('(?:' + escapedExtentions.join('|') + ')$', 'i');
    }
  }, {
    key: 'getExcludeNamesRegex',
    value: function getExcludeNamesRegex(names) {
      var escapedNames = this.enumEscaper(names);

      return RegExp('/(?:' + escapedNames.join('|') + ')', 'i');
    }
  }, {
    key: 'getConvertedFilesRegex',
    value: function getConvertedFilesRegex(filePrefix) {
      return RegExp('/' + filePrefix + '[^/]+$', 'i');
    }

    /*
     * Prepare each array element (string) to be valid for Regex constructor
     */

  }, {
    key: 'enumEscaper',
    value: function enumEscaper(inArray) {
      return inArray.map(function (element) {
        return element.replace(/\\/g, '\\');
      });
    }
  }]);

  return FileFilter;
}();

exports.default = FileFilter;