<template>
  <transition-group
    appear
    enter-active-class="animated zoomIn"
    leave-active-class="animated zoomOut"
  >
    <div class="pic-modal bg-dark" key="item1">
      <img :src="message.text" alt="user pic" class="image" key="item2" />
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
import { onMounted } from "vue";

export default {
  props: ["message"],
  setup(props, context) {
    console.log("image url: ", props.message.text);

    const closePicModal = () => {
      // props.url = null;
      context.emit("close-picmodal");
    };

    onMounted(() => {});

    return {
      closePicModal,
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
.image {
  width: 100%;
}
.pic-modal {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  z-index: 500;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
