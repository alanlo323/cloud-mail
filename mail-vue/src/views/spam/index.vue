<template>
  <emailScroll type="spam" ref="scroll"
               :allow-star="false"
               :show-star="false"
               :show-unread="true"
               :getEmailList="getSpamList"
               :emailDelete="emailDelete"
               :emailRead="emailRead"
               :email-restore-spam="emailRestoreSpam"
               :show-restore-spam="true"
               @jump="jumpContent"
               actionLeft="6px"
               :show-account-icon="true"
  />
</template>

<script setup>
import emailScroll from "@/components/email-scroll/index.vue"
import {emailDelete, emailList, emailRead, emailRestoreSpam} from "@/request/email.js";
import {useEmailStore} from "@/store/email.js";
import {useAccountStore} from "@/store/account.js";
import {defineOptions, onMounted, ref, watch} from "vue";
import router from "@/router/index.js";

defineOptions({
  name: 'spam'
})

const scroll = ref({})
const emailStore = useEmailStore();
const accountStore = useAccountStore();

function jumpContent(email) {
  emailStore.contentData.email = email
  emailStore.contentData.delType = 'logic'
  emailStore.contentData.showStar = false
  emailStore.contentData.showReply = true
  emailStore.contentData.showMarkSpam = false
  emailStore.contentData.showRestoreSpam = true
  router.push('/message')
}

function getSpamList(emailId, size) {
  const accountId = accountStore.currentAccountId;
  const allReceive = accountStore.currentAccount.allReceive;
  return emailList(accountId, allReceive, emailId, 0, size, 0, 1).then(data => {
    data.latestEmail.reqAccountId = accountId;
    data.latestEmail.allReceive = allReceive;
    return data;
  })
}

watch(() => accountStore.currentAccountId, () => {
  scroll.value?.refreshList?.();
})

onMounted(() => {
  emailStore.spamScroll = scroll
})
</script>
