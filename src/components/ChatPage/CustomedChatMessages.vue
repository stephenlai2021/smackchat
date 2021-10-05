<template>
  <!-- class="q-mx-md q-mt-sm column col justify-end messages" -->
  <div ref="chats" :class="{ invisible: !showMessages }">
    <!-- <q-chat-message
      v-for="(message, index) in store.getters.formattedMessages()"
      :key="index"
      :text="[message.text]"
      :sent="message.from === 'me'"
      :stamp="message.createdAt"
      :bg-color="message.from === 'me' ? 'amber-2' : 'light-green-2'"
      class="q-mb-md"
    /> -->
    <section class="chat-box">
      <div
        v-for="(message, index) in store.getters.formattedMessages()"
        :key="index"
        :text="[message.text]"
        :sent="message.from === 'me'"
        :stamp="message.createdAt"
        :bg-color="message.from === 'me' ? 'amber-2' : 'light-green-2'"
        class="q-mx-md"
        :class="message.from == 'me' ? 'message current-user' : 'message'"
      >
        <div class="message-inner">
          <!-- <div class="username">{{ message }}</div> -->
          <div v-if="!message.image" class="content">
            {{ message.text }}
          </div>
          <img
            class="user-image"
            v-if="message.image"
            :src="message.text"
            alt="user image"
            @click="showPicModal"
          />
        </div>
        <pic-modal v-if="picModal" :url="message.text" @close-picmodal="picModal = false" />
      </div>
    </section>
  </div>
</template>

<script>
import { inject, ref, watch } from "vue";

export default {
  components: {
    "pic-modal": require("components/ChatPage/PicModal.vue").default,
  },
  setup() {
    const store = inject("store");

    const chats = ref(null);
    const showMessages = ref(false);
    const picModal = ref(false);

    const showPicModal = () => {
      picModal.value = true;
    };

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
      picModal,
      showMessages,
      showPicModal,
    };
  },
};
</script>

<style lang="scss" scoped>
.user-image {
  max-width: 80%;
}
.chat-box {
  .message {
    display: flex;
    margin-bottom: 15px;

    .message-inner {
      max-width: 80%;
      .content {
        padding: 10px 20px;
        background-color: #f3f3f3;
        border-radius: 20px;

        color: #333;
        word-wrap: break-word;
        text-align: left;
      }
    }

    &.current-user {
      margin-top: 30px;
      justify-content: flex-end;
      text-align: right;

      .message-inner {
        max-width: 80%;
        .content {
          color: #fff;
          word-wrap: break-word;
          background-color: #ea526f;
        }
      }
    }
  }
}
</style>
