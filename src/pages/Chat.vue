<template>
  <q-page class="page-chat">
    <page-header />

    <chat-messages @click="showMenuModal = false" @user-message="openPicModal" />

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

    <video-modal
      v-if="showVideoModal"
      @close-videoModal="showVideoModal = false"
    />

    <map-modal
      v-if="showMapModal"      
      @close-mapModal="showMapModal = false"
    />

    <menu-modal
      v-if="showMenuModal"
      @open-cameraModal="showCameraModal = true"
      @open-videoModal="showVideoModal = true"
      @open-linkModal="showLinkModal = true"
      @open-videoLinkModal="showVideoLinkModal = true"
      @open-mapModal="showMapModal = true"
      @close-menuModal="showMenuModal = false"
    />

    <!-- <q-footer
      style="z-index: 300; backdrop-filter: blur(20px)"
      class="q-py-xs bg-transparent"
    > -->
    <q-footer
      style="z-index: 300; border-top-left-radius: 10px; border-top-right-radius: 10px;"
      class="q-py-xs bg-dark"
    >
      <q-form class="flex constraint" :class="{ 'q-mx-sm': inputFocus }">
        <div
          v-if="!inputFocus"
          flat
          round
          class="flex row justify-evenly"
          style="width: 15%; display: flex; align-items: center"
        >
          <q-btn
            round
            size=""
            flat
            ref="btnEmoji"
            class="text-"
            icon="eva-menu-outline"
            @click="showMenuModal = true"
          />
        </div>

        <div
          :class="inputFocus ? 'q-pl-md' : ''"
          class="q-pr-md q-py-sm"
          style="width: 80%; display: flex; align-items: center"
          :style="{ width: inputFocus ? '100%' : '80%' }"
        >
          <q-input
            ref="input"
            v-model="newMessage"
            class="q-mr-md full-width text-dark"
            outlined
            rounded
            standout
            color="dark"
            bg-color="lime-1"
            label-color="dark"
            :label="t('message')"
            dense
            focus="false"
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
          <div style="width: 7%">
            <q-btn
              icon="eva-navigation-2-outline"
              size="md"
              class="text-white q-mx-sm"
              dense
              flat
              :color="inputFocus ? 'white' : 'white'"
              @click="sendMessage"
            />
          </div>
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
    "menu-modal": require("components/ChatPage/MenuModal.vue").default,
    "video-modal": require("components/ChatPage/VideoChatModal.vue").default,
    "camera-modal": require("components/ChatPage/CameraModal.vue").default,
    "pic-modal": require("components/ChatPage/PicModal.vue").default,
    "link-modal": require("src/components/ChatPage/LinkModal.vue").default,
    "chat-messages": require("components/ChatPage/CustomedChatMessages.vue")
      .default,
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
