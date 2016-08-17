#!/usr/bin/env node
'use strict'

var firebase = require('firebase')

firebase.initializeApp({
  serviceAccount: './firebaseCredentials.json',
  databaseURL: "https://pixews-a5861.firebaseio.com"
});

var db = firebase.database();
var empresas = db.ref("/empresas")
var fotografos = db.ref("/fotografos")

const Hapi = require('hapi')

const server = new Hapi.Server()
server.connection({ port: 8080 })

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        // reply('Hello, world!');
        // console.log(db);
        var ref = db.ref("/fotografos")
        ref.orderByKey().on("value",
          function(snapshot) {
            console.log(
              snapshot.key + " was " + snapshot.val()
            )
            reply(snapshot.val())
          })
    }
});

// criar_fotografo({nome, email, pais, estado})
server.route({
    method: 'PUT',
    path: '/fotografo',
    handler: function (request, reply) {
        // reply('Hello, world!');
        // console.log(db);
        var fotografo = request.payload
        var novoFotografo = fotografos.push(fotografo)
        reply(novoFotografo.key)

    }
});
// alterar_fotografo({id, nome?, email?, pais?, estado?})
// pontuar({fotografo_id, imagem_id, valor})
// criar_empresa({nome, cnpj, pais, foto?, site?:[{nome, link}]})
// alterar_empresa({nome, cnpj, pais, foto?, site?:[{nome, link}]})

server.start((err) => {

    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`)
});