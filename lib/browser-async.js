!function(name, path, ctx) {
  var latest, previous = name !== 'Keen' && ctx['Keen'] ? ctx['Keen'] : false;
  ctx[name] = ctx[name] || {
    ready: function(fn) {
      var head = document.getElementsByTagName('head')[0],
          script = document.createElement('script'),
          loaded;
      script.onload = script.onerror = script['onreadystatechange'] = function () {
        if ( (script['readyState'] && !(/^c|loade/.test(script['readyState'])) ) || loaded) return;
        script.onload = script['onreadystatechange'] = null;
        loaded = 1;
        // noConflict
        latest = ctx.Keen;
        if (previous) {
          ctx.Keen = previous;
          ctx[name] = latest;
        }
        ctx[name].ready(fn);
      }
      script.async = 1;
      script.src = path;
      head.parentNode.insertBefore(script, head);
    }
  };
}('Keen', '../dist/keen-tracking.js', this);
