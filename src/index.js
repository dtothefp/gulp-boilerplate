import moduleA, {dopeness} from './lib/module-a';
console.log('MAIN JS LOADED');
var {a, b} = dopeness;

console.log(moduleA());
console.log('A => %s, B => %s', a, b);

