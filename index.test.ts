import test from 'ava';
// eslint-disable-next-line import/extensions
import Vanillish from './index';

test('main exports a function', t => {
  t.deepEqual(typeof Vanillish, 'function');
});
