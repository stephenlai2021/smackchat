<template>
  <q-page>
    <!-- <transition-group
      appear
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    > -->
      <div class="video-modal">
        <h5 style="border: 1px solid white;">Video Chat</h5>
        <q-btn
          round
          dense
          size="md"
          class="bg-red-3"
          icon="eva-close-outline"
          style="
            position: fixed;
            left: 50%;
            transform: translate(-50%);
            bottom: 20px;
            z-index: 700;
          "
          @click="closeVideoModal"
        />
      </div>
    <!-- </transition-group> -->
  </q-page>
</template>

<script>
export default {
  setup(props, context) {
    const closeVideoModal = () => {
      context.emit("close-videoModal");
    };

    return {
      closeVideoModal,
    };
  },
};
</script>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
}
.video-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 600;
  // background: black;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(8px);
}
</style>
