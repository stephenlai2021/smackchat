<template>
  <q-page class="page-chat">
    <div class="row justify-center">
      <!-- <div style="position: relative" class="q-mx-"> -->
      <video class="remote-video" ref="remoteVideo" autoplay />
      <video class="local-video" ref="localVideo" autoplay />
      <div
      class="row justify-center"
        style="
          position: fixed;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          z-index: 500;
        "
      >
        <q-btn
          round
          dense
          class="bg-red-3 q-mx-lg"
          icon="eva-close-outline"
          style="cursor: pointer; "
          @click="closeVideoModal"
        />
        <q-btn
          round
          dense
          v-if="pause && cameraEnabled"
          color="grey"
          class="q-mx-sm"
          style="opacity: 0.7; cursor: pointer; "
          icon="eva-play-circle-outline"
          @click="resumeVideo"
        />
        <q-btn
          dense
          v-if="!pause && cameraEnabled"
          round
          color="grey"
          class="q-mx-sm"
          style="opacity: 0.7; cursor: pointer; "
          icon="eva-pause-circle-outline"
          @click="pauseVideo"
        />
        <q-btn
          dense
          v-if="audioOn && cameraEnabled"
          round
          color="grey"
          class="q-mx-sm"
          style="opacity: 0.7; cursor: pointer; "
          icon="eva-volume-up-outline"
          @click="toggleAudio"
        />
        <q-btn
          dense
          v-if="!audioOn && cameraEnabled"
          round
          color="grey"
          class="q-mx-sm"
          icon="eva-volume-off-outline"
          style="opacity: 0.7; cursor: pointer; z-index: 500"
          @click="toggleAudio"
        />
        <q-btn
          v-if="!remoteVideoShow"
          round
          dense
          class="q-mx-lg"
          style="cursor: pointer; z-index: 500"
          @click="call"
          color="green"
          icon="eva-phone-outline"
        />
        <q-btn
          v-if="remoteVideoShow"
          dense
          round
          color="red"
          class="q-mx-sm"
          icon="eva-phone-off-outline"
          style="opacity: 0.7; cursor: pointer; z-index: 500"
          @click="hangUp"
        />
      </div>
      <!-- </div> -->
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
    const videoOn = ref(false);
    const audioOn = ref(false);
    const pause = ref(false);
    const cameraEnabled = ref(false);
    const remoteVideoShow = ref(false);
    const closeRemoteVideo = ref(false);

    const peer = new Peer();

    peer.on("open", (id) => {
      store.methods.savePeerId(id);
    });

    const closeVideoModal = () => {
      context.emit("close-videoModal");
    };

    peer.on("call", (call) => {
      $q.dialog({
        title: "Confirm",
        message: "Incoming call from " + store.state.otherUser.name,
        cancel: true,
        persistent: true,
      })
        .onOk(() => {
          context.emit("open-videoModal");
          remoteVideoShow.value = true;

          call.answer(localStream.value);

          call.on("stream", (remoteStream) => {
            remoteVideo.value.srcObject = remoteStream;
          });
        })
        .onCancel(() => {
          console.log(">>>> Cancel");
        });
    });

    const hangUp = () => {
      console.log("close connection");
      peer.destroy();
      closeRemoteVideo.value = true;
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
    });

    return {
      store,

      myId,
      idInput,
      cameraEnabled,
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
.page-chat {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  // max-width: 700px;
  z-index: 600;
  // margin: auto;
  // border: 1px solid;
  background: black;
}
.remote-video {
  width: 100%;
  // min-height: 300px;
  height: 50vh;
  // border: 1px solid;
}
.local-video {
  // width: 100px;
  width: 100%;
  height: 50vh;
  // height: 100px;
  // border: 1px solid white;
  // position: absolute;
  // top: 10px;
  // right: 10px;
  // z-index: 500;
}
</style>
