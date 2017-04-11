'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.run = undefined;

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

var _whet = require('whet.extend');

var _whet2 = _interopRequireDefault(_whet);

var _optimist = require('optimist');

var _optimist2 = _interopRequireDefault(_optimist);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _config = require('../etc/config');

var _config2 = _interopRequireDefault(_config);

var _theme = require('../etc/theme');

var _theme2 = _interopRequireDefault(_theme);

var _package = require('../package');

var _package2 = _interopRequireDefault(_package);

var _converter = require('./converter');

var _converter2 = _interopRequireDefault(_converter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// enable some colors at output
/*
 * Image Batch Resizer CLI module main part
 *
 */

_colors2.default.setTheme(_theme2.default);

/*
 * Read convertor version
 */
function getVersion() {
  return _package2.default.version;
}

/*
 * Naive CPU core counter.
 * FIXME: if HT used - user get x2 workers but how detect real cores?
 */
function calculateWorkers() {
  return _os2.default.cpus().length;
}

function getWarningTextOnRemove() {
  return ('WARNING!!!'.bold + ' You have selected to ' + 'REMOVE ORIGINAL FILES'.bold + '\nIf you are not SURE about deleting these files - ' + 'stop script IMMEDIATELY'.bold + '!!!\n').warn;
}

function getLongDefinition() {
  return '\nImage batch resizer v.' + getVersion() + '\nThis script asynchronously resizes image files, recursively searching for images in selected directory.\nUsage: image-batch-resizer -d [start directory]';
}

function readArgs() {
  var res = void 0;

  try {
    res = argvParser(_config2.default);
  } catch (err) {
    console.error(('' + err).error);
    _optimist2.default.showHelp();
    process.exit(1);
  }
  return res;
}

/*
 * This argv parser with usage info and some verification
 */
function argvParser(config) {
  var argvInput = _optimist2.default.usage(getLongDefinition().help).describe('d', 'Directory to start recursive search').options('d', {
    alias: ['dir', 'directory'],
    demand: true
  }).describe('p', 'Prefix for resized images').options('p', {
    alias: 'prefix',
    demand: false,
    default: config.prefix
  }).describe('R', 'Remove original file after conversion ("yes"|"no")').options('R', {
    alias: 'remove-original-file',
    demand: false,
    default: config.remove_original_file
  }).describe('s', 'New image size (add ">" to prevent upscale)').options('s', {
    alias: 'size',
    demand: false,
    default: config.size
  }).describe('w', 'Number of workers (parallel jobs) (integer|"auto")').options('w', {
    alias: 'workers',
    demand: false,
    default: config.workers
  }).argv;

  if (!/^(yes|no)$/i.test(argvInput['remove-original-file'])) {
    throw Error('--remove-original-file key is |' + argvInput['remove-original-file'] + '|\n      this key value MUST be \'yes\' OR \'no\' only!');
  }

  if (!/^(auto|\d+)$/i.test(argvInput.workers)) {
    throw Error('--workers key is |' + argvInput.workers + '|\n      this key value MUST be integer OR \'auto\' only!');
  }

  return argvInput;
}

/*
 * Main command
 */
function run() {
  var parsed = readArgs();
  var options = (0, _whet2.default)({}, _config2.default, parsed);

  if (/^auto$/i.test(options.workers)) {
    options.workers = calculateWorkers();
  }

  if (/^yes$/i.test(options['remove-original-file'])) {
    console.log(getWarningTextOnRemove());
  }

  new _converter2.default(options).doConvert();
}

exports.run = run;