import test from 'node:test';
import assert from 'node:assert/strict';
import { validatePassword } from '../routes/auth.js';

test('accepts a strong password', () => {
  assert.equal(validatePassword('StrongPass123!').valid, true);
});

test('rejects weak passwords', () => {
  const result = validatePassword('password');
  assert.equal(result.valid, false);
  assert.match(result.reason, /uppercase|numbers|8 characters/i);
});
