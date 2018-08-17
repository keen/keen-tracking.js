import KeenT, { cookie } from './browser-light';

KeenT.debug = true;

const client = new KeenT(KeenT.defaultConfig);

const x = Math.random();
console.log(x);
const eventBody = {
  x: 123456,
  page: {
    a: 1,
    b: {
      c:1
    }
  }
};

client.recordEvent({
  collection: 'abc',
  event: {
    z: 1
  },
  callback: (err, res) => console.log(err,res)
});

console.log(client);
