(function () {

function shoppingCartService($window) {

  var _shoppingCart
    = $window.localStorage.getItem('shoppingCart') ? $window.localStorage.getItem('shoppingCart').split(',') : []
  var _subscribers = []

  function hasItems () {
    return !!_shoppingCart.length
  }

  function get () {
    return _shoppingCart
  }

  function subscribe (callback) {
    console.log('subscribed');
    console.log(callback);
    _subscribers.push(callback)
  }

  function publish () {
    var index = 0

    _subscribers.every(function (subscriber) {
      if (subscriber)
        subscriber(_shoppingCart)
    })
  }

  function add (picture) {
    console.log('adding');
    if (_shoppingCart.indexOf(picture) == -1) {
      _shoppingCart.push(picture)
      $window.localStorage.shoppingCart = _shoppingCart
    }

    publish()
  }

  function remove (pictureId) {
    var index = _shoppingCart.indexOf(pictureId)
    _shoppingCart.splice(index, 1)
    $window.localStorage.shoppingCart = _shoppingCart

    publish()
  }

  function removeAll () {
    console.log('removeAll')

    _shoppingCart = []
    $window.localStorage.shoppingCart = _shoppingCart

    publish()
  }

  function isNotInShoppingCart (picture) {
    var index
    for (index = 0; index < _shoppingCart.length; index++) {
      if (_shoppingCart.id == picture.id) {
        return false
      }
    }

    return true
  }

  return {
    hasItems: hasItems,
    get: get,
    subscribe: subscribe,
    publish: publish,
    add: add,
    remove: remove,
    removeAll: removeAll,
    isNotInShoppingCart: isNotInShoppingCart
  }

}

angular.module("pixewsWeb").factory("shoppingCartService", shoppingCartService)

})()