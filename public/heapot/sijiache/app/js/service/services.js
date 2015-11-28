define(['angular', 'angular-resource'], function(angular) {
    var appServices = angular.module('appServices', ['ngResource']);

    var URL = 'http://localhost:3000/test';

    appServices.factory('CatalogService', ['$resource', function($resource) {
    	return $resource(URL, {}, {
            
        });
    }]);

    return appServices;
});
