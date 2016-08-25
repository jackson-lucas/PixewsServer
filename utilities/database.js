// <Pixews Server>
// Copyright (C) 2016  Jackson Lucas <jackson7br@gmail.com>

var firebase = require('firebase')

firebase.initializeApp({
  serviceAccount: './firebaseCredentials.json',
  databaseURL: 'https://pixews-a5861.firebaseio.com'
})

var db = firebase.database()
var empresas = db.ref('/empresas')
var fotografos = db.ref('/fotografos')

module.exports = {
  'source': db,
  'empresas': empresas,
  'fotografos': fotografos
}