<template>
  <q-page class="page-chat">
    <q-header
      class="bg-transparent"
      style="backdrop-filter: blur(20px); z-index: 500"
    >
      <q-toolbar
        class="constraint"
        style="padding: 0; backdrop-filter: blur(8px)"
      >
        <q-btn
          round
          flat
          color="grey-5"
          size="18px"
          class=""
          style="position: relative; z-index: 500"
          icon="eva-arrow-ios-back-outline"
          @click="router.push('/users')"
        />
        <span
          class="text-grey-5 text-bold"
          style="font-size: 18px; width: 100%"
          color=""
          v-if="store.state.otherUser"
        >
          {{ store.state.otherUser.name }}
        </span>
        <div class="flex row justify-end full-width">
          <q-btn
            round
            dense
            color="blue"
            size="md"
            icon="eva-pin-outline"
            class="q-mr-md"
            @click="router.push('/map')"
          />
          <q-btn
            round
            dense
            color="red"
            size="md"
            icon="eva-phone-outline"
            class="q-mr-md"
            @click="call"
          />
        </div>
      </q-toolbar>
    </q-header>

    <div class="video-chat"></div>

    <div
      ref="chats"
      :class="{ invisible: !showMessages }"
      class="q-mx-md q-my-md column col justify-end messages"
    >
      <q-chat-message
        v-for="(message, index) in store.getters.formattedMessages()"
        :key="index"
        :avatar="
          message.from === 'me'
            ? store.state.userDetails.avatar
            : store.state.otherUser.avatar
        "
        :text="[message.text]"
        :sent="message.from === 'me'"
        :stamp="message.createdAt"
        :bg-color="message.from === 'me' ? 'amber-2' : 'light-green-2'"
        class="q-my-md"
      />
    </div>

    <!-- Image Modal -->
    <transition-group
      appear
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
      <div v-if="file" class="image-modal constraint text-center q-pa-md">
        <div v-if="file">{{ file.name }}</div>
        <!-- <div v-if="file">Uploading... {{ store.state.progress }}%</div> -->
        <div v-if="file">Uploading...</div>
        <div
          v-if="file"
          class="progress-bar"
          :style="{ width: store.state.progress + '%' }"
        ></div>
      </div>
    </transition-group>

    <!-- Camera Modal -->
    <transition-group
      appear
      enter-active-class="animated slideInDown"
      leave-active-class="animated slideOutUp"
    >
      <div v-if="showCameraModal" class="camera-modal">
        <div class="constraint" style="border: 1px solid green; height: 100vh">
          <div class="row justify-around">
            <h3 style="margin: 0; padding: 0">Camera Modal</h3>
            <q-btn
              round
              color="red"
              icon="eva-close"
              @click="showCameraModal = false"
            />
          </div>
          <camera-input></camera-input>
        </div>
      </div>
    </transition-group>

    <q-footer class="bg-transparent footer" style="backdrop-filter: blur(20px)">
      <q-form class="flex constraint" :class="{ 'q-mx-sm': inputFocus }">
        <q-btn-group
          v-if="!inputFocus"
          flat
          round
          class="flex row justify-evenly"
          style="width: 50%"
        >
          <label class="q-ma-md" style="cursor: pointer">
            <input class="file-input" type="file" @change="handleChange" />
            <q-icon color="green-12" size="md" name="eva-image-outline" />
          </label>
          <q-icon
            size="md"
            class="q-ma-md"
            color="green-12"
            style="cursor: pointer"
            name="eva-camera-outline"
            @click="showCameraModal = true"
          />
          <q-btn
            round
            size="16px"
            flat
            class="q-ma-sm"
            ref="btnEmoji"
            color="green-12"
            icon="eva-smiling-face-outline"
            @click="showEmojiPicker"
          />
        </q-btn-group>

        <div style="width: 50%" :style="{ width: inputFocus ? '100%' : '50%' }">
          <q-input
            ref="input"
            v-model="newMessage"
            class="q-px-md q-py-sm full-width"
            outlined
            rounded
            :label="t('message')"
            dense
            focus="false"
            bg-color=""
            @keydown.enter="sendMessage"
            @keyup="sendTypingIndicator()"
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
import { ref, onMounted, inject, watch, computed } from "vue";
import { EmojiButton } from "@joeattardi/emoji-button";
import { useRoute, useRouter } from "vue-router";
import { formatDistanceToNow } from "date-fns";
import { timestamp } from "src/boot/firebase";
import { useQuasar } from "quasar";
import { useI18n } from "vue-i18n";

export default {
  setup() {
    const $q = useQuasar();

    const store = inject("store");

    const { t, locale } = useI18n();

    const route = useRoute();
    const router = useRouter();

    const chats = ref(null);
    const input = ref(null);

    const desktop = ref(false);
    const newMessage = ref("");
    const indicator = ref(false);
    const inputFocus = ref(false);
    const showMessages = ref(false);
    const to = ref({});
    const showCameraModal = ref(false);

    /***************/
    /* Image Input */
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
      } else {
        file.value = null;
        fileError.value = "Please select an image file (png or jpeg/jpg)";
        $q.notify({
          message: fileError.value,
          color: "purple",
          position: "bottom",
          timeout: 2000,
        });
        // fileError.value = null
      }
    };

    watch(
      () => file.value,
      (newVal, oldVal) => {
        console.log("You have selected: ", newVal);

        if (file.value && types.includes(file.value.type)) {
          console.log("file name: ", file.value.name);

          fileError.value = null;
          store.methods.useStorage2(file.value, "smackchat");

          // store.state.progress = null;
          // setTimeout(() => {
          //   if (store.state.uploadCompleted) {
          //     file.value = null;
          //   }
          // }, 2000);

          if (store.state.url) {
            store.methods.sendMessage({
              text: store.state.url,
              from: "me",
              to: route.params.to,
              createdAt: timestamp(),
            });
            file.value = null
          }
        }
      }
    );
    /* End of Image Input */

    /***************/
    /* Emoji Input */
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
    /* End of Emoji Input */

    watch(
      () => store.state.messages,
      () => {
        setTimeout(() => {
          window.scrollTo(0, chats.value.scrollHeight);
          showMessages.value = true;
        }, 1000);
      }
    );

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

    const call = () => {};

    const sendTypingIndicator = () => {
      indicator.value = true;

      store.methods.sendTypingIndicator({
        from: "me",
        to: route.params.to,
      });
    };

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

      store.methods.getUser(route.params.to);

      if (store.state.otherUser) {
        console.log("getUser | Chat: ", store.state.otherUser);
      }
    });

    return {
      // i18n
      t,
      locale,

      store,
      route,
      router,

      /* ref */
      to,
      file,
      chats,
      input,
      desktop,
      btnEmoji,
      indicator,
      fileError,
      inputFocus,
      showCameraModal,

      // methods
      call,
      onBlur,
      onFocus,
      newMessage,
      sendMessage,
      showMessages,
      handleChange,
      showEmojiPicker,
      sendTypingIndicator,
      formatDistanceToNow,
    };
  },
};
</script>

<style lang="scss" scoped>
.progress-bar {
  display: block;
  height: 6px;
  background: #5ad8d2;
  // padding: 20px;
  border-radius: 6px;
  margin-top: 20px;
  transition: width 0.3s ease;
}
.image-modal {
  position: fixed;
  bottom: 64px;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  border: 1px solid green;
}
.footer {
  z-index: 300;
}
.camera-modal {
  position: fixed;
  top: 0;
  left: 0;
  // transform: translateX(-50%);
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
  // padding: 20px;
  border-radius: 6px;
  // margin-top: 10px;
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
.page-chat {
  overflow: hidden;
  &:after {
    content: "";
    display: block;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 0;
    opacity: 0.1;
    background-image: radial-gradient(
        circle at 100% 150%,
        silver 24%,
        white 24%,
        white 28%,
        silver 28%,
        silver 36%,
        white 36%,
        white 40%,
        transparent 40%,
        transparent
      ),
      radial-gradient(
        circle at 0 150%,
        silver 24%,
        white 24%,
        white 28%,
        silver 28%,
        silver 36%,
        white 36%,
        white 40%,
        transparent 40%,
        transparent
      ),
      radial-gradient(
        circle at 50% 100%,
        white 10%,
        silver 10%,
        silver 23%,
        white 23%,
        white 30%,
        silver 30%,
        silver 43%,
        white 43%,
        white 50%,
        silver 50%,
        silver 63%,
        white 63%,
        white 71%,
        transparent 71%,
        transparent
      ),
      radial-gradient(
        circle at 100% 50%,
        white 5%,
        silver 5%,
        silver 15%,
        white 15%,
        white 20%,
        silver 20%,
        silver 29%,
        white 29%,
        white 34%,
        silver 34%,
        silver 44%,
        white 44%,
        white 49%,
        transparent 49%,
        transparent
      ),
      radial-gradient(
        circle at 0 50%,
        white 5%,
        silver 5%,
        silver 15%,
        white 15%,
        white 20%,
        silver 20%,
        silver 29%,
        white 29%,
        white 34%,
        silver 34%,
        silver 44%,
        white 44%,
        white 49%,
        transparent 49%,
        transparent
      );
    background-size: 100px 50px;
  }
}
</style>
