<template>
  <!-- <q-header
    class="bg-transparent"
    style="backdrop-filter: blur(20px); z-index: 500"
  > -->
  <q-header style="z-index: 500" class="bg-transparent">
    <q-toolbar
      class="constraint"
      style="padding: 0; backdrop-filter: blur(20px); position: relative"
    >
      <div class="full-width row justify-between">
        <!-- style="position: relative; z-index: 500" -->
        <q-btn
          flat
          round
          dense
          size="16px"
          icon="eva-arrow-ios-back-outline"
          @click="router.push('/users')"
        />
        <!-- style="font-size: 18px; width: 100%; position: absolute; left: 50%; transform: translateX(-50%);" -->
        <span
          v-if="store.state.otherUser"
          class="text-bold q-ml-sm row justify-center items-center"
          style="font-size: 18px"
        >
          {{ store.state.otherUser.name }}
        </span>
        <div class="row justify-center items-center q-mr-sm">
          <q-avatar v-if="store.state.otherUser">
            <img
              style="width: 30px; height: 30px"
              :src="
                !store.state.otherUser.avatar
                  ? '/avatar.png'
                  : store.state.otherUser.avatar
              "
              alt="user avatar"
            />
          </q-avatar>
        </div>
        <!-- <div class="flex row justify-end full-width">
        <q-btn
          flat
          round
          dense
          icon="eva-pin-outline"
          class="q-mr-sm text-"
          @click="showMapModal"
        />
        <q-btn
          flat
          round
          dense
          icon="eva-video-outline"
          class="q-mr-sm text-"
          @click="showVideoModal"
        />
      </div> -->
      </div>
    </q-toolbar>
  </q-header>
</template>

<script>
import { inject } from "vue";
import { useRoute, useRouter } from "vue-router";

export default {
  setup(props, context) {
    const store = inject("store");

    const route = useRoute();
    const router = useRouter();

    const sendVideochatNotification = () => {
      console.log("notification | page header");
      context.emit("notification");
    };

    const showMapModal = () => {
      console.log("open map modal");
      context.emit("open-mapModal");
    };

    const showVideoModal = () => {
      console.log("open video modal");
      context.emit("open-videoModal");
    };

    return {
      store,
      router,

      showMapModal,
      showVideoModal,
      sendVideochatNotification,
    };
  },
};
</script>

<style lang="scss" scoped></style>
