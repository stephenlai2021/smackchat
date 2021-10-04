<template>
  <div
    ref="chats"
    :class="{ invisible: !showMessages }"
    class="q-mx-md q-mt-sm column col justify-end messages"
  >
      <!-- :avatar="
        message.from === 'me'
          ? store.state.userDetails.avatar
          : store.state.otherUser.avatar
      " -->
    <q-chat-message
      v-for="(message, index) in store.getters.formattedMessages()"
      :key="index"
      :text="[message.text]"
      :sent="message.from === 'me'"
      :stamp="message.createdAt"
      :bg-color="message.from === 'me' ? 'amber-2' : 'light-green-2'"
      class="q-mb-md"
    />
  </div>
</template>

<script>
import { inject, ref, watch } from "vue";

export default {
  setup() {
    const store = inject("store");

    const chats = ref(null);
    const showMessages = ref(false);

    watch(
      () => store.state.messages,
      () => {
        setTimeout(() => {
          window.scrollTo(0, chats.value.scrollHeight);
          showMessages.value = true;
        }, 300);
      }
    );

    return {
      chats,
      store,
      showMessages,
    };
  },
};
</script>

<style lang="scss" scoped></style>
