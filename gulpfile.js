const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const notify = require("gulp-notify");
const del = require('del');
 

gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: "./src"
        },
        notify: false
    });
});

gulp.task('sass', function(){
    return gulp.src('src/sass/**/*.sass')
    .pipe(sass().on('error', notify.onError()))
    .pipe(autoprefixer(['last 15 version']))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('src/css'))
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('images', function(){
    return gulp.src('src/img/**/*')
    .pipe(imagemin([
        imagemin.jpegtran({
            progressive: true
        }),
        imagemin.optipng({
            optimizationLevel: 5
        })
    ]))
    .pipe(gulp.dest('dist/img'))
})

gulp.task('watch', ['server'], function() {
    gulp.watch('src/sass/**/*.sass', ['sass']);
    gulp.watch('src/js/**/*.js', ['scripts']);
    gulp.watch('src/img/**/*', browserSync.reload);
    gulp.watch('src/**/*.html', browserSync.reload);
});

gulp.task('scripts', function(){
    return gulp.src([
        // Добавляем все скрипты которые хотим объединить
        'src/js/script.js'
    ])
    .pipe(concat('script.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('src/js'))
    .pipe(browserSync.reload({stream: true}))
});

gulp.task('del', function() {
    del(['dist']);
})

gulp.task('build', ['del', 'scripts', 'sass', 'images'], function () {
    return gulp.src([
        'src/**/*.html',
        'src/**/*.min.js',
        'src/**/*.css'
    ])
    .pipe(gulp.dest('dist'))
});

gulp.task('default', ['watch']);