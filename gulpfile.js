var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var eslint = require('gulp-eslint');
var uglify = require('gulp-uglify');
var minifycss = require('gulp-minify-css');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');
var subtree = require('gulp-subtree');
var clean = require('gulp-clean');

gulp.task('browser-sync', ['build'], function() {
  browserSync({
    server: {
        baseDir: "./dist"
    }
  });
});

gulp.task('bs-reload', function () {
  browserSync.reload();
});


gulp.task('styles', function(){
  gulp.src(['src/styles/**/*.scss'])
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(sass())
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest('dist/styles/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/styles/'))
    .pipe(browserSync.reload({stream:true}))
});

// Img
gulp.task('img', function() {
  return gulp.src('src/imgs/**/*')
    .pipe(gulp.dest('dist/imgs/'))
    .pipe(browserSync.reload({stream:true}))
});

// Html
gulp.task('html', function() {
  return gulp.src('./index.html')
      .pipe(gulp.dest('dist'))
      .pipe(browserSync.reload({stream:true}));
});

// MP3s
gulp.task('mp3', function() {
  return gulp.src('src/mp3s/**/*')
      .pipe(gulp.dest('dist/mp3s'))
      .pipe(browserSync.reload({stream:true}));
});

// Eslint
gulp.task('lint', function() {
  return gulp.src('src/scripts/**/*.js')
    .pipe(eslint())
    .pipe(eslint.format());
});

// Browserify
gulp.task('browserify', ['lint'], function () {
    return browserify({
        debug: true,
        entries: ['src/scripts/app.jsx' ],
        extensions: ['.jsx', '.js' ]
    })
    .transform(babelify)
    .bundle()
    .pipe(source('app.js'))
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(gulp.dest('dist/scripts/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(streamify(uglify()))
    .pipe(gulp.dest('dist/scripts/'))
    .pipe(browserSync.reload({stream:true}))
});

// Deploy to GH pages
gulp.task('temp', ['build'], function() {
    return gulp.src('./dist/**/*')
        .pipe(gulp.dest('./build'));
});

gulp.task('deploy', ['temp'], function() {
    return gulp.src('./build')
        .pipe(subtree())
        .pipe(clean());
});

gulp.task('build', ['styles', 'browserify', 'img', 'mp3', 'html']);

gulp.task('default', ['browser-sync'], function(){
  gulp.watch("src/styles/**/*.scss", ['styles']);
  gulp.watch(["src/scripts/**/*.jsx", "src/scripts/**/*.js"], ['browserify']);
  gulp.watch("src/imgs/**/*", ['img']);
  gulp.watch("*.html", ['html']);
  gulp.watch("src/mp3s/**/*", ['mp3']);
});
