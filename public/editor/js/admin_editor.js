var DEV_CONFIG = {
    DEV_MODE: false
}

require.config({
    baseUrl: '/editor/',
    paths: {
        // 'weixin': 'http://res.wx.qq.com/open/js/jweixin-1.0.0',
        'jquery': DEV_CONFIG.DEV_MODE ? 'bower_components/jquery/dist/jquery' : '//cdn.bootcss.com/jquery/2.1.4/jquery.min',
        'jquery-qr': 'js/vendor/jquery.qrcode.min',
        'swiper': DEV_CONFIG.DEV_MODE ? 'bower_components/Swiper/dist/js/swiper' : '//cdn.bootcss.com/Swiper/3.0.7/js/swiper.min',
        'bootstrap': DEV_CONFIG.DEV_MODE ? 'bower_components/bootstrap/dist/js/bootstrap' : '//cdn.bootcss.com/bootstrap/4.0.0-alpha.2/js/bootstrap.min',
        'angular': DEV_CONFIG.DEV_MODE ? 'bower_components/angular/angular' : '//cdn.bootcss.com/angular.js/1.4.7/angular.min',
        'angular-route': DEV_CONFIG.DEV_MODE ? 'bower_components/angular-route/angular-route' : 'http://bowen-blog.b0.upaiyun.com/js/angular/angular-route.min',
        'angular-resource': DEV_CONFIG.DEV_MODE ? 'bower_components/angular-resource/angular-resource' : 'http://bowen-blog.b0.upaiyun.com/js/angular/angular-resource.min',
        'quantize': 'js/vendor/quantize',
        'ColorAnalysis': 'js/vendor/ColorAnalysis',
        'ddSort': 'js/vendor/ddSort',
        'ueditor': DEV_CONFIG.DEV_MODE ? 'js/vendor/ueditor/ueditor.all' : 'js/vendor/ueditor/ueditor.all.min',
        'ueditor-config': 'js/vendor/ueditor/ueditor.config',
        'ueditor-zh': 'js/vendor/ueditor/zh-cn',
        'ZeroClipboard': 'js/vendor/ueditor/third-party/zeroclipboard/zeroclipboard.min'
    },
    shim: {
        'jquery-qr': {
            deps: ['jquery']
        },
        'bootstrap': {
            deps: ['jquery']
        },
        'swiper': {
            deps: ['jquery']
        },
        'angular': {
            exports: 'angular'
        },
        'angular-route': {
            deps: ['angular']
        },
        'angular-resource': {
            deps: ['angular', 'angular-route']
        },
        'quantize': {
            exports: 'MMCQ'
        },
        'ColorAnalysis': {
            deps: ['jquery', 'quantize']
        },
        'ddSort': {
            deps: ['jquery']
        },
        'ueditor': {
            deps: ['ueditor-config'],
            exports: 'UE'
        },
        'ueditor-zh': {
            deps: ['ueditor']
        },
        'ZeroClipboard': {
            exports: 'ZeroClipboard'
        }
    },
    waitSeconds: 30
});


require(['jquery', 'ZeroClipboard', 'ueditor', 'ueditor-zh', 'ColorAnalysis', 'bootstrap', 'jquery-qr'], function($, ZeroClipboard, UE) {
    window.ZeroClipboard = ZeroClipboard;
    var ue = UE.getEditor('editor');


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
        var imgSrc = $('header.title').find('.bg-img').data('src');
        imgSrc = imgSrc || '/editor/img/listbg.jpg';
        img.src = imgSrc;
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
    window.currentArticleId = $('body').data('id');
    $('.btn-save').click(function(event) {
        var result = {};
        result.url = $('header.title').find('.bg-img').data('src');
        result.title = $('header.title').find('h1').text();
        result.content = UE.getEditor('editor').getContent();
        console.log(result);
        if (window.currentArticleId) {
            $.ajax({
                    url: '/editor/article/' + window.currentArticleId,
                    type: 'PUT',
                    dataType: 'json',
                    data: {
                        url: result.url,
                        title: result.title,
                        content: result.content
                    }
                })
                .done(function(a) {
                    console.log(a);
                })
                .fail(function() {
                    console.log("error");
                });

        } else {
            $.post('/editor/article', result, function(data, textStatus, xhr) {
                console.log(data, textStatus);
            });
        }
    });

    $('.btn-preview').click(function(event) {
        console.log(location.origin + '/editor/article/' + window.currentArticleId);
        $('#qrcode').html('').qrcode({width: 220,height: 220,text: location.origin + '/editor/article/' + window.currentArticleId});
        $('.qr-modal').modal();
    });
});
