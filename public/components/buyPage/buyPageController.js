(function () {

function buyPageController (
  $scope,
  $location,
  $window,
  ModalService,
  shoppingCartService,
  config
) {

  $scope.baseApi = config.baseApi
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
      // request data
      // $scope.items.every(function (item) {
      //
      // })
    } else {
      $location.path('login')
    }
  }

  $scope.showPicture = function (index, picture) {
    console.log('showing picture')
    console.log(picture)

    ModalService.showModal({
      templateUrl: "components/pictureModal/pictureModalTemplate.html",
      controller: "pictureModalController",
      inputs: {
        picture: picture,
        index: index,
        baseApi: config.baseApi
      }
    }).then(function(modal) {
      modal.element.modal();
      modal.close.then(function(result) {

      });
    })
  }
}

angular.module("pixewsWeb").controller('buyPageController', buyPageController)

})()