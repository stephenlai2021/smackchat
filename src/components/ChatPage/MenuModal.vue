<template>
  <transition-group
    appear
    enter-active-class="animated slideInUp"
    leave-active-class="animated slideOutDown"
  >
    <div
      style="height: 64px"
      class="menu-modal bg-dark q-pa-sm full-width q-py-md constraint"
      key="item1"
    >
      <div class="icons full-width">
        <label class="q-ml-sm q-mr-md text-white" style="cursor: pointer">
          <input class="file-input" type="file" @change="handleChange" />
          <q-icon size="sm" class="text-" name="eva-image-outline" />
        </label>
        <q-icon
          round
          size="sm"
          class="q-mr-md"
          style="cursor: pointer"
          name="eva-camera-outline"
          @click="showCameraModal"
        />
        <q-icon
          round
          size="sm"
          class="q-mr-md"
          style="cursor: pointer"
          name="eva-video-outline"
          @click="showVideoModal"
        />
        <q-icon
          round
          size="sm"
          class="q-mr-md"
          style="cursor: pointer"
          name="eva-link-outline"
          @click="showLinkModal"
        />
        <q-icon
          round
          size="sm"
          style="cursor: pointer"
          name="eva-pin-outline"
          @click="showMapModal"
        />
        <q-btn
          flat
          round
          size="md"
          class="text-pink-3 btn-close"
          icon="eva-close-outline"
          @click="closeMenuModal"
        />
      </div>
    </div>
    <image-modal
      :file="file"
      v-if="file"
      @close-imageModal="file = null"
      @close-menuModal="closeMenuModal"
    />
  </transition-group>
</template>

<script>
import { ref, inject } from "vue";

export default {
  components: {
    "image-modal": require("components/ChatPage/ImageModal.vue").default,
  },
  setup(props, context) {
    const store = inject('store')
    /***************/
    /* Image Button */
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

    const showCameraModal = () => {
      context.emit("open-cameraModal");
    };
    const showLinkModal = () => {
      console.log('show link modal')
      context.emit("open-linkModal");
    };
    const showVideoModal = () => {
      context.emit("open-videoModal");
    };
    const showMapModal = () => {
      context.emit("open-mapModal");
    };
    const closeMenuModal = () => {
      context.emit("close-menuModal");
    };

    return {
      file,
      store,
      handleChange,
      showCameraModal,
      showLinkModal,
      showVideoModal,
      showMapModal,
      closeMenuModal,
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
}
.menu-modal {
  position: fixed;
  bottom: 0;
  z-index: 500;
  display: flex;
}
</style>
