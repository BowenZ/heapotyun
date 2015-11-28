define(['angular', 'ui.router', 'js/controller/controllers', 'js/service/services'], function(angular) {
    'use strict';
    var App = angular.module('App', ['ui.router', 'appServices', 'appControllers']);

    App.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
        /*$locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });*/
        $urlRouterProvider.otherwise('/');
        $stateProvider.
        state('car', {
            url: '/car',
            views: {
                'view-content': {
                    templateUrl: 'views/index/car.html',
                    controller: 'CarController as carCtrl'
                }
            }
        }).
        state('fix', {
            url: '/fix',
            views: {
                'view-content': {
                    templateUrl: 'views/index/fix.html',
                    controller: 'FixController as fixCtrl'
                }
            }
        }).
        state('maintenance', {
            url: '/maintenance',
            views: {
                'view-content': {
                    templateUrl: 'views/index/maintenance.html',
                    controller: 'MaintenanceController as mtncCtrl'
                }
            }
        }).
        state('insurance', {
            url: '/insurance',
            views: {
                'view-content': {
                    templateUrl: 'views/index/insurance.html',
                    controller: 'InsuranceController as insuranceCtrl'
                }
            }
        });
    }]);

    App.bootstrap = function() {
        angular.element(document).ready(function() {
            angular.bootstrap(document, ['App']);
        });
    }
    return App;
});
