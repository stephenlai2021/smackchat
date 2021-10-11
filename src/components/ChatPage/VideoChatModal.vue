<template>
  <q-page class="page-chat bg-dark">
    <div class="row justify-center">
      <div class="remote-video-container constraint" style="position: relative">
        <video
          class="remote-video"
          ref="remoteVideo"
          id="remoteVideo"
          autoplay
        />
        <q-btn
          v-if="!remoteVideoShow"
          rounded
          dense
          size="xl"
          color="pink-3"
          style="
            cursor: pointer;
            z-index: 500;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          "
          icon="leak_add"
          @click="call"
        />
      </div>
      <div class="local-video-container" style="position: relative">
        <div v-if="!cameraEnabled" class="icon-localvideo">
          <img :src="store.state.userDetatils ? store.state.userDetatils.avatar : null" alt="user avatar">
        </div>
        <div class="position: relative;">
          <video class="local-video" ref="localVideo" autoplay />
          <div
            class="row justify-center full-width"
            style="position: absolute; bottom: 20px;"
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
            <q-btn
              v-if="remoteVideoShow && !btnHangup"
              rounded
              dense
              color="pink-3"
              style="cursor: pointer; z-index: 500"
              icon="leak_remove"
              @click="hangUp"
            />
          </div>
        </div>
      </div>
      <div v-if="cameraEnabled" class="row justify-around control-panel">
        <q-btn
          round
          dense
          color="pink-3"
          class=""
          icon="eva-close-outline"
          style="cursor: pointer"
          @click="closeVideoModal"
        />
      </div>
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
    const localVideoShow = ref(false);
    const closeRemoteVideo = ref(false);
    const btnHangup = ref(false);

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
      btnHangup.value = true;
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

          // localVideoShow.value = true;
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

      console.log('user avatar: ', store.state.userDetails)
    });

    return {
      store,

      myId,
      idInput,
      btnHangup,
      remoteStream,
      cameraEnabled,
      localVideoShow,
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
// .remote-video-container,
.local-video-container {
  border: 1px solid pink;
  display: flex;
  justify-content: center;
  align-items: center;
}
.local-video,
.remote-video {
  width: 100vw;
  height: 50vh;
}
// @media (orientation: portrait) {
//   .remote-video-container,
//   .local-video-container {
//     position: relative;
//     height: 50vh;
//     width: 100vw;
//   }
//   .local-video,
//   .remote-video {
//     height: 100%;
//     width: 100%;
//   }
//   .control-panel {
//     position: fixed;
//     top: 50%;
//     transform: translateY(-50%);
//     z-index: 500;
//     min-width: 360px;
//     opacity: 0.8;
//     border-radius: 30px;
//   }
// }
// @media (orientation: landscape) {
//   .remote-video-container,
//   .local-video-container {
//     position: relative;
//     width: 50vw;
//     height: 100vh;
//     border: 1px solid pink;
//   }
//   .local-video,
//   .remote-video {
//     width: 100%;
//     height: 100%;
//   }
//   .control-panel {
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     align-items: center;
//     position: fixed;
//     top: 50%;
//     left: 50%;
//     transform: translate(-50%, -50%);
//     z-index: 500;
//     opacity: 0.7;
//     min-height: 360px;
//     border-radius: 30px;
//   }
// }
</style>
