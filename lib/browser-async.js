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

/*!
  Example Usage:
  Replace 'Keen' with a custom name: 'MyCustomKeenBuild'
  -------------------------------------------------------

  MyCustomKeenBuild.ready(function(){
    var client = new MyCustomKeenBuild.Client({
      projectId: "123",
      writeKey: "4324543"
    });
  });

*/

/*

Previous

!function(name, ctx) {
  if ('undefined' !== typeof ctx[name]) return;
  var previous = name !== 'Keen' && ctx['Keen'] ? ctx['Keen'] : false,
      latest;
  ctx[name] = {
    load: function(url, fn) {
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
      script.src = url;
      head.parentNode.insertBefore(script, head);
    }
  };
}('Keen', this);

*/


/*

// Front-loaded namespace

!function(i,o){i("Keen", o);}(function(name,win){
  if ('undefined' !== typeof window[name]) return;
  var previous = name !== 'Keen' && window['Keen'] ? window['Keen'] : false,
      latest;
  window[name] = {
    load: function(url, fn) {
      var head = document.getElementsByTagName('head')[0],
          script = document.createElement('script'),
          loaded;
      script.onload = script.onerror = script['onreadystatechange'] = function () {
        if ( (script['readyState'] && !(/^c|loade/.test(script['readyState'])) ) || loaded) return;
        script.onload = script['onreadystatechange'] = null;
        loaded = 1;
        // noConflict
        latest = window.Keen;
        if (previous) {
          window.Keen = previous;
          window[name] = latest;
        }
        window[name].ready(fn);
      }
      script.async = 1;
      script.src = url;
      head.parentNode.insertBefore(script, head);
    }
  };
}, this);


*/
