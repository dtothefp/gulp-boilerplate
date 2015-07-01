const a = 'a';
const b = 'b';
var obj = {
  a,
  b
};

export default function() {
  return console.log('module-a');
}

export {obj as dopeness};
