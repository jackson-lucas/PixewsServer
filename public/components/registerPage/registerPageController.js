(function () {

function registerPageController ($scope, apiService, $location) {

  function isRegistrationValid () {
    if ($scope.password != $scope.passwordConfirmation)
      return false
    return true
  }

  $scope.register = function () {
    var form = {
      email: $scope.email,
      senha: $scope.password,
      nome: $scope.name,
      cnpj: $scope.cnpj,
      pais: 'Brasil'
    }

    if (isRegistrationValid()) {
      apiService.register(form)
        .then(function (response) {
          console.log('registered');
          // TODO: Notify sucess
          $location.path('login')
        },
        function (response) {
          // TODO: Notify error
          console.error(response);
        }
      )
    } else {

      // TODO: Notify error
    }
  }
}

angular.module('pixewsWeb').controller('registerPageController', registerPageController)

})()