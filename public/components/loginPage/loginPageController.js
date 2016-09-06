(function () {

function loginPageController ($scope, $window, apiService) {

  $scope.login = function (email, senha) {
    apiService.login(email, senha)
      .then(function success (response) {
        console.log('logged')
        console.log(response)
        $window.localStorage.token = response.data.token
        $window.localStorage.usuario = response.data.usuario
        $window.localStorage.chave = response.data.chave
      }, function error (response) {
        console.error(response)
      })
  }
}

angular.module("pixewsWeb").controller('loginPageController', loginPageController)

})()