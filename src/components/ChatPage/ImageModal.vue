<template>
  <div class="image-modal bg- q-pa-md">
    <div class="container text-center">
      <div class="text-white">{{ file.name }}</div>
      <!-- <div class="text-white">{{ file.name.split(" ")[0].substring(20, 0) + "." }}</div> -->
      <div class="text-white q-mt-sm ">Uploading... {{ store.state.progress }}%</div>
      <div
        class="progress-bar"
        :style="{ width: store.state.progress + '%' }"
      ></div>
    </div>
  </div>
</template>

<script>
import { inject, watch } from "vue";
import { useRoute } from "vue-router";
import { timestamp } from "src/boot/firebase";

export default {
  props: ["file"],
  emits: ["close-imageModal", "close-menuModal"],
  setup(props, context) {
    const store = inject("store");

    const route = useRoute();

    watch(
      () => store.state.url,
      (newVal, oldVal) => {
        store.methods.sendMessage({
          from: "me",
          text: store.state.url,
          url: false,
          image: true,
          to: route.params.to,
          createdAt: timestamp(),
        });
        if (store.state.uploadCompleted) {
          context.emit("close-imageModal");
        }
      }
    );

    return {
      store,
    };
  },
};
</script>

<style lang="scss" scoped>
.image-modal {
  position: fixed;
  bottom: 0;
  // top: 50%;
  // left: 50%;
  // transform: translate(-50%, -50%);
  // height: 100vh;
  width: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(20px);
  z-index: 800;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
}
.container {
  width: 250px;
  // border: 1px solid white;
  padding: 20px;
  // border-radius: 20px;
}
.progress-bar {
  display: block;
  height: 6px;
  background: #69f0ae;
  border-radius: 6px;
  margin-top: 20px;
  transition: width 0.3s ease;
}
</style>
