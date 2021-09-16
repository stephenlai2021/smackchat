<template>
  <div v-if="file" class="image-modal constraint text-center q-pa-md">
    <div>{{ file.name }}</div>
    <div v-if="file">Uploading... {{ store.state.progress }}%</div>
    <div
      class="progress-bar"
      :style="{ width: store.state.progress + '%' }"
    ></div>
  </div>
</template>

<script>
import { ref, watch, inject } from "vue";

export default {
  setup() {
    const store = inject("store");

    const file = ref(null);
    const fileError = ref(null);

    const types = ["image/png", "image/jpeg", "image/jpg"];

    const handleChange = (e) => {
      let selected = e.target.files[0];
      console.log("You have selected: ", selected);

      if (selected && types.includes(selected.type)) {
        file.value = selected;
        fileError.value = null;

        store.methods.useStorage2(file.value, "smackchat");

        store.state.progress = null;
      } else {
        file.value = null;
        fileError.value = "Please select an image file (png or jpeg/jpg)";

        $q.notify({
          message: fileError.value,
          color: "purple",
          position: "bottom",
          timeout: 2000,
        });
      }
    };

    watch(
      () => store.state.url,
      (newVal, oldVal) => {
        store.methods.sendMessage({
          text: store.state.url,
          from: "me",
          to: route.params.to,
          createdAt: timestamp(),
        });
        if (store.state.uploadCompleted) {
          file.value = null;

          hideCameraBtn.value = false;
          imageCaptured.value = false;
          showCameraModal.value = false;

          disableCamera();
        }
      }
    );

    return {
      store,
      
      file,
      fileError,
    };
  },
};
</script>

<style lang="scss" scoped></style>
