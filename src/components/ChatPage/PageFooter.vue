<template>
  <q-footer class="footer bg-transparent q-py-xs row justify-center">
    <q-form class="flex constraint full-width">
      <div
        v-if="!inputFocus"
        flat
        round
        class="row justify-center items-center"
        style="width: 15%"
      >
        <q-btn
          flat
          round
          ref="btnEmoji"
          icon="eva-menu-outline"
          @click="openMenuModal"
        />
      </div>
      <div
        class="q-py-sm"
        style="width: 100%; display: flex; align-items: center"
        :style="{ width: inputFocus ? '85%' : '70%' }"
      >
        <q-input
          ref="input"
          dense
          standout
          focus="false"
          class="full-width"
          :class="inputFocus ? 'q-pl-md' : ''"
          bg-color="lime-1"
          label-color="dark"
          :label="t('message')"
          v-model="newMessage"
          @keydown.enter="sendMessage"
          @keyup="sendTypingIndicator"
          @focus="onFocus"
          @blur="onBlur"
          style="border: 20px"
          :style="{ width: inputFocus ? '85%' : '70%' }"
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
          <template v-slot:append v-if="inputFocus">
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
      <div
        class="row justify-center items-center"
        style="width: 15%"
      >
        <q-btn
          icon="eva-navigation-2-outline"
          size="md"
          class="text-white"
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
import { useRoute } from 'vue-router'
import { ref, inject, watch } from 'vue'
import { timestamp } from 'src/boot/firebase'
import { EmojiButton } from "@joeattardi/emoji-button";

export default {
  setup(props, { emit }) {
    const { t, locale } = useI18n();

    const route = useRoute()

    const store = inject('store')

    const newMessage = ref("");
    const indicator = ref(false);
    const inputFocus = ref(false);

    const openMenuModal = () => {
      emit('openMenuModal')
    }

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

    return {
      t,
      store,
      locale,
      onBlur,
      onFocus,
      newMessage,
      inputFocus,
      sendMessage,
      openMenuModal,
      showEmojiPicker,
      sendTypingIndicator,
    }
  },
};
</script>

<style lang="scss" scoped></style>
