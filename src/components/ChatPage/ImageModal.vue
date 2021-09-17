<template>
    <transition-group
      appear
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    >
      <div v-if="file" class="image-modal constraint text-center q-pa-md">
        <div>{{ file.name }}</div>
        <div v-if="file">Uploading... {{ store.state.progress }}%</div>
        <div
          class="progress-bar"
          :style="{ width: store.state.progress + '%' }"
        ></div>
      </div>
    </transition-group>
</template>

<script>
import { inject } from "vue";

export default {
  props: ["file"],
  setup() {
    const store = inject("store");

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
