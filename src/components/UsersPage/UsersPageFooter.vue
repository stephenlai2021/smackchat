<template>
   <q-footer class="footer bg-secondary">
      <!-- <div class="constraint"> -->
        <q-tabs
          v-model="store.state.tab"
          no-caps
          class="row justify-evenly text-white"
        >
          <q-tab
            name="home"
            :label="t('posts')"
            icon="eva-home-outline"
            style="width: 50%"
            @click="router.push('/')"
          />
          <q-tab
            name="chat"
            :label="t('chat')"
            icon="eva-message-circle-outline"
            style="width: 50%"
            @click="router.push('/users')"
          />
          <!-- <q-btn
            flat
            name="setting"
            class="text-"
            icon="eva-settings-2-outline"
            style="width: 20%"
            @click="toggleLeftDrawer"
          /> -->
        </q-tabs>
      <!-- </div> -->
    </q-footer>
</template>

<script>
import { inject } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

export default {
  setup() {
    const store = inject("store");

    const { t, locale } = useI18n();

    const router = useRouter();

    return {
      t,
      locale,
      store,
      router,
    };
  },
};
</script>

<style lang="scss" scoped>
.footer {
  // opacity: 0.7;
  z-index: 500;
  height: 70px;
}
</style>
