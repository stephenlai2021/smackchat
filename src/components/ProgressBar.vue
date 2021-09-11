<template>
  <div class="progress-bar" :style="{ width: progress + '%' }"></div>
</template>

<script>
import { watchEffect } from "vue";
import useStorage from "src/composables/useStorage";

export default {
  props: ["file"],
  setup(props, context) {
    const { url, error, progress } = useStorage(props.file, 'images');

    watchEffect(() => {
      if (progress.value >= 100) {
        setTimeout(() => {
          context.emit("complete");
        }, 1000);
      }
    });

    return {
      url,
      error,
      progress,
    };
  },
};
</script>

<style lang="scss" scoped>
.progress-bar {
  display: block;
  height: 6px;
  background: #5ad8d2;
  // padding: 20px;
  border-radius: 6px;
  margin-top: 20px;
  transition: width 0.3s ease;
}
</style>
