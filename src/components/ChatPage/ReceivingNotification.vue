<template>
  <!-- <transition-group
    appear
    enter-active-class="animated zoomIn"
    leave-active-class="animated zoomOut"
  > -->
  <div class="videochat-notification">
    <h5 class="text-center">Receiving Videochat Notification</h5>
      <h6 class="text-center">Answering call from {{ store.state.otherUser.name }} ?</h6>
    <div class="row justify-center">
      <q-btn
        round
        size="md"
        color="red"
        icon="eva-close-outline"
        style="cursor: pointer; z-index: 700"
        @click="closeNotification"
      />
    </div>
  </div>
  <!-- </transition-group> -->
</template>

<script>
import { inject } from 'vue'

export default {
  setup(props, context) {
    const store = inject('store')

    const closeNotification = () => {
      context.emit("close-notification");
    };
    return {
      store,
      closeNotification,
    };
  },
};
</script>

<style lang="scss" scoped>
// * {
//   margin: 0;
//   padding: 0;
//   box-sizing: border-box;
// }
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
