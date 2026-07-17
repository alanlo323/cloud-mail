import { emailConst } from '../const/entity-const';

/**
 * Normalize sender address for personal spam rules (trim + lowercase).
 * @param {string|null|undefined} addr
 * @returns {string|null}
 */
export function normalizeSendEmail(addr) {
	if (addr == null) {
		return null;
	}
	const normalized = String(addr).trim().toLowerCase();
	return normalized || null;
}

/**
 * Resolve list/latest spam filter flag from query params.
 * @param {{ isSpam?: string|number }} params
 * @returns {number}
 */
export function spamFlagFromParams(params) {
	const raw = params?.isSpam;
	return Number(raw) === emailConst.spam.SPAM ? emailConst.spam.SPAM : emailConst.spam.NORMAL;
}

/**
 * Whether mark-spam should also create a personal sender rule.
 * Default true when omitted (matches UI checkbox default).
 * @param {boolean|undefined|null} blockSender
 * @returns {boolean}
 */
export function shouldBlockSender(blockSender) {
	return blockSender !== false;
}

/**
 * Deduplicate and coerce client emailIds to valid numbers.
 * @param {unknown} emailIds
 * @returns {number[]}
 */
export function normalizeEmailIds(emailIds) {
	if (!Array.isArray(emailIds)) {
		return [];
	}
	return [...new Set(emailIds.map(Number).filter(n => !isNaN(n)))];
}

/**
 * Senders whose rules may be cleared on restore — only rows that were spam.
 * @param {Array<{ isSpam?: number, sendEmail?: string|null }>} rows
 * @returns {string[]}
 */
export function priorSpamSendersFromRows(rows) {
	return (rows || [])
		.filter(row => row.isSpam === emailConst.spam.SPAM)
		.map(row => row.sendEmail);
}
