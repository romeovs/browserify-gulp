import gutil from 'gulp-util'

var unique = function(arr) {
  var uniq = [];
  for (var i = 0; i < arr.length; i++) {
    if (uniq.indexOf(arr[i]) === -1) {
        uniq.push(arr[i]);
    }
  }
  return uniq;
};

var bs = gutil.colors.cyan('browserify');

export default function(files) {
  unique(files || [])
    .map(file => gutil.colors.magenta(`./${file}`))
    .forEach(function(file) {
      gutil.log(`${file} was changed`);
    });
    gutil.log(`Starting ${bs} build...`);
};

