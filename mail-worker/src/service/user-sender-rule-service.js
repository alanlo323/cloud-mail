import orm from '../entity/orm';
import { userSenderRule } from '../entity/user-sender-rule';
import { and, eq, inArray } from 'drizzle-orm';
import { normalizeSendEmail } from '../utils/spam-utils';

const userSenderRuleService = {

	normalizeSendEmail,

	async match(c, userId, fromAddress) {
		const sendEmail = normalizeSendEmail(fromAddress);
		if (!sendEmail || !userId) {
			return false;
		}
		const row = await orm(c).select().from(userSenderRule).where(
			and(
				eq(userSenderRule.userId, userId),
				eq(userSenderRule.sendEmail, sendEmail)
			)
		).get();
		return !!row;
	},

	async upsert(c, userId, senders) {
		const unique = [...new Set(
			(senders || [])
				.map(s => normalizeSendEmail(s))
				.filter(Boolean)
		)];
		for (const sendEmail of unique) {
			const exist = await orm(c).select().from(userSenderRule).where(
				and(
					eq(userSenderRule.userId, userId),
					eq(userSenderRule.sendEmail, sendEmail)
				)
			).get();
			if (exist) {
				continue;
			}
			try {
				await orm(c).insert(userSenderRule).values({ userId, sendEmail }).run();
			} catch (e) {
				console.warn(`user_sender_rule upsert skip: ${e.message}`);
			}
		}
	},

	async removeByUserAndSenders(c, userId, senders) {
		const unique = [...new Set(
			(senders || [])
				.map(s => normalizeSendEmail(s))
				.filter(Boolean)
		)];
		if (!unique.length) {
			return;
		}
		await orm(c).delete(userSenderRule).where(
			and(
				eq(userSenderRule.userId, userId),
				inArray(userSenderRule.sendEmail, unique)
			)
		).run();
	},

	async removeByUserIds(c, userIds) {
		if (!userIds?.length) {
			return;
		}
		await orm(c).delete(userSenderRule).where(inArray(userSenderRule.userId, userIds)).run();
	}
};

export default userSenderRuleService;
