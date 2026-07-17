import { defineStore } from 'pinia'

export const useEmailStore = defineStore('email', {
    state: () => ({
        deleteIds: 0,
        starScroll: null,
        spamScroll: null,
        emailScroll: null,
        cancelStarEmailId: 0,
        addStarEmailId: 0,
        contentData: {
            email: null,
            delType: null,
            showStar: true,
            showReply: true,
            showUnread: false,
            showMarkSpam: false,
            showRestoreSpam: false
        },
        sendScroll: null,
    }),
    persist: {
        pick: ['contentData'],
        afterRestore: (ctx) => {
            if (ctx.store.contentData) {
                ctx.store.contentData.showMarkSpam = false
                ctx.store.contentData.showRestoreSpam = false
            }
        }
    },
})
