var gulp = require('gulp'),
  fs = require('fs');

gulp.task('concat', function() {
  var files = ['global.js', 'Binder.js', 'Model.js', 'Node.js', 'Compiler.js'],
    filePrefix = './src/',
    dest = 'index.js';
  var result = '(function(s){';

  for (i in files) {
    result += fs.readFileSync(filePrefix + files[i]);
  }

  result += '})(window);';

  fs.writeFileSync(dest, result);

  console.log('Files concation finished.');
});