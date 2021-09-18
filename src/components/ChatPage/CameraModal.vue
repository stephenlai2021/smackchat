<template>
  <transition-group
    appear
    enter-active-class="animated slideInUp"
    leave-active-class="animated slideOutDown"
  >
    <!-- <div v-if="showCameraModal" class="camera-modal"> -->
    <div class="camera-modal">
      <div class="constraint" style="height: 100vh">
        <div class="full-width camera-panel">
          <div style="width: 100%; position: relative">
            <video
              v-show="!imageCaptured"
              ref="video"
              autoplay
              style="width: 100%"
            />
            <q-btn
              v-if="showCaptureBtn"
              color="red"
              icon="eva-close-outline"
              size="md"
              round
              style="position: absolute; top: 20px; right: 20px; opacity: 0.5"
              @click="cancelCapture"
            />
            <q-btn
              v-if="showCaptureBtn"
              color="blue"
              icon="eva-camera-outline"
              size="lg"
              round
              style="
                position: absolute;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                opacity: 0.5;
              "
              @click="captureImage"
            />
            <q-btn
              v-if="showCaptureBtn && btnSwap"
              :disable="hideCameraBtn"
              color="amber-8"
              icon="eva-swap-outline"
              size="md"
              round
              style="
                position: absolute;
                bottom: 30px;
                right: 20px;
                opacity: 0.5;
              "
              @click="frontCamera = !frontCamera"
            />
            <canvas
              v-show="imageCaptured"
              ref="canvas"
              class="full-width"
              height="240"
            />
            <div v-if="imageCaptured" class="constraint text-center q-pa-md">
              <div>Uploading... {{ store.state.progress }}%</div>
              <div
                class="progress-bar"
                :style="{ width: store.state.progress + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition-group>
</template>

<script>
import { uid } from "quasar";
import { inject, ref, watch, onMounted, onBeforeUnmount } from "vue";

export default {
  setup(props, context) {
    const store = inject("store");

    const video = ref(null);
    const canvas = ref(null);
    const btnSwap = ref(true);
    const stream = ref(null);
    const imageCaptured = ref(false);
    const hideCameraBtn = ref(false);
    const hasCameraSupport = ref(true);
    const showCaptureBtn = ref(false);
    // const showCameraModal = ref(false);
    const frontCamera = ref(true);
    const post = ref({
      id: uid(),
      caption: "",
      location: "",
      photo: null,
      createdAt: Date.now(),
    });

    const cancelCapture = () => {
      // showCameraModal.value = false;
      closeCameraModal()
      context.emit('close-cameraModal')
      // disableCamera();
    };

    onMounted(() => {
      initFrontCamera();

      if (store.state.desktop) {
        btnSwap.value = false;
      }
    });

    // const openCameraModal = () => {
    //   showCameraModal.value = true;
    //   initFrontCamera();

    //   if (store.state.desktop) {
    //     btnSwap.value = false;
    //   }
    // };

    const closeCameraModal = () => {
      showCaptureBtn.value = false;
      // showCameraModal.value = false;
      disableCamera();
    };

    watch(
      () => frontCamera.value,
      () => {
        closeCameraModal();
        showCameraModal.value = true;

        if (frontCamera.value) {
          initFrontCamera();
        }
        if (!frontCamera.value) {
          initBackCamera();
        }
      }
    );

    const initFrontCamera = () => {
      showCaptureBtn.value = false;

      const supports = navigator.mediaDevices.getSupportedConstraints();
      if (!supports["facingMode"]) {
        alert("This browser does not support facingMode!");
      }

      if (store.state.desktop) {
        btnSwap.value = false;
      }

      navigator.mediaDevices
        .getUserMedia({
          video: {
            facingMode: "user",
          },
        })
        .then((stream) => {
          video.value.srcObject = stream;
          showCaptureBtn.value = true;
        })
        .catch((err) => {
          hasCameraSupport.value = false;
        });
    };

    const initBackCamera = async () => {
      showCaptureBtn.value = false;

      const supports = navigator.mediaDevices.getSupportedConstraints();
      if (!supports["facingMode"]) {
        alert("This browser does not support facingMode!");
      }

      try {
        stream.value = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { exact: "environment" },
          },
        });

        video.value.srcObject = stream.value;
        showCaptureBtn.value = true;
      } catch (err) {
        hasCameraSupport.value = false;
      }
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

      showCaptureBtn.value = false;
      imageCaptured.value = true;
      hideCameraBtn.value = true;

      post.value.photo = dataURItoBlob(canvas.value.toDataURL());
      console.log("photo info: ", post.value.photo);

      store.methods.useStorage2(post.value.photo, "smackchat");
      store.state.progress = null;
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
      if (video.value) {
        video.value.srcObject.getVideoTracks().forEach((track) => {
          track.stop();
        });
      }
    };

    onBeforeUnmount(() => {
      closeCameraModal();
    });

    return {
      store,

      video,
      canvas,
      frontCamera,

      btnSwap,
      captureImage,
      hideCameraBtn,
      imageCaptured,
      cancelCapture,
      showCaptureBtn,
    };
  },
};
</script>

<style lang="scss" scoped>
.progress-bar {
  display: block;
  height: 6px;
  background: #69f0ae;
  border-radius: 6px;
  margin-top: 20px;
  transition: width 0.3s ease;
}
.camera-panel {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.camera-frame {
  border: 2px solid grey;
  border-radius: 10px;
}
.camera-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 600;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
}
</style>
