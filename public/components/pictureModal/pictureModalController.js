(function () {
  function pictureModalController ($scope, $element, index, picture, close, baseApi) {
    console.log('opening');
    $scope.picture = picture
    $scope.index = index
    $scope.baseApi = baseApi
    $scope.buyPicture = false
    //  This close function doesn't need to use jQuery or bootstrap, because
    //  the button has the 'data-dismiss' attribute.
    $scope.close = function() {
   	  close({
        picture: $scope.picture,
        index: $scope.index,
        buyPicture: $scope.buyPicture
      }, 500); // close, but give 500ms for bootstrap to animate
    }

    //  This cancel function must use the bootstrap, 'modal' function because
    //  the doesn't have the 'data-dismiss' attribute.
    $scope.cancel = function() {
      //  Manually hide the modal.
      $element.modal('hide')

      //  Now call close, returning control to the caller.
      close({
        picture: $scope.picture,
        index: $scope.index,
        buyPicture: $scope.buyPicture
      }, 500); // close, but give 500ms for bootstrap to animate
    }

    $scope.buy = function () {
      close({
        picture: $scope.picture,
        index: $scope.index,
        buyPicture: true
      }, 500)
    }

  }

  angular.module("pixewsWeb").controller('pictureModalController', pictureModalController)
})()