(function () {

function registerPageController ($scope, apiService, $location) {

  function isRegistrationValid () {
    if($scope.name == null || $scope.name == ""
      || $scope.email == null || $scope.email == ""
      || $scope.cnpj == null || $scope.cnpj == ""
      || $scope.password == null || $scope.password == ""
      || $scope.passwordConfirmation == null || $scope.passwordConfirmation == ""){
      //alert("Campo vazio");
      $.notify({
        title: '<strong>Aviso!</strong>',
        message: 'Campo vazio.'
      },{
        type: 'danger'
      });
      return false;
    }

    var x = $scope.email;
    var atpos = x.indexOf("@");
    var dotpos = x.lastIndexOf(".");
    if (atpos<1 || dotpos<atpos+2 || dotpos+2>=x.length) {
        //alert("E-mail não válido");
        $.notify({
          title: '<strong>Aviso!</strong>',
          message: 'E-mail inválido.'
        },{
        type: 'danger'
      });
        return false;
    }

    var illegalChars = /[\W_]/; // allow only letters and numbers
    if ($scope.password.length < 4 || $scope.password.length > 16 || illegalChars.test($scope.password)) {
          
        //alert("Senha não aceita! Mínimo de 4 caracteres");
        $.notify({
          title: '<strong>Aviso!Senha inválida</strong>',
          message: 'Mínimo de 4 caracteres.'
        },{
        type: 'danger'
      });
        return false;
      }

      if ($scope.passwordConfirmation.length < 4 || $scope.password.length > 16 || illegalChars.test($scope.password)) {
        //alert("Senha não aceita! Mínimo de 4 caracteres");
        $.notify({
          title: '<strong>Aviso!Senha inválida</strong>',
          message: 'Caracteres inválidos ou insuficientes.'
        },{
        type: 'danger'
      });
        return false;
      }

      var illegalPass = /[0-9]+/; // allow only numbers
      if ($scope.cnpj.length < 14 || !illegalPass.test($scope.cnpj)) {
        //alert("CNPJ inválido!");
        $.notify({
        title: '<strong>Aviso!</strong>',
        message: 'CNPJ inválido.'
      },{
        type: 'danger'
      });
        return false;
      }

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