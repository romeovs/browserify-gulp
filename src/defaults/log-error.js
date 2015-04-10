import gutil from 'gulp-util'

export default function(err) {
  // log error
  var error = new gutil.PluginError('Browserify', err);
  gutil.log(error);

};
