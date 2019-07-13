/* eslint-disable */
const gulp = require('gulp');
const twig = require('gulp-twig');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const image = require('gulp-image');
const glob = require('gulp-sass-glob');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');
const stylelint = require('gulp-stylelint');
const browserSync = require('browser-sync');

gulp.task('twig', () => {
  return gulp
    .src('src/templates/*.html.twig')
    .pipe(twig())
    .pipe(rename('index.html'))
    .pipe(gulp.dest('dist'));
});

gulp.task('sass', () => {
  return gulp
    .src('src/sass/**/*.scss')
    .pipe(glob())
    .pipe(
      sass({
        includePaths: ['./node_modules']
      })
    )
    .pipe(autoprefixer({ browsers: ['last 2 versions'] }))
    .pipe(gulp.dest('dist'));
});

gulp.task('image', () => {
  return gulp
    .src('src/images/*')
    .pipe(image())
    .pipe(gulp.dest('dist/images'));
});

gulp.task('stylelint', () => {
  return gulp.src('src/sass/**/*.scss').pipe(
    stylelint({
      reporters: [{ formatter: 'string', console: true }]
    })
  );
});

gulp.task('babel', () => {
  return gulp
    .src('src/js/*.js')
    .pipe(babel())
    .pipe(gulp.dest('dist'));
});

gulp.task('eslint', () => {
  return gulp
    .src(['src/js/*.js'])
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('browsersync', () => {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  });
  gulp.watch(
    [
      'src/templates/**/*.twig',
      'src/sass/**/*.scss',
      'src/js/*.js',
      'src/images/*.png'
    ],
    gulp.series('build', browserSync.reload)
  );
});

gulp.task('lint', gulp.parallel('stylelint', 'eslint'));
gulp.task('build', gulp.parallel('twig', 'sass', 'babel', 'image'));
gulp.task('server', gulp.series('build', gulp.parallel('browsersync')));

gulp.task('default', gulp.series('lint', 'build'));
