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
    shoppingCartService.add(picture)
  }

  $scope.showPicture = function (picture) {
    ModalService.showModal({
      templateUrl: "components/pictureModal/pictureModalTemplate.html",
      controller: "pictureModalController",
      inputs: {
        title: "A More Complex Example",
        picture: picture,
        baseApi: config.baseApi
      }
    }).then(function(modal) {
      modal.element.modal();
      modal.close.then(function(result) {
        $scope.complexResult  = "Name: " + result.name + ", age: " + result.age;
      });
    })
  }
}

angular.module("pixewsWeb").controller('searchPageController', searchPageController)

})()