<template>
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
          @click="showMapModal"
        />
        <q-btn
          round
          dense
          color="green"
          size="md"
          icon="eva-phone-outline"
          class="q-mr-md"
          @click="showVideoModal"
        />
      </div>
    </q-toolbar>
  </q-header>
</template>

<script>
import { inject } from 'vue'
import { useRouter } from 'vue-router'

export default {
  setup(props, context) {
    const store = inject('store')

    const router = useRouter()

    const showMapModal = () => {
      console.log('open map modal')
      context.emit('open-mapModal')
    }

    const showVideoModal = () => {
      console.log('open video modal')
      context.emit('open-videoModal')
    }

    return {
      store,
      router,

      showMapModal,
      showVideoModal,
    }
  }
};
</script>

<style lang="scss" scoped></style>
