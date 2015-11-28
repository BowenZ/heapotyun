define(['jquery', 'angular'], function($, angular) {
    var appControllers = angular.module('appControllers', ['appServices']);

    /*最高级Controler*/
    appControllers.controller('MainController', ['$scope', function($scope){
    	var self = this;
    	$scope.popupTitle = '爱车梦工厂';

    	$scope.showPopup = function(){
    		$('.popup').addClass('active');
    	}
    	$scope.hidePopup = function(){
    		$('.popup').removeClass('active');
    	}
    }]);

    appControllers.controller('CarController', ['$scope', function($scope) {
        var self = this;
        $scope.$parent.popupTitle = '二手车';

        self.processBuyForm = function(){
        	console.log(self.buyCarData);
        	$.post('./buycarinfo', $.param(self.buyCarData), function(data, textStatus, xhr) {
        		console.log(data);
        	});
        }
    }]);

    appControllers.controller('FixController', ['$scope', function($scope) {
        var self = this;
        $scope.$parent.popupTitle = '维修';
    }]);

    appControllers.controller('UpkeepController', ['$scope', function($scope) {
        var self = this;
        $scope.$parent.popupTitle = '保养';
    }]);

    appControllers.controller('InsuranceController', ['$scope', function($scope) {
        var self = this;
        $scope.$parent.popupTitle = '车险';
    }]);

    return appControllers;
});
