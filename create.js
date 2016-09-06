#!/usr/bin/env node
var cmd = require('node-cmd')

cmd.run(`mkdir private`)
cmd.run(`mkdir public/imagens`)
cmd.run(`mkdir private/data`)
cmd.run(`mkdir private/imagens`)