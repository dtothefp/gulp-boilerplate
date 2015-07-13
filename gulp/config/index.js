import path from 'path';
import _ from 'lodash';
import {path as phantomPath} from 'phantomjs';
import moment from 'moment';

export default function(cliConfig) {
  function makeBasePath(str) {
    return path.join(process.cwd(), str);
  }
  let jsSrc = makeBasePath('src');
  let testSrc = makeBasePath('test');
  let buildSrc = makeBasePath('gulp');
  let screensDir = makeBasePath('test/screenshots');
  let binary = path.dirname(phantomPath) + '/';
  let date = moment().format('HH-mm-ss-MM-DD-YYYY');
  let email = `dfoxpowell+test-${date}@hillaryclinton.com`;

  var config = {
    email,
    screensDir,
    jsSrc,
    testSrc,
    buildSrc,
    screenshot(opts) {
      return path.join(screensDir, `${opts.imgName}.jpg`);
    },
    phantomPath: binary,
    makeTestUrl(url) {
      url = url || '';
      let fullPath = `http://localhost:3000/${url}?test=phantom`;
      return fullPath;
    }
  };

  return _.merge({}, config, cliConfig);
}
