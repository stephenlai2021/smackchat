<template>
  <transition-group
    appear
    enter-active-class="animated slideInUp"
    leave-active-class="animated slideOutDown"
  >
    <div class="menu-modal bg-dark q-pa-sm full-width q-py-md constraint" key="item1">
      <div class="icons">
        <label class="q-ml-sm q-mr-md text-white" style="cursor: pointer">
          <input class="file-input" type="file" @change="handleChange" />
          <q-icon size="md" class="text-green" name="eva-image-outline" />
        </label>
        <q-icon
          round
          size="md"
          class="q-mr-md text-blue"
          style="cursor: pointer"
          name="eva-camera-outline"
        @click="showCameraModal = true"
        />
          <!-- @click="openCameraModal" -->
        <q-icon
          round
          size="md"
          class="q-mr-sm text-pink-3"
          style="cursor: pointer"
          name="eva-link-outline"
          @click="showLinkModal = true"
        />
        <!-- <q-btn
          round
          size="18PX"
          flat
          ref="btnEmoji"
          style="color: #69f0ae"
          class="q-mr-md text-yellow"
          icon="eva-smiling-face-outline"
          @click="showEmojiPicker"
        /> -->
        <q-icon
          round
          size="md"
          class="q-mr-sm text-pink-3 btn-close"
          name="eva-close-outline"
          @click="closeMenuModal"
        />
      </div>
    </div>
  </transition-group>
</template>

<script>
import { ref, inject } from 'vue'
import { useQuasar } from "quasar";
import { EmojiButton } from "@joeattardi/emoji-button";

export default {
  setup(props, context) {
    const $q = useQuasar();

    const store = inject('store')

    const btnEmoji = ref(null);
    const picker = ref(null);
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

    const openCameraModal = () => {
      context.emit("open-cameraModal");
    };

    const closeMenuModal = () => {
      context.emit("close-menuModal");
    };

    picker.value = new EmojiButton();

    picker.value.on("emoji", (selection) => {
      newMessage.value += selection.emoji;
    });

    const showEmojiPicker = () => {
      picker.value.togglePicker(btnEmoji.value);
    };

    return {
      btnEmoji,
      handleChange,
      closeMenuModal,
      openCameraModal,
      showEmojiPicker,
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
  bottom: 0;
  z-index: 500;
  // height: 56px;
}
</style>
