var gulp = require('gulp'),
  fs = require('fs'),
  uglify = require('gulp-uglify'),
  concatDest = 'index.js',
  minifyDest = 'dest';

gulp.task('concat', function() {
  var files = ['global.js', 'Binder.js', 'Model.js', 'Node.js', 'Compiler.js'],
    filePrefix = './src/';

  var result = '(function(s){';

  for (i in files) {
    result += fs.readFileSync(filePrefix + files[i]);
  }

  result += '})(window);';

  fs.writeFileSync(concatDest, result);
});

gulp.task('uglify', function() {
  gulp.src(concatDest)
    .pipe(uglify())
    .pipe(gulp.dest(minifyDest));
});

gulp.task('watch', function() {
  gulp.watch('./src/**/*.js', ['build']);
});

gulp.task('build', ['concat', 'uglify']);