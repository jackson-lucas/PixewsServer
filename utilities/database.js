var firebase = require('firebase')

firebase.initializeApp({
  serviceAccount: './firebaseCredentials.json',
  databaseURL: 'https://pixews-a5861.firebaseio.com'
})

var db = firebase.database()
var empresas = db.ref('/empresas')
var fotografos = db.ref('/fotografos')

module.exports = {
  'empresas': empresas,
  'fotografos': fotografos
}