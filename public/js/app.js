angular.module('pixewsWeb', [
  'ngRoute',
  'ngTouch',
  'ngAnimate',
  'angularModalService'
]);

angular.module('pixewsWeb').constant('config', {
  baseApi: 'http://ec2-54-208-73-59.compute-1.amazonaws.com',
  // baseApi: 'http://localhost:3000',
  publicToken: "2d7fEicnEirsPE"
})