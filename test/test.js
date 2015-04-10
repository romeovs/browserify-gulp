import { expect } from './instrument'
import Lab        from 'lab'
import buffer     from 'gulp-buffer'

var lab = Lab.script();
var { describe, it } = lab;
export { lab }

import Browserify from '../src'

describe('Browserify', function() {
  it('should bundle the file', function(done) {
    Browserify(__dirname + '/bundle/main.js', {})
      .done(function(strm) {
        strm
          .pipe(buffer())
          .once('data', function(file) {
            var code = file.contents.toString();
            done();
          });
      });
  });
});

