var DEV_CONFIG = {
    DEV_MODE: false
}

require.config({
    baseUrl: '/radio/',
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



