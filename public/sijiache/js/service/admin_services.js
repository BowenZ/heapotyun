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
    	return $resource('maintenanceitem/:id', {id: '@id'}, {
    		changeStatus: {
    			method: 'PATCH'
    		},
    		getActiveItems: {
    			method: 'GET',
    			params: {
    				status: 1
    			}
    		}
    	});
    }]);

    appServices.factory('MaintenanceService', ['$resource', function($resource){
    	return $resource('maintenance/:id', {}, {});
    }]);

    appServices.factory('AdvertisementService', ['$resource', function($resource){
    	return $resource('ad/:id', {}, {});
    }]);

    appServices.factory('ArticleService', ['$resource', function($resource){
        return $resource('article/:id', {}, {
            like: {
                method: 'PATCH'
            }
        });
    }]);

    return appServices;
});
