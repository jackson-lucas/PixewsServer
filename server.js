#!/usr/bin/env node
'use strict'

const empresa = require('./routes/empresa.js')
const fotografo = require('./routes/fotografo.js')
const transacao = require('./routes/transacao.js')
const imagens = require('./routes/imagens.js')

const Hapi = require('hapi')

const server = new Hapi.Server()
server.connection({
  host: process.env.HOSTNAME || 'localhost',
  port: process.env.PORT || 3000
})

server.register(
    [require('vision'), require('inert'), { register: require('lout') }],
    function(err) {
      console.log(err)
});


server.route(fotografo.get)
// criar_fotografo({nome, email, pais, estado})
server.route(fotografo.put)
// login_do_fotografo ({email, senha})
server.route(fotografo.post)
// alterar_fotografo({id, nome?, email?, pais?, estado?})
server.route(fotografo.patch)


server.route(empresa.get)
// criar_empresa({nome, cnpj, pais, foto?, site?:[{nome, link}]})
server.route(empresa.put)
// login_da_empresa ({email, senha})
server.route(empresa.post)
// alterar_empresa({nome, cnpj, pais, foto?, site?:[{nome, link}]})
server.route(empresa.patch)

// pontuar({foto_id, empresa_id, fotografo_id})
server.route(transacao.put)

server.route(imagens.get)

server.start((err) => {

  if (err) {
    throw err
  }
  console.log(`Server running at: ${server.info.uri}`)
})
