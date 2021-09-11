<template>
  <q-page class="flex q-pa-md">
    <q-header class="bg-white" reveal style="border-bottom: 1px solid #eeeeee">
      <q-toolbar class="constraint">
        <q-avatar>
          <img
            style="width: 30px; height: 30px"
            :src="
              !store.state.userDetails.avatar
                ? 'https://www.clipartmax.com/png/full/98-984206_profile-photo-facebook-profile-picture-icon.png'
                : store.state.userDetails.avatar
            "
            alt="user avatar"
          />
        </q-avatar>
        <div class="flex row justify-end full-width">
          <q-btn
            round
            dense
            flat
            color="primary"
            size="md"
            icon="eva-settings-2-outline"
            @click="store.methods.toggleLeftDrawer()"
          />
        </div>
      </q-toolbar>
    </q-header>
    <div class="spinner" v-if="store.state.login">
      <q-spinner-ios color="primary" size="3em" />
    </div>
    <q-card v-else class="full-width">
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="login" :label="t('login')" />
        <q-tab name="register" :label="t('register')" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="login">
          <login-register :tab="tab" />
        </q-tab-panel>

        <q-tab-panel name="register">
          <login-register :tab="tab" />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script>
import { ref, inject } from "vue";
import { useI18n } from "vue-i18n";

export default {
  components: {
    "login-register": require("components/LoginRegister.vue").default,
  },
  setup() {
    const store = inject("store");

    const { t, locale } = useI18n();

    const tab = ref("login");

    return {
      t,
      locale,
      store,
      tab,
    };
  },
};
</script>

<style lang="scss" scoped>
.spinner {
  width: 100vw;
  height: calc(100vh - 50px);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
