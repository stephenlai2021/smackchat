<template>
  <transition-group
    appear
    enter-active-class="animated zoomIn"
    leave-active-class="animated zoomOut"
  >
    <div class="videochat-notification">
      <h5>Receiving Videochat Notification</h5>
      <q-btn
        icon="eva-close-outline"
        style="cursor: pointer; z-index: 700"
        @click="closeNotification"
      />
    </div>
  </transition-group>
</template>

<script>
export default {
  setup(props, context) {
    const closeNotification = () => {
      context.emit("close-notification");
    };
    return {
      closeNotification,
    };
  },
};
</script>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.videochat-notification {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 600;
  background: black;
}
</style>
