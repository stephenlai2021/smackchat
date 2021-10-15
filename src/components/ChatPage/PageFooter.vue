<template>
  <q-footer class="bg-primary q-py-xs row" style="z-index: 300;">
    <menu-modal
      :showMenuModal="showMenuModal"
      @openCameraModal="showCameraModal = true"
      @openVideoModal="showVideoModal = true"
      @openLinkModal="showLinkModal = true"
      @openMapModal="showMapModal = true"
      @closeMenuModal="closeMenuModal"
    />
    <q-form v-if="inputForm" class="flex form">
        <!-- v-if="!inputFocus" -->
      <div
        flat
        round
        class="btn-menu row justify-center items-center"
      >
        <q-btn
          flat
          round
          ref="btnEmoji"
          class="text-primary"
          icon="eva-menu-outline"
          @click="openMenuModal"
        />
        <!-- @click="showMenuModal = true" -->
      </div>
      <div class="q-py-sm input-box-container" style="">
        <!-- :style="{ width: inputFocus ? '85%' : '70%' }" -->
        <q-input
          ref="input"
          dense
          standout
          outlined
          focus="false"
          class="full-width"
          :class="inputFocus ? 'q-pl-md' : ''"
          bg-color="primary"
          label-color="white"
          :label="t('message')"
          v-model="newMessage"
          style="opacity: 0.7;"
          @keydown.enter="sendMessage"
          @keyup="sendTypingIndicator"
          @focus="onFocus"
          @blur="onBlur"
        >
          <!-- :style="{ width: inputFocus ? '90%' : '80%' }" -->
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
          <template v-slot:append v-if="inputFocus">
            <q-icon
              round
              size="sm"
              ref="btnEmoji"
              style="cursor: pointer"
              class="text-primary"
              name="eva-smiling-face-outline"
              @click="showEmojiPicker"
            />
          </template>
        </q-input>
      </div>
      <div
        class="btn-send row justify-center items-center"
        style="width: 10%"
      >
        <q-btn
          icon="eva-navigation-2-outline"
          size="md"
          class="text-primary"
          dense
          flat
          @click="sendMessage"
        />
      </div>
    </q-form>
  </q-footer>
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
    const inputFocus = ref(false);
    const showMenuModal = ref(false);

    const inputForm = ref(true)
    const menuModal = ref(true)

    const closeMenuModal = () => {
      showMenuModal.value = false
      inputForm.value = true
    }

    const openMenuModal = () => {
      // emit("openMenuModal");
      // showMenuModal.value = !showMenuModal;
      inputForm.value = false
      showMenuModal.value = true
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

    const resize = () => {
      setInterval(() => {
        let w = window.innerWidth;
        if (w <= 575) {
          btnSend.value = false
          btnMenu.value = false
          inputBoxContainer.value = false
          menuModal.value = true
        } 
      }, 100);
    };

    onMounted(() => {
      // resize()
    })

    return {
      t,
      store,
      locale,
      onBlur,
      resize,
      onFocus,
      menuModal,
      inputForm,
      newMessage,
      inputFocus,
      sendMessage,
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
.input-box-container {
  width: 90%;
  display: flex;
  align-items: center;
}
.btn-menu {
  display: none;
  width: 10%;
}
.form {
  width: 50%;
}
@media (max-width: 575px) {
  .form {
    width: 100%;
  }
  .btn-menu {
    display: flex;
    width: 10%;
  }
  .input-box-container {
    width: 80%;
  }  
}
</style>
