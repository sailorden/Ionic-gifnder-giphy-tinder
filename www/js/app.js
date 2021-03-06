// Ionic Starter App, v0.9.20

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ionic.contrib.ui.tinderCards', 'starter.services'])


.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('tabs',
    {
      url: '/tab',
      abstract: true,
      templateUrl: 'templates/tabs.html'
    })
    .state('tabs.trending',{
      url: '/trending',
      views: {
        'tab-trending':{
          templateUrl: 'templates/tab-trending.html',
          controller: 'CardsCtrl'
        }
      }
    })
    .state('tabs.favorites',{
      url: '/favorites',
      views:{
        'tab-favorites':{
          templateUrl: 'templates/tab-favorites.html',
          controller: 'FavoritesCtrl'
        }
      }
    });
    $urlRouterProvider.otherwise('tab/trending');
})

.directive('noScroll', function($document) {

  return {
    restrict: 'A',
    link: function($scope, $element, $attr) {

      $document.on('touchmove', function(e) {
        e.preventDefault();
      });
    }
  }
})

.controller('CardsCtrl', function($scope, TDCardDelegate, giphyService) {
  console.log('CARDS CTRL');
  var cardTypes = [];
  var refreshes = 0;

  giphyService.trending(refreshes, function(resp){
    console.log(resp);
    angular.forEach(resp.data, function(giphy){
      //console.log(giphy.images.fixed_width.url + ' '+giphy.id);
      cardTypes.push({ image: giphy.images.fixed_width.url, id: giphy.id, width: giphy.images.fixed_width.width, height:giphy.images.fixed_width.height})
    })
    $scope.cards = cardTypes;
  });

  $scope.cardDestroyed = function(index) {
    $scope.cards.splice(index, 1);
  };

  $scope.addCards = function() {
    refreshes++;
    giphyService.trending(refreshes, function(resp){
      console.log(resp);
      angular.forEach(resp.data, function(giphy){
        //console.log(giphy.images.fixed_width.url + ' '+giphy.id);
        cardTypes.push({ image: giphy.images.fixed_width.url, id: giphy.id})
      })
      $scope.cards = cardTypes;
    });
  };
  $scope.cardSwipedLeft = function(card) {
    console.log('LEFT SWIPE');
    if($scope.cards.length === 0){
      $scope.addCards();
    }
  };
  $scope.cardSwipedRight = function(card) {
    console.log('RIGHT SWIPE');
    favorites.addFavorite(card);
    if($scope.cards.length === 0){
      $scope.addCards();
    }
  };

  $scope.cardSwiped = function(index){
    console.log('SWIPED'+index);
  };
  $scope.transitionOut = function(card) {
    console.log('card transition out');
  };
   
  $scope.transitionRight = function(card) {
    console.log('card removed to the right');
    console.log(card); 
  };

  $scope.transitionLeft = function(card) {
    console.log('card removed to the left');
    console.log(card);
  };
})

.controller('CardCtrl', function($scope, TDCardDelegate, favorites) {

  $scope.nope = function(card){
    console.log(card);
    if($scope.cards.length === 0){
      $scope.addCards();
    }
  };
  $scope.like = function(card){
    console.log(card);
    favorites.addFavorite(card);
  };
})
.controller('FavoritesCtrl', function($scope,TDCardDelegate, favorites){
  $scope.cards = favorites.clearFavorites();

  $scope.$on("$ionicView.enter", function(scope, states){
    $scope.cards = favorites.getFavorites();
  })
});
