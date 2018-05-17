var assert = require('proclaim');
var config = require('../helpers/client-config');
var Keen = require('../../../lib/browser');

describe('Auto Tracking', function() {

  beforeEach(function() {
    this.client = new Keen({
      projectId: config.projectId,
      writeKey: config.writeKey,
      requestType: 'xhr',
      host: config.host,
      protocol: config.protocol
    });
  });

  it('should capture "pageviews," "clicks," and "form submits"', function(){
    this.timeout(5000);
    var aNode = document.createElement('A');
    var bNode = document.createElement('BUTTON');
    var fNode = document.createElement('FORM');
    var iNode = document.createElement('INPUT');
    var pNode = document.createElement('INPUT');
    var inc = 0;

    this.client.on('recordEvent', function(stream, payload){
      if (stream === 'pageviews') {
        expect().equal(stream, 'pageviews');
        inc++;
      }
      else if (stream === 'clicks') {
        expect().equal(stream, 'clicks');
        expect().equal(payload.element.id, 'test-auto-tracker-clicks');
        expect().equal(payload.element.node_name, 'A');
        expect().isNumber(payload.page.time_on_page);
        aNode.outerHTML = '';
        inc++;
      }
      else if (stream === 'form_submissions') {
        expect().equal(stream, 'form_submissions');
        expect().equal(payload.element.id, 'test-auto-tracker-submits');
        expect().equal(payload.element.node_name, 'FORM');
        expect().equal(payload.form.fields.email, 'team@keen.io');
        expect().notOk(payload.form.fields.password);
        expect().isNumber(payload.page.time_on_page);
        fNode.outerHTML = '';
        inc++;
      }
      // if (inc === 3) {
      //   done();
      // }
    });
    this.client.initAutoTracking();

    /*
      Anchor Tag Listener
    */
    aNode.id = 'test-auto-tracker-clicks';
    aNode.href = 'javascript:void(0);';
    aNode.onclick = function(e){
      e.preventDefault();
      return false;
    };
    document.body.appendChild(aNode);

    /*
      Form Listener
    */
    fNode.id = 'test-auto-tracker-submits';
    fNode.action = 'javascript:void(0);';
    fNode.onsubmit = function(e) {
      e.preventDefault();
      return false;
    };
    // fNode.style.display = 'none';

    iNode.type = 'text';
    iNode.name = 'email';
    iNode.value = 'team@keen.io';

    pNode.type = 'password';
    pNode.name = 'password';
    pNode.value = '**********';

    bNode.type = 'submit';
    fNode.appendChild(iNode);
    fNode.appendChild(pNode);
    fNode.appendChild(bNode);
    document.body.appendChild(fNode);

    /*
      Init Behavior
    */
    // Init anchor click
    if (aNode.click) {
      aNode.click();
    }
    else if (document.createEvent) {
      var ev1 = document.createEvent('MouseEvent');
      ev1.initMouseEvent('click',
          true /* bubble */, true /* cancelable */,
          window, null,
          0, 0, 0, 0,
          false, false, false, false,
          0, null
      );
      aNode.dispatchEvent(ev1);
    }

    // Init form button click (submit)
    if (bNode.click) {
      bNode.click();
    }
    else if (document.createEvent) {
      var ev2 = document.createEvent('MouseEvent');
      ev2.initMouseEvent('click',
          true /* bubble */, true /* cancelable */,
          window, null,
          0, 0, 0, 0,
          false, false, false, false,
          0, null
      );
      bNode.dispatchEvent(ev2);
    }
  });

});
