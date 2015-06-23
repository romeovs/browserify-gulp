import watchify   from 'watchify'
import gutil      from 'gulp-util'
import source     from 'vinyl-source-stream'
import path       from 'path'
import proxy      from './proxy'

import logfiles   from './defaults/log-files'
import logtime    from './defaults/log-time'
import logerror   from './defaults/log-error'

// merge middleware
var merge = function(middleware, options, done, rebundle) {
  var conf = {
    bundler: proxy()  // create empty proxy
  , options           // start with options
  , done              // start with done handler
  , rebundle
  };

  middleware.forEach(function(fn) {
    fn.apply(conf);
  });

  return conf;
};

var Browserify = function (options = {}) {

  // fallback options
  options.delay      = options.delay    || 60;        // 60ms delay after file changed
  options.filename   = options.filename || 'main.js'; // the name of the bundled file
  options.entries    = options.entries  || [];        // entries

  // default logging functions
  options.logfiles   = options.logfiles || logfiles;
  options.logtime    = options.logtime  || logtime;
  options.logerror   = options.logerror || logerror;

  // override some options
  var bopts = Object.assign(options, {
      cache        : {}
    , packageCache : {}
    , fullpaths    : options.watching
    , watching     : options.watching
    });

  // initial middleware is empty
  var middleware = [];
  var configure = function(fn) {
    // add to middleware
    middleware.push(fn);

    // return for chaining
    return this;
  };

  this.rebundle = function() {
    // do nothing as we haven't finished bootstrapping yet
    // after the bootstrapping rebunle will be called
    // anyways.
  };

  // start bundling chain
  var start = function(bundler, handler) {
    // set up watchify if necessary
    if ( options.watching ) {
      bundler = watchify(bundler, {
        delay: options.delay
      });
    }

    // rebundle files
    this.rebundle = function(files) {
      options.logfiles(files);

      var stream =
        bundler
          .bundle()
          .on('error', function(err) {
            // log the error
            options.logerror(err)

            // end stream
            this.emit('end');
          })
          .pipe(source(options.filename)) // create file for gulp
          ;

      if ( !options.watching ) {
          stream.on('end', options.logtime);
      }

      // continue with stream
      handler(stream);
    };

    if ( options.watching ) {
      bundler.on('update', this.rebundle);
      bundler.on('time',   options.logtime);
    }

    // call rebundle to sart ping-pong
    this.rebundle();
  }.bind(this);

  // end config chain, add done handler
  var done = function(fn) {
    var re = function() {
      this.rebundle();
    }.bind(this);
    var merged = merge(middleware, bopts, fn, re);
    var bundler = merged.bundler.build(merged.options);
    start(bundler, merged.done);

    // return rebundle function so it can be
    // called externally
    return re;
  }.bind(this);

  return {
    configure
  , done
  };
};

// export nice function
export default function(entries, options) {
  // check if entries is available
  // and put it in options
  if ( options ) {
    options.entries = entries.concat(options.entries || []);
  } else {
    options = entries;
  }

  return new Browserify(options);
};

export { default as babelify } from './middleware/babelify';

