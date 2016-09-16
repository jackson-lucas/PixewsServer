// <Pixews Server>
// Copyright (C) 2016  Jackson Lucas <jackson7br@gmail.com>
var Joi = require('joi')
var db = require('../utilities/database.js')
var empresas = db.empresas
var fotografos = db.fotografos
var TokenGenerator = require('../utilities/token.js')
var Promise = require('bluebird')
var Boom = require('boom')

function addPointsAsync(request, reply) {
  return new Promise (function (resolve, reject) {

    var pontos = db.source.ref(`/fotografos/${request.payload.fotografo_chave}/pontos`)

    pontos.transaction(
      function (currentValue) {
        return (currentValue || 0) + 30
      },
      function (error, isCommitted, snapshot) {
        // console.log(snapshot.val())
        if (isCommitted) {
          resolve()
        } else {
          reject(error)
        }
    })
  })
}

function addCompraAsync(request, reply) {
  return new Promise (function (resolve, reject) {
    var comprasReference
    = db.source.ref(`/empresas/${request.payload.empresa_chave}/compras`)

    comprasReference.transaction(
      function (currentValue) {
        if (currentValue) {
          currentValue.push(request.payload.foto_chave)
        } else {
          currentValue = [request.payload.foto_chave]
        }
        return currentValue
      },
      function (error, isCommitted, snapshot) {
        // console.log(snapshot.val())
        if (isCommitted) {
          resolve()
        } else {
          reject(error)
        }
    })
  })
}

const put = {
  method: 'PUT',
  path: '/transacao',
  handler: function (request, reply) {

    // TODO: Add +1 on picture sold
    Promise.all(
      [addPointsAsync(request, reply), addCompraAsync(request, reply)
    ])
    .then(() => {
      reply({message:'ok'})
    })
    .catch(error => {
      reply(Boom.badRequest('Response Not Valid!'))
    })

  },
  config: {
    description: 'Registrar Compra',
    notes: `@return 200 {mensagem: "ok"}<br>
            @return 400 {mensagem: "erro"}`,
    validate: {
      headers: Joi.object({
        token: Joi.string().required()
      }).options({ allowUnknown: true }),
      payload: Joi.object({
        foto_chave: Joi.string(),
        fotografo_chave: Joi.string(),
        empresa_chave: Joi.string()
      }).example({
          "foto_chave": "12",
          "fotografo_chave": "-KPLQFyeto3QWooOPdjr",
          "empresa_chave": "-VILWFyeto3QWooORdjr"
      })
    }
  }
}

module.exports = {
  'put': put
}