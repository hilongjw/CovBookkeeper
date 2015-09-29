var gulp = require('gulp');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
 
gulp.task('ju', function() {
  return gulp.src('public/lib/js/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('public/dist/js'));
});

gulp.task('css', function() {
  return gulp.src('public/lib/css/*.css')
    .pipe(minifyCss({compatibility: 'chrome'}))
    .pipe(gulp.dest('public/dist/css'));
});

// 默认任务
gulp.task('default', function(){
    gulp.run('ju','css');

    // 监听文件变化
    gulp.watch('public/lib/js/*.js', function(){
        gulp.run('ju');
    });
    // 监听文件变化
    gulp.watch('public/lib/css/*.css', function(){
        gulp.run('css');
    });
});