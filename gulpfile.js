const gulp = require('gulp');
const clientPath = './client/';
const libs = [
  "./bower_components/reveal-js/css/reveal.min.css",
  "./bower_components/reveal-js/css/theme/night.css",
  "./bower_components/reveal-js/lib/css/zenburn.css",
  "./bower_components/reveal-js/lib/js/head.min.js",
  "./bower_components/reveal-js/js/reveal.min.js",
  "./bower_components/reveal-js/plugin/highlight/highlight.js"
];

gulp.task('default', () => (
  gulp.src(libs)
    .pipe(gulp.dest(clientPath))
));
