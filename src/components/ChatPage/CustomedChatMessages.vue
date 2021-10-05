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
    <section class="chat-box q-mt-md">
      <div
        v-for="(message, index) in store.getters.formattedMessages()"
        :key="index"
        :bg-color="message.from === 'me' ? 'amber-2' : 'light-green-2'"
        class="q-px-md"
        :class="message.from == 'me' ? 'message current-user' : 'message'"
      >
        <div class="message-inner">
          <div v-if="!message.image" class="text-box">
            <div  class="content">
              {{ message.text }}
            </div>
            <p v-if="imageLoaded" class="time-stamp">{{ message.createdAt }}</p>
          </div>

          <div v-if="message.image" class="img-box">
            <img
              ref="imageRef"
              class="user-image"              
              :src="message.text"
              alt="user image"
              @click="showPicModal"
              @load="loadImage"
            />
            <p v-if="imageLoaded" class="time-stamp">{{ message.createdAt }}</p>
          </div>
        </div>
        <pic-modal
          v-if="picModal"
          :url="message.text"
          @close-picmodal="picModal = false"
        />
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
    const imageRef = ref(null)
    const picModal = ref(false);
    const imageLoaded = ref(false)
    const showMessages = ref(false);

    const showPicModal = () => {
      picModal.value = true;
    };

    const loadImage = () => {
      imageLoaded.value = imageRef.value.complete && imageRef.value.naturalHeight !== 0
      console.log('image fully loaded !')


    }

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
      imageRef,
      picModal,
      imageLoaded,

      loadImage,
      showMessages,
      showPicModal,
    };
  },
};
</script>

<style lang="scss" scoped>
.time-stamp {
  text-align: center;
  font-size: 12px;
}
.user-image {
  width: 100%;
}
.chat-box {
  .message {
    display: flex;
    margin-bottom: 15px;

    .message-inner {
      max-width: 50%;
      .content {
        padding: 10px 20px;
        background-color: #f3f3f3;
        border-radius: 10px;

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
        max-width: 50%;
        .content {
          color: #fff;
          word-wrap: break-word;
          background-color: #ea526f;
          text-align: right;
        }
      }
    }
  }
}
</style>
