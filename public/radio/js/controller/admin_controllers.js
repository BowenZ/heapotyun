define(['jquery', 'angular'], function($, angular) {
    var adminControllers = angular.module('adminControllers', []);
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

    function showAlert(success, copy, noHide) {
        if (success) {
            $('.alert').removeClass('alert-danger').addClass('alert-success').find('.info').text(copy);
        } else {
            $('.alert').removeClass('alert-success').addClass('alert-danger').find('.info').text(copy);
        }
        if(noHide){
            $('.alert').fadeIn(200);
            return;
        }
        $('.alert').fadeIn(200).delay(2000).fadeOut(200);
    }

    adminControllers.controller('ArticleController', ['$scope', '$sce', function($scope, $sce) {
        var self = this;
        updateLink('article');

        self.loadData = function() {
            $.get('article', function(data) {
                if (data.msg == 'error') {
                    alert('加载失败，请稍后再试');
                    return;
                }
                if (data.msg == 'nologin') {
                    alert('登录超时，请刷新页面重新登录');
                    return;
                }
                if (data.msg == 'success') {
                    self.articleInfos = data.result;
                    $scope.$apply();
                }
            });
        }
        self.loadData();

        $scope.dateFilter = function(obj) {
            return ($scope.queryDate1 ? (Date.parse(obj.publishDate.date) >= Date.parse($scope.queryDate1)) : true) && ($scope.queryDate2 ? (Date.parse(obj.publishDate.date) <= Date.parse($scope.queryDate2)) : true);
        }

        self.deleteItem = function(id, index) {
            if (window.confirm('确定要删除该项吗？')) {
                $.ajax({
                        url: 'article/' + id,
                        type: 'DELETE'
                    })
                    .done(function(result) {
                        if (result.msg == 'nologin') {
                            alert('登录超时，请刷新页面重新登录');
                            return;
                        } else if (result.msg == 'error') {
                            alert('删除失败，请稍后再试');
                            return;
                        }
                        self.articleInfos.splice(index, 1);
                        $scope.$apply();
                    })
                    .fail(function() {
                        console.log("error");
                    });
            }
        }

        self.viewArticle = function(index) {
            self.activeArticle = $.extend({}, self.articleInfos[index]);;
            self.activeArticle.content = $sce.trustAsHtml(self.activeArticle.content);
            $('#article').modal('show');
        }

        self.editArticle = function(index) {
            self.editArticleId = self.articleInfos[index]._id;
            UE.getEditor('revise-editor').setContent(self.articleInfos[index].content);
            $('.revise-modal').modal('show');
        }

        self.saveEdit = function() {
            var result = {
                content: UE.getEditor('revise-editor').getContent()
            };
            $.ajax({
                    url: '/radio/article/' + self.editArticleId,
                    type: 'PUT',
                    dataType: 'json',
                    data: {
                        article: JSON.stringify(result)
                    }
                })
                .done(function(a) {
                    if (a.msg == 'success')
                        showAlert(true, '修改成功！');
                    else
                        showAlert(false, '修改失败！' + a.result);
                })
                .fail(function(a) {
                    showAlert(false, '修改失败！');
                });
        }

        require(['ZeroClipboard', 'ueditor', 'ueditor-zh', 'ColorAnalysis', 'jquery-qr'], function(ZeroClipboard, UE) {
            window.ZeroClipboard = ZeroClipboard;
            var ue = UE.getEditor('editor');
            var reviseEditor = UE.getEditor('revise-editor');


            var timer = setInterval(function() {
                if ($('.edit-zone').find('.edui-editor-toolbarbox').length > 0) {
                    if ($('textarea.article-content').val()) {
                        UE.getEditor('editor').execCommand('insertHtml', $('textarea.article-content').val())
                    }
                    $('.tool-zone').append($('#editor .edui-editor-toolbarbox').detach().prepend($('.tool-zone .btn-group').detach()));
                    $('.edui-editor').width(375);
                    $('#editor .edui-editor-iframeholder').css('min-height', '600px');
                    clearInterval(timer);
                }
            }, 500);


            //重新实例化一个编辑器，防止在上面的editor编辑器中显示上传的图片或者文件
            var _editor = UE.getEditor('upload_editor');
            _editor.ready(function() {
                //设置编辑器不可用
                _editor.setDisabled();
                //隐藏编辑器，因为不会用到这个编辑器实例，所以要隐藏
                _editor.hide();
                //侦听图片上传
                _editor.addListener('beforeInsertImage', function(t, arg) {
                        //将地址赋值给相应的input,只去第一张图片的路径
                        console.log(arg[0].src);
                    })
                    //侦听文件上传，取上传文件列表中第一个上传的文件的路径
                _editor.addListener('afterUpfile', function(t, arg) {
                    console.log(_editor.options.filePath, arg[0].url);
                })
            });
            //弹出图片上传的对话框
            function upImage() {
                var myImage = _editor.getDialog("insertimage");
                myImage.open();
            }
            //弹出文件上传的对话框
            function upFiles() {
                var myFiles = _editor.getDialog("attachment");
                myFiles.open();
            }

            /*++++++++++++++++++++++++++++++++++++++++++++++++*/
            var $window = $(window);

            function feathering(canvas, width, height, size, color) {
                var conv, dist, idata, p, pdata, x, y, _i, _j, _k, _l, _ref;
                if (size == null) {
                    size = 20;
                }
                if (color == null) {
                    color = [0, 0, 0];
                }
                idata = canvas.getContext("2d").getImageData(0, 0, width, height);
                pdata = idata.data;
                conv = function(x, y, p) {
                    var idx;
                    if (p < 0) {
                        p = 0;
                    }
                    if (p > 1) {
                        p = 1;
                    }
                    idx = (y * width + x) * 4;
                    pdata[idx + 0] = p * pdata[idx + 0] + (1 - p) * color[0];
                    pdata[idx + 1] = p * pdata[idx + 1] + (1 - p) * color[1];
                    return pdata[idx + 2] = p * pdata[idx + 2] + (1 - p) * color[2];
                };
                dist = function(xa, ya, xb, yb) {
                    return Math.sqrt((xb - xa) * (xb - xa) + (yb - ya) * (yb - ya));
                };
                for (x = _i = 0; _i < width; x = _i += 1) {
                    for (y = _j = 0; _j < size; y = _j += 1) {
                        p = y / size;
                        if (x < size) {
                            p = 1 - dist(x, y, size, size) / size;
                        }
                        conv(x, y, p);
                    }
                }
                for (y = _k = _ref = 0 + size; _k < height; y = _k += 1) {
                    for (x = _l = 0; _l < size; x = _l += 1) {
                        p = x / size;
                        conv(x, y, p);
                    }
                }
                return canvas.getContext("2d").putImageData(idata, 0, 0);
            };

            function loadTitleImg(callback) {
                var img = new Image();
                var canvas = document.createElement('canvas');
                img.onload = function() {
                    ColorAnalysis.getColor(img, function(result) {
                        var thisColor;
                        var rgb = result.bgColor.replace(/\(|\)|rgb|\s/g, '').split(/,/);
                        thisColor = result.bgColor;
                        if (rgb[0] > 220 && rgb[1] > 220 && rgb[2] > 220) {
                            // thisColor = result.fgColor[0];
                            $('header.title').find('h1').css('color', result.fgColor[0]);
                        }
                        canvas.height = $('header.title').height() * 2;
                        // console.log(canvas.height / img.height * img.width);
                        canvas.width = canvas.height / img.height * img.width;
                        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
                        feathering(canvas, canvas.width, canvas.height, 80, rgb);
                        $('header.title .bg-img').css('background-color', thisColor).html('').append(canvas);
                        callback && callback(thisColor);
                    });
                }
                img.src = $('header.title').find('.bg-img').data('src');
            }
            loadTitleImg();
            /*++++++++++++++++++++++++++++++++++++++++++++++++*/
            $('#titleImg').change(function(event) {
                var imgFile = this.files[0];
                var imgFormData = new FormData();
                imgFormData.append('file', imgFile);

                var xhr;
                if (window.ActiveXObject) {
                    xhr = new ActiveXObject("Microsoft.XMLHTTP");
                } else if (window.XMLHttpRequest) {
                    xhr = new XMLHttpRequest();
                }
                xhr.open("POST", "/ueditor/upload?action=uploadimage", true);
                xhr.onload = function(event) {
                    var result = JSON.parse(xhr.response);
                    if (result.state == 'SUCCESS') {
                        $('header.title').find('.bg-img').data('src', result.url.replace(/\\/gi, '/'));
                        loadTitleImg();
                    }
                };
                xhr.send(imgFormData);
            });
            self.currentArticleId = $('body').data('id');
            $('.btn-save').click(function(event) {
                var ue = UE.getEditor('editor');
                console.log(ue,'+++++');
                return;
                var result = {};
                result.url = $('header.title').find('.bg-img').data('src');
                result.title = $('header.title').find('h1').text();
                result.content = UE.getEditor('editor').getContent();
                result.author = self.author;
                result.tags = self.tags;
                console.log(result);
                if (self.currentArticleId) {
                    $.ajax({
                            url: '/radio/article/' + self.currentArticleId,
                            type: 'PUT',
                            dataType: 'json',
                            data: {
                                article: JSON.stringify(result)
                            }
                        })
                        .done(function(a) {
                            if (a.msg == 'success')
                                showAlert(true, '修改成功！');
                            else
                                showAlert(false, '修改失败！' + a.result);
                        })
                        .fail(function(a) {
                            showAlert(false, '修改失败！');
                        });

                } else {
                    $.post('/radio/article', result, function(data, textStatus, xhr) {
                        console.log(data);
                        if (data.msg == 'success') {
                            self.currentArticleId = data.result._id;
                            showAlert(true, '保存成功！');
                            console.log(self.currentArticleId);
                        } else {
                            showAlert(false, '保存失败！');
                        }
                    });
                }
            });

            $('.btn-preview').click(function(event) {
                if (!self.currentArticleId) {
                    showAlert(false, '保存之后才能预览');
                    return;
                }
                $('#qrcode').html('').qrcode({
                    width: 220,
                    height: 220,
                    text: location.origin + '/radio/article/' + self.currentArticleId + '?html=true'
                });
                $('.qr-modal').modal();
            });
        });
    }]);

    adminControllers.controller('ActivityController', ['$scope', function($scope) {
        var self = this;
        updateLink('activity');

        self.loadData = function() {
            $.get('activity', function(data) {
                console.log(data);
                if (data.msg == 'error') {
                    alert('加载失败，请稍后再试');
                    return;
                }
                if (data.msg == 'nologin') {
                    alert('登录超时，请刷新页面重新登录');
                    return;
                }
                if (data.msg == 'success') {
                    self.activityInfos = data.result;
                    $scope.$apply();
                }
                setTimeout(function() {
                    $('[data-toggle="tooltip"]').tooltip();
                }, 500);
            });
        }
        self.loadData();

        $scope.dateFilter = function(obj) {
            return ($scope.queryDate1 ? (Date.parse(obj.publishDate.date) >= Date.parse($scope.queryDate1)) : true) && ($scope.queryDate2 ? (Date.parse(obj.publishDate.date) <= Date.parse($scope.queryDate2)) : true);
        }

        self.addActivity = function() {
            if(!self.activityName){
                showAlert(false, '请填写活动名');
                return false;
            }
            if(!self.activityContent){
                showAlert(false, '请填写活动内容');
                return false;
            }
            var imgFile = document.getElementById("activityImg").files;
            if(imgFile.length > 0){
                if(imgFile.length > 10){
                    showAlert(false, '最多上传10张图片');
                    return false;
                }
                var oversized = false;
                for (var i = imgFile.length - 1; i >= 0; i--) {
                    if(imgFile[i].size > 1024 * 1024){
                        oversized = true;
                    }
                };
                if(oversized){
                    showAlert(false, '文件超出大小限制');
                    return false;
                }
            }
            var formData = new FormData(document.forms.namedItem("uploadform"));
            var xhr;
            if (window.ActiveXObject) {
                xhr = new ActiveXObject("Microsoft.XMLHTTP");
            } else if (window.XMLHttpRequest) {
                xhr = new XMLHttpRequest();
            }
            xhr.open("POST", "/radio/activity", true);
            xhr.onload = function(event) {
                var result = JSON.parse(xhr.response);
                if(result.msg == 'success'){
                    showAlert(true, '添加成功');
                    $('form[name="uploadform"] button[type="reset"]').trigger('click');     
                }else{
                    showAlert(false, '添加失败');        
                }
            };
            xhr.send(formData);
            showAlert(true, '正在上传中，请稍后...', true);
        }
        self.deleteItem = function(id, index) {
            if (window.confirm('确定要删除该项吗？')) {
                $.ajax({
                        url: 'activity/' + id,
                        type: 'DELETE'
                    })
                    .done(function(result) {
                        if (result.msg == 'nologin') {
                            alert('登录超时，请刷新页面重新登录');
                            return;
                        } else if (result.msg == 'error') {
                            alert('删除失败，请稍后再试');
                            return;
                        }
                        self.activityInfos.splice(index, 1);
                        $scope.$apply();
                    })
                    .fail(function() {
                        console.log("error");
                    });
            }
        }
        self.simplifyQestion = function(str) {
            if(str)
                return str.substr(0, 10) + (str.length > 10 ? '...' : '');
        }

        self.showEnroll = function(activityId){
            self.enrollInfos = null;
            $.get('/radio/enroll?activityId='+activityId, function(data) {
                if(data.msg == 'success'){
                    self.enrollInfos = data.result;
                    $scope.$apply();
                }
            });
        }
    }]);


    return adminControllers;
});
