import gutil from 'gulp-util'

export default function(err) {
  const error = new gutil.PluginError('Browserify', err);
  gutil.log(error);
};
