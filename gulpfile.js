const gulp = require('gulp'),
      destPath = '../Web/juggling/';

gulp.task('default', () => {
const libs = [
  "./bower_components/reveal-js/css/reveal.min.css",
  "./bower_components/reveal-js/css/theme/night.css",
  "./bower_components/reveal-js/lib/css/zenburn.css",
  "./bower_components/reveal-js/lib/js/head.min.js",
  "./bower_components/reveal-js/js/reveal.min.js",
  "./bower_components/reveal-js/plugin/highlight/highlight.js",
  "./juggling.js"
];

  gulp.src(libs).pipe(gulp.dest(destPath + 'client/'));
  gulp.src(['images/*']).pipe(gulp.dest(destPath + 'images/'));
  gulp.src(['index.html', 'test2.html']).pipe(gulp.dest(destPath));
});
