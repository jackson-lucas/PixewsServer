(function () {

function navbarController (
  $scope,
  $location,
  apiService,
  $window,
  shoppingCartService,
  loginService
) {

  $scope.login = loginService.get()

  var shoppingCart = shoppingCartService.get()

  $scope.hasItemsToBuy = shoppingCartService.hasItems()

  function subscription (_shoppingCart) {
    shoppingCart = _shoppingCart
    $scope.hasItemsToBuy = !!shoppingCart.length
    console.log('update');
    console.log($scope.hasItemsToBuy);
  }

  shoppingCartService.subscribe(subscription)

  $scope.changePage = function (pageName) {
    console.log('going to ' + pageName);
    $location.path(pageName)
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

  $scope.checkSearch = function checkSearch(keyCode, tags) {
    // 'Enter' key code
    if (keyCode == 13) {
      $scope.search(tags);
    }
  }

  $scope.logoff = function () {
    delete $window.localStorage.shoppingCart
    $scope.isLogged = false;
    loginService.logoff()
  }
}

angular.module("pixewsWeb").controller('navbarController', navbarController)

})()