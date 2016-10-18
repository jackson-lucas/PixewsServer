angular.module('pixewsWeb', [
  'ngRoute',
  'ngTouch',
  'ngAnimate',
  'ngStorage',
  'angularModalService'
]);

angular.module('pixewsWeb').constant('config', {
  baseApi: 'http://ec2-52-23-224-27.compute-1.amazonaws.com',
  // baseApi: 'http://localhost:3000',
  publicToken: "2d7fEicnEirsPE"
})