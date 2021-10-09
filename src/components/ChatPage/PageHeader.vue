<template>
  <q-header style="z-index: 500" class="bg-transparent">
    <q-toolbar
      class="constraint"
      style="padding: 0; backdrop-filter: blur(20px); position: relative"
    >
      <div class="full-width row justify-between">
        <q-btn
          flat
          round
          dense
          size="16px"
          icon="eva-arrow-ios-back-outline"
          @click="router.push('/users')"
        />
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
      </div>
    </q-toolbar>
  </q-header>
</template>

<script>
import { inject } from "vue";
import { useRouter } from "vue-router";

export default {
  setup() {
    const store = inject("store");

    const router = useRouter();

    return {
      store,
      router,
    };
  },
};
</script>

<style lang="scss" scoped></style>
