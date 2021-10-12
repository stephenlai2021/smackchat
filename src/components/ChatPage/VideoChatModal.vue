<template>
  <q-page class="page-chat bg-dark">
    <div class="row justify-center constraint">
      <div class="remote-video-container">
        <div style="position: relative">
          <video
            class="remote-video"
            ref="remoteVideo"
            id="remoteVideo"
            autoplay
          />
          <div
            style="
              width: 100px;
              cursor: pointer;
              z-index: 500;
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            "
          >
            <q-img
              v-if="!remoteVideoShow && store.state.otherUser"
              :src="store.state.otherUser.avatar"
              spinner-color="white"
            />
            <div
              class="block text-center"
              style="margin-top: -20px; opacity: 0.7"
            >
              <q-btn
                v-if="!remoteVideoShow"
                rounded
                dense
                size=""
                color="pink-3"
                icon="eva-phone-outline"
                @click="call"
              />
            </div>
          </div>
            <!-- v-if="remoteVideoShow && !btnHangup" -->
          <q-btn
            v-if="remoteVideoShow"
            rounded
            dense
            class="btn-hangup"
            color="pink-3"
            icon="eva-phone-off-outline"
            @click="hangUp"
          />
        </div>
      </div>

      <div class="local-video-container">
        <div style="position: relative">
          <div
            style="
              width: 100px;
              cursor: pointer;
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              z-index: -50;
            "
          >
            <q-img
              v-if="!localVideoShow && store.state.userDetails"
              :src="store.state.userDetails.avatar"
              spinner-color="white"
            />
          </div>
          <div class="position: relative; z-index: 200;">
            <video class="local-video" ref="localVideo" autoplay />
            <div
              class="row justify-center full-width"
              style="position: absolute; bottom: 20px"
            >
              <q-btn
                v-if="pause && cameraEnabled"
                round
                dense
                color="pink-3"
                class="q-mx-md"
                style="opacity: 0.7; cursor: pointer"
                icon="eva-play-circle-outline"
                @click="resumeVideo"
              />
              <q-btn
                v-if="!pause && cameraEnabled"
                dense
                round
                color="pink-3"
                class="q-mx-md"
                style="opacity: 0.7; cursor: pointer"
                icon="eva-pause-circle-outline"
                @click="pauseVideo"
              />
              <q-btn
                v-if="audioOn && cameraEnabled"
                dense
                round
                color="pink-3"
                class="q-mx-md"
                style="opacity: 0.7; cursor: pointer"
                icon="eva-volume-up-outline"
                @click="toggleAudio"
              />
              <q-btn
                v-if="!audioOn && cameraEnabled"
                dense
                round
                color="pink-3"
                class="q-mx-md"
                icon="eva-volume-off-outline"
                style="opacity: 0.7; cursor: pointer; z-index: 500"
                @click="toggleAudio"
              />
            </div>
          </div>
        </div>
      </div>
      <q-btn
        v-if="cameraEnabled"
        flat
        round
        dense
        size="lg"
        color="pink-3"
        class="btn-close"
        icon="eva-close-outline"
        style="cursor: pointer"
        @click="closeVideoModal"
      />
    </div>
  </q-page>
</template>

<script>
import { useQuasar } from "quasar";
import { db } from "src/boot/firebase";
import { ref, onMounted, onBeforeUnmount, watch, inject } from "vue";

export default {
  setup(props, context) {
    const $q = useQuasar();

    const store = inject("store");

    console.log($q.dark.isActive);
    console.log($q.dark.mode);

    const idInput = ref("");
    const myId = ref("");
    const localVideo = ref(null);
    const remoteVideo = ref(null);
    const localStream = ref(null);
    const remoteStream = ref(null);
    const videoOn = ref(false);
    const audioOn = ref(false);
    const pause = ref(false);
    const cameraEnabled = ref(false);
    const remoteVideoShow = ref(false);
    const closeRemoteVideo = ref(false);
    // const btnHangup = ref(false);

    const peer = new Peer();

    peer.on("open", (id) => {
      store.methods.savePeerId(id);
    });

    const closeVideoModal = () => {
      context.emit("close-videoModal");
    };

    peer.on("call", (call) => {
      // $q.dialog({
      //   title: "Confirm",
      //   message: `Incoming call from <strong>${store.state.otherUser.name}</strong>`,
      //   dark: true,
      //   cancel: true,
      //   persistent: true,
      //   html: true,
      // })
      //   .onOk(() => {
      //     context.emit("open-videoModal");

      //     call.answer(localStream.value);

      //     call.on("stream", (remoteStream) => {
      //       remoteVideo.value.srcObject = remoteStream;
      //       remoteVideoShow.value = true;
      //     });
      //   })
      //   .onCancel(() => {
      //     console.log(">>>> Cancel");
      //   });
      context.emit("open-videoModal");

      call.answer(localStream.value);

      call.on("stream", (remoteStream) => {
        remoteVideo.value.srcObject = remoteStream;
        remoteVideoShow.value = true;
      });
    });

    const hangUp = () => {
      console.log("close connection");
      peer.destroy();
      closeRemoteVideo.value = true;
      // btnHangup.value = true;
    };

    const call = () => {
      console.log("making call to ", store.state.otherUser.name);
      const call = peer.call(store.state.otherUser.peerId, localStream.value);

      call.on("stream", (remoteStream) => {
        remoteVideo.value.srcObject = remoteStream;
        remoteVideoShow.value = true;
      });
    };

    const pauseVideo = () => {
      console.log("pause video");

      pause.value = true;

      localVideo.value.srcObject.getTracks().forEach((track) => {
        track.enabled = false;
      });
    };

    const resumeVideo = () => {
      console.log("resume video");

      pause.value = false;

      localVideo.value.srcObject.getTracks().forEach((track) => {
        track.enabled = true;
      });
    };

    const toggleVideo = () => {
      console.log("toggle video");
      videoOn.value = !videoOn.value;

      if (videoOn.value) {
        openCamera();
      }

      if (!videoOn.value) {
        closeCamera();
      }

      console.log("video on: ", videoOn.value);
    };

    const toggleAudio = () => {
      audioOn.value = !audioOn.value;

      if (audioOn.value) {
        openAudio();
      }

      if (!audioOn.value) {
        closeAudio();
      }

      console.log("video on: ", videoOn.value);
    };

    const openCamera = () => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          localVideo.value.srcObject = localStream.value = stream;

          cameraEnabled.value = true;
          videoOn.value = true;
          audioOn.value = true;

          console.log("local stream: ", stream);
        });
    };

    const closeCamera = () => {
      localVideo.value.srcObject.getTracks().forEach((track) => {
        track.stop();

        cameraEnabled.value = false;
      });
    };

    const openAudio = () => {
      localVideo.value.srcObject.getAudioTracks().forEach((track) => {
        track.enabled = true;
      });
    };

    const closeAudio = () => {
      localVideo.value.srcObject.getAudioTracks().forEach((track) => {
        track.enabled = false;
      });
    };

    onBeforeUnmount(() => {
      peer.destroy();
      closeCamera();
    });

    onMounted(() => {
      openCamera();

      console.log("user avatar: ", store.state.userDetails);
    });

    return {
      store,

      myId,
      idInput,
      // btnHangup,
      remoteStream,
      cameraEnabled,
      // localVideoShow,
      remoteVideoShow,

      call,
      pause,
      hangUp,
      videoOn,
      audioOn,
      localVideo,

      openCamera,
      pauseVideo,
      remoteVideo,
      toggleVideo,
      resumeVideo,
      toggleAudio,
      closeVideoModal,
    };
  },
};
</script>

<style lang="scss" scoped>
.btn-hangup {
  cursor: pointer;
  z-index: 500;
  position: absolute;
  left: 20px;
  bottom: 20px;
  opacity: 0.7;
}
.btn-close {
  cursor: pointer;
  z-index: 500;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.icon-localvideo {
  position: absolute;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.page-chat {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 600;
}
.remote-video-container,
.local-video-container {
  // border: 1px solid pink;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 50vh;
}
.local-video,
.remote-video {
  width: 100vw;
  height: 50vh;
}
// @media (orientation: portrait) {
//   .remote-video-container,
//   .local-video-container {
//     width: 100%;
//     height: 50vh;
//   }
//   .local-video,
//   .remote-video {
//     width: 100vw;
//     height: 50vh;
//   }
// }
@media (orientation: landscape) {
  .remote-video-container,
  .local-video-container {
    width: 50%;
    height: 100vh;
  }
  .local-video,
  .remote-video {
    width: 100%;
    height: 100%;
  }
}
</style>
