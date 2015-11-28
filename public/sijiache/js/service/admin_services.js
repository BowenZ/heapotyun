define(['angular', 'angular-resource'], function(angular) {
    var appServices = angular.module('appServices', ['ngResource']);

    appServices.factory('BuyCarService', ['$resource', function($resource) {
    	return $resource('buycar/:id', {}, {
        });
    }]);

    appServices.factory('SellCarService', ['$resource', function($resource){
    	return $resource('sellcar/:id', {}, {});
    }]);

    appServices.factory('FixService', ['$resource', function($resource){
    	return $resource('fixcar/:id', {}, {});
    }]);

    appServices.factory('MaintenanceItemService', ['$resource', function($resource){
    	return $resource('maintenanceitem/:id', {}, {});
    }]);

    appServices.factory('MaintenanceService', ['$resource', function($resource){
    	return $resource('maintenance/:id', {}, {});
    }]);

    return appServices;
});
