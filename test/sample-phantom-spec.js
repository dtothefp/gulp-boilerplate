import {expect} from 'chai';
import path from 'path';
import Nightmare from 'nightmare';
import config from '../gulp/config';

describe('optimizely mobile signup form', () => {
  var {makeTestUrl, phantomPath, screenshot, email} = config();
  var url = makeTestUrl();

  it('should error without a password', (done) => {
    new Nightmare({
        phantomPath,
        webSecurity: false
      })
      .viewport(1024, 1000)
      .on('callback', (data) => {
        expect(data).to.eql({hello: 'world'});
        done();
      })
      .goto(url)
      .screenshot(screenshot({ imgName: 'phantom-test/home' }))
      .run((err) => {
        if(err) return console.error(err);
      });
  });

});

