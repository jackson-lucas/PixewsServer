(function () {

function profilePageController (
  $scope,
  user
) {

  console.log(user)
  $scope.user = user.data

}

angular.module("pixewsWeb").controller('profilePageController', profilePageController)

})()