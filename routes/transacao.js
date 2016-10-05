// <Pixews Server>
// Copyright (C) 2016  Jackson Lucas <jackson7br@gmail.com>
var Joi = require('joi')
var db = require('../utilities/database.js')
var empresas = db.empresas
var fotografos = db.fotografos
var TokenGenerator = require('../utilities/token.js')
var Promise = require('bluebird')
var reqwest = Promise.promisify(require('request'))
var Boom = require('boom')
var debug = require('debug')('pixews:route:transacao')
var jsonfile = require('jsonfile')

// function getFotografoIdByImage (request, reply) {
//   return reqwest(`http:localhost:8983/solr/pixews/select?wt=json&indent=true&q=id:${request.query.foto_chave}`).then(function () {
//
//   })
// }

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
          currentValue = currentValue.concat(request.payload.foto_chaves)
        } else {
          currentValue = request.payload.foto_chaves
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

function addVenda (fotoId) {

  return new Promise (function (resolve, reject) {
    var file = `private/data/${fotoId}.json`
    jsonfile.readFile(file, function(err, obj) {
      if (err) debug(err)
      obj["vendas"] = obj["vendas"] + 1
      jsonfile.writeFile(file, obj, (error) => {
        if (error) {
          debug(error)
          reject(error)
        }
        debug('success updating')
        resolve()
      })
    })
  })
}

const put = {
  method: 'PUT',
  path: '/transacao',
  handler: function (request, reply) {

    request.payload.foto_chaves.every(addVenda)

    addCompraAsync(request, reply)
    .then(() => {
      return reply({message:'ok'})
    })
    .catch(error => {
      return reply(Boom.badRequest('Response Not Valid!'))
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
        foto_chaves: Joi.array().items(Joi.string()),
        empresa_chave: Joi.string()
      }).example({
          "foto_chaves": ["12"],
          "empresa_chave": "-VILWFyeto3QWooORdjr"
      })
    }
  }
}

module.exports = {
  'put': put
}