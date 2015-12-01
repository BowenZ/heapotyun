var DEV_CONFIG = {
    DEV_MODE: false
}

require.config({
    baseUrl: '',
    paths: {
        // 'weixin': 'http://res.wx.qq.com/open/js/jweixin-1.0.0',
        'jquery': DEV_CONFIG.DEV_MODE? 'bower_components/jquery/dist/jquery' : '//cdn.bootcss.com/jquery/2.1.4/jquery.min',
        'swiper': DEV_CONFIG.DEV_MODE? 'bower_components/Swiper/dist/js/swiper' : '//cdn.bootcss.com/Swiper/3.0.7/js/swiper.min',
        'bootstrap': DEV_CONFIG.DEV_MODE? 'bower_components/bootstrap/dist/js/bootstrap' : '//cdn.bootcss.com/bootstrap/3.3.5/js/bootstrap.min',
        'angular': DEV_CONFIG.DEV_MODE? 'bower_components/angular/angular' : '//cdn.bootcss.com/angular.js/1.4.7/angular.min',
        'angular-route': DEV_CONFIG.DEV_MODE? 'bower_components/angular-route/angular-route' : 'http://bowen-blog.b0.upaiyun.com/js/angular/angular-route.min',
        'ui.router': DEV_CONFIG.DEV_MODE? 'bower_components/angular-ui-router/release/angular-ui-router' : 'http://bowen-blog.b0.upaiyun.com/js/angular/angular-ui-router.min',
        'angular-resource': DEV_CONFIG.DEV_MODE? 'bower_components/angular-resource/angular-resource' : 'http://bowen-blog.b0.upaiyun.com/js/angular/angular-resource.min'
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
        'ui.router': {
            deps: ['angular']
        },
        'angular-resource': {
            deps: ['angular', 'angular-route']
        }
    },
    waitSeconds: 30
});

require(['js/app'], function(app){
	app.bootstrap();
});