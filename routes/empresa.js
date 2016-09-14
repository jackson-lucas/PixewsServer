// <Pixews Server>
// Copyright (C) 2016  Jackson Lucas <jackson7br@gmail.com>

var Joi = require('joi')
var db = require('../utilities/database.js')
var empresas = db.empresas
var fotografos = db.fotografos
var TokenGenerator = require('../utilities/token.js')

const get = {
  method: 'GET',
  path: '/empresa',
  handler: function (request, reply) {
    if(TokenGenerator.isValid(request.headers.token)) {
      empresas.child(request.query.chave).on('value', function (snapshot) {
        var empresa = snapshot.val()
        delete empresa.senha

        reply(empresa)
      })
    }
  },
  config: {
    description: 'Retornar Empresa',
    notes: `
    @required atributo token:string em Headers<br>
    @example /empresa?chave=-KPO80sjVWDUy4ATCZc9<br>
    @return Empresa`,
    validate: {
      headers: Joi.object({
        token: Joi.string().required()
      }).options({ allowUnknown: true }),
      query: Joi.object({
        chave: Joi.string()
      })
    }
  }
}

const getImagens = {
  method: 'GET',
  path: '/empresa/imagens',
  handler: function (request, reply) {
    if(TokenGenerator.isValid(request.headers.token)) {
      empresas.child(request.query.chave).on('value', function (snapshot) {
        var empresa = snapshot.val()

        reply(empresa.compras)
      })
    }
  },
  config: {
    description: 'Retornar Imagens de uma Empresa',
    notes: `
    @required atributo token:string em Headers<br>
    @example /empresa?chave=-KPO80sjVWDUy4ATCZc9<br>
    @return Array<Id's de Imagens>`,
    validate: {
      headers: Joi.object({
        token: Joi.string().required()
      }).options({ allowUnknown: true }),
      query: Joi.object({
        chave: Joi.string()
      })
    }
  }
}

const put = {
  method: 'PUT',
  path: '/empresa',
  handler: function (request, reply) {
    var empresa = request.payload
    var novaReferencia = empresas.push(empresa)
    var token = TokenGenerator.generate()
    var key = novaReferencia.key
    reply({'token': token, 'chave': key})
  },
  config: {
    description: 'Criar Empresa',
    notes: '@return {token: string, chave: string}',
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
}

const post = {
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
        if (!user) {
          return reply(new Error('User Not Found!'))
        }
        key = Object.keys(user)[0]
        user = user[key]

        if (user.senha == request.payload.senha) {
          token = TokenGenerator.generate()

          delete user.senha

          reply({'token': token, 'chave': key, 'usuario': user, 'limit': request.payload.limit})
        } else {
          reply(new Error('User Credentials Not Valid!'))
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
}

const patch = {
  method: 'PATCH',
  path: '/empresa',
  handler: function (request, reply) {
    if(TokenGenerator.isValid(request.headers.token)) {
      empresas.child(request.payload.chave).update(request.payload.user)
      reply({'mensagem': 'ok'})
    } else {
      reply(new Error('Token not valid!'))
    }
  },
  config: {
    description: 'Alterar Empresa',
    notes: `@required atributo token:string em Headers<br>
            @return 200 {mensagem: "ok"}<br>
            @return 400 {mensagem: string}`,
    validate: {
      headers: Joi.object({
        token: Joi.string().required()
      }).options({ allowUnknown: true }),
      payload: Joi.object({
        chave: Joi.string().required(),
        user: Joi.object({
          email: Joi.string().email().optional().notes('Opcional'),
          nome: Joi.string().optional().notes('Opcional'),
          pais: Joi.string().optional().notes('Opcional')
        })
      }).example({
        'chave': '-KQ1anjlocpsi-zSshkt',
        'user': {
          'nome': 'Rede TV'
        }
      })
    }
  }
}

module.exports = {
  'get': get,
  'getImagens': getImagens,
  'put': put,
  'post': post,
  'patch': patch
}