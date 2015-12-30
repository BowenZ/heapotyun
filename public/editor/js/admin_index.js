var DEV_CONFIG = {
    DEV_MODE: true
}

require.config({
    baseUrl: '',
    paths: {
        // 'weixin': 'http://res.wx.qq.com/open/js/jweixin-1.0.0',
        'jquery': DEV_CONFIG.DEV_MODE ? 'bower_components/jquery/dist/jquery' : '//cdn.bootcss.com/jquery/2.1.4/jquery.min',
        'swiper': DEV_CONFIG.DEV_MODE ? 'bower_components/Swiper/dist/js/swiper' : '//cdn.bootcss.com/Swiper/3.0.7/js/swiper.min',
        'bootstrap': DEV_CONFIG.DEV_MODE ? 'bower_components/bootstrap/dist/js/bootstrap' : '//cdn.bootcss.com/bootstrap/4.0.0-alpha.2/js/bootstrap.min.js',
        'angular': DEV_CONFIG.DEV_MODE ? 'bower_components/angular/angular' : '//cdn.bootcss.com/angular.js/1.4.7/angular.min',
        'angular-route': DEV_CONFIG.DEV_MODE ? 'bower_components/angular-route/angular-route' : 'http://bowen-blog.b0.upaiyun.com/js/angular/angular-route.min',
        'angular-resource': DEV_CONFIG.DEV_MODE ? 'bower_components/angular-resource/angular-resource' : 'http://bowen-blog.b0.upaiyun.com/js/angular/angular-resource.min',
        'quantize': 'js/vendor/quantize',
        'ColorAnalysis': 'js/vendor/ColorAnalysis',
        'ddSort': 'js/vendor/ddSort'
    },
    shim: {
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
        }
    },
    waitSeconds: 30
});

require(['ColorAnalysis', 'ddSort', 'bootstrap'], function() {
    $('.list-container').each(function(index, el) {
        var img = new Image();
        img.onload = function() {
            ColorAnalysis.getColor(this, function(result) {
                var thisColor;
                var rgb = result.bgColor.replace(/\(|\)|rgb|\s/g, '').split(/,/);
                if (rgb[0] > 170 && rgb[1] > 170 && rgb[2] > 170) {
                    thisColor = result.fgColor[0];
                } else {
                    thisColor = result.bgColor;
                }
                $('.list-container').eq(index).find('.list-bg').css({
                    background: '-moz-linear-gradient(to right,  ' + thisColor + ' 0%,rgba(0,0,0,0) 100%)',
                    background: '-webkit-linear-gradient(to right,  ' + thisColor + ' 0%,rgba(0,0,0,0) 100%)',
                    background: 'linear-gradient(to right,  ' + thisColor + ' 0%,' + thisColor.replace(')', ',0.5)').replace('rgb', 'rgba') + ' 61%,rgba(0,0,0,0) 100%)'
                });
            });
        }
        img.src = 'img/' + $(el).css('background-image').split(/\)/)[0].split(/\//).pop().replace(/\"/, '');
    });

    //文章排序
    $('.single-list .article-list').ddSort({
        topOffset: $('.wrapper-single-list').offset().top,
        dragEndCallback: function() {
            console.log('end');
        }
    });

    //节目排序
    $('.wrapper-single-list').ddSort({
        dragTarget: ".single-list",
        dragSelector: "header",
        topOffset: $('.wrapper-single-list').offset().top - 15,
        dragEndCallback: function() {
            console.log('end');
        }
    });

    //改变菜单栏进度条宽度
    function changePrograssBar() {
        var percentage = ($(window).width() / ($('.single-list:eq(1)').outerWidth() * $('.single-list').length)).toFixed(3) * 100 + '%';
        $('.navbar').find('.sub-nav .bar').css('width', percentage);
    }
    changePrograssBar();
    $(window).resize(changePrograssBar);

    //改变菜单栏进度条位置
    $('.wrapper-single-list').scroll(function(event) {
        var percentage = $('.wrapper-single-list').scrollLeft() / ($('.single-list:eq(1)').outerWidth() * $('.single-list').length) * 100 + '%';
        $('.navbar').find('.sub-nav .bar').css('left', percentage);
    });

    //点击菜单栏滚动列表
    $('.sub-nav .nav-link').click(function(event) {
        event.preventDefault();
        $('.wrapper-single-list').animate({
            scrollLeft: $('.single-list').width() * $(this).index() + window.getComputedStyle($('.single-list:eq(1)')[0])['margin-left'].replace('px', '') * $(this).index()
        }, 300, 'swing');
        return false;
    });

    //对可移动dom进行点击事件绑定
    $.fn.bindCustomClick = function(callback) {
        var self = this;
        $(self).on('mousedown', function(event) {
            var startX = event.pageX,
                startY = event.pageY;
            $(self).on('mouseup', function(event2) {
                $(self).off('mouseup');
                if (startX == event2.pageX && startY == event2.pageY) {
                    callback();
                }
            });
        });
    }

    $('.list-header').bindCustomClick(function(){
        $('.program-modal').modal('show');
    });

});

require(['js/admin_index_app'], function(app) {
    app.bootstrap();
});
