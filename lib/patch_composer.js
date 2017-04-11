'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * This library created to remove non-specific behavior from Converter class
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PathComposer = function () {
  function PathComposer(newFilePrefix) {
    _classCallCheck(this, PathComposer);

    this.newFilePrefix = newFilePrefix;
  }

  /*
   * Method to create cleaned (remove unneeded dots e.t.c) name pairs
   */


  _createClass(PathComposer, [{
    key: 'makeCleanPair',
    value: function makeCleanPair(filepath) {
      var dirname = void 0,
          basename = void 0,
          cleanedOldFilePath = void 0,
          newFilePath = void 0;

      dirname = _path2.default.dirname(filepath);
      basename = _path2.default.basename(filepath);
      cleanedOldFilePath = _path2.default.join(dirname, basename);
      newFilePath = _path2.default.join(dirname, '' + this.newFilePrefix + basename);

      return [cleanedOldFilePath, newFilePath];
    }
  }]);

  return PathComposer;
}();

exports.default = PathComposer;