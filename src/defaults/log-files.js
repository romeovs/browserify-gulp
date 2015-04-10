import gutil from 'gulp-util'

// returns filename relative to project
// directory (containing gulpfile)
// var relify = function(file) {
//   return path.relative(gulpdir, file);
// };

var unique = function(arr) {
  var uniq = [];
  for (var i = 0; i < arr.length; i++) {
    if (uniq.indexOf(arr[i]) === -1) {
        uniq.push(arr[i]);
    }
  }
  return uniq;
};

Array.prototype.unique = function() {
  return unique(this);
};

var bs = gutil.colors.cyan('browserify');

export default function(files) {
  (files || [])
    // .map(relify)
    .unique()
    .map(file => gutil.colors.magenta(`./${file}`))
    .forEach(function(file) {
      gutil.log(`${file} was changed`);
    });
    gutil.log(`Starting ${bs} build...`);
};

