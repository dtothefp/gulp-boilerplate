console.log('PHANTOM SHIM LOADED!!');

function deparam(str) {
  var queryI = str.indexOf('?');
  if(queryI !== -1) {
    str = str.substring(queryI + 1);
  }
  var pairs = str.split('&');

  return pairs.reduce((o, pairStr) => {
    var pair = pairStr.split('=');
    o[pair[0]] = decodeURIComponent(pair[1]);
    return o;
  }, {});
}

var params = deparam(window.location.href);
var {test} = params;

if(test && test === 'phantom' && typeof window.callPhantom === 'function') {
  /**
   * Put hooks in here for http requests/redirects to trigger phantom
   * `.on('callback'` in nightmare tests
   */
  window.callPhantom({ hello: 'world' });
}

