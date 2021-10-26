<template>
  <transition-group
    appear
    enter-active-class="animated zoomIn"
    leave-active-class="animated zoomOut"
  >
    <div
      class="pic-modal bg-dark constraint"
      key="item1"
      style="object-fit: cover"
    >
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
import { ref, onMounted, watch } from "vue";

export default {
  props: ["message"],
  emits: ["close-picmodal"],
  setup(props, context) {
    // console.log("image url: ", props.message.text);
    const image = ref(null);
    const imageWidth = ref(null);
    const imageHeight = ref(null);
    const isImageFullyLoaded = ref(false);
    const orientation = ref(screen.orientation || screen.mozOrientation || screen.msOrientation)

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

          if (orientation.value.type === 'landscape-primary' && imageWidth.value < imageHeight.value) {
            image.value.style.height = '100vh'
            image.value.style.width = '90vw'
          }
          if (orientation.value.type === 'landscape-primary' && imageWidth.value > imageHeight.value) {
            image.value.style.width = '90vw'
            image.value.style.height = '90vh'
          }
          if (orientation.value.type === 'portrait-primary' && imageWidth.value < imageHeight.value) {
            image.value.style.width = '90vw'
            image.value.style.height = '100vh'
          }
          if (orientation.value.type === 'portrait-primary' && imageWidth.value > imageHeight.value) {
            image.value.style.width = '100vw'
            image.value.style.height = '90vh'
          }
        }
      }
    );

    onMounted(() => {});

    return {
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
  left: 50%;
  transform: translateX(-50%);
  top: 0;
  width: 100vw;
  height: 100vh;
  z-index: 800;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
