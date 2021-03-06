<template>
  <q-page class="page-chat q-pr-">
    <page-header />

      <!-- @click="
        showMenuModal && !showLinkModal ? (showMenuModal = false) : null,
          showLinkModal && showMenuModal ? (showLinkModal = false) : null
      " -->
    <chat-messages
      @user-message="openPicModal"
    />

    <pic-modal
      v-if="picModal"
      :message="userMessage"
      @close-picmodal="picModal = false"
    />

    <camera-modal      
      v-if="store.state.showCameraModal"
      @close-cameraModal="showCameraModal = false"
      @close-menuModal="showMenuModal = false"     
    />

    <link-modal v-if="showLinkModal" @close-LinkModal="showLinkModal = false" />

    <videochat-modal
      v-if="showVideoModal"
      @close-videoModal="showVideoModal = false"
    />

    <map-modal v-if="showMapModal" @close-mapModal="showMapModal = false" />

    <image-modal
      :file="store.state.file"
      v-if="store.state.file"
      @close-imageModal="store.state.file = null"
    />

      <!-- @close-menuModal="closeMenuModal" -->
    <!-- <menu-modal
      v-if="showMenuModal"
      @openCameraModal="showCameraModal = true"
      @openVideoModal="showVideoModal = true"
      @openLinkModal="showLinkModal = true"
      @openMapModal="showMapModal = true"
      @closeMenuModal="showMenuModal = false"
    /> -->

    <page-footer @openMenuModal="showMenuModal = true" />
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

// Import components
import PageHeader from "../components/ChatPage/PageHeader.vue";
import PageFooter from "../components/ChatPage/PageFooter.vue";
import MapModal from "../components/ChatPage/MapModal.vue";
import MenuModal from "../components/ChatPage/MenuModal.vue";
import VideochatModal from "../components/ChatPage/VideoChatModal.vue";
import CameraModal from "../components/ChatPage/CameraModal.vue";
import PicModal from "../components/ChatPage/PicModal.vue";
import LinkModal from "../components/ChatPage/LinkModal.vue";
import ChatMessages from "../components/ChatPage/ChatMessages.vue";
import ImageModal from "../components/ChatPage/ImageModal.vue";

export default {
  components: {
    PageHeader,
    PageFooter,
    ImageModal,
    MapModal,
    MenuModal,
    VideochatModal,
    CameraModal,
    PicModal,
    LinkModal,
    ChatMessages,
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
    const picModal = ref(false);
    const desktop = ref(false);
    const newMessage = ref("");
    const userMessage = ref({});
    const indicator = ref(false);
    const inputFocus = ref(false);
    const showLinkModal = ref(false);
    const showMenuModal = ref(false);
    const showMessages = ref(false);
    const showMapModal = ref(false);
    const showVideoModal = ref(false);
    const showCameraModal = ref(false);
    const notification = ref(false);

    /****************/
    /* Emoji Button */
    /****************/
    const btnEmoji = ref(null);
    const picker = ref(null);

    picker.value = new EmojiButton({
      position: {
        bottom: "64px",
        left: "40%",
      },
    });

    picker.value.on("emoji", (selection) => {
      newMessage.value += selection.emoji;
    });

    const showEmojiPicker = () => {
      picker.value.togglePicker(btnEmoji.value);
    };

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

    const openPicModal = (message) => {
      console.log("user message: ", message);
      userMessage.value = message;
      picModal.value = true;
      console.log("picModal: ", picModal.value);
    };

    const sendMessage = () => {
      if (newMessage.value === "") return;

      store.methods.sendMessage({
        from: "me",
        text: newMessage.value,
        url: false,
        image: false,
        to: route.params.to,
        createdAt: timestamp(),
      });

      newMessage.value = "";

      showMenuModal.value = false;

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
      chats,
      input,
      desktop,
      picModal,
      btnEmoji,
      indicator,
      inputFocus,
      notification,
      showLinkModal,
      userMessage,
      showMenuModal,
      showCameraModal,

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
      openPicModal,
      showEmojiPicker,
      sendTypingIndicator,
      formatDistanceToNow,
    };
  },
};
</script>

<style lang="scss" scoped>
.page-chat {
  position: relative;
}
.icons {
  display: flex;
  align-items: center;
}
.btn-close {
  cursor: pointer;
  margin-left: auto;
}
.menu-modal {
  position: fixed;
  // bottom: 56px;
  bottom: 0;
  z-index: 500;
}
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
</style>
