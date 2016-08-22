var Joi = require('joi')
var db = require('../utilities/database.js')
var empresas = db.empresas
var fotografos = db.fotografos
var TokenGenerator = require('../utilities/token.js')
var reqwest = require('request')

const get = {
  method: 'GET',
  path: '/imagens',
  handler: function (request, reply) {
    if(TokenGenerator.isValid(request.headers.token)) {
      var query = ''
      var parameters = request.query.tags.split(' ')

      query = '%2B' + parameters[0]

      var index;
      for (index = 1; index < parameters.length; index++) {
        query += '+%2B' + parameters[index]
      }

      reqwest(`http://ec2-54-197-15-18.compute-1.amazonaws.com:8983/solr/gettingstarted/select?wt=json&indent=true&q=${query}`, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          reply(body)
        } else {
          reply({})
        }
      })


      // request(`http://ec2-54-197-15-18.compute-1.amazonaws.com:8983/solr/gettingstarted/select?wt=json&indent=true&q=`, function (error, response, body) {
      //   if (!error && response.statusCode == 200) {
      //     console.log(body) // Show the HTML for the Google homepage.
      //   }
      // })
    } else {
      reply({})
    }

  },
  config: {
    description: 'Busca de Imagens por Tags',
    notes: `
    @required atributo token:string em Headers<br>
    @example api.pixews.com/imagens?tags=<br>
    @return Imagem[]`,
    validate: {
      headers: Joi.object({
        token: Joi.string().required()
      }).options({ allowUnknown: true }),
      query: Joi.object({
        tags: Joi.string()
      })
    }
  }
}

module.exports = {
  'get': get
}