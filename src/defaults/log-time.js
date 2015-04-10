import gutil from 'gulp-util'

var bs = gutil.colors.cyan('browserify');

export default function(time) {
  var tm = gutil.colors.magenta(`${time}ms`);
  gutil.log(`Finished ${bs} build after ${tm}.`);
};
