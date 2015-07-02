import fetch from 'fetch';
import moduleA, {dopeness} from './lib/module-a';
console.log('MAIN JS LOADED');
var {a, b} = dopeness;

moduleA();
console.log('A => %s, B => %s', a, b);

fetch('http://www.omdbapi.com/?t=up&y=&plot=short&r=json')
.then(function(res) {
    console.log('FIRST PROMISE', typeof res.json === 'function');
    return res.json();
}).then(function(json) {
    console.log('RES PROMISE RESOLVED', json);
})
.catch((err) => {
  console.error('ERROR', err);
});
