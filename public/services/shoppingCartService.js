(function () {

function shoppingCartService($window) {

  var _shoppingCart = []
  var _subscribers = []

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
    }

    publish()
  }

  function remove (pictureId) {
    _shoppingCart.splice(pictureId, 1)

    publish()
  }

  function removeAll () {
    console.log('removeAll')

    _shoppingCart = []

    publish()
  }

  function isNotInShoppingCart (picture) {
    var index
    for (index = 0; index < _shoppingCart.length; index++) {
      if (_shoppingCart[index].id == picture.id) {
        return false
      }
    }

    return true
  }

  return {
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