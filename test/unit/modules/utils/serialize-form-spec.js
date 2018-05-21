import { serializeForm } from '../../../../lib/utils/serializeForm';

const ELEMENT_ID = 'test-serialize-form';
const INPUT_NAME = 'email';
const INPUT_VALUE = 'team@keen.io';
const PASSWORD_NAME = 'password';
const PASSWORD_VALUE = 'password';

let form;

describe('Keen.utils.serializeForm', function() {

  beforeAll(() => {
    const el = document.createElement('FORM');
    el.id = ELEMENT_ID;
    el.action = './';
    el.method = 'POST';
    document.body.appendChild(el);
    form = document.getElementById(ELEMENT_ID);

    const input = document.createElement('INPUT');
    input.name = INPUT_NAME;
    input.type = 'text';
    input.value = INPUT_VALUE;
    form.appendChild(input);

    const password = document.createElement('INPUT');
    password.name = PASSWORD_NAME;
    password.type = 'password';
    password.value = PASSWORD_VALUE;
    form.appendChild(password);
  });

  afterAll(() => {
    form.outerHTML = '';
  });

  it('should be a function', function() {
    expect(serializeForm).toBeInstanceOf(Function);
  });

  it('should accept a FORM element and return an object', function() {
    const serialized = serializeForm(form, { hash: true });
    expect(serialized).toBeInstanceOf(Object);
    expect(serialized.email).toBeTruthy();
    expect(serialized.password).toBeTruthy();
  });

  it('should omit fields by type (password example)', function() {
    const serialized = serializeForm(form, {
      hash: true,
      ignoreTypes: ['password']
    });
    expect(serialized).toBeInstanceOf(Object);
    expect(serialized.email).toBeTruthy();
    expect(serialized.password).toBeFalsy();
  });

});
