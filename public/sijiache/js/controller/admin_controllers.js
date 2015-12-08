define(['jquery', 'angular', 'js/service/admin_services'], function($, angular) {
    var adminControllers = angular.module('adminControllers', ['appServices']);
    var $navLinks = $('.nav-links');

    function updateLink(location, sublink) {
        $navLinks.find('.mainlink.active').removeClass('active').find('.sublink.active').removeClass('active');
        $navLinks.find('.mainlink.link-' + location).addClass('active').find('.sublink.link-' + sublink).addClass('active');
    }

    function progressFunction(evt) {
        var progressBar = document.getElementById("progressBar");
        if (evt.lengthComputable) {
            var value = Math.floor((evt.loaded / evt.total) * 100);
            $("#progressBar").attr("style", "width: " + value + "%").attr("aria-valuenow", value);
            if (value == 100) {
                $("#progressBar").removeClass("progress-bar-warning").addClass("progress-bar-success");;
            }
        }
    }

    adminControllers.controller('BuyCarController', ['$scope', 'BuyCarService', function($scope, BuyCarService) {
        var self = this;
        updateLink('car', 'buycar');

        BuyCarService.get().$promise.then(function(result) {
            if (result.msg == 'nologin') {
                alert('登录超时，请刷新页面重新登录');
                return;
            }
            self.buyCarInfos = result.result;
            setTimeout(function() {
                $('[data-toggle="tooltip"]').tooltip();
            }, 500);
        });

        $scope.dateFilter = function(obj) {
            return ($scope.queryDate1 ? (Date.parse(obj.publishDate.date) >= Date.parse($scope.queryDate1)) : true) && ($scope.queryDate2 ? (Date.parse(obj.publishDate.date) <= Date.parse($scope.queryDate2)) : true);
        }

        self.deleteInfo = function(id, index) {
            if (window.confirm('确定要删除该项吗？')) {
                BuyCarService.remove({
                    id: id
                }).$promise.then(function(result) {
                    console.log(result);
                    if (result.msg == 'nologin') {
                        alert('登录超时，请刷新页面重新登录');
                        return;
                    } else if (result.msg == 'error') {
                        alert('删除失败，请稍后再试');
                        return;
                    }
                    self.buyCarInfos.splice(index, 1);
                });
            }
        }

        self.simplifyQestion = function(str) {
            if(str)
                return str.substr(0, 5) + (str.length > 5 ? '...' : '');
        }
    }]);

    adminControllers.controller('SellCarController', ['$scope', 'SellCarService', function($scope, SellCarService) {
        var self = this;
        updateLink('car', 'sellcar');

        SellCarService.get().$promise.then(function(result) {
            if (result.msg == 'nologin') {
                alert('登录超时，请刷新页面重新登录');
                return;
            }
            self.sellCarInfos = result.result;
            setTimeout(function() {
                $('[data-toggle="tooltip"]').tooltip();
            }, 500);
        });

        $scope.dateFilter = function(obj) {
            return ($scope.queryDate1 ? (Date.parse(obj.publishDate.date) >= Date.parse($scope.queryDate1)) : true) && ($scope.queryDate2 ? (Date.parse(obj.publishDate.date) <= Date.parse($scope.queryDate2)) : true);
        }

        self.formatGearbox = function(obj) {
            var result;
            switch (obj) {
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

        self.formatDate = function(obj) {
            if(obj){
                var date = new Date(obj);
                return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
            }
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
                    } else if (result.msg == 'error') {
                        alert('删除失败，请稍后再试');
                        return;
                    }
                    self.sellCarInfos.splice(index, 1);
                });
            }
        }

        self.simplifyQestion = function(str) {
            if(str)
                return str.substr(0, 5) + (str.length > 5 ? '...' : '');
        }
    }]);

    adminControllers.controller('FixController', ['$scope', 'FixService', function($scope, FixService) {
        var self = this;

        updateLink('fix');

        FixService.get().$promise.then(function(result) {
            if (result.msg == 'nologin') {
                alert('登录超时，请刷新页面重新登录');
                return;
            }
            self.fixInfos = result.result;
            setTimeout(function() {
                $('[data-toggle="tooltip"]').tooltip();
            }, 500);
        });

        $scope.dateFilter = function(obj) {
            return ($scope.queryDate1 ? (Date.parse(obj.publishDate.date) >= Date.parse($scope.queryDate1)) : true) && ($scope.queryDate2 ? (Date.parse(obj.publishDate.date) <= Date.parse($scope.queryDate2)) : true);
        }

        self.deleteInfo = function(id, index) {
            if (window.confirm('确定要删除该项吗？')) {
                FixService.remove({
                    id: id
                }).$promise.then(function(result) {
                    console.log(result);
                    if (result.msg == 'nologin') {
                        alert('登录超时，请刷新页面重新登录');
                        return;
                    } else if (result.msg == 'error') {
                        alert('删除失败，请稍后再试');
                        return;
                    }
                    self.fixInfos.splice(index, 1);
                });
            }
        }

        self.simplifyQestion = function(str) {
            return str.substr(0, 20) + (str.length > 20 ? '...' : '');
        }
    }]);

    adminControllers.controller('MaintenanceItemController', ['$scope', 'MaintenanceItemService', function($scope, MaintenanceItemService) {
        var self = this;

        updateLink('maintenance', 'maintenanceitem');

        var $alert = $('#mainteanceItemModal .alert');

        function loadData(callback) {
            MaintenanceItemService.get().$promise.then(function(result) {
                if (result.msg == 'nologin') {
                    alert('登录超时，请刷新页面重新登录');
                    return;
                }
                self.itemInfos = result.result;
                setTimeout(function() {
                    $('[data-toggle="tooltip"]').tooltip();
                }, 500);
                callback && callback();
            });
        }

        loadData();

        $scope.dateFilter = function(obj) {
            return ($scope.queryDate1 ? (Date.parse(obj.publishDate.date) >= Date.parse($scope.queryDate1)) : true) && ($scope.queryDate2 ? (Date.parse(obj.publishDate.date) <= Date.parse($scope.queryDate2)) : true);
        }

        self.deleteItem = function(id, index) {
            if (window.confirm('确定要删除该项吗？')) {
                MaintenanceItemService.remove({
                    id: id
                }).$promise.then(function(result) {
                    if (result.msg == 'nologin') {
                        alert('登录超时，请刷新页面重新登录');
                        return;
                    } else if (result.msg == 'error') {
                        alert('删除失败，请稍后再试');
                        return;
                    }
                    self.itemInfos.splice(index, 1);
                });
            }
        }

        self.changeStatus = function(id, index, status) {
            MaintenanceItemService.changeStatus({
                id: id,
                status: Math.abs(status - 1)
            }).$promise.then(function(result) {
                if (result.msg == 'nologin') {
                    alert('登录超时，请刷新页面重新登录');
                    return;
                } else if (result.msg == 'error') {
                    alert('操作失败，请稍后再试');
                    return;
                }
                self.itemInfos[index].status = Math.abs(status - 1);
            });
        }

        self.processItemForm = function() {
            if (isNaN(self.itemData.price - 0)) {
                alert('价格请填写纯数字，不要加任何字符');
            }
            $.post('./maintenanceitem', $.param(self.itemData), function(data, textStatus, xhr) {
                if (data.msg == 'success') {
                    $alert.text('提交成功').removeClass('alert-danger').addClass('alert-success').css('visibility', 'visible');
                    setTimeout(function() {
                        $alert.css('visibility', 'hidden')
                    }, 2000);
                    $('#mainteanceItemModal input[type="reset"]').trigger('click');
                    self.itemData = {};
                } else {
                    $alert.text('提交失败，请稍后再试').removeClass('alert-success').addClass('alert-danger').css('visibility', 'visible');
                    setTimeout(function() {
                        $alert.css('visibility', 'hidden')
                    }, 2000);
                }
            });
        }
    }]);

    adminControllers.controller('MaintenanceController', ['$scope', 'MaintenanceService', function($scope, MaintenanceService) {
        var self = this;

        updateLink('maintenance', 'maintenanceinfo');

        MaintenanceService.get().$promise.then(function(result) {
            if (result.msg == 'nologin') {
                alert('登录超时，请刷新页面重新登录');
                return;
            }
            self.mtncInfos = result.result;
        });

        $scope.dateFilter = function(obj) {
            return ($scope.queryDate1 ? (Date.parse(obj.publishDate.date) >= Date.parse($scope.queryDate1)) : true) && ($scope.queryDate2 ? (Date.parse(obj.publishDate.date) <= Date.parse($scope.queryDate2)) : true);
        }

        self.deleteItem = function(id, index) {
            if (window.confirm('确定要删除该项吗？')) {
                MaintenanceService.remove({
                    id: id
                }).$promise.then(function(result) {
                    if (result.msg == 'nologin') {
                        alert('登录超时，请刷新页面重新登录');
                        return;
                    } else if (result.msg == 'error') {
                        alert('删除失败，请稍后再试');
                        return;
                    }
                    self.mtncInfos.splice(index, 1);
                });
            }
        }
    }]);

    adminControllers.controller('AdvertisementController', ['$scope', 'AdvertisementService', function($scope, AdvertisementService) {
        var self = this;

        updateLink('ad');

        var $alert = $('#adModal .alert');

        AdvertisementService.get().$promise.then(function(result) {
            if (result.msg == 'nologin') {
                alert('登录超时，请刷新页面重新登录');
                return;
            }
            self.adInfos = result.result;
        });

        $scope.dateFilter = function(obj) {
            return ($scope.queryDate1 ? (Date.parse(obj.publishDate.date) >= Date.parse($scope.queryDate1)) : true) && ($scope.queryDate2 ? (Date.parse(obj.publishDate.date) <= Date.parse($scope.queryDate2)) : true);
        }

        self.deleteItem = function(id, index) {
            if (window.confirm('确定要删除该项吗？')) {
                AdvertisementService.remove({
                    id: id
                }).$promise.then(function(result) {
                    if (result.msg == 'nologin') {
                        alert('登录超时，请刷新页面重新登录');
                        return;
                    } else if (result.msg == 'error') {
                        alert('删除失败，请稍后再试');
                        return;
                    }
                    self.adInfos.splice(index, 1);
                });
            }
        }

        self.formData = {};



        self.uploadImg = function() {
            if (document.getElementById("imgFile").files.length == 0) {
                $alert.text('文件不能为空！').removeClass('alert-success').addClass('alert-danger').css('visibility', 'visible');
                setTimeout(function() {
                    $alert.css('visibility', 'hidden');
                }, 1500);
                return false;
            }
            $("#adModal #progressBar").attr("style", "width: 0%").attr("aria-valuenow", "0");
            var imgFile = document.getElementById("imgFile").files[0];
            var imgFormData = new FormData();
            imgFormData.append('imgFile', imgFile);

            var xhr;
            if (window.ActiveXObject) {
                xhr = new ActiveXObject("Microsoft.XMLHTTP");
            } else if (window.XMLHttpRequest) {
                xhr = new XMLHttpRequest();
            }
            xhr.open("POST", "upload", true);
            xhr.onload = function(event) {
                var result = JSON.parse(xhr.response);
                if (result.msg == 'success') {
                    self.formData.imgUrl = 'upload/' + result.filename;
                    $alert.text('上传成功！').removeClass('alert-danger').addClass('alert-success').css('visibility', 'visible');
                    setTimeout(function() {
                        $alert.css('visibility', 'hidden');
                    }, 1500);
                    $scope.$apply();
                } else if (result.msg == 'nologin') {
                    $alert.text('登录超时，请刷新页面再试！').removeClass('alert-success').addClass('alert-danger').css('visibility', 'visible');
                } else {
                    console.log(result.err);
                    $alert.text('上传出现错误，请刷新页面再试！').removeClass('alert-success').addClass('alert-danger').css('visibility', 'visible');
                    setTimeout(function() {
                        $alert.css('visibility', 'hidden');
                    }, 1500);
                }
                $(".ad-view #uploadButton").removeAttr('disabled');
            };
            xhr.upload.addEventListener("progress", progressFunction, false);
            xhr.send(imgFormData);
            $(".ad-view #uploadButton").attr('disabled', 'disabled');
            return false;
        }

        self.processForm = function() {
            if (!self.formData.imgUrl) {
                $alert.text('请填写图片路径或上传图片').removeClass('alert-success').addClass('alert-danger').css('visibility', 'visible');
                setTimeout(function() {
                    $alert.css('visibility', 'hidden')
                }, 2000);
                return false;
            }
            $.post('./ad', $.param(self.formData), function(data, textStatus, xhr) {
                console.log(data);
                if (data.msg == 'success') {
                    $alert.text('提交成功').removeClass('alert-danger').addClass('alert-success').css('visibility', 'visible');
                    setTimeout(function() {
                        $alert.css('visibility', 'hidden')
                    }, 2000);
                    $('#adModal input[type="reset"]').trigger('click');
                    $("#adModal #progressBar").attr("style", "width: 0%").attr("aria-valuenow", "0");
                    self.formData = {};
                    $scope.$apply();
                } else if (data.msg == 'nologin') {
                    $alert.text('登录超时，请刷新页面重新登录').removeClass('alert-success').addClass('alert-danger').css('visibility', 'visible');
                    setTimeout(function() {
                        $alert.css('visibility', 'hidden')
                    }, 2000);
                } else {
                    $alert.text('提交失败，请稍后再试').removeClass('alert-success').addClass('alert-danger').css('visibility', 'visible');
                    setTimeout(function() {
                        $alert.css('visibility', 'hidden')
                    }, 2000);
                }
            });
        }

    }]);

    adminControllers.controller('ArticleController', ['$scope', '$sce', 'ArticleService', function($scope, $sce, ArticleService) {
        var self = this;

        updateLink('article');

        require(['pagedown'], function(a) {
            var pagedown = $("textarea#pagedownMe").pagedownBootstrap({
                sanatize: false,
                help: function() {
                    alert(1);
                    return false;
                }
            });
            $('.article-view .article-preview').append($('.article-view .article-form .wmd-preview').detach());
            $('.article-view .wmd-panel .wmd-button-group2').append('<button class="btn btn-default" id="wmd-upload-button-0" type="button" data-toggle="tooltip" data-placement="bottom" title="上传"><i class="fa fa-cloud-upload"></i></button>').find('[data-toggle="tooltip"]').tooltip().click(function(event) {
                $('#uploadModal').modal('show');
            });
            console.dir(pagedown);
        });

        ArticleService.get().$promise.then(function(result) {
            console.log(result);
            if (result.msg == 'nologin') {
                alert('登录超时，请刷新页面重新登录');
                return;
            }
            self.articleInfos = result.result;
        });

        self.submitArticle = function() {
            self.formData.content = $('textarea.article-content').val();
            var newArticle = new ArticleService(self.formData);
            newArticle.$save(function(result) {
                if(result.msg == 'success'){
                    alert('提交成功');
                }
            });
        }

        self.deleteItem = function(id, index) {
            if (window.confirm('确定要删除该项吗？')) {
                ArticleService.remove({
                    id: id
                }).$promise.then(function(result) {
                    if (result.msg == 'nologin') {
                        alert('登录超时，请刷新页面重新登录');
                        return;
                    } else if (result.msg == 'error') {
                        alert('删除失败，请稍后再试');
                        return;
                    }
                    self.articleInfos.splice(index, 1);
                });
            }
        }

        self.viewArticle = function(index) {
            self.activeArticle = $.extend({}, self.articleInfos[index]);;
            self.activeArticle.content = $sce.trustAsHtml(self.activeArticle.content);
            $('#article').modal('show');
        }

        function insertAtCursor(myField, myValue) {
            if (document.selection) {
                myField.focus();
                sel = document.selection.createRange();
                sel.text = myValue;
                sel.select();
            } else if (myField.selectionStart || myField.selectionStart == '0') {
                var startPos = myField.selectionStart;
                var endPos = myField.selectionEnd;
                var restoreTop = myField.scrollTop;
                myField.value = myField.value.substring(0, startPos) + myValue + myField.value.substring(endPos, myField.value.length);
                if (restoreTop > 0) {
                    myField.scrollTop = restoreTop;
                }
                myField.focus();
                myField.selectionStart = startPos + myValue.length;
                myField.selectionEnd = startPos + myValue.length;
            } else {
                myField.value += myValue;
                myField.focus();
            }
        }

        var $alert = $('#uploadModal .alert');
        $('#uploadButton').click(function(event) {
            if (document.getElementById("fileInput").files.length == 0) {
                $alert.text('文件不能为空！').removeClass('alert-success').addClass('alert-danger').css('visibility', 'visible');
                setTimeout(function() {
                    $alert.css('visibility', 'hidden');
                }, 1500);
                return false;
            }
            $("#uploadModal #progressBar").attr("style", "width: 0%").attr("aria-valuenow", "0");
            var imgFormData = new FormData(document.forms.namedItem("uploadform"));
            imgFormData.append('folder', 'article');

            var xhr;
            if (window.ActiveXObject) {
                xhr = new ActiveXObject("Microsoft.XMLHTTP");
            } else if (window.XMLHttpRequest) {
                xhr = new XMLHttpRequest();
            }
            xhr.open("POST", "uploadarray", true);
            xhr.onload = function(event) {
                var result = JSON.parse(xhr.response);
                console.log(result);
                if (result.msg == 'success') {
                    result.filenames.forEach(function(filename){
                        insertAtCursor($('textarea.article-content')[0], '![enter image description here](/sijiache/upload/article/'+filename+')\n\n');    
                    });
                    
                    $alert.text('上传成功！').removeClass('alert-danger').addClass('alert-success').css('visibility', 'visible');
                    setTimeout(function() {
                        $alert.css('visibility', 'hidden');
                    }, 1500);
                    $scope.$apply();
                } else if (result.msg == 'nologin') {
                    $alert.text('登录超时，请刷新页面再试！').removeClass('alert-success').addClass('alert-danger').css('visibility', 'visible');
                } else {
                    console.log(result.err);
                    $alert.text('上传出现错误，请刷新页面再试！').removeClass('alert-success').addClass('alert-danger').css('visibility', 'visible');
                    setTimeout(function() {
                        $alert.css('visibility', 'hidden');
                    }, 1500);
                }
                $("#uploadButton").removeAttr('disabled');
            };
            xhr.upload.addEventListener("progress", progressFunction, false);
            xhr.send(imgFormData);
            $("#uploadButton").attr('disabled', 'disabled');
            return false;
        });;
    }]);

    return adminControllers;
});
