import babelify from 'babelify';

export default function (options = {}) {
  // get extensions
  const {
    extensions = [ '.jsx', '.es' ]
  } = options;

  return function() {
    // add extensions
    this.options.extensions = extensions.concat(this.options.extensions || []);

    // add babel transform
    this.bundler.transform(babelify.configure(options));
  };
};
