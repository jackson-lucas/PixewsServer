(function () {

function myPicturesPageController (
  $scope,
  results,
  $window,
  config
) {

  $scope.baseApi = config.baseApi

  console.log(results)

  $scope.results = results.data.filter( function( item, index, inputArray ) {
    return inputArray.indexOf(item) == index;
  });

  console.log($scope.results)

  $scope.download = function (index, picture) {

  }
}

angular.module("pixewsWeb").controller('myPicturesPageController', myPicturesPageController)

})()