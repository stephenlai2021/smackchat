<template>
  <q-page class="page-chat">
    <q-header
      class="bg-transparent"
      style="backdrop-filter: blur(20px); z-index: 500"
    >
      <q-toolbar
        class="constraint"
        style="padding: 0; backdrop-filter: blur(8px)"
      >
        <q-btn
          round
          flat
          color="white"
          size="18px"
          class=""
          style="position: relative; z-index: 500"
          icon="eva-arrow-ios-back-outline"
          @click="router.push('/users')"
        />
        <span
          class="text-white text-bold"
          style="font-size: 18px; width: 100%"
          color=""
          v-if="store.state.otherUser"
        >
          {{ store.state.otherUser.name }}
        </span>
        <div class="flex row justify-end full-width">
          <q-btn
            round
            dense
            color="blue"
            size="md"
            icon="eva-pin-outline"
            class="q-mr-md"
            @click="showMapModal = true"
          />
          <q-btn
            round
            dense
            color="green"
            size="md"
            icon="eva-phone-outline"
            class="q-mr-md"
            @click="call"
          />
        </div>
      </q-toolbar>
    </q-header>
  
    <chat-messages />

    <!-- <image-modal v-if="file" :file="file" @close-imageModal="file = null" /> -->
    <image-modal v-if="file" @close-imageModal="file = null" />

    <map-modal v-if="showMapModal" @close-mapmodal="showMapModal = false" />

    <!-- Camera Modal -->
    <camera-modal v-if="showCameraModal" @close-cameraModal="showCameraModal = false" @open-cameraModal="showCameraModal = true" />

    <!-- <transition-group
      appear
      enter-active-class="animated zoomIn"
      leave-active-class="animated zoomOut"
    >
      <div v-if="showCameraModal" class="camera-modal">
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
                  class="progress-bar q-mt-md"
                  :style="{ width: store.state.progress + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition-group> -->
    <!-- End of Camera Modal -->

    <q-footer class="bg-transparent footer" style="backdrop-filter: blur(20px)">
      <q-form class="flex constraint" :class="{ 'q-mx-sm': inputFocus }">
        <q-btn-group
          v-if="!inputFocus"
          flat
          round
          class="flex row justify-evenly"
          style="width: 50%"
        >
          <label class="q-ma-md" style="cursor: pointer">
            <input class="file-input" type="file" @change="handleChange" />
            <q-icon color="green-12" size="md" name="eva-image-outline" />
          </label>
          <q-icon
            size="md"
            class="q-ma-md"
            color="green-12"
            style="cursor: pointer"
            name="eva-camera-outline"
            @click="showCameraModal = true"
          />
            <!-- @click="openCameraModal" -->
          <q-btn
            round
            size="16px"
            flat
            class="q-ma-sm"
            ref="btnEmoji"
            color="green-12"
            icon="eva-smiling-face-outline"
            @click="showEmojiPicker"
          />
        </q-btn-group>

        <div style="width: 50%" :style="{ width: inputFocus ? '100%' : '50%' }">
          <q-input
            ref="input"
            v-model="newMessage"
            class="q-px-md q-py-sm full-width"
            outlined
            rounded
            :label="t('message')"
            dense
            focus="false"
            bg-color=""
            @keydown.enter="sendMessage"
            @keyup="sendTypingIndicator()"
            @focus="onFocus"
            @blur="onBlur"
            :style="{ width: inputFocus ? '100%' : '50%' }"
          >
            <template v-slot:prepend v-if="inputFocus">
              <q-btn
                icon="navigate_next"
                size="md"
                dense
                flat
                color="primary"
                @click="inputFocus = false"
              />
            </template>
            <template v-slot:append>
              <q-btn
                icon="eva-navigation-2-outline"
                :color="inputFocus ? 'primary' : 'grey-6'"
                size="md"
                dense
                flat
                @click="sendMessage"
              />
            </template>
          </q-input>
        </div>
      </q-form>
    </q-footer>
  </q-page>
</template>

<script>
import { useI18n } from "vue-i18n";
import { useQuasar, uid } from "quasar";
import { timestamp } from "src/boot/firebase";
import { formatDistanceToNow } from "date-fns";
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted, onBeforeUnmount, inject, watch } from "vue";
import { EmojiButton } from "@joeattardi/emoji-button";

export default {
  components: {
    "map-modal": require("components/ChatPage/MapModal.vue").default,
    "video-modal": require("components/ChatPage/VideoModal.vue").default,
    "image-modal": require("components/ChatPage/ImageModal.vue").default,
    "camera-modal": require("components/ChatPage/CameraModal.vue").default,
    "chat-messages": require("components/ChatPage/ChatMessages.vue").default,
  },
  setup() {
    const $q = useQuasar();

    const store = inject("store");

    const { t, locale } = useI18n();

    const route = useRoute();
    const router = useRouter();

    const chats = ref(null);
    const input = ref(null);

    const desktop = ref(false);
    const newMessage = ref("");
    const indicator = ref(false);
    const inputFocus = ref(false);
    const showMessages = ref(false);
    const to = ref({});
    const showMapModal = ref(false)

    /****************/
    /* Video Button */
    /****************/

    /* Enod of Video Button */

    /****************/
    /* Camera Button */
    /****************/
    // const video = ref(null);
    // const canvas = ref(null);
    // const btnSwap = ref(true);
    // const stream = ref(null);
    // const imageCaptured = ref(false);
    // const hideCameraBtn = ref(false);
    // const hasCameraSupport = ref(true);
    // const cameraDisabled = ref(false);
    // const showCaptureBtn = ref(false);
    // const showMapModal = ref(false);
    const showCameraModal = ref(false);
    // const frontCamera = ref(true);
    // const post = ref({
    //   id: uid(),
    //   caption: "",
    //   location: "",
    //   photo: null,
    //   createdAt: Date.now(),
    // });

    // const cancelCapture = () => {
    //   showCameraModal.value = false;
    //   disableCamera();
    // };

    // const openCameraModal = () => {
    //   showCameraModal.value = true;
    //   initFrontCamera();

    //   if (store.state.desktop) {
    //     btnSwap.value = false;
    //   }
    // };

    // const closeCameraModal = () => {
    //   showCaptureBtn.value = false;
    //   showCameraModal.value = false;
    //   disableCamera();
    // };

    // watch(
    //   () => frontCamera.value,
    //   () => {
    //     closeCameraModal();
    //     showCameraModal.value = true;

    //     if (frontCamera.value) {
    //       initFrontCamera();
    //     }
    //     if (!frontCamera.value) {
    //       initBackCamera();
    //     }
    //   }
    // );

    // const initFrontCamera = () => {
    //   showCaptureBtn.value = false;

    //   const supports = navigator.mediaDevices.getSupportedConstraints();
    //   if (!supports["facingMode"]) {
    //     alert("This browser does not support facingMode!");
    //   }

    //   if (store.state.desktop) {
    //     btnSwap.value = false;
    //   }

    //   navigator.mediaDevices
    //     .getUserMedia({
    //       video: {
    //         facingMode: "user",
    //       },
    //     })
    //     .then((stream) => {
    //       video.value.srcObject = stream;
    //       showCaptureBtn.value = true;
    //     })
    //     .catch((err) => {
    //       hasCameraSupport.value = false;
    //     });
    // };

    // const initBackCamera = async () => {
    //   showCaptureBtn.value = false;

    //   const supports = navigator.mediaDevices.getSupportedConstraints();
    //   if (!supports["facingMode"]) {
    //     alert("This browser does not support facingMode!");
    //   }

    //   try {
    //     stream.value = await navigator.mediaDevices.getUserMedia({
    //       video: {
    //         facingMode: { exact: "environment" },
    //       },
    //     });

    //     video.value.srcObject = stream.value;
    //     showCaptureBtn.value = true;
    //   } catch (err) {
    //     hasCameraSupport.value = false;
    //   }
    // };

    // const captureImage = () => {
    //   canvas.value.width = video.value.getBoundingClientRect().width;
    //   canvas.value.height = video.value.getBoundingClientRect().height;

    //   let context = canvas.value.getContext("2d");
    //   context.drawImage(
    //     video.value,
    //     0,
    //     0,
    //     canvas.value.width,
    //     canvas.value.height
    //   );

    //   showCaptureBtn.value = false;
    //   imageCaptured.value = true;
    //   hideCameraBtn.value = true;

    //   post.value.photo = dataURItoBlob(canvas.value.toDataURL());
    //   console.log("photo info: ", post.value.photo);

    //   store.methods.useStorage2(post.value.photo, "smackchat");
    //   store.state.progress = null;
    // };

    // const dataURItoBlob = (dataURI) => {
    //   const byteString = atob(dataURI.split(",")[1]);

    //   const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

    //   const ab = new ArrayBuffer(byteString.length);

    //   const ia = new Uint8Array(ab);

    //   for (var i = 0; i < byteString.length; i++) {
    //     ia[i] = byteString.charCodeAt(i);
    //   }

    //   const blob = new Blob([ab], { type: mimeString });
    //   return blob;
    // };

    // const disableCamera = () => {
    //   if (video.value) {
    //     video.value.srcObject.getVideoTracks().forEach((track) => {
    //       track.stop();
    //     });
    //   }
    // };

    // onBeforeUnmount(() => {
    //   closeCameraModal();
    // });
    /************************/
    /* End of Camera Button */
    /************************/

    /***************/
    /* Image Button */
    /***************/
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

    // watch(
    //   () => store.state.url,
    //   (newVal, oldVal) => {
    //     store.methods.sendMessage({
    //       text: store.state.url,
    //       from: "me",
    //       to: route.params.to,
    //       createdAt: timestamp(),
    //     });
    //     if (store.state.uploadCompleted) {
    //       file.value = null;

    //       // hideCameraBtn.value = false;
    //       // imageCaptured.value = false;
    //       // showCameraModal.value = false;

    //       // disableCamera();
    //     }
    //   }
    // );
    /***********************/
    /* End of Image Button */
    /***********************/

    /***************/
    /* Emoji Modal */
    /***************/
    const btnEmoji = ref(null);
    const picker = ref(null);

    picker.value = new EmojiButton();

    picker.value.on("emoji", (selection) => {
      newMessage.value += selection.emoji;
    });

    const showEmojiPicker = () => {
      picker.value.togglePicker(btnEmoji.value);
    };
    /***********************/
    /* End of Emoji Modal */
    /***********************/

    watch(
      () => indicator.value,
      (newVal, oldVal) => {
        store.methods.getTypingIndicator(route.params.from, route.params.to);
      }
    );

    watch(
      () => [store.state.typing.typing, store.state.messages],
      (newVal, oldVal) => {
        if (store.state.typing.typing) {
          $q.notify({
            message: (store.state.messages[0].from = "me"
              ? store.state.otherUser.name + "Typing..."
              : store.state.userDetails.name + "Typing..."),
            color: "purple",
            position: "top",
            timeout: 1000,
          });
        }
      }
    );

    const call = () => {};

    const sendTypingIndicator = () => {
      indicator.value = true;

      store.methods.sendTypingIndicator({
        from: "me",
        to: route.params.to,
      });
    };

    const sendMessage = () => {
      if (newMessage.value === "") return;

      store.methods.sendMessage({
        text: newMessage.value,
        from: "me",
        to: route.params.to,
        createdAt: timestamp(),
      });

      newMessage.value = "";

      inputFocus.value = false;
    };

    const onFocus = () => {
      if (!store.state.desktop) {
        inputFocus.value = true;
      }
    };

    const onBlur = () => {
      if (!store.state.desktop) {
        inputFocus.value = false;
      }
    };

    onMounted(() => {
      store.methods.getMessages(route.params.from, route.params.to);
      store.methods.getOnlineStatus(route.params.to);
      store.methods.getToday();

      if ($q.platform.is.desktop) {
        console.log("you are running on desktop | chat page");
        store.state.desktop = true;
      } else {
        console.log("you are not running on desktop | chat page");
        store.state.desktop = false;
      }

      store.methods.getUser(route.params.to);

      if (store.state.otherUser) {
        console.log("getUser | Chat: ", store.state.otherUser);
      }
    });

    return {
      t,
      locale,

      store,
      route,
      router,

      to,
      file,
      chats,
      input,
      desktop,
      btnEmoji,
      indicator,
      fileError,
      inputFocus,
      showCameraModal,

      /* map */
      showMapModal,

      /* camera */
      // post,
      // video,
      // canvas,
      // btnSwap,
      // frontCamera,
      // imageCaptured,
      // cancelCapture,
      // hideCameraBtn,
      // cameraDisabled,
      // showCaptureBtn,
      showCameraModal,
      // hasCameraSupport,

      // methods
      call,
      onBlur,
      onFocus,
      newMessage,
      sendMessage,
      showMessages,
      handleChange,
      showEmojiPicker,
      sendTypingIndicator,
      formatDistanceToNow,

      /* camera */
      // captureImage,
      // disableCamera,
      // openCameraModal,
      // closeCameraModal,
      /* end of camera */
    };
  },
};
</script>

<style lang="scss" scoped>
.btn-mapBack {
  position: fixed;
  left: 50%;
  transform: translate(-50%);
  top: 10px;
  z-index: 500;
}
#map {
  position: fixed;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 500;
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
// .progress-bar {
//   display: block;
//   height: 6px;
//   background: #69f0ae;
//   border-radius: 6px;
//   margin-top: 20px;
//   transition: width 0.3s ease;
// }
// .image-modal {
//   position: fixed;
//   bottom: 64px;
//   left: 50%;
//   transform: translateX(-50%);
//   width: 100%;
//   background: rgba(0, 0, 0, 0.8);
//   backdrop-filter: blur(8px);
// }
.footer {
  z-index: 300;
}
.camera-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 500;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
}
.progress-bar {
  display: block;
  height: 6px;
  background: #5ad8d2;
  // padding: 20px;
  border-radius: 6px;
  // margin-top: 10px;
  transition: width 0.3s ease;
}
.file-input {
  height: 0;
  width: 0;
  opacity: 0;
}
.q-toolbar {
  padding-right: 0;
}
.banner {
  position: fixed;
  width: 100%;
  opacity: 80%;
  z-index: 500;
  text-align: center;
  padding-left: -300px;
}
.page-chat {
  overflow: hidden;
  &:after {
    content: "";
    display: block;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 0;
    opacity: 0.1;
    background-image: radial-gradient(
        circle at 100% 150%,
        silver 24%,
        white 24%,
        white 28%,
        silver 28%,
        silver 36%,
        white 36%,
        white 40%,
        transparent 40%,
        transparent
      ),
      radial-gradient(
        circle at 0 150%,
        silver 24%,
        white 24%,
        white 28%,
        silver 28%,
        silver 36%,
        white 36%,
        white 40%,
        transparent 40%,
        transparent
      ),
      radial-gradient(
        circle at 50% 100%,
        white 10%,
        silver 10%,
        silver 23%,
        white 23%,
        white 30%,
        silver 30%,
        silver 43%,
        white 43%,
        white 50%,
        silver 50%,
        silver 63%,
        white 63%,
        white 71%,
        transparent 71%,
        transparent
      ),
      radial-gradient(
        circle at 100% 50%,
        white 5%,
        silver 5%,
        silver 15%,
        white 15%,
        white 20%,
        silver 20%,
        silver 29%,
        white 29%,
        white 34%,
        silver 34%,
        silver 44%,
        white 44%,
        white 49%,
        transparent 49%,
        transparent
      ),
      radial-gradient(
        circle at 0 50%,
        white 5%,
        silver 5%,
        silver 15%,
        white 15%,
        white 20%,
        silver 20%,
        silver 29%,
        white 29%,
        white 34%,
        silver 34%,
        silver 44%,
        white 44%,
        white 49%,
        transparent 49%,
        transparent
      );
    background-size: 100px 50px;
  }
}
</style>
