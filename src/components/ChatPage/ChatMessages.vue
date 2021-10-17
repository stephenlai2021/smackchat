<template>
  <div class="chatbox" ref="chats" :class="{ invisible: !showMessages }">
    <section class="chat-box q-mt-md">
      <div
        v-for="(message, index) in store.getters.formattedMessages()"
        :key="index"
        :bg-color="message.from === 'me' ? 'amber-2' : 'light-green-2'"
        class="q-px-md"
        :class="message.from == 'me' ? 'message current-user' : 'message'"
      >
        <div class="message-inner">
          <div v-if="!message.url && !message.image" class="text-box">
            <div class="content text-dark">
              {{ message.text }}
            </div>
            <div class="full-width text-center">
              <span class="time-stamp">{{ message.createdAt }}</span>
            </div>
          </div>

          <div v-if="message.url && !message.image" class="content">
            <a :href="message.text" target="_blank" class="block text-dark">
              {{ message.text }}
            </a>
          </div>
          <div class="full-width text-center">
            <span v-if="message.url" class="time-stamp">{{
              message.createdAt
            }}</span>
          </div>          
        </div>
        <div
            v-if="message.image && !message.url"
            class="img-box"
            :class="{ invisible: !imageLoaded }"
          >
            <img
              ref="imageRef"
              class="user-image"
              :src="message.text"
              alt="user image"
              @load="loadImage"
              @click="getMessage(index, message)"
            />
            <div class="full-width text-center">
              <span class="time-stamp">{{ message.createdAt }}</span>
            </div>
          </div>
      </div>
    </section>
  </div>
</template>

<script>
import { inject, ref, watch } from "vue";

export default {
  components: {},
  setup(props, context) {
    const store = inject("store");

    const chats = ref(null);
    const imageRef = ref(null);
    const picModal = ref(false);
    const imageLoaded = ref(false);
    const showMessages = ref(false);

    const showPicModal = () => {
      picModal.value = true;
    };

    const getMessage = (index, message) => {
      console.log("message-index: ", index);
      context.emit("user-message", message);
    };

    const loadImage = () => {
      imageLoaded.value =
        imageRef.value.complete && imageRef.value.naturalHeight !== 0;
    };

    watch(
      () => store.state.messages,
      () => {
        setTimeout(() => {
          window.scrollTo(0, chats.value.scrollHeight);
          showMessages.value = true;
        }, 1000);
      }
    );

    return {
      chats,
      store,
      imageRef,
      picModal,
      loadImage,
      getMessage,
      imageLoaded,
      showMessages,
      showPicModal,
    };
  },
};
</script>

<style lang="scss" scoped>
// .chatbox {
//   border-top-left-radius: 20px;
//   border-top-right-radius: 20px;
// }
.img-box {
  position: relative;
  margin: 0;
  padding: 0;
  line-height: 0.9;
  box-sizing: border-box;
  width: 30%;
}
@media (orientation: portrait) {
  .img-box {
    width: 50%;
  }
}
.video-box {
  width: 50%;
}
.time-stamp {
  text-align: center;
  font-size: 10px;
}
.user-image {
  width: 100%;
}
.chat-box {
  .message {
    display: flex;
    padding-bottom: 20px;

    .message-inner {
      max-width: 50%;

      .content {
        padding: 10px;
        background-color: #ffe0b2;
        // background-color: #f3f3f3;
        border-radius: 15px;
        border-bottom-left-radius: 0px;
        border-bottom-right-radius: 15px;
        height: auto;
        color: #333;
        word-wrap: break-word;
      }
    }

    &.current-user {
      margin-top: 30px;
      justify-content: flex-end;

      .message-inner {
        max-width: 50%;

        .content {
          color: #fff;
          word-wrap: break-word;
          background-color: #c8e6c9;
          border-bottom-left-radius: 15px;
          border-bottom-right-radius: 0px;
        }
      }
    }
  }
}
</style>
