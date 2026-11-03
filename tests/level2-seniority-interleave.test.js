'use strict';

// Isolated, in-memory regression test for the requested Level 2-only ordering.
// No production database, payment, wallet, or member records are modified.
const assert = require('assert');
const { createSessionContext } = require('../src/b5-engine');

const members = [];
for (let i = 1; i <= 15; i += 1) {
  members.push({
    memberId: `B5-${String(i).padStart(3, '0')}`,
    b5Id: i,
    name: `Initial Company ${i}`,
    status: 'ACTIVE',
    level: 7,
    initialSeniority: { 2: i, 3: i, 4: i, 5: i, 6: i, 7: i },
    levelReachedAt: {}
  });
}
for (let i = 1; i <= 3; i += 1) {
  const at = `2026-11-0${i}T00:00:00.000Z`;
  members.push({
    memberId: `TEST-UPGRADE-${i}`,
    name: `Test Upgraded User ${i}`,
    status: 'Verified',
    level: 2,
    joinedAt: at,
    levelReachedAt: { 2: at }
  });
}

const state = {
  members,
  leveltrackPayments: [],
  leveltrackUpgrades: [],
  leveltrackRequests: [],
  messages: [],
  leveltrackMessages: [],
  paymentSettings: {},
  adminPassword: 'TEST-ONLY'
};
const ctx = createSessionContext(state, {});

const level2 = ctx.seniorityQueue(2).map(row => row.memberId);
assert.deepStrictEqual(level2.slice(0, 7), [
  'B5-001', 'TEST-UPGRADE-1',
  'B5-002', 'TEST-UPGRADE-2',
  'B5-003', 'TEST-UPGRADE-3',
  'B5-004'
]);
assert.strictEqual(level2.length, 18, 'All initial and qualifying Level 2 users must remain present');

for (const level of [3, 4, 5, 6, 7]) {
  const queue = ctx.seniorityQueue(level).map(row => row.memberId);
  assert.strictEqual(queue.length, 15, `Level ${level} must remain unchanged`);
  assert.deepStrictEqual(queue, Array.from({ length: 15 }, (_, i) => `B5-${String(i + 1).padStart(3, '0')}`));
}

console.log('PASS: Level 2 inserts one qualifying upgraded user after each initial member.');
console.log('PASS: Levels 3–7 retain the original 15-member order.');
console.log('PASS: Test uses in-memory records only; no production data is touched.');
