define(['angular', 'angular-route', 'js/controller/controllers', 'js/service/services'], function(angular) {
    'use strict';
    var App = angular.module('App', ['ngRoute', 'appServices', 'appControllers']);

    App.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
        /*$locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });*/
        $routeProvider.
        when('/index', {
            templateUrl: 'partials/page_index.html',
            controller: 'IndexController as indexCtrl'
        }).
        otherwise({
            redirectTo: '/index'
        });
    }]);

    App.bootstrap = function() {
        angular.element(document).ready(function() {
            angular.bootstrap(document, ['App']);
        });
    }
    return App;
});
