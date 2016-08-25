// <Pixews Server>
// Copyright (C) 2016  Jackson Lucas <jackson7br@gmail.com>

var Joi = require('joi')
var db = require('../utilities/database.js')
var empresas = db.empresas
var fotografos = db.fotografos
var TokenGenerator = require('../utilities/token.js')

const put = {
  method: 'PUT',
  path: '/transacao',
  handler: function (request, reply) {
    reply('ok')
    // // Atualizando pontuação do fotografo
    // var fotografoReference
    // = fotografos.child(request.payload.fotografo_chave).limitToFirst(1)
    //
    // fotografoReference.on('value', function (snapshot) {
    //   var fotografo = snapshot.val()
    //   console.log('fotografo')
    //   console.log(fotografo)
    //   fotografo.pontos = parseInt(fotografo.pontos) + 30
    //   console.log(fotografo.pontos)
    //   fotografos
    //     .child(request.payload.fotografo_chave)
    //     .update({'pontos': fotografo.pontos})
    // })
    //
    // // Atualizando compras da empresa
    // var empresaReference
    // = empresas
    //   .child(request.payload.empresa_key)
    //   .on('value', function (snapshot) {
    //     var empresa = snapshot.val()
    //     console.log(empresa)
    //     // TODO analisar como array se comporta no firebase, se é possível fazer push manual
    //     // empresa.compras.push(request.payload.foto_key)
    //   })
  },
  config: {
    description: 'Registrar Compra - <strong>Em Desenvolvimento</strong>',
    notes: `@return 200 {mensagem: "ok"}<br>
            @return 400 {mensagem: string}`,
    validate: {
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