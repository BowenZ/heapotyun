define(['jquery', 'angular'], function($, angular) {
    var appControllers = angular.module('appControllers', ['appServices']);

    /*最高级Controler*/
    appControllers.controller('MainController', ['$scope', 'CatalogService', function($scope, CatalogService) {
        var self = this;
    }]);

    return appControllers;
});
