<template>
  <q-page class="page-chat">
    <p class="q-mt-md text-center text-bold" style="font-size: 16px">
      My ID: <br />
      {{ myId }}
    </p>
    <div class="row justify-center q-mx-sm">
      <q-input
        v-model="idInput"
        label="Please paste peer id here ..."
        style="width: 600px"
      >
        <template v-slot:append>
          <q-btn
            round
            dense
            @click="call"
            color="green"
            icon="eva-phone-outline"
          />
        </template>
      </q-input>
    </div>
    <div class="row justify-center q-my-lg">
      <div style="position: relative" class="q-mx-sm">
        <video class="local-video" ref="localVideo" autoplay />
        <video class="remote-video" ref="remoteVideo" autoplay />
        <div
          class="row justify-center"
          style="position: absolute; bottom: 30px; left: 0; width: 100%"
        >
          <q-btn
            dense
            v-if="pause && cameraEnabled"
            round
            color="grey"
            class="q-mx-sm"
            style="opacity: 0.7"
            icon="eva-play-circle-outline"
            @click="resumeVideo"
          />
          <q-btn
            dense
            v-if="!pause && cameraEnabled"
            round
            color="grey"
            class="q-mx-sm"
            style="opacity: 0.7"
            icon="eva-pause-circle-outline"
            @click="pauseVideo"
          />
          <!-- <q-btn
            dense
            v-if="videoOn"
            round
            color="grey"
            class="q-mx-sm"
            style="opacity: 0.7"
            icon="eva-video-outline"
            @click="toggleVideo"
          />
          <q-btn
            dense
            v-else
            round
            color="grey"
            class="q-mx-sm"
            style="opacity: 0.7"
            icon="eva-video-off-outline"
            @click="toggleVideo"
          /> -->
          <q-btn
            dense
            v-if="audioOn && cameraEnabled"
            round
            color="grey"
            class="q-mx-sm"
            style="opacity: 0.7"
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
            style="opacity: 0.7"
            @click="toggleAudio"
          />
          <q-btn
            dense
            round
            color="red"
            style="opacity: 0.7"
            class="q-mx-sm"
            icon="eva-phone-off-outline"
            @click="hangUp"
          />
        </div>
      </div>
    </div>
    <q-btn
      round
      dense
      size="md"
      class="bg-red-3"
      icon="eva-close-outline"
      style="
        position: fixed;
        left: 50%;
        transform: translate(-50%);
        bottom: 20px;
        z-index: 700;
      "
      @click="closeVideoModal"
    />
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

    // connect to Peer server
    const peer = new Peer();

    // get a random id assigned by Peer server
    peer.on("open", (id) => {
      myId.value = id;
      store.state.peerId = id;
    });

    const closeVideoModal = () => {
      context.emit("close-videoModal");
    };

    peer.on("call", (call) => {
      $q.dialog({
        title: "Confirm",
        message: "Would you like to answer this call ?",
        cancel: true,
        persistent: true,
      })
        .onOk(() => {
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
    };

    const call = () => {
      // const call = peer.call(idInput.value, localStream.value);
      const call = peer.call(store.state.otherUser.peerId, localStream.value);

      remoteVideoShow.value = true;

      call.on("stream", (remoteStream) => {
        remoteVideo.value.srcObject = remoteStream;
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
  max-width: 700px;
  margin: auto;
  // border: 1px solid;
}
.remote-video {
  width: 100%;
  min-height: 300px;
  border: 1px solid;
}
.local-video {
  width: 100px;
  // height: 100px;
  border: 1px solid white;
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 500;
}
</style>
