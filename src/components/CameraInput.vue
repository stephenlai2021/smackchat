<template>
  <div class="camera-frame" style="width: 320px; padding: 10px">
    <video
      v-show="!imageCaptured"
      ref="video"
      autoplay
      style="width: 100%; border-radius: 5px"
    />
    <canvas
      v-show="imageCaptured"
      ref="canvas"
      class="full-width"
      height="240"
    />

    <div class="text-center q-pa-md">
      <q-btn
        color="grey-10"
        icon="eva-camera"
        size="md"
        round
        @click="captureImage"
      />
      <div class="row justify-between q-mt-md">
        <q-btn round icon="eva-cloud-upload-outline" @click="uploadImage" />
        <q-btn-group rounded>
          <q-btn @click="initCamera" icon="eva-video-outline" />
          <q-btn @click="disableCamera" icon="eva-video-off-outline" />
        </q-btn-group>
      </div>
    </div>
  </div>
</template>

<script>
require("md-gum-polyfill");
import { uid } from "quasar";
import ProgressBar from "./ProgressBar.vue";
import { ref, onMounted, onBeforeUnmount, inject } from "vue";

export default {
  components: { ProgressBar },
  setup() {
    const store = inject("store");

    const post = ref({
      id: uid(),
      caption: "",
      location: "",
      photo: null,
      createdAt: Date.now(),
    });

    const video = ref(null);
    const canvas = ref(null);
    const imageCaptured = ref(false);
    const hideCameraBtn = ref(false);
    const hasCameraSupport = ref(true);
    const cameraDisabled = ref(false);

    const initCamera = () => {
      navigator.mediaDevices
        .getUserMedia({
          video: true,
        })
        .then((stream) => {
          video.value.srcObject = stream;
        })
        .catch((err) => {
          hasCameraSupport.value = false;
        });
    };

    const captureImage = () => {
      canvas.value.width = video.value.getBoundingClientRect().width;
      canvas.value.height = video.value.getBoundingClientRect().height;

      let context = canvas.value.getContext("2d");
      context.drawImage(
        video.value,
        0,
        0,
        canvas.value.width,
        canvas.value.height
      );

      imageCaptured.value = true;
      hideCameraBtn.value = true;

      post.value.photo = dataURItoBlob(canvas.value.toDataURL());
      console.log("photo info: ", post.value.photo);

      // disableCamera()
    };

    const uploadImage = () => {
      store.methods.useStorage(post.value.photo, "images");

      hideCameraBtn.value = false;
      imageCaptured.value = false;
    };

    const dataURItoBlob = (dataURI) => {
      const byteString = atob(dataURI.split(",")[1]);

      const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

      const ab = new ArrayBuffer(byteString.length);

      const ia = new Uint8Array(ab);

      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      const blob = new Blob([ab], { type: mimeString });
      return blob;
    };

    const disableCamera = () => {
      video.value.srcObject.getVideoTracks().forEach((track) => {
        track.stop();
      });

      hideCameraBtn.value = true;
    };

    onBeforeUnmount(() => {
      disableCamera();
    });

    onMounted(() => {
      initCamera();
    });

    return {
      store,

      // ref
      post,
      video,
      canvas,
      imageCaptured,
      hideCameraBtn,
      cameraDisabled,
      hasCameraSupport,

      // methods
      initCamera,
      uploadImage,
      captureImage,
      disableCamera,
    };
  },
};
</script>

<style lang="scss" scoped>
.camera-frame {
  border: 2px solid grey;
  border-radius: 10px;
}
</style>
