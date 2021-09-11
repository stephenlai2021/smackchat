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
          <!-- <q-spinner-dots
            size="2rem"
            color="grey-5"
            v-if="store.state.typing.typing"
          /> -->
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

    <q-footer
      class="bg-transparent"
      style="backdrop-filter: blur(20px);"
    >
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
          <label class="q-ma-md" style="cursor: pointer">
            <input class="file-input" type="file" @change="handleChange" />
            <q-icon color="green-12" size="md" name="eva-camera-outline" />
          </label>
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

    const btnEmoji = ref(null);
    const chats = ref(null);
    const input = ref(null);
    const picker = ref(null);
    const desktop = ref(false);
    const newMessage = ref("");
    const indicator = ref(false);
    const inputFocus = ref(false);
    const showMessages = ref(false);
    const to = ref({});
    const file = ref(null);
    const fileError = ref(null);

    // allowed file types
    const types = ["image/png", "image/jpeg", "image/jpg"];  

    // watch
    watch(
      () => store.state.messages,
      () => {
        setTimeout(() => {
          window.scrollTo(0, chats.value.scrollHeight);
          showMessages.value = true;
        }, 20);
      }
    );

    watch(
      () => indicator.value,
      // () => store.state.typing.typing,
      (newVal, oldVal) => {
        store.methods.getTypingIndicator(route.params.from, route.params.to);
        // newVal = false
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

    watch(
      () => file.value,
      (newVal, oldVal) => {
        console.log("You have selected: ", newVal);

        if (file.value && types.includes(file.value.type)) {
          console.log("file name: ", file.value.name);

          fileError.value = null;
          store.methods.useStorage2(file.value, "smackchat");

          setTimeout(() => {
            if (store.state.uploadCompleted) {
              file.value = null;
            }
          }, 2000);

          if (store.state.url) {
            store.methods.sendMessage({
              text: store.state.url,
              from: "me",
              to: route.params.to,
              createdAt: timestamp(),
            });
          }
        } else {
          file.value = null;
          // fileError.value = "Please select an image file (png or jpeg/jpg)";
        }
      }
    );

    // methods
    const call = () => {};

    const handleChange = (e) => {
      let selected = e.target.files[0];
      console.log("You have selected: ", selected);

      if (selected && types.includes(selected.type)) {
        file.value = selected;
        fileError.value = null;
      } else {
        file.value = null;
        fileError.value = "Please select an image file (png or jpeg/jpg)";
      }
    };

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

    // picker.value = new EmojiButton({
    //   position: {
    //     top: '50px',
    //   },
    // });

    picker.value = new EmojiButton();

    picker.value.on("emoji", (selection) => {
      newMessage.value += selection.emoji;
    });

    const showEmojiPicker = () => {
      picker.value.togglePicker(btnEmoji.value);
    };

    // lifecycle
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
      chats,
      input,
      desktop,
      btnEmoji,
      indicator,
      inputFocus,

      // methods
      call,
      onBlur,
      onFocus,
      handleChange,
      newMessage,
      sendMessage,
      showMessages,
      showEmojiPicker,
      sendTypingIndicator,
      formatDistanceToNow,
    };
  },
};
</script>

<style lang="scss" scoped>
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
