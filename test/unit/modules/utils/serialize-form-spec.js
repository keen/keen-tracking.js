var assert = require('proclaim');

var serializeForm = require('../../../../lib/utils/serializeForm');

var ELEMENT_ID = 'test-serialize-form';
var INPUT_NAME = 'email';
var INPUT_VALUE = 'team@keen.io';
var PASSWORD_NAME = 'password';
var PASSWORD_VALUE = 'password';

describe('Keen.utils.serializeForm', function() {

  beforeEach(() => {
    const el = document.createElement('FORM');
    el.id = ELEMENT_ID;
    el.action = './';
    el.method = 'POST';
    document.body.appendChild(el);
    this.form = document.getElementById(ELEMENT_ID);

    const input = document.createElement('INPUT');
    input.name = INPUT_NAME;
    input.type = 'text';
    input.value = INPUT_VALUE;
    this.form.appendChild(input);

    const password = document.createElement('INPUT');
    password.name = PASSWORD_NAME;
    password.type = 'password';
    password.value = PASSWORD_VALUE;
    this.form.appendChild(password);
  });

  afterEach(() => {
    this.form.outerHTML = '';
  });

  it('should be a function', function() {
    expect().isFunction(serializeForm);
  });

  it('should accept a FORM element and return an object', function() {
    const serialized = serializeForm(this.form, { hash: true });
    expect().isObject(serialized);
    expect().ok(serialized.email);
    expect().ok(serialized.password);
  });

  it('should omit fields by type (password example)', function() {
    const serialized = serializeForm(this.form, {
      hash: true,
      ignoreTypes: ['password']
    });
    expect().isObject(serialized);
    expect().ok(serialized.email);
    expect().notOk(serialized.password);
  });

});
