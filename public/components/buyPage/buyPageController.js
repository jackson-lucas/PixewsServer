(function () {

function buyPageController (
  $scope,
  $location,
  $window,
  ModalService,
  shoppingCartService
) {

  $scope.items = shoppingCartService.get()

  console.log($scope.items);

  function subscription (shoppingCart) {
    $scope.items = shoppingCart
  }

  shoppingCartService.subscribe(subscription)

  $scope.removeAll = function () {
    shoppingCartService.removeAll()
    $location.path('/')
  }

  $scope.removeItem = shoppingCartService.remove

  $scope.buy = function () {
    var isLogged = !!$window.localStorage.getItem('chave')

    if (isLogged) {
      // do transaction
    } else {
      $location.path('login')
    }
  }

  $scope.showPicture = function (picture) {
    console.log('showing picture')
    console.log(picture)

    ModalService.showModal({
      templateUrl: "components/pictureModal/pictureModalTemplate.html",
      controller: "pictureModalController",
      inputs: {
        title: "A More Complex Example",
        picture: picture
      }
    }).then(function(modal) {
      modal.element.modal();
      modal.close.then(function(result) {
        $scope.complexResult  = "Name: " + result.name + ", age: " + result.age;
      });
    })
  }
}

angular.module("pixewsWeb").controller('buyPageController', buyPageController)

})()