<template>
  <q-page class="page-chat">
    <page-header />

    <chat-messages
      @click="
        showMenuModal && !showLinkModal ? (showMenuModal = false) : null,
          showLinkModal && showMenuModal ? (showLinkModal = false) : null
      "
      @user-message="openPicModal"
    />

    <pic-modal
      v-if="picModal"
      :message="userMessage"
      @close-picmodal="picModal = false"
    />

    <camera-modal
      v-if="showCameraModal"
      @close-cameraModal="showCameraModal = false"
      @close-menuModal="showMenuModal = false"
    />

    <link-modal v-if="showLinkModal" @close-LinkModal="showLinkModal = false" />

    <videochat-modal
      v-if="showVideoModal"
      @close-videoModal="showVideoModal = false"
    />

    <map-modal v-if="showMapModal" @close-mapModal="showMapModal = false" />

    <menu-modal
      v-if="showMenuModal"
      @openCameraModal="showCameraModal = true"
      @openVideoModal="showVideoModal = true"
      @openLinkModal="showLinkModal = true"
      @openMapModal="showMapModal = true"
      @closeMenuModal="showMenuModal = false"
    />

    <q-footer class="footer q-py-xs bg-transparent constraint" style="border: 2px solid white;">
      <q-form class="flex constraint full-width">
        <div
          v-if="!inputFocus"
          flat
          round
          class="row justify-center items-center"
          style="width: 15%;"
        >
          <q-btn
            flat
            round
            ref="btnEmoji"
            icon="eva-menu-outline"
            @click="showMenuModal = true"
          />
        </div>
        <div
          :class="inputFocus ? 'q-px-md' : ''"
          class="q-py-sm"
          style="width: 70%; display: flex; align-items: center"
          :style="{ width: inputFocus ? '100%' : '70%' }"
        >
          <q-input
            ref="input"
            dense
            standout
            focus="false"
            class="full-width"
            bg-color="lime-1"
            label-color="dark"
            :label="t('message')"
            v-model="newMessage"
            @keydown.enter="sendMessage"
            @keyup="sendTypingIndicator"
            @focus="onFocus"
            @blur="onBlur"
            :style="{ width: inputFocus ? '100%' : '50%' }"
            style="border: 20px"
          >
            <template v-slot:prepend v-if="inputFocus">
              <q-btn
                icon="navigate_next"
                size="md"
                class="text-dark"
                dense
                flat
                @click="inputFocus = false"
              />
            </template>
            <template v-slot:append>
              <q-icon
                round
                size="sm"
                ref="btnEmoji"
                style="cursor: pointer"
                class="q-mr- text-dark"
                name="eva-smiling-face-outline"
                @click="showEmojiPicker"
              />
            </template>
          </q-input>
        </div>
        <div v-if="!inputFocus" class="row justify-center items-center" style="width: 15%">
          <q-btn
            icon="eva-navigation-2-outline"
            size="md"
            class="text-white"
            dense
            flat
            :color="inputFocus ? 'white' : 'white'"
            @click="sendMessage"
          />
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

// Import components
import PageHeader from "../components/ChatPage/PageHeader.vue";
import MapModal from "../components/ChatPage/MapModal.vue";
import MenuModal from "../components/ChatPage/MenuModal.vue";
import VideochatModal from "../components/ChatPage/VideoChatModal.vue";
import CameraModal from "../components/ChatPage/CameraModal.vue";
import PicModal from "../components/ChatPage/PicModal.vue";
import LinkModal from "../components/ChatPage/LinkModal.vue";
import ChatMessages from "../components/ChatPage/ChatMessages.vue";

export default {
  components: {
    PageHeader,
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
.footer {
  z-index: 300;
  backdrop-filter: blur(20px);
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  backdrop-filter: blur(20px);
}
.icons {
  display: flex;
  align-items: center;
  
}
.btn-close {
  cursor: pointer;
  margin-left: auto;
  // position: absolute;
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
</style>
