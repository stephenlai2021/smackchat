<template>
  <div ref="chats" :class="{ invisible: !showMessages }">
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
            <div class="content">
              {{ message.text }}
            </div>
            <span class="time-stamp">{{ message.createdAt }}</span>
          </div>

          <div v-if="message.url">
            <a :href="message.url">{{ message.url }}</a>
          </div>

          <div
            v-if="message.image"
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
              <!-- @click="showPicModal" -->
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
  components: {
    
  },
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
      console.log('message-index: ', index)
      context.emit('user-message', message)
    }

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
.text-box, .img-box {
  margin: 0;
  padding: 0;
  line-height: 0.9;
  box-sizing: border-box;
}
.time-stamp {
  // text-align: center;
  font-size: 12px;
  // border: 1px solid;
  // margin-top: 0;
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
        text-align: center;
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
          text-align: center;
        }
      }
    }
  }
}
</style>
