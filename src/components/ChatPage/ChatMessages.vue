<template>
  <div class="messages" ref="chats" :class="{ invisible: !showMessages }">
    <div class="chatbox">
      <div
        v-for="(message, index) in store.getters.formattedMessages()"
        :key="index"
        :bg-color="message.from === 'me' ? 'amber-2' : 'light-green-2'"
        class="q-px-md"
        :class="message.from == 'me' ? 'message current-user' : 'message'"
      >
        <div class="message-inner">
          <div v-if="!message.url && !message.image">
            <div class="text-box">
              <div
                v-if="store.state.otherUser"
                class="row justify-center items-center other-avatar q-mr-sm"
              >
                <img
                  class="avatar-image"
                  :src="
                    !store.state.otherUser.avatar
                      ? '/avatar.png'
                      : store.state.otherUser.avatar
                  "
                  alt="user avatar"
                />
              </div>
              <div class="content">
                {{ message.text }}
              </div>
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
            <div v-if="message.url" class="time-stamp">
              {{ message.createdAt }}
            </div>
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
          <div class="full-width text-right" style="margin-bottom: 25px;">
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
.text-box {
  display: flex;
}
.messages {
  padding-top: 15px;
  padding-bottom: 60px;
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
  margin-bottom: 18px;
}
.user-image {
  width: 100%;
}
.chatbox {
  .message {
    display: flex;

    .message-inner {
      // max-width: 50%;
      position: relative;
      // border: 1px solid;

      .avatar-image {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        object-fit: cover;
      }

      .content {
        text-align: center;
        padding: 7px;
        background-color: #e7eaed;
        border-radius: 15px;
        border-bottom-left-radius: 0px;
        border-bottom-right-radius: 10px;
        height: auto;
        color: #0b2f5b;
        font-size: 14px;
        font-weight: 600;
        word-wrap: break-word;
      }
    }

    &.current-user {
      // margin-top: 10px;
      justify-content: flex-end;

      .message-inner {
        max-width: 50%;
        position: relative;
        border: none;

        .other-avatar {
          display: none;
        }

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
