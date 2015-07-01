import path from 'path';
import Nightmare from 'nightmare';

export default function(gulp, plugins, config) {
  var {optPath, phantomPath, screenshot} = config;

  return (cb) => {
    new Nightmare({phantomPath: phantomPath})
    .viewport(1024, 1000)
    .goto(path.join(optPath, 'mobile'))
    .screenshot(screenshot({ imgName: 'opt-homepage' }))
    .run((err) => {
      if(err) throw new Error(err.message);

      console.log('nightmare task done');
      cb();
    });
  };
}
