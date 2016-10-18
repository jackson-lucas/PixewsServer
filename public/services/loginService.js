(function () {

  function loginService ($window, apiService, $location, $localStorage, shoppingCartService) {

    var _login = {
      isLogged: $localStorage.isLogged,
      chave: $localStorage.chave,
      token: $localStorage.token
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
        .then(function (response) {
          console.log('logged')
          console.log(response)

          $localStorage.isLogged = true
          $localStorage.token = response.data.token
          $localStorage.chave = response.data.chave

          _login.isLogged = true
          _login.token = response.data.token
          _login.chave = response.data.chave

          _publish()
          $location.path('/')
        }, function (response) {
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
      $localStorage.isLogged = false
      $localStorage.token = ''
      $localStorage.chave = ''

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