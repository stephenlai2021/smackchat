<template>
  <div
    class="header bg-white q-px-md q-pb- row justify-between"
    :style="{
      left:
        store.state.leftDrawerOpen && $q.platform.is.desktop ? '250px' : '0px',
      width:
        store.state.leftDrawerOpen &&
        store.state.rightDrawerOpen &&
        $q.platform.is.desktop
          ? 'calc(100% - 315px)'
          : store.state.leftDrawerOpen && $q.platform.is.desktop
          ? 'calc(100% - 250px)'
          : '',
    }"
  >
    <div class="row items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="9.801"
        height="16.683"
        style="cursor: pointer"
        viewBox="0 0 9.801 16.683"
        @click="router.push('/')"
      >
        <g id="left-arrow" transform="translate(111.281 16.683) rotate(180)">
          <g id="Group_86" data-name="Group 86" transform="translate(101.48 0)">
            <path
              id="Path_244"
              data-name="Path 244"
              d="M104.773,8.345,111.014,2.1a.915.915,0,0,0,0-1.29l-.547-.547a.914.914,0,0,0-1.291,0L101.746,7.7a.921.921,0,0,0,0,1.3l7.424,7.424a.914.914,0,0,0,1.291,0l.547-.547a.914.914,0,0,0,0-1.291Z"
              transform="translate(-101.48 0)"
              fill="#a9b5c1"
            />
          </g>
        </g>
      </svg>
    </div>

    <span
      v-if="store.state.otherUser"
      class="text-bold text-secondary row justify-center items-center"
      style="font-size: 20px"
    >
      {{ store.state.otherUser.name }}
    </span>
    <div v-if="store.state.otherUser" class="row justify-center items-center">
      <img
        style="width: 28px; height: 28px; border-radius: 50%; object-fit: cover"
        :src="
          !store.state.otherUser.avatar
            ? '/avatar.png'
            : store.state.otherUser.avatar
        "
        alt="user avatar"
      />
    </div>
  </div>
</template>

<script>
import { inject } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";

export default {
  setup() {
    const store = inject("store");

    const router = useRouter();

    const $q = useQuasar();

    return {
      $q,
      store,
      router,
    };
  },
};
</script>

<style lang="scss" scoped>
* {
  line-height: 0.7;
}
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 500;
  padding-top: 24px;
}
// @media (min-width: 1023px) {
//   .header {
//     left: 250px;
//     width: calc(100% - 315px);
//   }
// }
</style>
