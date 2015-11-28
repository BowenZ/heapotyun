define(['angular', 'ui.router', 'js/controller/admin_controllers'], function(angular) {
    'use strict';
    var App = angular.module('App', ['ui.router', 'appServices', 'adminControllers']);

    App.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
        /*$locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });*/
        $urlRouterProvider.otherwise('/buycar');
        $stateProvider.
        state('buycar', {
            url: '/buycar',
            views: {
                'admin-view': {
                    templateUrl: 'views/admin/buycar.html',
                    controller: 'BuyCarController as buyCtrl'
                }
            }
        }).
        state('sellcar', {
            url: '/sellcar',
            views: {
                'admin-view': {
                    templateUrl: 'views/admin/sellcar.html',
                    controller: 'SellCarController as sellCtrl'
                }
            }
        }).
        state('fix', {
            url: '/fix',
            views: {
                'admin-view': {
                    templateUrl: 'views/admin/fix.html',
                    controller: 'FixController as fixCtrl'
                }
            }
        }).
        state('maintenanceitem', {
            url: '/maintenanceitem',
            views: {
                'admin-view': {
                    templateUrl: 'views/admin/maintenanceitem.html',
                    controller: 'MaintenanceItemController as itemCtrl'
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
