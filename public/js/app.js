angular.module('pixewsWeb', [
  'ngRoute',
  'ngTouch',
  'ngAnimate',
  'angularModalService'
]);

angular.module('pixewsWeb').constant('config', {
  baseApi: 'http://api.pixews.com',
  // baseApi: 'http://localhost:3000',
  publicToken: "2d7fEicnEirsPE"
})