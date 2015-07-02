const a = 'a';
const b = 'b';
var obj = {
  a,
  b
};

export default function() {
  return 'module-a';
}

export {obj as dopeness};
