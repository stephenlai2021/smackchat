<template>
  <q-form @submit="submitForm">
      <!-- v-if="tab === 'register'" -->
    <q-input
      class="q-mb-md"
      outlined
      v-model="name"
      :label="t('name')"
      required
      placeholder="Please enter user name"
    />
    <q-input
      class="q-mb-md"
      outlined
      v-model="email"
      type="email"
      :label="t('email')"
      placeholder="Please enter user email"
    />
    <q-input
      class="q-mb-md"
      outlined
      v-model="password"
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
  <p>{{ name }}</p>
  <p>{{ email }}</p>
  <p>{{ password }}</p>
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

    const name = ref("me");
    const email = ref("me@test.com");
    const password = ref("123456");

    // const peerId = ref(null);

    // allowed file types
    const types = ["image/png", "image/jpeg", "image/jpg"];

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

        const data = {
          name: name.value,
          email: email.value,
          password: password.value,
          peerId: null,
          geolocation: {
            lat: lat.value,
            lng: lng.value,
          },
        };

        store.methods.loginUser(data);

        if (store.state.successMessage === "user login successfully") {
          store.state.login = false;
          router.push("/");
        }
      }
      if (props.tab === "register") {
        const data = {
          name: name.value,
          email: email.value,
          password: password.value,
          avatar: store.state.url,
          // peerId: peerId.value,
          peerId: null,
          geolocation: {
            lat: lat.value,
            lng: lng.value,
          },
        };
        store.methods.registerUser(data);

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
          console.log("geolocation | loginRegister", pos);
        });
      } else {
        console.log("Your browser does not support map features");
      }

      // const peer = new Peer();
      // peer.on("open", (id) => {
      //   peerId.value = id;
      //   console.log("peer id: ", peerId.value);
      // });
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
      // formData,

      name,
      email,
      password,

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
