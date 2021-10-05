<template>
    <transition-group
      appear
      enter-active-class="animated slideInUp"
      leave-active-class="animated slideOutDown"
    >
      <div class="image-modal constraint text-center q-pa-md">
        <div>{{ file.name }}</div>
        <div>Uploading... {{ store.state.progress }}%</div>
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
  setup(props, context) {
    const store = inject("store");

    const route = useRoute()

    watch(
      () => store.state.url,
      (newVal, oldVal) => {
        store.methods.sendMessage({
          text: store.state.url,
          from: "me",
          to: route.params.to,
          image: true,
          createdAt: timestamp(),
        });
        if (store.state.uploadCompleted) {
          context.emit('close-imageModal')
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
  bottom: 64px;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  // border: 1px solid green;
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
