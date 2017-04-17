define(['jquery', 'angular', 'js/service/admin_services', 'swiper'], function($, angular) {
    var appControllers = angular.module('appControllers', ['appServices']);

    /*最高级Controler*/
    appControllers.controller('MainController', ['$scope', 'AdvertisementService', function($scope, AdvertisementService) {
        var self = this;
        $scope.popupTitle = '爱车梦工厂';
        var $toptip = $('.toptip');

        AdvertisementService.get().$promise.then(function(result) {
            self.ads = result.result;
            setTimeout(function() {
                var swiper = new Swiper('.swiper-container', {
                    pagination: '.swiper-pagination',
                    paginationClickable: false,
                    // direction: 'vertical',
                    // autoplay: 1000,
                    effect: 'slide', //Could be "slide", "fade", "cube" or "coverflow"
                    loop: true,
                    onSlideChangeEnd: function(s) {
                        // console.log(s.activeIndex);
                    }
                });
            }, 100);
        });

        $('.success-message').find('.weui_btn').click(function(event) {
            $('.success-message').hide();
        });;

        $scope.showToptip = function(status, copy) {
            if (status == 'success') {
                $toptip.css('background-color', '#09BB07');
            } else if (status == 'error') {
                $toptip.css('background-color', '#F76260');
            }
            $toptip.text(copy).fadeIn(200).delay(2000).fadeOut(200);;
        }

        $scope.showPopup = function() {
            $('.popup').css('display', 'block');
            setTimeout(function() {
                $('.popup').addClass('active');
            }, 30);
        }
        $scope.hidePopup = function() {
            $('.popup').removeClass('active');
            setTimeout(function() {
                $('.popup').css('display', 'none');
            }, 300);
        }
    }]);

    appControllers.controller('IndexController', ['$scope', function($scope){
        $scope.$parent.hidePopup();
    }]);

    appControllers.controller('CarController', ['$scope', function($scope) {
        var self = this;
        $scope.$parent.popupTitle = '二手车';
        $scope.$parent.showPopup();

        self.buyCarData = {};

        $('input.weui_input').on('focus', function(event) {
            $('.weui_cell').removeClass('weui_cell_warn');
        });

        self.processBuyForm = function() {
            var validated = true;
            $('.buy-car input.weui_input[required]').each(function(index, el) {
                if(!$(el).val()){
                    validated = false;
                    $(el).parents('.weui_cell').addClass('weui_cell_warn');
                    // return false;
                }
            });
            if(!validated){
                $scope.$parent.showToptip('error', '请将表单填写完整');
                return false;
            }
            $.post('./buycar', $.param(self.buyCarData), function(data, textStatus, xhr) {
                if (data == 'success') {
                    // $scope.$parent.showToptip('success', '添加成功');
                    $('.popup-car .buy-car input[type="reset"]').trigger('click');
                    self.buyCarData = {};
                    $('.success-message').show();
                } else {
                    $scope.$parent.showToptip('error', '添加失败');
                }
            });
        }

        self.processSellForm = function() {
            var validated = true;
            $('.sell-car input.weui_input[required]').each(function(index, el) {
                if(!$(el).val()){
                    validated = false;
                    $(el).parents('.weui_cell').addClass('weui_cell_warn');
                    // return false;
                }
            });
            if(!validated){
                $scope.$parent.showToptip('error', '请将表单填写完整');
                return false;
            }
            $.post('./sellcar', $.param(self.sellCarData), function(data, textStatus, xhr) {
                if (data == 'success') {
                    // $scope.$parent.showToptip('success', '提交成功');
                    $('.popup-car .sell-car input[type="reset"]').trigger('click');
                    self.sellCarData = {};
                    $('.success-message').show();
                } else {
                    $scope.$parent.showToptip('error', '提交失败');
                }
            });
        }
    }]);

    appControllers.controller('FixController', ['$scope', function($scope) {
        var self = this;
        $scope.$parent.popupTitle = '维修';
        $scope.$parent.showPopup();
        
        self.processFixForm = function() {
            var validated = true;
            $('.popup-fix input.weui_input[required]').each(function(index, el) {
                if(!$(el).val()){
                    validated = false;
                    $(el).parents('.weui_cell').addClass('weui_cell_warn');
                    // return false;
                }
            });
            if(!validated){
                $scope.$parent.showToptip('error', '请将表单填写完整');
                return false;
            }
            $.post('./fixcar', $.param(self.fixData), function(data, textStatus, xhr) {
                if (data == 'success') {
                    // $scope.$parent.showToptip('success', '提交成功');
                    $('.popup-fix form input[type="reset"]').trigger('click');
                    self.fixData = {};
                    $('.success-message').show();
                } else {
                    $scope.$parent.showToptip('error', '提交失败');
                }
            });
        }
    }]);

    appControllers.controller('MaintenanceController', ['$scope', 'MaintenanceItemService', 'MaintenanceService', function($scope, MaintenanceItemService, MaintenanceService) {
        var self = this;
        $scope.$parent.popupTitle = '保养';
        $scope.$parent.showPopup();

        $('#dialog1').find('.weui_btn_dialog').on('click', function () {
            $('#dialog1').hide();
        });

        MaintenanceItemService.getActiveItems().$promise.then(function(result) {
            self.maintenanceItems = result.result;
        });

        self.formData = {};
        self.itemDetail = {};

        self.showMore = function(index){
            self.itemDetail = self.maintenanceItems[index];
            $('#dialog1').show();
        }

        self.processForm = function() {
            if(!$('.popup-maintenance input.mtnc-item:checked').val()){
                $scope.$parent.showToptip('error', '请选择参加的特惠活动');
                return false;
            }

            var validated = true;
            $('.popup-maintenance input.weui_input[required]').each(function(index, el) {
                if(!$(el).val()){
                    validated = false;
                    $(el).parents('.weui_cell').addClass('weui_cell_warn');
                    // return false;
                }
            });
            if(!validated){
                $scope.$parent.showToptip('error', '请将表单填写完整');
                return false;
            }

            var itemArr = [];
            $('input.mtnc-item:checked').each(function(index, el) {
                itemArr.push({
                    id: $(el).data('itemid'),
                    name: $(el).data('itemname'),
                    price: $(el).data('itemprice')
                });
            });
            self.formData.items = itemArr;
			//获取服务地址
			 var address=$('input:radio[name="radio1"]:checked').val();
			self.formData.address=address;
            console.log('@@@@@@@@@',self.formData)
            var newMaintenanceInfo = new MaintenanceService(self.formData);
            newMaintenanceInfo.$save(function(result) {
                if (result.msg == 'success') {
                    // $scope.$parent.showToptip(result.msg, '提交成功');
                    $('.popup-maintenance form input[type="reset"]').trigger('click');
                    self.fixData = {};
                    $('.success-message').show();
                } else {
                    $scope.$parent.showToptip(result.msg, '提交失败');
                }
            });
            return false;
        }
    }]);

    appControllers.controller('InsuranceController', ['$scope', function($scope) {
        var self = this;
        $scope.$parent.popupTitle = '车险';
    }]);

    return appControllers;
});
