// <Pixews Server>
// Copyright (C) 2016  Jackson Lucas <jackson7br@gmail.com>

var Joi = require('joi')
var db = require('../utilities/database.js')
var empresas = db.empresas
var fotografos = db.fotografos
var TokenGenerator = require('../utilities/imageToken.js')
var reqwest = require('request')
var JsonFile = require('jsonfile')
var cmd = require('node-cmd')
var FileSystem = require('fs')
var debug = require('debug')('pixews:route:imagem')
var Boom = require('boom')
var watermark = require('image-watermark');

function watermarkImage(path) {
  debug('watermarking:'+path)
  watermark.embedWatermarkWithCb(
    path,
    {
      'text' : 'Pixews ®',
      'override-image': 'true'
    },
    function (error) {
      if (!error) debug('success watermarking')
      debug(error)
    }
  )
}

const post = {
  method: 'POST',
  path: '/imagem',
  handler: function (request, reply) {
    debug('file')
    debug(request.payload.info)
    debug(JSON.parse(request.payload.info))
    var info = JSON.parse(request.payload.info)
    info.id = TokenGenerator.generate()

    // debug(request.payload.picture)
    debug('info.extensao')
    info.fotografo_id = info.fotografo_id.replace(/-/g,'')
    debug(info)

    // Create and Store JSON file
    var file = `private/data/${info.id}.json`
    JsonFile.writeFile(file, info, function (error) {
      if (error) {

        debug('error: ' + error);
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
          debug(error)
          reply(error)
        }
    })

    // TODO: Need watermark first
    FileSystem.writeFile(`public/imagens/${info.id+'.'+info.extensao}`, request.payload.picture,
      (error) => {
        if (error) {
          debug(error)
          reply(new Error('Token not valid!'))
        } else {
          watermarkImage(`public/imagens/${info.id+'.'+info.extensao}`);
        }

    })

    reply({'id': info.id})
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
  path: '/imagem',
  handler: function (request, reply) {
    debug('get imagem')
    // debug(TokenGenerator.generate())

    if(TokenGenerator.isValid(request.headers.token)) {
      reqwest(`http:localhost:8983/solr/pixews/select?wt=json&indent=true&q=id:${request.query.id}`, function (error, response, body) {
        debug(error, response, body)
        if (!error && response.statusCode == 200) {
          debug(body)
          body = JSON.parse(body)
          if (body.response) {
            reply(body.response.docs)
          } else {
            reply(body)
          }
        } else {
          reply(Boom.badRequest('Response Not Valid!'))
        }
      })
    } else {
      reply(Boom.badRequest('Token not valid!'))
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

const getExtension = {
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
          reply(Boom.badRequest('Response Not Valid!'))
        }
      })
    } else {
      reply(Boom.badRequest('Token not valid!'))
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
  'get': get,
  'getExtension': getExtension
}