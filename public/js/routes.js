(function () {

function routes($routeProvider) {

  $routeProvider
    .when("/", {
      templateUrl: "components/homePage/homePageTemplate.html",
      controller: "homePageController"
    })
    .when("/pesquisar", {
      templateUrl: "components/searchPage/searchPageTemplate.html",
      controller: "searchPageController",
      resolve: {
        results: function (apiService, $location) {
          return apiService.search($location.search().tags)
        }
      }
    })
    .when("/cadastrar", {
      templateUrl: "components/registerPage/registerPageTemplate.html",
      controller: "registerPageController"
    })
    .when("/login", {
      templateUrl: "components/loginPage/loginPageTemplate.html",
      controller: "loginPageController"
    })
    .when("/comprar/", {
      templateUrl: "components/buyPage/buyPageTemplate.html",
      controller: "buyPageController"
    })
    .when("/perfil", {
      templateUrl: "components/profilePage/profilePageTemplate.html",
      controller: "profilePageController",
      resolve: {
        user: function (apiService, $window) {
          return apiService.getUser($window.localStorage.getItem('chave'))
        }
      }
    })
    .when("/minhas-compras", {
      templateUrl: "components/myPicturesPage/myPicturesPageTemplate.html",
      controller: "myPicturesPageController",
      resolve: {
        results: function (apiService, $window) {
          return apiService.getMyPictures($window.localStorage.getItem('chave'))
        }
      }
    })

  // $routeProvider.otherwise({
  //   redirectTo: "/"
  // })
}

angular.module("pixewsWeb").config(routes)

})()