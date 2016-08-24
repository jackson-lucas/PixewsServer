var Joi = require('joi')
var db = require('../utilities/database.js')
var empresas = db.empresas
var fotografos = db.fotografos
var TokenGenerator = require('../utilities/token.js')
var reqwest = require('request')

const get = {
  method: 'GET',
  path: '/imagem',
  handler: function (request, reply) {
    if(TokenGenerator.isValid(request.headers.token)) {

      reqwest(`http://ec2-54-197-15-18.compute-1.amazonaws.com:8983/solr/gettingstarted/select?wt=json&indent=true&q=id:${request.query.id}`, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          body = JSON.parse(body)
          reply(body.response.docs)
        } else {
          reply({})
        }
      })
    } else {
      reply({})
    }

  },
  config: {
    description: 'Busca de Imagem por Id',
    notes: `
    @required atributo token:string em Headers<br>
    @example api.pixews.com/imagem?id=2<br>
    @return SolrResponse`,
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
  'get': get
}