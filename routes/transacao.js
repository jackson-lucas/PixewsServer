// <Pixews Server>
// Copyright (C) 2016  Jackson Lucas <jackson7br@gmail.com>

var Joi = require('joi')
var db = require('../utilities/database.js')
var empresas = db.empresas
var fotografos = db.fotografos
var TokenGenerator = require('../utilities/token.js')
var Promise = require('bluebird')

const put = {
  method: 'PUT',
  path: '/transacao',
  handler: function (request, reply) {
    // Atualizando pontuação do fotografo
    // TODO Apply chain of events, promise, async or highland
    var pontos = db.source.ref(`/fotografos/${request.payload.fotografo_chave}/pontos`)
    pontos.transaction(function (currentValue) {
      return (currentValue || 0) + 30
    },
    function (error, isCommitted, snapshot) {
      console.log(snapshot.val())
      if (isCommitted) {
        reply('ok')
        return
      }
      if (error) {
        console.error(error)
        reply('erro')
        return
      }
    })

    // Atualizando compras da empresa
    // var empresaReference
    // = empresas
    //   .child(request.payload.empresa_key)
    //   .on('value', function (snapshot) {
    //     var empresa = snapshot.val()
    //     console.log(empresa)
    //     // TODO analisar como array se comporta no firebase, se é possível fazer push manual
    //     // empresa.compras.push(request.payload.foto_key)
      // })
  },
  config: {
    description: 'Registrar Compra - <strong>Em Desenvolvimento</strong>',
    notes: `@return 200 {mensagem: "ok"}<br>
            @return 400 {mensagem: string}`,
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