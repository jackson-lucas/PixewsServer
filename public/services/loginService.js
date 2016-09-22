(function () {

  function loginService ($window, apiService, $location, shoppingCartService) {

    var _login = {
      isLogged: $window.localStorage.isLogged,
      chave: $window.localStorage.chave,
      token: $window.localStorage.token
    };
    var _subscribers = []

    function subscribe (callback) {
      console.log('subscribed');
      console.log(callback);
      _subscribers.push(callback)
    }

    function _publish () {
      var index = 0

      _subscribers.every(function (subscriber) {
        if (subscriber)
          subscriber(_login)
      })
    }

    function get () {
      return _login
    }

    function login (email, senha) {
      apiService.login(email, senha)
        .then(function success (response) {
          console.log('logged')
          console.log(response)

          $window.localStorage.isLogged = true
          $window.localStorage.token = response.data.token
          $window.localStorage.chave = response.data.chave

          _login.isLogged = true
          _login.token = response.data.token
          _login.chave = response.data.chave

          _publish()
          $location.path('/')
        }, function error (response) {
          console.error(response);
          $.notify({
            title: '<strong>Aviso!</strong>',
            message: 'Falha ao Logar.'
          },{
            type: 'danger'
          });
        })
    }

    function logoff () {
      $window.localStorage.isLogged = false
      $window.localStorage.token = ''
      $window.localStorage.chave = ''

      shoppingCartService.removeAll()

      _login.isLogged = false
      _login.token = ''
      _login.chave = ''

      $location.path('/')
      _publish()
    }

    return {
      get: get,
      login: login,
      subscribe: subscribe,
      logoff: logoff
    }

  }

  angular.module('pixewsWeb').factory("loginService", loginService)
})()