<template>
  <q-page class="page-chat">
    <div class="row justify-center constraint">
      <video class="remote-video" ref="remoteVideo" autoplay />
      <!-- <div> -->
      <video
        class="local-video"
        ref="localVideo"
        :style="{ border: cameraEnabled ? '2px solid pink' : 'none' }"
        autoplay
      />
      <div
        v-if="cameraEnabled"
        class="row justify-center q-py-xs bg-pink-3"
        style="
          position: fixed;
          left: 0;
          bottom: 0;
          z-index: 500;
          width: 100%;
          opacity: 0.7;
          border-top-left-radius: 30px;
          border-top-right-radius: 30px;
        "
      >
        <q-btn
          round
          dense
          flat
          class="q-mx-md"
          icon="eva-close-outline"
          style="cursor: pointer"
          @click="closeVideoModal"
        />
        <q-btn
          v-if="pause && cameraEnabled"
          round
          dense
          flat
          class="q-mx-md"
          style="opacity: 0.7; cursor: pointer"
          icon="eva-play-circle-outline"
          @click="resumeVideo"
        />
        <q-btn
          v-if="!pause && cameraEnabled"
          dense
          round
          flat
          class="q-mx-md"
          style="cursor: pointer"
          icon="eva-pause-circle-outline"
          @click="pauseVideo"
        />
        <q-btn
          v-if="audioOn && cameraEnabled"
          dense
          round
          flat
          class="q-mx-md"
          style="cursor: pointer"
          icon="eva-volume-up-outline"
          @click="toggleAudio"
        />
        <q-btn
          v-if="!audioOn && cameraEnabled"
          dense
          round
          flat
          class="q-mx-md"
          icon="eva-volume-off-outline"
          style="cursor: pointer; z-index: 500"
          @click="toggleAudio"
        />
        <q-btn
          v-if="!remoteVideoShow"
          rounded
          flat
          class="q-mx-md"
          style="cursor: pointer; z-index: 500"
          @click="call"
          label="Connect"
        />
        <q-btn
          v-if="remoteVideoShow"
          rounded
          flat
          class="q-mx-md"
          style="cursor: pointer; z-index: 500"
          label="Disconnet"
          @click="hangUp"
        />
      </div>
    </div>
    <!-- </div> -->
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
    // const remoteStream = ref(null);
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

          call.answer(localStream.value);

          call.on("stream", (remoteStream) => {
            remoteVideo.value.srcObject = remoteStream;
            remoteVideoShow.value = true;

            const vw = remoteVideo.value.width;
            const vh = remoteVideo.value.height;

            console.log("video width: ", vw);
            console.log("video height: ", vh);
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

        const vw = remoteVideo.value.width;
        const vh = remoteVideo.value.height;

        console.log("video width: ", vw);
        console.log("video height: ", vh);
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

    // watch(
    //   () => cameraEnabled.value,
    //   () => {
    //     if (cameraEnabled.value) {
    //       const vw = localVideo.value.width;
    //       const vh = localVideo.value.height;

    //       console.log("video width: ", vw);
    //       console.log("video height: ", vh);
    //     }
    //   }
    // );

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
  z-index: 600;
  background: black;
}
.local-video {
  position: fixed;
  top: 5%;
  right: 5%;
  width: 30%;
  border-radius: 10px;
}
.remote-video {
  height: 100vh;
}
</style>
