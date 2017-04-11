/*
 * Configuration settings
 */

module.exports = {
  im_command: '-adaptive-resize',
  remove_original_file: 'no',
  prefix: 'res_',
  size: '2048x2048>', // to have proportional resize on any side
  workers: 'auto', // number or 'auto' - will be guessed
  exclude_files: {
    by_extension: [
        '.txt',
        '.db'
    ],
    by_name: [
      '.DS_Store',
      '.AppleDouble',
      'Temporary Items',
      'Network Trash Folder'
    ]
  } 
};
