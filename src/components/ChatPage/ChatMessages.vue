<template>
  <div class="chatbox" ref="chats" :class="{ invisible: !showMessages }">
    <div class="chat-box">
      <div
        v-for="(message, index) in store.getters.formattedMessages()"
        :key="index"
        :bg-color="message.from === 'me' ? 'amber-2' : 'light-green-2'"
        class="q-px-md"
        :class="message.from == 'me' ? 'message current-user' : 'message'"
      >
        <!-- <span>123</span> -->
        <div class="message-inner">
          <div v-if="!message.url && !message.image" class="text-box">
            <div class="content">
              {{ message.text }}
            </div>
            <div class="full-width text-right">
              <div class="time-stamp">{{ message.createdAt }}</div>
            </div>
          </div>

          <div v-if="message.url && !message.image" class="content">
            <a :href="message.text" target="_blank" class="block text-dark">
              {{ message.text }}
            </a>
          </div>
          <div class="full-width text-right">
            <div v-if="message.url" class="time-stamp">{{ message.createdAt }}</div>
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
    </div>
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
p {
  margin-bottom: 0;
  font-size: 10px;
}
.chatbox {
  padding-top: 80px;
  // border: 1px solid;
}
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
  font-size: 10px;
  // font-weight: 500;
  color: #c9d5e2;
  margin-top: 5px;
  margin-bottom: 13px;
}
.user-image {
  width: 100%;
}
.chat-box {
  .message {
    display: flex;
    // padding-bottom: 20px;

    .message-inner {
      max-width: 50%;
      position: relative;

      .content {
        text-align: center;
        padding: 7px;
        background-color: #E7EAED;
        border-radius: 15px;
        border-bottom-left-radius: 0px;
        border-bottom-right-radius: 10px;
        height: auto;
        color: #0B2F5B;
        font-size: 14px;
        font-weight: 600;
        word-wrap: break-word;
      }
    }

    &.current-user {
      margin-top: 10px;
      justify-content: flex-end;

      .message-inner {
        max-width: 50%;
        position: relative;

        .content {
          text-align: center;
          color: #fff;
          word-wrap: break-word;
          font-size: 14px;
          font-weight: 600;
          background-color: #ed4f5c;
          border-radius: 10px;
          // border-bottom-left-radius: 10px;
          border-bottom-right-radius: 0px;
        }
      }
    }
  }
}
</style>
