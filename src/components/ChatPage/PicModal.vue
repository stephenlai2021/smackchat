<template>
  <transition-group
    appear
    enter-active-class="animated zoomIn"
    leave-active-class="animated zoomOut"
  >
    <div
      class="pic-modal"
      key="item1"
      :style="{
        left:
          store.state.leftDrawerOpen && $q.platform.is.desktop
            ? '250px'
            : '0px',
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
      <q-icon v-if="!isImageFullyLoaded" name="eva-image-outline" size="xl" class="text-green-2" />
      <img        
        @load="loadFullImage"
        :src="message.text"
        ref="image"
        alt="user pic"
        class="image"
        key="item2"
        style="object-fit: contain"
      />
      <q-btn
        key="item3"
        round
        class="btn-close"
        color="pink-3"
        icon="eva-close-outline"
        @click="closePicModal"
      />
    </div>
  </transition-group>
</template>

<script>
import { ref, onMounted, watch, inject } from "vue";

export default {
  props: ["message"],
  emits: ["close-picmodal"],
  setup(props, context) {
    // console.log("image url: ", props.message.text);
    const store = inject("store");

    const image = ref(null);
    const imageWidth = ref(null);
    const imageHeight = ref(null);
    const isImageFullyLoaded = ref(false);
    const orientation = ref(
      screen.orientation || screen.mozOrientation || screen.msOrientation
    );

    const closePicModal = () => {
      context.emit("close-picmodal");
    };

    const loadFullImage = () => {
      if (image.value.complete && image.value.naturalHeight !== 0) {
        isImageFullyLoaded.value = true;
        console.log("image is fully loaded");
      }
    };

    watch(
      () => [isImageFullyLoaded.value, orientation.value],
      () => {
        if ((isImageFullyLoaded.value = true)) {
          imageWidth.value = image.value.clientWidth;
          imageHeight.value = image.value.clientHeight;

          console.log("image width: ", imageWidth.value);
          console.log("image height: ", imageHeight.value);

          if (
            orientation.value.type === "landscape-primary" &&
            imageWidth.value < imageHeight.value
          ) {
            image.value.style.height = "100vh";
            image.value.style.width = "90vw";
          }
          if (
            orientation.value.type === "landscape-primary" &&
            imageWidth.value > imageHeight.value
          ) {
            image.value.style.width = "90vw";
            image.value.style.height = "90vh";
          }
          if (
            orientation.value.type === "portrait-primary" &&
            imageWidth.value < imageHeight.value
          ) {
            image.value.style.width = "90vw";
            image.value.style.height = "100vh";
          }
          if (
            orientation.value.type === "portrait-primary" &&
            imageWidth.value > imageHeight.value
          ) {
            image.value.style.width = "100vw";
            image.value.style.height = "90vh";
          }
        }
      }
    );

    return {
      store,
      image,
      context,
      loadFullImage,
      closePicModal,
      isImageFullyLoaded,
    };
  },
};
</script>

<style lang="scss" scoped>
.btn-close {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0.7;
}
.pic-modal {
  position: fixed;
  left: 0px;
  // left: 10%;
  // transform: translateX(-10%);
  top: 0;
  width: 100%;
  height: 100vh;
  z-index: 800;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(20px);
}
</style>
