#!/usr/bin/env node
'use strict'
// "token": "8a73EicEi3Ersr"
var Joi = require('joi')
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
server.connection({
  host: process.env.HOSTNAME || 'localhost',
  port: process.env.PORT || 3000
})

server.register(
    [require('vision'), require('inert'), { register: require('lout') }],
    function(err) {
      console.log(err)
});

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

    reply({'token': token, 'chave': key, 'usuario': novoFotografo})
  },
  config: {
    description: 'Criar Fotografo',
    notes: '@return {token: string, chave: string, usuario: Fotografo}',
    validate: {
      payload: Joi.object({
        email: Joi.string().email(),
        nome: Joi.string(),
        senha: Joi.string(),
        estado: Joi.string(),
        pais: Joi.string()
      }).example({
        email: 'lyso@icomp.ufam.edu.br',
        senha: '123456',
        nome: 'Leandro Youiti Silva Okimoto',
        estado: 'AM',
        pais: 'Brasil'
      })
    }
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
    reply({'token': token, 'chave': key, 'usuario': novaEmpresa})
  },
  config: {
    description: 'Criar Empresa',
    notes: '@return {token: string, chave: string, usuario: Empresa}',
    validate: {
      payload: Joi.object({
        email: Joi.string().email(),
        senha: Joi.string(),
        cnpj: Joi.string(),
        nome: Joi.string(),
        pais: Joi.string()
      }).example({
        email: 'redetv@rede.tv',
        senha: '123456',
        cnpj: '58.245.453/0001-68',
        nome: 'Rede TV',
        pais: 'Brasil'
      })
    }
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

          reply({'token': token, 'chave': key, 'usuario': user})
        } else {
          reply({'erro': 401 })
        }
      })
  },
  config: {
    description: 'Login Empresa',
    notes: `@return 200 {token: string, chave: string, usuario: Empresa}</br>
            @return 401 {erro: 401}`,
    validate: {
      payload: Joi.object({
        email: Joi.string().email(),
        senha: Joi.string()
      }).example({
        email: 'redetv@rede.tv',
        senha: '123456'
      })
    }
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

          reply({'token': token, 'chave': key, 'usuario': user})
        } else {
          reply({'erro': 401 })
        }
      })
  },
  config: {
    description: 'Login Fotografo',
    notes: `@return 200 {token: string, chave: string, usuario: Fotografo}</br>
            @return 401 {erro: 401}`,
    validate: {
      payload: Joi.object({
        email: Joi.string().email(),
        senha: Joi.string()
      }).example({
        email: 'lyso@icomp.ufam.edu.br',
        senha: '123456'
      })
    }
  }
})

// alterar_empresa({nome, cnpj, pais, foto?, site?:[{nome, link}]})
server.route({
  method: 'PATCH',
  path: '/empresa',
  handler: function (request, reply) {
    if(TokenGenerator.isValid(request.payload.token)) {
      empresas.set(request.payload.user)
      reply({'mensagem': 'ok'})
    } else {
      reply({'mensagem': 'token not valid'})
    }
  },
  config: {
    description: 'Alterar Empresa',
    notes: `@return 200 {mensagem: "ok"}<br>
            @return 400 {mensagem: string}`,
    validate: {
      payload: Joi.object({
        token: Joi.string(),
        user: Joi.object({
          email: Joi.string().email().optional().notes('Opcional'),
          nome: Joi.string().optional().notes('Opcional'),
          pais: Joi.string().optional().notes('Opcional')
        })
      }).example({
        'token': '-KPLQFyeto3QWooOPdjr',
        'user': {
          'nome': 'Rede TV'
        }
      })
    }
  }
})

// alterar_fotografo({id, nome?, email?, pais?, estado?})
server.route({
  method: 'PATCH',
  path: '/fotografo',
  handler: function (request, reply) {
    if(TokenGenerator.isValid(request.payload.token)) {
      fotografos.child(request.payload.key).set(request.payload.user)
      reply({'mensagem': 'ok'})
    } else {
      reply({'mensagem': 'token not valid'})
    }
  },
  config: {
    description: 'Alterar Fotografo',
    notes: `@return 200 {mensagem: "ok"}<br>
            @return 400 {mensagem: string}`,
    validate: {
      payload: Joi.object({
        token: Joi.string(),
        user: Joi.object({
          nome: Joi.string().optional().notes('Opcional'),
          estado: Joi.string().optional().notes('Opcional'),
          pais: Joi.string().optional().notes('Opcional')
        })
      }).example({
        'token': '-KPLQFyeto3QWooOPdjr',
        'user': {
          'nome': 'Leandro Okimoto'
        }
      })
    }
  }
})

// pontuar({foto_id, empresa_id, fotografo_id})
server.route({
  method: 'PUT',
  path: '/transacao',
  handler: function (request, reply) {
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
})

server.start((err) => {

  if (err) {
    throw err
  }
  console.log(`Server running at: ${server.info.uri}`)
})
