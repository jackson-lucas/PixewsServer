(function () {

function searchPageController (
  $scope,
  $location,
  results,
  ModalService,
  $window,
  shoppingCartService,
  config
) {

  $scope.baseApi = config.baseApi
  console.log('Search Page')
  console.log(results)

  // $scope.results = results.data.filter(shoppingCartService.isNotInShoppingCart)
  $scope.results = results.data

  $scope.addItem = function (index, picture) {
    $scope.results.splice(index, 1)
    shoppingCartService.add(picture.id)
  }

  $scope.showPicture = function (index, picture) {
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
        if (result.buyPicture) {
          $scope.addItem(result.index, result.picture)
        }
      });
    })
  }
}

angular.module("pixewsWeb").controller('searchPageController', searchPageController)

})()