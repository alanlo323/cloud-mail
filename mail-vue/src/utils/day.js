import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import 'dayjs/locale/zh-tw'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import {useSettingStore} from "@/store/setting.js";
const settingStore = useSettingStore();
dayjs.extend(utc)
dayjs.extend(timezone)

function toDayjsLocale(lang) {
    if (lang === 'en') return 'en'
    if (lang === 'zh-TW') return 'zh-tw'
    return 'zh-cn'
}

dayjs.locale(toDayjsLocale(settingStore.lang))
const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export function fromNow(date) {
    const d = dayjs.utc(date).tz(timeZone);
    const now = dayjs();
    const diffSeconds = now.diff(d, 'second');
    const diffMinutes = now.diff(d, 'minute');
    const diffHours = now.diff(d, 'hour');
    const isToday = now.isSame(d, 'day');
    if (settingStore.lang === 'en') {

        if (isToday) {
            if (diffSeconds < 60) return `Just now`;
            if (diffMinutes < 60) return `${diffMinutes} min ago`;
            if (diffHours < 2) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
            return d.format('hh:mm A');
        }

        if (now.subtract(1, 'day').isSame(d, 'day')) {
            return d.format('MMM D');
        }

        return d.year() === now.year()
            ? d.format('MMM D')
            : d.format('YYYY/MM/DD');


    } else if (settingStore.lang === 'zh-TW') {

        if (isToday) {
            if (diffSeconds < 60) return `剛剛`;
            if (diffMinutes < 60) return `${diffMinutes}分鐘前`;
            if (diffHours >= 1 && diffHours < 2) return '1小時前';
            return d.format('HH:mm');
        }
        else if (now.subtract(1, 'day').isSame(d, 'day')) {
            return `昨天 ${d.format('HH:mm')}`;
        }
        else if (now.subtract(2, 'day').isSame(d, 'day')) {
            return `前天 ${d.format('HH:mm')}`;
        }
        return d.year() === now.year()
            ? d.format('M月D日')
            : d.format('YYYY/M/D');

    } else {

        if (isToday) {
            if (diffSeconds < 60) return `几秒前`;
            if (diffMinutes < 60) return `${diffMinutes}分钟前`;
            if (diffHours >= 1 && diffHours < 2) return '1小时前';
            return d.format('HH:mm');
        }
        else if (now.subtract(1, 'day').isSame(d, 'day')) {
            return `昨天 ${d.format('HH:mm')}`;
        }
        else if (now.subtract(2, 'day').isSame(d, 'day')) {
            return `前天 ${d.format('HH:mm')}`;
        }
        return d.year() === now.year()
            ? d.format('M月D日')
            : d.format('YYYY/M/D');

    }

}

export function updateNow(date) {
    if (isToday) {
        if (diffSeconds < 60) return `Just now`;
        if (diffMinutes < 60) return `${diffMinutes} min ago`;
        if (diffHours < 2) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        return d.format('hh:mm A');
    }
}

export function formatDetailDate(time) {
    const d = dayjs.utc(time).tz(timeZone);
    const now = dayjs();

    const isSameYear = now.year() === d.year();

    if (settingStore.lang === 'en') {
        return isSameYear
            ? d.format('ddd, MMM D, h:mm A')
            : d.format('ddd, MMM D, YYYY, h:mm A');
    } else {
        return d.format('YYYY年M月D日 ddd AH:mm');
    }
}

export function tzDayjs(time) {
    return dayjs.utc(time).tz(timeZone)
}

export function toUtc(time) {
    return dayjs(time).utc()
}

export function setExtend(lang) {
    dayjs.locale(lang)
}
