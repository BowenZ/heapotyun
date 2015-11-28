var gulp = require('gulp'),
    yargs = require('yargs').argv,
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    minifyCSS = require('gulp-minify-css'),
    autoprefixer = require('gulp-autoprefixer'),
    imagemin = require('gulp-imagemin'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload;

var RevAll = require('gulp-rev-all'),
    useref = require('gulp-useref');

var dist = __dirname + '/dist/';

gulp.task('min-js', function() {
    gulp.src(['js/**/*.js', '!js/**/*.min.js']) //选择文件，传入参数是文件路径
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(dist + 'js/')); //输出文件
});

gulp.task('concat-js', function() {
    gulp.src('js/*.js') //选择文件，传入参数是文件路径
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(uglify())
        .pipe(concat('app.min.js'))
        .pipe(gulp.dest(dist + 'js/')); //输出文件
});

gulp.task('lint-js', function() {
    gulp.src('js/*.js') //选择文件，传入参数是文件路径
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('auto', function() {
    // 监听文件修改，当文件被修改则执行 uglify-js 任务
    gulp.watch('js/*.js', ['min-js']);
});

gulp.task('min-css', function() {
    gulp.src('css/*.css')
        .pipe(autoprefixer())
        .pipe(minifyCSS())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(dist + 'css/'));
});

gulp.task('min-img', function() {
    gulp.src('img/*.*')
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest(dist + 'img/'));
});

//同步浏览器操作，监听文件改动
gulp.task('browser-sync', function() {
    var files = [
        'design/**/*.html',
        'design/public/css/**/*.css'
    ];
    browserSync.init(files, {
        server: {
            baseDir: './design'
        }
    });
});

//将远程页面代理到本地
gulp.task('browser-sync-proxy', function() {
    browserSync.init({
        proxy: 'https://www.baidu.com/'
    });
});

gulp.task('md5', function() {
    var revAll = new RevAll({

        //不重命名文件  
        dontRenameFile: ['.html'],

        //无需关联处理文件  
        dontGlobal: [/^\/favicon.ico$/, '.bat', '.txt', '.json'],

        //该项配置只影响绝对路径的资源  
        prefix: 'http://s0.static.server.com',

        dontUpdateReference: ['.html']
    });

    /*
    useref的作用是将html中的css和js合并后将路径改为单一文件
    <!-- build:<type>(alternate search path) <path> -->
    ...HTML Markup, list of script / link tags.
    <!-- endbuild -->
    如：<!-- build:css css/combined.css -->
        <link href="css/one.css" rel="stylesheet">
        <link href="css/two.css" rel="stylesheet">
        <!-- endbuild -->
    转换为：<link rel="stylesheet" href="css/combined.css"/>
    */

    return gulp.src('design/*.html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCSS()))
        .pipe(revAll.revision())
        .pipe(gulp.dest(dist))
        .pipe(revAll.manifestFile())
        .pipe(gulp.dest(dist));;
});

// 使用 gulp.task('default') 定义默认任务
gulp.task('default', function(){
    if(yargs.l){
        gulp.start('lint-js');
    }else if(yargs.m){
        gulp.start(['min-js', 'min-css', 'min-img']);
    }else{
        console.log('eeee');
    }
    return;
});