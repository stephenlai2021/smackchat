<template>
  <!-- <q-header
    class="bg-transparent"
    style="backdrop-filter: blur(20px); z-index: 500"
  > -->
  <q-header style="z-index: 500">
    <q-toolbar
      class="constraint"
      style="padding: 0; backdrop-filter: blur(8px)"
    >
      <q-btn
        round
        flat
        size="18px"
        style="position: relative; z-index: 500"
        icon="eva-arrow-ios-back-outline"
        @click="router.push('/users')"
      />
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
      <span
        class="text- text-bold q-ml-sm"
        style="font-size: 18px; width: 100%"
        color=""
        v-if="store.state.otherUser"
      >
        {{ store.state.otherUser.name }}
      </span>
      <div class="flex row justify-end full-width">
        <q-btn
          flat
          round
          dense
          icon="eva-pin-outline"
          class="q-mr-xs text-"
          @click="showMapModal"
        />
        <q-btn
          flat
          round
          dense
          icon="eva-video-outline"
          class="q-mr-sm text-"
          @click="sendVideochatNotification"
        />
        <!-- @click="showVideoModal" -->
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
      console.log('notification | page header')
      context.emit('notification')
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
