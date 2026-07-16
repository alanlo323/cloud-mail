import i18next from 'i18next';
import zh from './zh.js';
import zhTW from './zh-TW.js';
import en from './en.js';
import app from '../hono/hono';

function resolveLang(header) {
	if (!header) return undefined;
	const value = header.split(',')[0].trim();
	if (/^zh-(Hant|TW|HK|MO)/i.test(value)) return 'zh-TW';
	if (/^zh/i.test(value)) return 'zh';
	if (/^en/i.test(value)) return 'en';
	return undefined;
}

app.use('*', async (c, next) => {
	const lang = resolveLang(c.req.header('accept-language'));
	i18next.init({
		lng: lang,
	});
	return await next();
});

const resources = {
	en: {
		translation: en,
	},
	zh: {
		translation: zh,
	},
	'zh-TW': {
		translation: zhTW,
	},
};

i18next.init({
	fallbackLng: 'zh',
	resources,
});

export const t = (key, values) => i18next.t(key, values);

export default i18next;
