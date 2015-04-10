class Stub {
  constructor() {
    this.commands = [];
  }

  // save a new configuration
  push(name, args) {
    this.commands.push([name, args]);
  }

  // apply all configurations
  build(options) {
    var bundler = browserify(options);

    this.commands.forEach(function(cmd) {
      var name = cmd[0];
      var args = cmd[1];

      if ( name === '__set' ) {
        bundler[args[0]] = args[1];
      } else {
        bundler[name].apply(bundler, args);
      }
    });

    return bundler;
  }
}

// valid methods in configure
var valid = [
  'transform'
, 'add'
, 'require'
, 'external'
, 'exclude'
, 'ignore'
, 'plugin'
, 'on'
];

// invalid methods in configure
var invalid = [
  'bundle'
, 'reset'
];

// create an configuration that's proxied
// to allow direct method calls
export default function() {
  var target = new Stub();
  var prox   = {
    build:    target.build.bind(target)
  , pipeline: {
      get() {
        throw new Error(`you cannot call .pipeline.get() in heimlich middleware`);
      }
    }
  };

  // copy all the api methods that are valid
  valid.forEach(function(name) {
    prox[name] = function() {
      target.push(name, arguments);
    };
  });

  // error for other api functions
  invalid.forEach(function(name) {
    prox[name] = function() {
      throw new Error(`you cannot call .${name}() in heimlich middleware`);
    };
  });

  return prox;
};
