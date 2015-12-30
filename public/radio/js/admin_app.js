define(['angular', 'angular-animate', 'ui.router', 'js/controller/admin_controllers'], function(angular) {
    'use strict';
    var App = angular.module('App', ['ngAnimate', 'ui.router', 'adminControllers']);

    App.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
        /*$locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });*/
        $urlRouterProvider.otherwise('/article');
        $stateProvider.
        state('article', {
            url: '/article',
            views: {
                'admin-view': {
                    templateUrl: 'views/admin/article.html',
                    controller: 'ArticleController as articleCtrl'
                }
            }
        }).
        state('enrollment', {
            url: '/enrollment',
            views: {
                'admin-view': {
                    templateUrl: 'views/admin/enrollment.html',
                    controller: 'EnrollmentController as enrollCtrl'
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
