import { describe, it, expect } from 'vitest';
import {
	normalizeSendEmail,
	spamFlagFromParams,
	shouldBlockSender,
	normalizeEmailIds,
	priorSpamSendersFromRows
} from '../../src/utils/spam-utils.js';

describe('normalizeSendEmail', () => {
	it('trims and lowercases', () => {
		expect(normalizeSendEmail('  Foo@Example.COM ')).toBe('foo@example.com');
	});

	it('returns null for empty or nullish', () => {
		expect(normalizeSendEmail(null)).toBeNull();
		expect(normalizeSendEmail(undefined)).toBeNull();
		expect(normalizeSendEmail('')).toBeNull();
		expect(normalizeSendEmail('   ')).toBeNull();
	});
});

describe('spamFlagFromParams', () => {
	it('returns SPAM only when isSpam is 1', () => {
		expect(spamFlagFromParams({ isSpam: 1 })).toBe(1);
		expect(spamFlagFromParams({ isSpam: '1' })).toBe(1);
		expect(spamFlagFromParams({ isSpam: 0 })).toBe(0);
		expect(spamFlagFromParams({})).toBe(0);
		expect(spamFlagFromParams({ isSpam: 'true' })).toBe(0);
	});
});

describe('shouldBlockSender', () => {
	it('defaults to true when omitted', () => {
		expect(shouldBlockSender(undefined)).toBe(true);
		expect(shouldBlockSender(null)).toBe(true);
	});

	it('respects explicit false', () => {
		expect(shouldBlockSender(false)).toBe(false);
		expect(shouldBlockSender(true)).toBe(true);
	});
});

describe('normalizeEmailIds', () => {
	it('returns empty for non-array or empty input', () => {
		expect(normalizeEmailIds(null)).toEqual([]);
		expect(normalizeEmailIds(undefined)).toEqual([]);
		expect(normalizeEmailIds('1,2')).toEqual([]);
		expect(normalizeEmailIds([])).toEqual([]);
	});

	it('coerces, drops NaN, and deduplicates', () => {
		expect(normalizeEmailIds([1, '2', 2, 'x', NaN, 3])).toEqual([1, 2, 3]);
	});
});

describe('priorSpamSendersFromRows', () => {
	it('only includes senders from rows that were spam', () => {
		expect(priorSpamSendersFromRows([
			{ isSpam: 1, sendEmail: 'a@x.com' },
			{ isSpam: 0, sendEmail: 'b@x.com' },
			{ isSpam: 1, sendEmail: 'c@x.com' }
		])).toEqual(['a@x.com', 'c@x.com']);
	});

	it('does not clear rules when restoring non-spam rows', () => {
		expect(priorSpamSendersFromRows([
			{ isSpam: 0, sendEmail: 'blocked@x.com' }
		])).toEqual([]);
	});

	it('handles empty input', () => {
		expect(priorSpamSendersFromRows([])).toEqual([]);
		expect(priorSpamSendersFromRows(null)).toEqual([]);
	});
});
