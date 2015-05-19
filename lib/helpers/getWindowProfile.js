function getWindowProfile(){
  var body, html, output;

  if ('undefined' == typeof document) return {};

  body = document.body;
  html = document.documentElement;

  output = {
    'height': window.innerHeight || null,
    'width': window.innerWidth || null,
    'scrollHeight': Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight ) || null
  };

  if (window.screen) {
    output.ratio = {
      'height': (window.screen.availHeight) ? parseFloat( (window.innerHeight/window.screen.availHeight).toFixed(2) ) : null,
      'width': (window.screen.availWidth) ? parseFloat( (window.innerWidth/window.screen.availWidth).toFixed(2) ) : null
    };
  }

  return output;
}

module.exports = getWindowProfile;
