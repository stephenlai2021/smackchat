<template>
  <q-page class="page-chat">
    <page-header
      @open-mapModal="showMapModal = true"
      @open-videoModal="showVideoModal = true"
      @notification="sendVideochatNotification"
    />

    <chat-messages />

    <!-- <sending-notification v-if="sendingNotification" @close-notification="sendingNotification = false, showVideoModal = true" />
    <receiving-notification v-if="receivingNotification" @close-notification="receivingNotification = false, showVideoModal = true" /> -->

    <sending-notification
      v-if="sendingNotification"
      @close-notification="
        (sendingNotification = false), (showVideoModal = true)
      "
    />
    <receiving-notification
      v-if="receivingNotification"
      @close-notification="closeReceivingNotification"
    />
    <!-- @close-notification="receivingNotification = false, showVideoModal = true" -->

    <video-modal
      v-if="showVideoModal"
      @close-videoModal="showVideoModal = false"
      @open-videoModal="showVideoModal = true"
    />

    <image-modal :file="file" v-if="file" @close-imageModal="file = null" />

    <map-modal v-if="showMapModal" @close-mapModal="showMapModal = false" />

    <camera-modal
      v-if="showCameraModal"
      @open-cameraModal="showCameraModal = true"
      @close-cameraModal="showCameraModal = false"
    />

    <!-- <q-footer class="bg-transparent footer" style="backdrop-filter: blur(20px)"> -->
    <q-footer style="z-index: 300" reveal class="q-py-xs">
      <q-form class="flex constraint" :class="{ 'q-mx-sm': inputFocus }">
        <div
          v-if="!inputFocus"
          flat
          round
          class="flex row justify-evenly"
          style="width: 50%; display: flex; align-items: center"
        >
          <label class="q-mr-sm" style="cursor: pointer">
            <input class="file-input" type="file" @change="handleChange" />
            <q-icon class="text-" size="sm" name="eva-image-outline" />
          </label>
          <q-icon
            round
            size="sm"
            class="text-"
            style="cursor: pointer"
            name="eva-camera-outline"
            @click="showCameraModal = true"
          />
          <q-btn
            round
            size=""
            flat
            ref="btnEmoji"
            class="text-"
            icon="eva-smiling-face-outline"
            @click="showEmojiPicker"
          />
        </div>

        <div
          :class="inputFocus ? 'q-pl-md' : ''"
          class="q-pr-md"
          style="width: 50%; display: flex; align-items: center"
          :style="{ width: inputFocus ? '100%' : '50%' }"
        >
          <q-input
            ref="input"
            v-model="newMessage"
            class="q-mr-md full-width"
            outlined
            rounded
            color="white"
            :label="t('message')"
            dense
            focus="false"
            @keydown.enter="sendMessage"
            @keyup="sendTypingIndicator"
            @focus="onFocus"
            @blur="onBlur"
            :style="{ width: inputFocus ? '100%' : '50%' }"
          >
            <template v-slot:prepend v-if="inputFocus">
              <q-btn
                icon="navigate_next"
                size="md"
                dense
                flat
                color="primary"
                @click="inputFocus = false"
              />
            </template>
            <template v-slot:append>
              <q-btn
                icon="eva-navigation-2-outline"
                :color="inputFocus ? 'primary' : 'grey-6'"
                size="md"
                dense
                flat
                @click="sendMessage"
              />
            </template>
          </q-input>
        </div>
      </q-form>
    </q-footer>
  </q-page>
</template>

<script>
import { useI18n } from "vue-i18n";
import { useQuasar } from "quasar";
import { timestamp } from "src/boot/firebase";
import { formatDistanceToNow } from "date-fns";
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted, inject, watch, watchEffect } from "vue";
import { EmojiButton } from "@joeattardi/emoji-button";

export default {
  components: {
    "page-header": require("components/ChatPage/PageHeader.vue").default,
    "map-modal": require("components/ChatPage/MapModal.vue").default,
    "video-modal": require("components/ChatPage/VideoChatModal.vue").default,
    "image-modal": require("components/ChatPage/ImageModal.vue").default,
    "camera-modal": require("components/ChatPage/CameraModal.vue").default,
    "chat-messages": require("components/ChatPage/ChatMessages.vue").default,
    "sending-notification":
      require("src/components/ChatPage/SendingNotification.vue").default,
    "receiving-notification":
      require("src/components/ChatPage/ReceivingNotification.vue").default,
  },
  setup() {
    const $q = useQuasar();

    const store = inject("store");

    const { t, locale } = useI18n();

    const route = useRoute();
    const router = useRouter();

    const to = ref({});
    const chats = ref(null);
    const input = ref(null);
    const desktop = ref(false);
    const newMessage = ref("");
    const indicator = ref(false);
    const inputFocus = ref(false);
    const showMessages = ref(false);
    const showMapModal = ref(false);
    const showVideoModal = ref(false);
    const showCameraModal = ref(false);
    const notification = ref(false);
    const sendingNotification = ref(false);
    const receivingNotification = ref(false);

    /***************/
    /* Image Button */
    /***************/
    const file = ref(null);
    const fileError = ref(null);

    const types = ["image/png", "image/jpeg", "image/jpg"];

    const handleChange = (e) => {
      let selected = e.target.files[0];
      console.log("You have selected: ", selected);

      if (selected && types.includes(selected.type)) {
        file.value = selected;
        fileError.value = null;

        store.methods.useStorage2(file.value, "smackchat");

        store.state.progress = null;
      } else {
        file.value = null;
        fileError.value = "Please select an image file (png or jpeg/jpg)";

        $q.notify({
          message: fileError.value,
          color: "purple",
          position: "bottom",
          timeout: 2000,
        });
      }
    };

    /***************/
    /* Emoji Modal */
    /***************/
    const btnEmoji = ref(null);
    const picker = ref(null);

    picker.value = new EmojiButton();

    picker.value.on("emoji", (selection) => {
      newMessage.value += selection.emoji;
    });

    const showEmojiPicker = () => {
      picker.value.togglePicker(btnEmoji.value);
    };

    /**************************/
    /* Videochat Notification */
    /**************************/
    const closeReceivingNotification = () => {
      receivingNotification.value = false;
      showVideoModal.value = true;
    };

    const sendVideochatNotification = () => {
      store.methods.sendVideochatNotification({
        from: "me",
        to: route.params.to,
      });

      sendingNotification.value = true;

      store.methods.getVideochatNotification(
        route.params.from,
        route.params.to
      );

    };

    // watch(
    //   () => notification.value,
    //   () => {
    //     store.methods.getVideochatNotification(
    //       route.params.from,
    //       route.params.to
    //     );
    //   }
    // );

    // watch(() => receivingNotification.value, () => {
    //   if (!receivingNotification.value) {

    //   }
    // })

    watch(
      () => [store.state.videochat],
      (newVal, oldVal) => {
        console.log("videochat | watch: ", newVal);
        if (store.state.videochat) {
          receivingNotification.value = true;
        } 
      }
    );

    /********************/
    /* Typing Indicator */
    /********************/
    const sendTypingIndicator = () => {
      indicator.value = true;

      store.methods.sendTypingIndicator({
        from: "me",
        to: route.params.to,
      });
    };

    watch(
      () => indicator.value,
      (newVal, oldVal) => {
        store.methods.getTypingIndicator(route.params.from, route.params.to);
      }
    );

    watch(
      () => [store.state.typing.typing, store.state.messages],
      (newVal, oldVal) => {
        if (store.state.typing.typing) {
          $q.notify({
            message: (store.state.messages[0].from = "me"
              ? store.state.otherUser.name + "Typing..."
              : store.state.userDetails.name + "Typing..."),
            color: "purple",
            position: "top",
            timeout: 1000,
          });
        }
      }
    );

    const sendMessage = () => {
      if (newMessage.value === "") return;

      store.methods.sendMessage({
        text: newMessage.value,
        from: "me",
        to: route.params.to,
        createdAt: timestamp(),
      });

      newMessage.value = "";

      inputFocus.value = false;
    };

    const onFocus = () => {
      if (!store.state.desktop) {
        inputFocus.value = true;
      }
    };

    const onBlur = () => {
      if (!store.state.desktop) {
        inputFocus.value = false;
      }
    };

    onMounted(() => {
      store.methods.getMessages(route.params.from, route.params.to);
      store.methods.getOnlineStatus(route.params.to);
      store.methods.getToday();

      if ($q.platform.is.desktop) {
        console.log("you are running on desktop | chat page");
        store.state.desktop = true;
      } else {
        console.log("you are not running on desktop | chat page");
        store.state.desktop = false;
      }

      store.methods.getOtherUser(route.params.to);

      if (store.state.otherUser) {
        console.log("Other User | Chat Page", store.state.otherUser);
      }
    });

    return {
      t,
      locale,

      store,
      route,
      router,

      to,
      file,
      chats,
      input,
      desktop,
      notification,
      btnEmoji,
      indicator,
      fileError,
      inputFocus,
      showCameraModal,
      sendingNotification,
      receivingNotification,

      /* map */
      showMapModal,
      showVideoModal,
      showCameraModal,

      // methods
      onBlur,
      onFocus,
      newMessage,
      sendMessage,
      showMessages,
      handleChange,
      showEmojiPicker,
      sendTypingIndicator,
      formatDistanceToNow,
      sendVideochatNotification,
      closeReceivingNotification,
    };
  },
};
</script>

<style lang="scss" scoped>
.btn-mapBack {
  position: fixed;
  left: 50%;
  transform: translate(-50%);
  top: 10px;
  z-index: 500;
}
#map {
  position: fixed;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 500;
}
.camera-panel {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.camera-frame {
  border: 2px solid grey;
  border-radius: 10px;
}
.footer {
  z-index: 300;
}
.camera-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 500;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
}
.progress-bar {
  display: block;
  height: 6px;
  background: #5ad8d2;
  border-radius: 6px;
  transition: width 0.3s ease;
}
.file-input {
  height: 0;
  width: 0;
  opacity: 0;
}
.q-toolbar {
  padding-right: 0;
}
.banner {
  position: fixed;
  width: 100%;
  opacity: 80%;
  z-index: 500;
  text-align: center;
  padding-left: -300px;
}
// .page-chat {
//   overflow: hidden;
//   &:after {
//     content: "";
//     display: block;
//     position: fixed;
//     left: 0;
//     right: 0;
//     top: 0;
//     bottom: 0;
//     z-index: 0;
//     opacity: 0.1;
//     background-image: radial-gradient(
//         circle at 100% 150%,
//         silver 24%,
//         white 24%,
//         white 28%,
//         silver 28%,
//         silver 36%,
//         white 36%,
//         white 40%,
//         transparent 40%,
//         transparent
//       ),
//       radial-gradient(
//         circle at 0 150%,
//         silver 24%,
//         white 24%,
//         white 28%,
//         silver 28%,
//         silver 36%,
//         white 36%,
//         white 40%,
//         transparent 40%,
//         transparent
//       ),
//       radial-gradient(
//         circle at 50% 100%,
//         white 10%,
//         silver 10%,
//         silver 23%,
//         white 23%,
//         white 30%,
//         silver 30%,
//         silver 43%,
//         white 43%,
//         white 50%,
//         silver 50%,
//         silver 63%,
//         white 63%,
//         white 71%,
//         transparent 71%,
//         transparent
//       ),
//       radial-gradient(
//         circle at 100% 50%,
//         white 5%,
//         silver 5%,
//         silver 15%,
//         white 15%,
//         white 20%,
//         silver 20%,
//         silver 29%,
//         white 29%,
//         white 34%,
//         silver 34%,
//         silver 44%,
//         white 44%,
//         white 49%,
//         transparent 49%,
//         transparent
//       ),
//       radial-gradient(
//         circle at 0 50%,
//         white 5%,
//         silver 5%,
//         silver 15%,
//         white 15%,
//         white 20%,
//         silver 20%,
//         silver 29%,
//         white 29%,
//         white 34%,
//         silver 34%,
//         silver 44%,
//         white 44%,
//         white 49%,
//         transparent 49%,
//         transparent
//       );
//     background-size: 100px 50px;
//   }
// }
</style>
