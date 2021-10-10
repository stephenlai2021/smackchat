<template>
    <transition-group
      appear
      enter-active-class="animated slideInUp"
      leave-active-class="animated slideOutDown"
    >
      <div class="image-modal bg-dark constraint text-center q-pa-md">
        <div class="text-white">{{ file.name }}</div>
        <div class="text-white">Uploading... {{ store.state.progress }}%</div>
        <div
          class="progress-bar"
          :style="{ width: store.state.progress + '%' }"
        ></div>
      </div>
    </transition-group>
</template>

<script>
import { inject, watch } from "vue";
import { useRoute } from 'vue-router'
import { timestamp } from "src/boot/firebase";

export default {
  props: ["file"],
  emits: ["close-imageModal", "close-menuModal"],
  setup(props, context) {
    const store = inject("store");

    const route = useRoute()

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
          context.emit('close-imageModal')
          context.emit('close-menuModal')
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
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  // background: rgba(0, 0, 0, 0.8);
  // backdrop-filter: blur(8px);
  z-index: 600;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
.progress-bar {
  display: block;
  height: 6px;
  // background: #5ad8d2;
  background: #69f0ae;
  // padding: 20px;
  border-radius: 6px;
  margin-top: 20px;
  transition: width 0.3s ease;
}
</style>
