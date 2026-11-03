# Level 2-only Seniority Interleave

- Changed only the seniority queue ordering for Level 2 in `src/b5-engine.js` and the matching root `b5-engine.js` runtime copy.
- The original 15 initial members retain their approved relative order.
- Each qualifying non-initial Level 2 member is inserted after the next initial member, one at a time: initial 1, upgraded user 1, initial 2, upgraded user 2, and so on.
- If there are more qualifying upgraded users than initial members, remaining users are appended in their existing order. No eligible member is dropped or duplicated.
- Levels 1 and 3–7 keep the existing ordering logic. Payment, receiver approval, admin approval, wallet, commission, rotation, login, database schema, and UI code were not intentionally changed.
- Added `tests/level2-seniority-interleave.test.js`, an isolated in-memory regression test. It does not create or modify production accounts.

## Verification

Run:

```bash
node tests/level2-seniority-interleave.test.js
node --check src/b5-engine.js
node --check b5-engine.js
```

The supplied ZIP does not contain `src/d1-node-binding.js` and its configured `npm test` script points to a missing `tests/phase4-qa-suite.js`; therefore the full project test suite could not be run from this archive as supplied. No production database operation or deployment was performed.
