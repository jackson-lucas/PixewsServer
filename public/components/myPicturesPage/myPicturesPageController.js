(function () {

function myPicturesPageController (
  $scope,
  results,
  $window,
  config
) {

  $scope.baseApi = config.baseApi

  console.log(results)

  $scope.results = results.data

  $scope.download = function (index, picture) {
    
  }
}

angular.module("pixewsWeb").controller('myPicturesPageController', myPicturesPageController)

})()