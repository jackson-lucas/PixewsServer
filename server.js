#!/usr/bin/env node
'use strict'
// "token": "8a73EicEi3Ersr"
var firebase = require('firebase')

firebase.initializeApp({
  serviceAccount: './firebaseCredentials.json',
  databaseURL: 'https://pixews-a5861.firebaseio.com'
})

var db = firebase.database()
var empresas = db.ref('/empresas')
var fotografos = db.ref('fotografos')

var TokenGenerator = require('token-generator')({
  salt: 'got a secret, can you keep it? better lock it in your pocket!',
  timestampMap: 'tEnPi3rces', // 10 chars array for obfuscation proposes
})

const Hapi = require('hapi')

const server = new Hapi.Server()
server.connection({ port: 8080 })

// criar_fotografo({nome, email, pais, estado})
server.route({
  method: 'PUT',
  path: '/fotografo',
  handler: function (request, reply) {
    var fotografo = request.payload
    var novoFotografo = fotografos.push(fotografo)
    var token = TokenGenerator.generate()

    delete novoFotografo.senha
    var key = novoFotografo.key
    delete novoFotografo.key

    reply({'token': token, 'key': key, 'user': novoFotografo})
  }
})

// criar_empresa({nome, cnpj, pais, foto?, site?:[{nome, link}]})
server.route({
  method: 'PUT',
  path: '/empresa',
  handler: function (request, reply) {
    var empresa = request.payload
    var novaEmpresa = empresas.push(empresa)
    var token = TokenGenerator.generate()
    delete novaEmpresa.senha
    var key = novaEmpresa.key
    delete novaEmpresa.key
    reply({'token': token, 'key': key, 'user': novaEmpresa})
  }
})

// login_da_empresa ({email, senha})
server.route({
  method: 'POST',
  path: '/empresa',
  handler: function (request, reply) {
    var query, user;
    empresas
      .orderByChild('email')
      .equalTo(request.payload.email).limitToFirst(1)
      .on('value', function (snapshot) {
        var token, key

        user = snapshot.val()
        key = Object.keys(user)[0]
        user = user[key]

        if (user.senha == request.payload.senha) {
          token = TokenGenerator.generate()

          delete user.senha

          reply({'token': token, 'key': key, 'user': user})
        } else {
          reply({'error': 401 })
        }
      })
  }
})

// login_do_fotografo ({email, senha})
server.route({
  method: 'POST',
  path: '/fotografo',
  handler: function (request, reply) {
    var query, user;
    fotografos.orderByChild('email')
      .equalTo(request.payload.email).limitToFirst(1)
      .on('value', function (snapshot) {
        var token, key

        user = snapshot.val()
        key = Object.keys(user)[0]
        user = user[key]

        if (user.senha == request.payload.senha) {
          token = TokenGenerator.generate()

          delete user.senha

          reply({'token': token, 'key': key, 'user': user})
        } else {
          reply({'error': 401 })
        }
      })
  }
})

// alterar_empresa({nome, cnpj, pais, foto?, site?:[{nome, link}]})
server.route({
  method: 'PATCH',
  path: '/empresa',
  handler: function (request, reply) {
    empresas.set(request.payload)
  }
})

// alterar_fotografo({id, nome?, email?, pais?, estado?})
server.route({
  method: 'PATCH',
  path: '/fotografo',
  handler: function (request, reply) {
    fotografos.set(request.payload)
  }
})

// pontuar({fotografo_id, imagem_id, valor})
server.route({
  method: 'PATCH',
  path: '/rank',
  handler: function (request, reply) {
    // fotografos.set(request.payload)
  }
})

server.start((err) => {

  if (err) {
    throw err
  }
  console.log(`Server running at: ${server.info.uri}`)
})
