// <Pixews Server>
// Copyright (C) 2016  Jackson Lucas <jackson7br@gmail.com>

var Joi = require('joi')
var db = require('../utilities/database.js')
var empresas = db.empresas
var fotografos = db.fotografos
var TokenGenerator = require('../utilities/imageToken.js')
var JsonFile = require('jsonfile')
var cmd = require('node-cmd')
var FileSystem = require('fs')
var debug = require('debug')('pixews:route:imagem')

const post = {
  method: 'POST',
  path: '/imagem',
  handler: function (request, reply) {
    // request.payload.vendas = [0]
    var info = JSON.parse(request.payload.info)
    info.id = TokenGenerator.generate()
    debug('info.extensao')
    debug(info)
    debug(info['extensao'])
    // Create and Store JSON file
    var file = `private/data/${info.id}.json`
    JsonFile.writeFile(file, info, function (error) {
      if (error) {

        debug('error' + error);
        reply(error)
      } else {
        debug('success')
        // Update Index
        // cmd.run(`java -jar post.jar ${file}`)
        cmd.run(`../solr/bin/post -c pixews ${file}`)
      }
    })

    // Create File in Private
    FileSystem.writeFile(`private/imagens/${info.id+'.'+info.extensao}`, request.payload.picture,
      (error) => {
        if (error) {
          console.error(error)
          reply(error)
        }
    })

    // TODO: Need watermark first
    FileSystem.writeFile(`public/imagens/${info.id+'.'+info.extensao}`, request.payload.picture,
      (error) => {
        if (error) {
          console.error(error)
          reply(new Error('Token not valid!'))
        }
    })

    reply(info.id)
  },
  config: {
    description: 'Criar Imagem',
    validate: {
      payload: Joi.object({
        info: Joi.string(),
        picture: Joi.binary()
      })
    }
  }
}

const get = {
  method: 'GET',
  path: '/imagem/extensao',
  handler: function (request, reply) {
    // request.payload.vendas = [0]
    if(TokenGenerator.isValid(request.headers.token)) {
      reqwest(`http:localhost:8983/solr/pixews/select?wt=json&indent=true&q=id:${request.query.id}`, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          body = JSON.parse(body)
          if (body.response) {
            reply(body.response.docs)
          } else {
            reply(body)
          }
        } else {
          reply(error)
        }
      })
    } else {
      reply(new Error('Token not valid!'))
    }


  },
  config: {
    description: 'Retornar Extensão da Imagem por Id',
    validate: {
      headers: Joi.object({
        token: Joi.string().required()
      }).options({ allowUnknown: true }),
      query: Joi.object({
        id: Joi.string()
      })
    }
  }
}

module.exports = {
  'post': post,
  'get': get
}