'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
/*
 * This library created to simplify image convert tasks
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _queue = require('queue');

var _queue2 = _interopRequireDefault(_queue);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _imagemagick = require('imagemagick');

var _imagemagick2 = _interopRequireDefault(_imagemagick);

var _walkdir = require('walkdir');

var _walkdir2 = _interopRequireDefault(_walkdir);

var _file_filter = require('./file_filter');

var _file_filter2 = _interopRequireDefault(_file_filter);

var _patch_composer = require('./patch_composer');

var _patch_composer2 = _interopRequireDefault(_patch_composer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Converter = function () {
  function Converter(options) {
    _classCallCheck(this, Converter);

    this.imCommand = options.im_command;
    this.newSize = options.size;
    this.startDirectory = options.directory;

    this.filter = this.createFilter(options);
    this.pathComposer = new _patch_composer2.default(options.prefix);
    this.queue = this.createQueue(options.workers);

    this.isRemoveOriginalFile = /^yes$/i.test(options['remove-original-file']);

    this.walkerCallback = this.walkerCallback.bind(this);
    this.converterJob = this.converterJob.bind(this);
  }

  /*
   * Main method
   */


  _createClass(Converter, [{
    key: 'doConvert',
    value: function doConvert() {
      var _this = this;

      var walker = void 0,
          errStr = void 0;

      // check to ensure is start "directory" ARE existing and its directory
      _fs2.default.lstat(this.startDirectory, function (err, stats) {
        errStr = _this.lstatChecker(err, stats);
        if (errStr) {
          console.warn(('' + errStr).error);
          process.exit(1);
        }
        // ignite async finder and setup event "on file fined"
        walker = (0, _walkdir2.default)(_this.startDirectory);
        walker.on('file', _this.walkerCallback);
      });
      return this;
    }

    /*
     * Create FileFilter object
     * options looks strange in constructor, so I move construction there
     */

  }, {
    key: 'createFilter',
    value: function createFilter(options, config) {
      return new _file_filter2.default({
        converted_prefix: options.prefix,
        exclude_extension: options.exclude_files.by_extension,
        exclude_names: options.exclude_files.by_name
      });
    }

    /*
     * Create async queue to limit converter workers
     */

  }, {
    key: 'createQueue',
    value: function createQueue(maxWorkers) {
      return (0, _queue2.default)({ concurrency: maxWorkers, autostart: true });
    }

    /*
     *  Checker for lstat returned data
     */

  }, {
    key: 'lstatChecker',
    value: function lstatChecker(err, stats) {
      if (err) {
        return 'ERROR: not exists directory |' + this.startDirectory + '|';
      } else if (!stats.isDirectory()) {
        return 'ERROR: isn`t directory |' + this.startDirectory + '|';
      }
    }

    /*
     * Callback for finder will continue only on right files
     */

  }, {
    key: 'walkerCallback',
    value: function walkerCallback(file, stat) {
      var _this2 = this;

      if (this.filter.isFilterPassed(file)) {
        this.queue.push(function (cb) {
          _this2.converterJob(file, cb);
        });
      }
    }

    /*
     * Command for async job
     */

  }, {
    key: 'converterJob',
    value: function converterJob(file, cb) {
      var _this3 = this;

      var imArgs = void 0;

      var _pathComposer$makeCle = this.pathComposer.makeCleanPair(file);

      var _pathComposer$makeCle2 = _slicedToArray(_pathComposer$makeCle, 2);

      var oldFilePath = _pathComposer$makeCle2[0];
      var newFilePath = _pathComposer$makeCle2[1];

      // check if it always converted

      _fs2.default.stat(newFilePath, function (err, stats) {
        if (!err && stats && stats.isFile()) {
          console.log(('== ' + oldFilePath).fileEqual);
          return cb();
        }
        console.log(('>> ' + oldFilePath).fileIn);

        imArgs = [oldFilePath, _this3.imCommand, _this3.newSize, newFilePath];
        _imagemagick2.default.convert(imArgs, function (err, stdout, stderr) {
          if (err) {
            console.error(('\n' + oldFilePath + '\n' + err).error);
            return cb();
          }

          console.log(('<< ' + newFilePath).fileOut);
          // fork for delete original file if it needed
          if (_this3.isRemoveOriginalFile) {
            _this3.fileRemover(oldFilePath, cb);
          } else {
            cb();
          }
        });
      });
    }

    /*
     * Async file remover
     */

  }, {
    key: 'fileRemover',
    value: function fileRemover(filename, cb) {
      _fs2.default.unlink(filename, function (err) {
        if (err) {
          console.error(('\n' + filename + '\n' + err).error);
        } else {
          console.log(('-- ' + filename).fileDelete);
        }
        cb();
      });
    }
  }]);

  return Converter;
}();

exports.default = Converter;