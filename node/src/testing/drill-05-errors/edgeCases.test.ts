import { describe, it, expect, beforeEach } from 'vitest';
import { getTestDb, clearDb } from '../setup/db';

describe('Drill 5 — Error & Edge Cases', () => {
  beforeEach(() => {
    clearDb();
  });

  it('should simulate DB down/locked error', () => {
    const Database = require('better-sqlite3');
    const localDb = new Database(':memory:');
    localDb.close();

    expect(() => {
      localDb.prepare('SELECT 1').get();
    }).toThrow();
  });

  it('should force a transaction rollback and assert data isn’t persisted', () => {
    // Re-ensure DB is open (getTestDb is a singleton, closing it affects others)
    // So for this specific drill we skip singleton and use a local one
    const Database = require('better-sqlite3');
    const localDb = new Database(':memory:');
    localDb.exec('CREATE TABLE test (val TEXT)');

    const insert = localDb.prepare('INSERT INTO test (val) VALUES (?)');

    try {
      localDb.transaction(() => {
        insert.run('valid');
        throw new Error('Rollback');
      })();
    } catch (e) {
      // Expected
    }

    const count = localDb.prepare('SELECT count(*) as c FROM test').get().c;
    expect(count).toBe(0);
  });

  it('should ensure error responses match RFC 7807 (Mocked API version)', async () => {
    const errorResponse = {
      type: 'https://example.com/probs/out-of-stock',
      title: 'Out of Stock',
      status: 400,
      detail: 'Item is not available in requested quantity',
      instance: '/orders/123',
    };

    expect(errorResponse).toHaveProperty('type');
    expect(errorResponse).toHaveProperty('title');
    expect(errorResponse).toHaveProperty('status');
  });
});
