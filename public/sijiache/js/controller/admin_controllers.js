define(['jquery', 'angular', 'js/service/admin_services'], function($, angular) {
    var adminControllers = angular.module('adminControllers', ['appServices']);
    var $navLinks = $('.nav-links');

    function updateLink(location){
    	if(!$navLinks.find('.active').hasClass('link-' + location)){
        	$navLinks.find('.active').removeClass('active');
        	$navLinks.find('.link-' + location).addClass('active');
        }
    }

    adminControllers.controller('BuyCarController', ['$scope', 'BuyCarService', function($scope, BuyCarService) {
        var self = this;
        updateLink('buycar');

        BuyCarService.get().$promise.then(function(result) {
            if (result.msg == 'nologin') {
                alert('登录超时，请刷新页面重新登录');
                return;
            }
            self.buyCarInfos = result.result;
        });

        self.deleteInfo = function(id, index) {
            if (window.confirm('确定要删除该项吗？')) {
                BuyCarService.remove({
                    id: id
                }).$promise.then(function(result) {
                    console.log(result);
                    if (result.msg == 'nologin') {
                        alert('登录超时，请刷新页面重新登录');
                        return;
                    }else if(result.msg == 'error'){
                    	alert('删除失败，请稍后再试');
                    	return;
                    }
                    self.buyCarInfos.splice(index, 1);
                });
            }
        }
    }]);

    adminControllers.controller('SellCarController', ['$scope', 'SellCarService', function($scope, SellCarService){
    	var self = this;
    	updateLink('sellcar');

    	SellCarService.get().$promise.then(function(result){
    		if (result.msg == 'nologin') {
                alert('登录超时，请刷新页面重新登录');
                return;
            }
            self.sellCarInfos = result.result;
    	});

    	self.formatGearbox = function(obj){
    		var result;
    		switch(obj){
    			case 1:
    				result = 'AT自动挡';
    				break;
    			case 2:
    				result = 'MT手动挡';
    				break;
    			case 3:
    				result = '手自一体';
    				break;
    		}

    		return result;
    	}

    	self.formatDate = function(obj){
    		var date = new Date(obj);
    		return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    	}

    	self.deleteInfo = function(id, index) {
            if (window.confirm('确定要删除该项吗？')) {
                SellCarService.remove({
                    id: id
                }).$promise.then(function(result) {
                    console.log(result);
                    if (result.msg == 'nologin') {
                        alert('登录超时，请刷新页面重新登录');
                        return;
                    }else if(result.msg == 'error'){
                    	alert('删除失败，请稍后再试');
                    	return;
                    }
                    self.sellCarInfos.splice(index, 1);
                });
            }
        }
    }]);

	adminControllers.controller('FixController', ['$scope', 'FixService', function($scope, FixService){
		var self = this;

		updateLink('fix');

		FixService.get().$promise.then(function(result){
			if (result.msg == 'nologin') {
                alert('登录超时，请刷新页面重新登录');
                return;
            }
			self.fixInfos = result.result;
			setTimeout(function() {
				$('[data-toggle="tooltip"]').tooltip();
			}, 500);
		});

		self.deleteInfo = function(id, index) {
            if (window.confirm('确定要删除该项吗？')) {
                FixService.remove({
                    id: id
                }).$promise.then(function(result) {
                    console.log(result);
                    if (result.msg == 'nologin') {
                        alert('登录超时，请刷新页面重新登录');
                        return;
                    }else if(result.msg == 'error'){
                    	alert('删除失败，请稍后再试');
                    	return;
                    }
                    self.fixInfos.splice(index, 1);
                });
            }
        }

        self.simplifyQestion = function(question){
        	return question.substr(0, 20) + (question.length > 20 ? '...' : '');
        }
	}]);

	adminControllers.controller('MaintenanceItemController', ['$scope', 'MaintenanceItemService', function($scope, MaintenanceItemService){
		var self = this;

		updateLink('maintenanceitem');

		var $alert = $('#mainteanceItemModal .alert');

		MaintenanceItemService.get().$promise.then(function(result){
			if (result.msg == 'nologin') {
                alert('登录超时，请刷新页面重新登录');
                return;
            }
			self.itemInfos = result.result;
			setTimeout(function() {
				$('[data-toggle="tooltip"]').tooltip();
			}, 500);
		});

		self.deleteItem = function(id, index) {
            if (window.confirm('确定要删除该项吗？')) {
                MaintenanceItemService.remove({
                    id: id
                }).$promise.then(function(result) {
                    console.log(result);
                    if (result.msg == 'nologin') {
                        alert('登录超时，请刷新页面重新登录');
                        return;
                    }else if(result.msg == 'error'){
                    	alert('删除失败，请稍后再试');
                    	return;
                    }
                    self.itemInfos.splice(index, 1);
                });
            }
        }

        self.processItemForm = function(){
        	console.log(self.itemData);
        	$.post('./maintenanceitem', $.param(self.itemData), function(data, textStatus, xhr) {
                if(data.msg == 'success'){
                    $alert.text('提交成功').removeClass('alert-danger').addClass('alert-success').css('visibility', 'visible');
                    setTimeout(function() {
                    	$alert.css('visibility', 'hidden')
                    }, 2000);
                    $('#mainteanceItemModal input[type="reset"]').trigger('click');
                    self.itemData = {};
                }else{
                    $alert.text('提交失败，请稍后再试').removeClass('alert-success').addClass('alert-danger').css('visibility', 'visible');
                    setTimeout(function() {
                    	$alert.css('visibility', 'hidden')
                    }, 2000);
                }
            });
        }
	}]);

    return adminControllers;
});
