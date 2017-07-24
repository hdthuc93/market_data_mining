var gulp = require('gulp'),
        usemin = require('gulp-usemin'),
        wrap = require('gulp-wrap'),
        connect = require('gulp-connect'),
        watch = require('gulp-watch'),
        minifyCss = require('gulp-cssnano'),
        minifyJs = require('gulp-uglify'),
        concat = require('gulp-concat'),
        less = require('gulp-less'),
        rename = require('gulp-rename'),
        minifyHTML = require('gulp-htmlmin');
        sourcemaps = require('gulp-sourcemaps');

var paths = {
    scripts: 'src/client/js/**/*.*',
    styles: 'src/client/style/**/*.*',
    images: 'src/client/img/**/*.*',
    templates: 'src/client/templates/**/*.html',
    index: 'src/client/index.html',
    bower_fonts: 'src/client/components/**/*.{ttf,woff,woff2,eof,svg}',
    jquery_ui_images: 'src/client/components/jquery-ui/themes/smoothness/images/*.{png,jpg,ico}'
};

/**
 * Handle bower components from index
 */
gulp.task('usemin', function () {
    return gulp.src(paths.index)
            .pipe(usemin({
                js: [minifyJs(), 'concat'],
                css: [],
            }))
            .pipe(gulp.dest('dist/'));
});

/**
 * Copy assets
 */
gulp.task('build-assets', ['copy-bower_fonts','copy-bower_fonts-to-css','copy-jquery_ui_images']);

gulp.task('copy-bower_fonts', function () {
    return gulp.src(paths.bower_fonts)
            .pipe(rename({
                dirname: '/fonts'
            }))
            .pipe(gulp.dest('dist/lib'));
});
gulp.task('copy-bower_fonts-to-css', function () {
    return gulp.src(paths.bower_fonts)
            .pipe(rename({
                dirname: '/css'
            }))
            .pipe(gulp.dest('dist/lib'));
});
gulp.task('copy-jquery_ui_images', function () {
    return gulp.src(paths.jquery_ui_images)
            .pipe(rename({
                dirname: '/images'
            }))
            .pipe(gulp.dest('dist/lib/css'));
});

/**
 * Handle custom files
 */
gulp.task('build-custom', ['custom-images', 'custom-js', 'custom-less', 'custom-templates']);

gulp.task('custom-images', function () {
    return gulp.src(paths.images)
            .pipe(gulp.dest('dist/img'));
});

gulp.task('custom-js', function () {
    return gulp.src(paths.scripts)
            .pipe(sourcemaps.init())
            .pipe(minifyJs())
            .pipe(concat('dashboard.min.js'))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('dist/js'));
});

gulp.task('custom-less', function () {
    return gulp.src(paths.styles)
            .pipe(less())
            .pipe(gulp.dest('dist/css'));
});

gulp.task('custom-templates', function () {
    return gulp.src(paths.templates)
            .pipe(minifyHTML())
            .pipe(gulp.dest('dist/templates'));
});

/**
 * Watch custom files
 */
gulp.task('watch', function () {
    gulp.watch([paths.images], ['custom-images']);
    gulp.watch([paths.styles], ['custom-less']);
    gulp.watch([paths.scripts], ['custom-js']);
    gulp.watch([paths.templates], ['custom-templates']);
    gulp.watch([paths.index], ['usemin']);
});

/**
 * Live reload server
 */
gulp.task('webserver', function () {
    connect.server({
        root: 'dist',
        livereload: true,
        port: 8899
    });
});

gulp.task('livereload', function () {
    gulp.src(['dist/**/*.*'])
            .pipe(watch(['dist/**/*.*']))
            .pipe(connect.reload());
});

/**
 * Gulp tasks
 */
gulp.task('build', ['usemin', 'build-assets', 'build-custom']);
gulp.task('default', ['build', 'watch']);