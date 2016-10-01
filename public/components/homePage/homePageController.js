(function () {

function homePageController ($scope, $location) {
  angular.element(document).ready(function () {
    $('.jumbotron').height(600)
    $('.jumbotron').css('margin-bottom', '0px')
  })

  $scope.checkSearch = function checkSearch(keyCode, tags) {
    // 'Enter' key code
    if (keyCode == 13) {
      $scope.search(tags);
    }
  }

  $scope.sendEmail = function sendEmail (name, email, message) {
    if (name && email && message) {
      $.notify({
        message: 'Email enviado com sucesso'
      },{
        type: 'success'
      });
    } else {
      $.notify({
        message: 'Campo vazio'
      },{
        type: 'danger'
      });
    }
  }

  $scope.search = function (tags) {
    tags = tags.split(' ').reduce(function (previous, current) {
      return previous + '+' + current
    })

    console.log('searching')
    $location.path('/pesquisar').search({
      'tags': tags
    });
    // .replace('\s', '+')
  }
}

angular.module("pixewsWeb").controller('homePageController', homePageController)

})()