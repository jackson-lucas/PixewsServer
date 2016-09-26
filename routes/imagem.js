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
var fs = require('fs')

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

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        cmd.run(`echo '${e}' >> public/log.txt`)
        return false;
    }
    return true;
}

const post = {
  method: 'POST',
  path: '/upload',
  handler: function (request, reply) {
    var id = TokenGenerator.generate()

    // reply({'id': id})
    // request.payload.vendas = [0]
    debug('>>>>>>>>>>>>>>> PATH UPLOAD <<<<<<<<<<<<<<<<<<')
    cmd.run(`echo '>>>>>>>>>>>>>>> PATH UPLOAD <<<<<<<<<<<<<<<<<<' >> public/log.txt`)
    cmd.run(`echo '${request.payload}' >> public/log.txt`)
    cmd.run(`echo 'picture' >> public/log.txt`)
    cmd.run(`echo '${request.payload.picture}' >> public/log.txt`)
    cmd.run(`echo 'description' >> public/log.txt`)
    cmd.run(`echo '${request.payload.description}' >> public/log.txt`)
    cmd.run(`echo 'type' >> public/log.txt`)
    cmd.run(`echo '${request.payload.type}' >> public/log.txt`)
    cmd.run(`echo '^ PAYLOAD ^' >> public/log.txt`)
    // cmd.run(`echo '${request.payload.description}' >> public/log.txt`)
    // cmd.run(`echo 'picture' >> public/log.txt`)
    // cmd.run(`echo '${request.payload.picture}' >> public/log.txt`)
    // IsJsonString(request.payload.description)
    //
    // var data = request.payload;
    // if (data.picture) {
    //     var name = data.picture.hapi.filename;
    //     cmd.run(`echo 'nome do arquivo: ${name}' >> public/log.txt`)
    //     var path = "private/data/" + name;
    //     var file = fs.createWriteStream(path);
    //
    //     file.on('error', function (err) {
    //       if (err) {
    //         cmd.run(`echo '${err}' >> public/log.txt`)
    //       }
    //         console.error(err)
    //     });
    //
    //     data.picture.pipe(file);
    //
    //     data.picture.on('end', function (err) {
    //       if (err) {
    //         cmd.run(`echo '${err}' >> public/log.txt`)
    //       }
    //         cmd.run(`echo 'terminou de ler o arquivo' >> public/log.txt`)
    //         var ret = {
    //             filename: data.picture.hapi.filename,
    //             headers: data.picture.hapi.headers
    //         }
    //         reply(JSON.stringify(ret));
    //     })
    // }
    // debug(request.payload.description)
    // debug('picture')
    // debug(request.payload.picture)
    // if (request.payload.picture) {
    //   cmd.run(`echo '${request.payload.picture[0]}' >> public/log.txt`)
    //   debug(request.payload.picture[0])
    // }
    //
    // var data = request.payload;
    // if (data.picture) {
    //   var name = data.picture.hapi.filename;
    //   debug(name)
    //   cmd.run(`echo 'nome do arquivo: ${name}' >> public/log.txt`)
    // }
    //
    var description = JSON.parse(request.payload.description)
    description.id = id


    debug('file')
    // debug(request.payload.picture)
    var picture;

    if (request.payload.type == 'BINARY') {
      picture = request.payload.picture
    } else {
      var data = request.payload.picture.split(',', 2)
      // debug(data)
      picture = new Buffer(data[1], 'base64')
    }

    debug('description.extensao')
    description.fotografo_id = description.fotografo_id.replace(/-/g,'')
    debug(description)

    // Create and Store JSON file
    var file = `private/data/${description.id}.json`
    JsonFile.writeFile(file, description, function (error) {
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
    FileSystem.writeFile(`private/imagens/${description.id+'.'+description.extensao}`, picture,
      (error) => {
        if (error) {
          debug(error)
          reply(error)
        }
    })

    FileSystem.writeFile(`public/imagens/${description.id+'.'+description.extensao}`, picture,
      (error) => {
        if (error) {
          debug(error)
          reply(new Error('Token not valid!'))
        } else {
          watermarkImage(`public/imagens/${description.id+'.'+description.extensao}`);
        }
      })

    cmd.run(`echo 'id: ${description.id}' >> public/log.txt`)

    reply({'id': id})
  },
  config: {
    description: 'Criar Imagem'
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
    debug('rota imagem/extensao')
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