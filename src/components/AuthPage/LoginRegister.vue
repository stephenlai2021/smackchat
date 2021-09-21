<template>
  <q-form @submit="submitForm">
    <q-input
      v-if="tab === 'register'"
      class="q-mb-md"
      outlined
      v-model="formData.name"
      :label="t('name')"
      required
    />
    <q-input
      class="q-mb-md"
      outlined
      v-model="formData.email"
      type="email"
      :label="t('email')"
    />
    <q-input
      class="q-mb-md"
      outlined
      v-model="formData.password"
      type="password"
      :label="t('password')"
    />
    <div v-if="tab === 'register'">
      <q-file outlined class="full-width" v-model="file" label="Uplaod Image">
        <template v-slot:prepend>
          <q-icon name="attach_file" />
        </template>
      </q-file>
      <div v-if="file" class="output-2 text-center">
        <p>{{ file.name }}</p>
        <div v-if="fileError" class="error">{{ fileError }}</div>
        <!-- <q-linear-progress
          v-if="file"
          class="q-mt-sm"
          color="primary"
          :value="store.state.progress"
        /> -->
        <div
          class="progress-bar q-mt-sm"
          :style="{ width: store.state.progress + '%' }"
        ></div>
      </div>
    </div>
    <p style="color: red">{{ store.state.errorMessage }}</p>
    <div class="row justify-end">
      <q-btn
        color="secondary"
        :label="t('reset')"
        class="q-mr-sm"
        @click="resetData"
      />
      <q-btn
        color="primary"
        :label="tab === 'register' ? t('register') : t('login')"
        type="submit"
      />
    </div>
  </q-form>
</template>

<script>
import { ref, inject, watch, watchEffect, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";

export default {
  props: ["tab"],
  setup(props) {
    const store = inject("store");

    const { t, locale } = useI18n();

    const route = useRoute();
    const router = useRouter();

    const file = ref(null);
    const fileError = ref(null);

    const lat = ref(null);
    const lng = ref(null);

    const peerId = ref(null);

    // allowed file types
    const types = ["image/png", "image/jpeg", "image/jpg"];

    const formData = ref({
      name: "me",
      email: "me@test.com",
      password: "123456",
      lat: null,
      lng: null,
    });

    watch(
      () => file.value,
      (newVal, oldVal) => {
        console.log("You have selected: ", newVal);

        if (file.value && types.includes(file.value.type)) {
          console.log("file name: ", file.value.name);

          fileError.value = null;
          store.state.register = false;
          store.methods.useStorage(file.value, "smackchat");
        } else {
          file.value = null;
          // fileError.value = "Please select an image file (png or jpeg/jpg)";
        }
      }
    );

    watch(
      () => store.state.url,
      (newVal, oldVal) => {
        if (store.state.uploadCompleted) {
          file.value = null;
        }
      }
    );

    watchEffect(() => {
      if (store.state.progress === 100) {
        file.value = null;
      }
    });

    // methods
    const submitForm = () => {
      if (props.tab === "login") {
        store.state.login = true;

        console.log("latitude: ", lat.value);
        console.log("longitude: ", lng.value);

        formData.value = {
          ...formData.value,
          lat: lat.value,
          lng: lng.value,
          peerId: peerId.value,
        };
        store.methods.loginUser(formData.value);
        console.log("login: ", formData.value);

        if (store.state.successMessage === "user login successfully") {
          store.state.login = false;
          router.push("/");
        }
      }
      if (props.tab === "register") {
        formData.value = {
          ...formData.value,
          avatar: store.state.url,
          lat: lat.value,
          lng: lng.value,
          peerId: peerId.value,
        };
        store.methods.registerUser(formData.value);

        if (store.state.successMessage === "user register successfully") {
          router.push("/");
        }
      }
    };

    const resetData = () => {
      formData.value = "";
      store.state.errorMessage = "";
    };

    onMounted(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          lat.value = pos.coords.latitude;
          lng.value = pos.coords.longitude;
        });
      } else {
        console.log("Your browser does not support map features");
      }

      // connect to Peer server
      const peer = new Peer();

      // get a random id assigned by Peer server
      peer.on("open", (id) => {
        peerId.value = id;
        // store.state.peerId = id;
      });
    });

    return {
      // i18n
      t,
      locale,

      // others
      store,

      // ref
      file,
      fileError,
      formData,

      // methods
      submitForm,
      resetData,
    };
  },
};
</script>

<style lang="scss" scoped>
.progress-bar {
  display: block;
  height: 6px;
  background: #5ad8d2;
  // padding: 20px;
  border-radius: 6px;
  // margin-top: 10px;
  transition: width 0.3s ease;
}
</style>
