var gulp = require('gulp');
var browserify = require('browserify');
var reactify = require('reactify');
var source = require('vinyl-source-stream');

// Our JS task. It will Browserify our code and compile React JSX files.
gulp.task('js', function() {
  // Browserify/bundle the JS.
  browserify(['./src/planner.js'])
    .transform(reactify)
    .bundle()
    .on('error', function(err){
      console.log(err.message);
      this.emit('end');
    })
    .pipe(source('planner.js'))
    .pipe(gulp.dest('./dist/'));
});

// Rerun tasks whenever a file changes.
gulp.task('watch', function() {
  gulp.watch(['src/**/*.js'], ['js']);
});