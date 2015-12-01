var DEV_CONFIG = {
    DEV_MODE: false
}

require.config({
    baseUrl: '',
    paths: {
        // 'weixin': 'http://res.wx.qq.com/open/js/jweixin-1.0.0',
        'jquery': DEV_CONFIG.DEV_MODE ? 'bower_components/jquery/dist/jquery' : '//cdn.bootcss.com/jquery/2.1.4/jquery.min',
        'swiper': DEV_CONFIG.DEV_MODE ? 'bower_components/Swiper/dist/js/swiper' : '//cdn.bootcss.com/Swiper/3.0.7/js/swiper.min',
        'bootstrap': DEV_CONFIG.DEV_MODE ? 'bower_components/bootstrap/dist/js/bootstrap' : '//cdn.bootcss.com/bootstrap/3.3.5/js/bootstrap.min',
        'bootstrapValidator': 'js/vendor/bootstrapValidator.min',
        'angular': DEV_CONFIG.DEV_MODE ? 'bower_components/angular/angular' : '//cdn.bootcss.com/angular.js/1.4.7/angular.min',
        'angular-route': DEV_CONFIG.DEV_MODE ? 'bower_components/angular-route/angular-route' : 'http://bowen-blog.b0.upaiyun.com/js/angular/angular-route.min',
        'ui.router': DEV_CONFIG.DEV_MODE ? 'bower_components/angular-ui-router/release/angular-ui-router' : 'http://bowen-blog.b0.upaiyun.com/js/angular/angular-ui-router.min',
        'angular-resource': DEV_CONFIG.DEV_MODE ? 'bower_components/angular-resource/angular-resource' : 'http://bowen-blog.b0.upaiyun.com/js/angular/angular-resource.min',
        'angular-animate': DEV_CONFIG.DEV_MODE ? 'bower_components/angular-animate/angular-animate' : 'http://bowen-blog.b0.upaiyun.com/js/angular/angular-animate.min'
    },
    shim: {
        'bootstrap': {
            deps: ['jquery']
        },
        'bootstrapValidator': {
            deps: ['bootstrap'],
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
            deps: ['angular', 'ui.router']
        },
        'angular-animate': {
            deps: ['angular']
        }
    },
    waitSeconds: 30
});

require(['js/admin_app', 'jquery', 'bootstrap', 'bootstrapValidator'], function(app) {
    var $shade = $('.shade'),
        $alert = $('.shade .alert');
    var resetPreview, loadContent;

    $(document).ready(function() {
        if($shade.hasClass('true')){
            app.bootstrap();
        }

        $alert.find('button').click(function() {
            $alert.hide(200);
        });
        $('.shade form').bootstrapValidator({
            message: '信息不合法',
            feedbackIcons: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                username: {
                    validators: {
                        notEmpty: {
                            message: '用户名不能为空'
                        }
                    }
                },
                password: {
                    validators: {
                        notEmpty: {
                            message: '密码不能为空'
                        }
                    }
                }
            },
            submitHandler: function(validator, form, submitButton) {
                var username = $(form).find('input[name="username"]').val(),
                    password = $(form).find('input[name="password"]').val();
                $.post('/sijiache/admin/login', {
                    name: username,
                    password: password
                }, function(data, textStatus, xhr) {
                    if (data == 'error') {
                        //用户不存在
                        $alert.find('.info').text('用户名或密码错误！');
                        $alert.show(200);
                    } else {
                        app.bootstrap();
                        $('.shade').hide(600);
                        $('.shade').find('input').val('')
                    }
                });
            }
        });

        !function bindEvents() {
            $('.logout').click(function() {
                $shade.show(200);
                $.get('admin/logout', function(data) {
                    console.log(data);
                });
            });
            $shade.find('input').on('focus change', function() {
                $alert.hide();
            });
        }();
    });

});
