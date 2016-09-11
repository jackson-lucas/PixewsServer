#!/usr/bin/env node

var fotos = require('./fotos_entregar.json')
var cmd = require('node-cmd')
var TokenGenerator = require('./utilities/imageToken')
var JsonFile = require('jsonfile')
var debug = require('debug')('parse')
var fs = require('fs')
var tokens = []
// cmd.run(`mkdir samples`)
var global = 0
function generateTokens () {

  tokens.push(TokenGenerator.generate())
}

var intervalRef = setInterval(generateTokens, 2000)



function newFoto(oldSample) {
  var foto = {}

  foto.id = tokens.shift()
  foto.tags = oldSample.tags
  foto.extensao = 'jpg'
  foto.descricao = oldSample.descricao[0]
  foto.dpi = oldSample.dpi[0]
  foto.width = oldSample.width[0]
  foto.height = oldSample.height[0]
  foto.fotografo_id = oldSample.fotografo_id[0]
  foto.localizacao = oldSample.localizacao[0]
  foto.vendas = oldSample.vendas[0]

  var date = oldSample.data_submissao[0].split('/')
  foto.data_submissao = [date[2], date[1], date[0]].join('-')

  // debug(foto)

  writeFile(foto)
}

function writeFile(foto) {
  var file = `samples/${foto.id}.json`

  fs.writeFile(file, JSON.stringify(foto), function(err) {
      if(err) {
          return console.log(err)
      }
      global += 1
      debug(`The file (${file}) was saved! ${global}`)
  })

}

function parse () {
  var index;
  clearImmediate(intervalRef)
  fotos.map(newFoto)
}

setTimeout(parse, 110000)