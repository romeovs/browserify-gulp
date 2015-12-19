# browserify-gulp

`browserify-gulp` is a drop-in replacement for [`browserify`][browserify] that
can be configured easily and has support for [`watchify`][watchify]
to improve performance drastically.

It is based on [this gulp recipe][recipe], but with some adaptations to make
configuring it easier.

## Installation
To install `browserify-gulp` do:

```
npm install --save-dev browserify-gulp
```

## Usage
At it's most basic use, you can use `browserify-gulp` like this:

```js
var gulp       = require('gulp')
  , Browserify = require('browserify-gulp')
  ;

var options = {
  entries: [ './src/main.js' ]
};

gulp.task('browserify', function() {
  Browserify(options)
    .done(function(strm) {
      // strm is a gulp strm containing
      // the bundled file, you can do anything
      // you would do with a normal gulp stream
      strm
        // .pipe(somegulpplugin)
        .pipe(gulp.dest('./dest'));
    });
});
```

## Options
`browserify-gulp` has the same signature as [`browserify`][browserify]:

```js
Browserify(entries, options)
// or
Browserify(options)
```

All the options are passed to `browserify` internally so you can use
`browserify-gulp` as a drop-in replacement fro `browserify`.

### `options.entries`
An array of filenames that serve as an entrypoint, as with `browserify`.  Can
also be passed as a normal argument to `browserify-gulp`.

### `options.watching`
If this is set to `true`, `browserify-gulp` will keep 
on watching the all the relevant files and rebuild everytime
one of them changes.  This is done using [`watchify`][watchify],
which caches intermediate files, making the builds super fast.

Defaults to `false`.

### `options.delay`
This is the default delay (in ms) `browserify-gulp` will wait before 
triggering a rebuild.

Defaults to `60`.

### `options.filename`
The filename the eventual build file will have in the gulp pipe.

Defaults to `main.js`.

### `options.logtime`
The function used to log build times.  Gets the time
the build took in ms as a parameter.

Defaults to [a nice gulp-like logging function](./src/defaults/log-time.js)

### `options.logfiles`
The function to log the changed files when watching. Gets an array of the changed
files as parameter.

Defaults to [a nice gulp-like logging function](./src/defaults/log-files.js)

### `options.logerror`
A function to log errors with.  Gets the error as parameter.

Defaults to [a nice gulp-like logging function](./src/defaults/log-error.js)

## Middleware
You can configure the bundler even more by using middleware functions.
To attach some middleware, use the `configure` method before calling `done`:

```js
Browserify(options)
  .configure(function() {
    // configure middleware
  })
  .done(/* ... */)
```

A middleware function has access to three things:

  - `this.options` this is the options object
     as was passed to `browserify-gulp`, possibly
     already edited by other middleware.
  - `this.bundler` the bundler that was created by `browserify`.  You can call
    almost all methods on it (`transform`, `add`, `require`, `external`,
    `exclude`, `ignore`, `plugin`, `on`) to configure the bundler.
  - `this.done` a function that will handle the final stream created
     when the files are bundled.  This handler gets a stream and should 
     return the transformed stream.

You can change these properties by setting them to their new value in
the middleware function.  Make sure you take into account previous options
that might have been set in other middleware (eg. concat your new extension
to the `this.options.extensions` array instead of overwiting it).

As an example, here is a transform that adds `jsx` support via `babelify`:
```js
var babelify = require('babelify');
// ...
Browserify(options)
  .configure(function() {
    this.options.extensions = ['.jsx'].concat(this.options.extensions || []);

    this.bundler.transform(babelify.configure({
      experimental: options.experimental
    }));
  })
  .done(function(strm) {
    // ...
  });
};
```


## Todo
- write tests
- add examples
- add links to middleware repos
- move to full es6


### License
This code is licensed under the [ISC license][license]

[license]:    ./LICENSE
[browserify]: http://browserify.org
[watchify]:   https://github.com/substack/watchify
[recipe]:     https://github.com/gulpjs/gulp/blob/master/docs/recipes/fast-browserify-builds-with-watchify.md "gulp recipe"
