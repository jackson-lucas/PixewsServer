(function () {

function apiService($http, config) {

  function _getUser (id) {
    var req = {
      method: 'GET',
      url: config.baseApi + "/empresa",
      //query string params
      params: {
        'chave': id
      },
      paramSerializer: '$httpParamSerializerJQLike',
      headers: {
        'token': config.publicToken
      }
    };
    return $http(req);
  }

  function _search (tags) {
    var req = {
      method: 'GET',
      url: config.baseApi + "/imagens",
      //query string params
      params: {
        'tags': tags
      },
      paramSerializer: '$httpParamSerializerJQLike',
      headers: {
        'token': config.publicToken
      }
    };
    return $http(req);
  };

  function _login (email, senha) {
    var req = {
      method: 'POST',
      url: config.baseApi + "/empresa",
      paramSerializer: '$httpParamSerializerJQLike',
      data: {
        'email': email,
        'senha': senha
      }
    };
    return $http(req);
  };

  function _register (form) {
    var req = {
      method: 'PUT',
      url: config.baseApi + "/empresa",
      paramSerializer: '$httpParamSerializerJQLike',
      data: form
    };
    return $http(req);
  };

  function _buy (form) {
    var req = {
      method: 'PUT',
      url: config.baseApi + "/transacao",
      paramSerializer: '$httpParamSerializerJQLike',
      data: form
    };
    return $http(req);
  };


  function _getMyPictures (enterpriseId) {
    var req = {
      method: 'GET',
      url: config.baseApi + "/empresa/imagens",
      //query string params
      params: {
        'chave': enterpriseId
      },
      paramSerializer: '$httpParamSerializerJQLike',
      headers: {
        'token': config.publicToken
      }
    };
    return $http(req);
  }

  return {
    'getUser': _getUser,
    'search': _search,
    'login': _login,
    'register': _register,
    'buy': _buy,
    'getMyPictures': _getMyPictures
  }

}

angular.module("pixewsWeb").factory("apiService", apiService)

})()