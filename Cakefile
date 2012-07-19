path          = require 'path'
fs            = require 'fs'
{spawn, exec} = require 'child_process'

require('colors').setTheme
  input:    'grey'
  verbose:  'cyan'
  prompt:   'grey'
  info:     'green'
  data:     'grey'
  help:     'cyan'
  warn:     'magenta'
  out:      'yellow'
  debug:    'blue'
  error:    'red'


task 'make:doc', 'make documantation for lib files', make_doc = (cb) ->

  proc = spawn 'coffeedoc', ["./lib"]
  proc.stderr.on 'data', (buffer) -> console.log  buffer.toString().error
  proc.stdout.on 'data', (buffer) -> console.log  buffer.toString().verbose
  proc.on        'exit', (status) ->
    process.exit(1) if status != 0
    cb() if typeof cb is 'function'  
