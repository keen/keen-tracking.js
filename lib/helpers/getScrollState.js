import extend from 'keen-core/lib/utils/extend';

export function getScrollState(obj){
  var config = typeof obj === 'object' ? obj : {};
  var state = extend({
    pixel: 0,
    pixel_max: 0,
    ratio: null,
    ratio_max: null
  }, config);

  if (typeof window !== undefined || typeof document !== undefined) {
    state.pixel = getScrollOffset() + getWindowHeight();
    if (state.pixel > state.pixel_max) {
      state.pixel_max = state.pixel;
    }
    state.ratio = parseFloat(Number(state.pixel / getScrollableArea()).toFixed(2));
    state.ratio_max = parseFloat(Number(state.pixel_max / getScrollableArea()).toFixed(2));
  }

  return state;
}

function getScrollableArea() {
  var body = document.body;
  var html = document.documentElement;
  return Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight ) || null;
}

function getScrollOffset() {
  return (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
}

function getWindowHeight() {
  return window.innerHeight || document.documentElement.clientHeight;
}
