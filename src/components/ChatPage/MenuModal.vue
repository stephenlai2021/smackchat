<template>
  <div class="menu-modal">
    <div class="row justify-center q-pa-sm">
      <label class="pointer">
        <input class="file-input" type="file" @change="handleChange" />
        <q-icon size="23px" name="eva-image-outline" class="text-primary" />
        <span class="block text-primary text-bold">Pic</span>
      </label>
    </div>
    <div class="column items-center pointer padding-y">
      <q-icon size="23px" name="eva-camera-outline" class="text-primary" />
      <span class="block text-primary text-bold">Cam</span>
    </div>
    <div class="column items-center pointer padding-y">
      <q-icon size="23px" name="eva-link-outline" class="text-primary" />
      <span class="block text-primary text-bold">Link</span>
    </div>
    <div class="column items-center pointer padding-y">
      <q-icon size="23px" name="eva-video-outline" class="text-primary" />
      <span class="block text-primary text-bold">Video</span>
    </div>
    <div class="column items-center pointer padding-y">
      <q-icon size="23px" name="eva-pin-outline" class="text-primary" />
      <span class="block text-primary text-bold">Map</span>
    </div>
    <div class="column items-center pointer padding-y disabled">
      <q-icon size="23px" name="eva-music-outline" class="text-primary" />
      <span class="block text-primary text-bold">Music</span>
    </div>
    <div class="column items-center pointer padding-y disabled">
      <q-icon size="23px" name="eva-film-outline" class="text-primary" />
      <span class="block text-primary text-bold">Movie</span>
    </div>
    <div class="column items-center pointer padding-y disabled">
      <q-icon size="23px" name="eva-edit-outline" class="text-primary" />
      <span class="block text-primary text-bold">Draw</span>
    </div>
    <div class="column items-center pointer padding-y disabled">
      <q-icon size="23px" name="mic_none" class="text-primary" />
      <span class="block text-primary text-bold">Voice</span>
    </div>
  </div>
  <!-- <image-modal
    :file="file"
    v-if="file"
    @close-imageModal="file = null"
    @close-menuModal="closeMenuModal"
  /> -->
</template>

<script>
import { ref, inject } from "vue";
import ImageModal from "./ImageModal.vue";

export default {
  components: {
    ImageModal,
  },
  emits: [
    "openCameraModal",
    "openLinkModal",
    "openVideoModal",
    "openMapModal",
    "closeMenuModal",
  ],
  props: ["showMenuModal"],
  setup(props, { emit }) {
    const store = inject("store");

    /* Do Not Delete ! */
    // const file = ref(null);
    // const fileError = ref(null);

    const types = ["image/png", "image/jpeg", "image/jpg"];

    const handleChange = (e) => {
      let selected = e.target.files[0];
      console.log("You have selected: ", selected);

      if (selected && types.includes(selected.type)) {
        /* Do Not Delete ! */
        // file.value = selected;
        // fileError.value = null;

        // store.methods.useStorage2(file.value, "smackchat");

        store.state.file = selected;
        store.state.fileError = null;

        store.state.rightDrawerOpen = false;

        store.methods.useStorage2(store.state.file, "smackchat");

        store.state.progress = null;
      } else {
        /* Do Not Delete ! */
        // file.value = null;
        // fileError.value = "Please select an image file (png or jpeg/jpg)";

        store.state.file = null;
        store.state.fileError = "Please select an image file (png or jpeg/jpg)";

        $q.notify({
          message: store.state.fileError,
          color: "purple",
          position: "bottom",
          timeout: 2000,
        });
      }
    };

    const openCameraModal = () => {
      emit("openCameraModal");
    };
    const showLinkModal = () => {
      emit("openLinkModal");
    };
    const showVideoModal = () => {
      emit("openVideoModal");
    };
    const showMapModal = () => {
      emit("openMapModal");
    };
    const closeMenuModal = () => {
      emit("closeMenuModal");
    };

    return {
      // file,
      store,
      handleChange,
      showMapModal,
      showLinkModal,
      showVideoModal,
      closeMenuModal,
      openCameraModal,
    };
  },
};
</script>

<style lang="scss" scoped>
.disabled {
  opacity: 0.5;
}
.pointer {
  cursor: pointer;
}
.padding-y {
  padding-top: 9px;
  padding-bottom: 9px;
}
.fade-enter-from {
  opacity: 0;
}
.fade-enter-to {
  opacity: 1;
}
.fade-enter-active {
  transition: all 2s ease;
}
.fade-leave-from {
  opacity: 1;
}
.fade-leave-to {
  opacity: 0;
}
.fade-leave-active {
  transition: all 2s ease;
}

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
  cursor: pointer padding-y;
  margin-left: auto;
}
</style>
