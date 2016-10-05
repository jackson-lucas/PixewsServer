#!/usr/bin/env node

// <Pixews Server>
// Copyright (C) 2016  Jackson Lucas <jackson7br@gmail.com>

'use strict'

require('./env.js')
const empresa = require('./routes/empresa.js')
const fotografo = require('./routes/fotografo.js')
const transacao = require('./routes/transacao.js')
const imagens = require('./routes/imagens.js')
const imagem = require('./routes/imagem.js')

const Hapi = require('hapi')

const server = new Hapi.Server()
server.connection({
  host: process.env.HOSTNAME || 'localhost',
  port: process.env.PORT || 3000
})

server.register(
    [require('vision'), require('inert'), { register: require('lout') }, {
      register: require('hapi-cors'),
      options: {
        origins: ['*'],
        allowCredentials: 'true',
        exposeHeaders: ['content-type', 'content-length'],
        maxAge: 600,
        methods: ['POST, GET, OPTIONS, PUT, PATCH'],
        headers: ['Access-Control-Allow-Origin', 'Accept', 'Content-Type', 'token']
      }
    }],
    function(err) {
      console.log(err)
});

server.route({
  method: 'GET',
  path: '/{param*}',
  handler: {
    directory: {
      path: 'public/'
    }
  }
});

server.route(fotografo.get)
server.route(fotografo.getImagens)
// criar_fotografo({nome, email, pais, estado})
server.route(fotografo.put)
// login_do_fotografo ({email, senha})
server.route(fotografo.post)
// alterar_fotografo({id, nome?, email?, pais?, estado?})
server.route(fotografo.patch)


server.route(empresa.get)
server.route(empresa.getImagens)
// criar_empresa({nome, cnpj, pais, foto?, site?:[{nome, link}]})
server.route(empresa.put)
// login_da_empresa ({email, senha})
server.route(empresa.post)
// alterar_empresa({nome, cnpj, pais, foto?, site?:[{nome, link}]})
server.route(empresa.patch)

// pontuar({foto_id, empresa_id, fotografo_id})
server.route(transacao.put)

server.route(imagens.get)
server.route(imagens.getMaisVendidas)

server.route(imagem.post)
server.route(imagem.get)
server.route(imagem.getPrivate)
server.route(imagem.getExtension)

server.start((err) => {

  if (err) {
    throw err
  }
  console.log(`Server running at: ${server.info.uri}`)
})
