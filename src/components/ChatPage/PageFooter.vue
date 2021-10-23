<template>
  <div
    class="bg-transparent q-py-sm q-pl-md footer row"
    :style="{
      left:
        store.state.leftDrawerOpen && $q.platform.is.desktop ? '250px' : '0px',
      width:
        store.state.leftDrawerOpen &&
        store.state.rightDrawerOpen &&
        $q.platform.is.desktop
          ? 'calc(100% - 315px)'
          : store.state.leftDrawerOpen && $q.platform.is.desktop
          ? 'calc(100% - 250px)'
          : '',
    }"
  >
    <div class="inner-container full-width">
      <div
        class="row items-center justify-center icon-menu-container"
        style="width: 6%"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="7.467"
          height="28"
          viewBox="0 0 7.467 28"
          style="5%; cursor: pointer;"
          @click="store.state.rightDrawerOpen = !store.state.rightDrawerOpen"
        >
          <g id="more" transform="translate(-22)">
            <path
              id="Path_250"
              data-name="Path 250"
              d="M25.733,7.467A3.733,3.733,0,1,0,22,3.733,3.738,3.738,0,0,0,25.733,7.467Z"
              fill="#A9B5C1"
            />
            <path
              id="Path_251"
              data-name="Path 251"
              d="M25.733,44a3.733,3.733,0,1,0,3.733,3.733A3.738,3.738,0,0,0,25.733,44Z"
              transform="translate(0 -23.467)"
              fill="#A9B5C1"
            />
            <path
              id="Path_252"
              data-name="Path 252"
              d="M25.733,22a3.733,3.733,0,1,0,3.733,3.733A3.738,3.738,0,0,0,25.733,22Z"
              transform="translate(0 -11.733)"
              fill="#A9B5C1"
            />
          </g>
        </svg>
      </div>

      <div class="input-search q-mr-md" style="width: 95%">
        <svg
          id="happiness"
          xmlns="http://www.w3.org/2000/svg"
          width="18.004"
          height="18.004"
          viewBox="0 0 18.004 18.004"
          class="icon-smiley"
          @click="showEmojiPicker"
        >
          <path
            id="Path_247"
            data-name="Path 247"
            d="M9,0a9,9,0,1,0,9,9A9.012,9.012,0,0,0,9,0ZM9,17.031A8.027,8.027,0,1,1,17.031,9,8,8,0,0,1,9,17.031Z"
            fill="#a9b5c1"
          />
          <circle
            id="Ellipse_10"
            data-name="Ellipse 10"
            cx="0.973"
            cy="0.973"
            r="0.973"
            transform="translate(5.089 6.022)"
            fill="#a9b5c1"
          />
          <circle
            id="Ellipse_11"
            data-name="Ellipse 11"
            cx="0.973"
            cy="0.973"
            r="0.973"
            transform="translate(11.111 6.022)"
            fill="#a9b5c1"
          />
          <path
            id="Path_248"
            data-name="Path 248"
            d="M75.363,182.288a5.65,5.65,0,0,0,4.72-2.562l-.817-.528a4.623,4.623,0,0,1-7.771,0l-.817.528a5.651,5.651,0,0,0,4.056,2.525A5.5,5.5,0,0,0,75.363,182.288Z"
            transform="translate(-66.378 -168.298)"
            fill="#a9b5c1"
          />
        </svg>
        <input
          type="text"
          name="search"
          v-model="newMessage"
          placeholder="Enter your message"
          @keydown.enter="sendMessage"
          @keyup="sendTypingIndicator"
        />
        <q-icon
          name="navigate_next"
          size="sm"
          class="text- btn-send q-pr-sm icon-right-arrow"
          dense
          flat
          @click="sendMessage"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { ref, inject, watch, onMounted } from "vue";
import { timestamp } from "src/boot/firebase";
import { EmojiButton } from "@joeattardi/emoji-button";
import MenuModal from "./MenuModal.vue";

export default {
  components: {
    MenuModal,
  },
  setup(props, { emit }) {
    const { t, locale } = useI18n();

    const route = useRoute();

    const store = inject("store");

    const newMessage = ref("");
    const indicator = ref(false);
    // const inputFocus = ref(false);
    const showMenuModal = ref(false);
    const inputBgColor = ref("#E7EAED");

    const inputForm = ref(true);
    const menuModal = ref(true);

    const footerItems = ref([
      {
        left: [
          {
            id: "item #1",
            value: true,
          },
          {
            id: "item #2",
            value: true,
          },
        ],
        right: [
          {
            id: "item#3",
            value: true,
          },
        ],
      },
    ]);

    const closeMenuModal = () => {
      showMenuModal.value = false;
      inputForm.value = true;
    };

    const openMenuModal = () => {
      // emit("openMenuModal");
      // showMenuModal.value = !showMenuModal;
      inputForm.value = false;
      showMenuModal.value = true;
      console.log("menu modal state: ", showMenuModal.vaue);
      console.log("open menu modal");
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
    };

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

    return {
      t,
      store,
      locale,
      menuModal,
      inputForm,
      newMessage,
      sendMessage,
      inputBgColor,
      showMenuModal,
      openMenuModal,
      closeMenuModal,
      showEmojiPicker,
      sendTypingIndicator,
    };
  },
};
</script>

<style lang="scss" scoped>
.input-search {
  position: relative;
  // border: 1px solid red;
  // width: 95%;
}
.icon-search {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
}
::placeholder {
  font-size: 14px;
  font-weight: 600;
  color: #a9b5c1;
  padding-left: 1px;
}
input[type="text"] {
  width: 100%;
  box-sizing: border-box;
  border: none;
  outline: none;
  border-radius: 10px;
  font-size: 16px;
  color: grey;
  background-color: #e7eaed;
  padding: 13px 20px 13px 37px;
}
.icon-smiley {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 10px;
  cursor: pointer;
}
.icon-right-arrow {
  position: absolute;
  right: 0px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 800;
  cursor: pointer;
}
.btn-send {
  color: #a9b5c1;
}
.footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 700;
  backdrop-filter: blur(20px);
  // border: none;
}
// @media (min-width: 1023px) {
//   .footer {
//     left: 250px;
//     width: calc(100% - px);
//   }
// }
.inner-container {
  display: flex;
}
@media (max-width: 757px) {
  .icon-menu-container {
    justify-content: flex-start;
  }
}
</style>
