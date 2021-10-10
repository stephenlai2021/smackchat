<template>
  <transition-group
    appear
    enter-active-class="animated zoomIn"
    leave-active-class="animated zoomOut"
  >
    <div class="camera-modal" key="item1">
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
              v-if="videoLoaded"
              class="text-warning"
              icon="eva-close-outline"
              size="md"
              flat
              round
              style="position: absolute; top: 20px; right: 20px"
              @click="cancelCapture"
            />
            <q-btn
              v-if="videoLoaded"
              class="text-warning"
              icon="eva-camera-outline"
              size="lg"
              flat
              round
              style="
                position: absolute;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
              "
              @click="captureImage"
            />
            <!-- <q-btn
              v-if="videoLoaded"
              :disable="hideCameraBtn"
              class="text-warning"
              icon="eva-bulb-outline"
              size="md"
              flat
              round
              style="position: absolute; bottom: 30px; left: 20px"
              @click="flashLight = !flashLight"
            /> -->
            <q-btn
              v-if="videoLoaded && btnSwap"
              :disable="hideCameraBtn"
              class="text-warning"
              icon="eva-swap-outline"
              size="md"
              flat
              round
              style="position: absolute; bottom: 30px; right: 20px"
              @click="frontCamera = !frontCamera"
            />
            <canvas
              v-show="imageCaptured"
              ref="canvas"
              class="full-width"
              height="240"
            />
            <div v-if="imageCaptured" class="constraint text-center q-pa-md">
              <div class="text-white">
                Uploading... {{ store.state.progress }}%
              </div>
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
import { useRoute } from "vue-router";
import { timestamp } from "src/boot/firebase";
import {
  inject,
  ref,
  watch,
  onMounted,
  onBeforeUnmount,
  onBeforeMount,
} from "vue";

export default {
  props: ["file"],
  emits: ["open-cameraModal", "close-cameraModal", "close-menuModal"],
  setup(props, context) {
    const store = inject("store");

    const route = useRoute();

    const video = ref(null);
    const fileNo = ref(0)
    const canvas = ref(null);
    const btnSwap = ref(true);
    const stream = ref(null);
    const imageCaptured = ref(false);
    const flashLight = ref(false);
    const hideCameraBtn = ref(false);
    const hasCameraSupport = ref(true);
    const videoLoaded = ref(false);
    const frontCamera = ref(true);
    const track = ref(null);
    const torch = ref(false);
    const post = ref({
      id: uid(),
      caption: "",
      location: "",
      photo: null,
      createdAt: Date.now(),
    });

    const cancelCapture = () => {
      closeCameraModal();
    };

    onBeforeMount(() => {
      initFrontCamera();
    });

    const closeCameraModal = () => {
      videoLoaded.value = false;
      disableCamera();
      context.emit("close-cameraModal");
    };

    // watch(
    //   () => flashLight.value,
    //   () => {
    //     flashLight.value ? torch.value = true : torch.value = false
    //   }
    // );

    watch(
      () => frontCamera.value,
      () => {
        closeCameraModal();
        context.emit("open-cameraModal");

        if (frontCamera.value) {
          initFrontCamera();
        }
        if (!frontCamera.value) {
          initBackCamera();
        }
      }
    );

    watch(
      () => store.state.url,
      (newVal, oldVal) => {
        store.methods.sendMessage({
          text: store.state.url,
          from: "me",
          image: true,
          to: route.params.to,
          createdAt: timestamp(),
        });
        if (store.state.uploadCompleted) {
          hideCameraBtn.value = false;
          imageCaptured.value = false;

          closeCameraModal();
          context.emit("close-menuModal");

        }
      }
    );

    const initFrontCamera = () => {
      videoLoaded.value = false;

      const supports = navigator.mediaDevices.getSupportedConstraints();
      if (!supports["facingMode"]) {
        alert("This browser does not support facingMode!");
      }

      if (store.state.desktop) {
        btnSwap.value = false;
      }

      const SUPPORTS_MEDIA_DEVICES = "mediaDevices" in navigator;

      if (SUPPORTS_MEDIA_DEVICES) {
        navigator.mediaDevices
          .getUserMedia({
            video: {
              facingMode: "user",
            },
          })
          .then((stream) => {
            video.value.srcObject = stream;

            // const track = stream.getVideoTracks()[0];

            // track.applyConstraints({
            //   advanced: [{ torch: true }],
            // });

            // if (flashLight.value) {
            //   track.applyConstraints({
            //     advanced: [{ torch: true }],
            //   })
            // } else {
            //   track.applyConstraints({
            //     advanced: [{ torch: false }],
            //   })
            // }

            setTimeout(() => {
              videoLoaded.value = true;
            }, 250);
          })
          .catch((err) => {
            hasCameraSupport.value = false;
          });
        // });
      } else {
        console.log("Your browser does not support mediaDevices !");
      }
    };

    const initBackCamera = async () => {
      videoLoaded.value = false;

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
        setTimeout(() => {
          videoLoaded.value = true;
        }, 250);
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

      videoLoaded.value = false;
      imageCaptured.value = true;
      hideCameraBtn.value = true;

      // post.value.photo = dataURItoBlob(canvas.value.toDataURL());
      post.value.photo = dataURItoFile(canvas.value.toDataURL(), `cameraPic${fileNo.value}.jpg`);
      console.log("photo info: ", post.value.photo);
      fileNo.value ++

      store.methods.useStorage2(post.value.photo, "smackchat");
      store.state.progress = null;
    };

    const dataURItoFile = (dataURI, filename) => {

    }

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
      flashLight,
      frontCamera,

      btnSwap,
      captureImage,
      hideCameraBtn,
      imageCaptured,
      cancelCapture,
      videoLoaded,
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
  // background: black;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(8px);
}
</style>
