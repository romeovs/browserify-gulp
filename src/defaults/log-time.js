import gutil from 'gulp-util'

var bs = gutil.colors.cyan('browserify');

export default function(time) {
  let info = '';
  if ( time ) {
    var tm = gutil.colors.magenta(`${time}ms`);
    info = ` after ${tm}`;
  }
  gutil.log(`Finished ${bs} build${info}.`);
};
