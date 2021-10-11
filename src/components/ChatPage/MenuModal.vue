<template>
  <!-- <transition-group
    appear
    enter-active-class="animated slideInUp"
    leave-active-class="animated slideOutDown"
  > -->
  <transition-group
    appear
    @before-enter="beforeEnter"
    @enter="enter"
    @after-enter="afterEnter"
    @before-leave="beforeLeave"
    @leave="leave"
    @after-leave="afterLeave"
  >
    <div
      style="height: 64px;"
      class="menu-modal bg-dark q-pa-sm full-width q-py-md constraint"
      key="item1"
    >
      <div class="icons full-width" key="item2">
        <label
          class="q-ml-sm q-mr-md text-white"
          style="cursor: pointer"
          key="item3"
        >
          <input
            class="file-input"
            type="file"
            @change="handleChange"
            key="item4"
          />
          <q-icon
            size="sm"
            class="text-"
            name="eva-image-outline"
            key="item5"
          />
        </label>
        <q-icon
          v-if="store.state.desktop"
          round
          size="sm"
          key="item7"
          class="q-mr-md text-white"
          style="cursor: pointer"
          name="eva-camera-outline"
          @click="showCameraModal"
        />
        <q-icon
          round
          size="sm"
          key="item9"
          class="q-mr-md text-white"
          style="cursor: pointer"
          name="eva-link-outline"
          @click="showLinkModal"
        />
        <q-icon
          round
          size="sm"
          key="item8"
          class="q-mr-md text-white"
          style="cursor: pointer"
          name="eva-video-outline"
          @click="showVideoModal"
        />
        <q-icon
          round
          size="sm"
          key="item10"
          class="text-white"
          style="cursor: pointer"
          name="eva-pin-outline"
          @click="showMapModal"
        />
        <q-btn
          flat
          round
          key="item11"
          size="md"
          class="text-pink-3 btn-close"
          icon="eva-close-outline"
          @click="closeMenuModal"
        />
      </div>
    </div>
    <image-modal
      key="item12"
      :file="file"
      v-if="file"
      @close-imageModal="file = null"
      @close-menuModal="closeMenuModal"
    />
  </transition-group>
</template>

<script>
import { ref, inject } from "vue";
import ImageModal from './ImageModal.vue'

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
  setup(props, { emit }) {
    const store = inject("store");

    const file = ref(null);
    const fileError = ref(null);

    const types = ["image/png", "image/jpeg", "image/jpg"];

    const beforeEnter = (el) => {}
    const enter = (el) => {}
    const afterEnter = (el) => {}
    const beforeLeave = (el) => {}
    const leave = (el) => {}
    const afterLeave = (el) => {}

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
      file,
      store,
      handleChange,
      showMapModal,
      showLinkModal,
      showVideoModal,
      closeMenuModal,
      showCameraModal,
      beforeEnter,
      enter,
      afterEnter,
      beforeLeave,
      leave,
      afterLeave,
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
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
</style>
