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
      <div class="output-2 text-center">
        <p v-if="file">{{ file.name }}</p>
        <div v-if="fileError" class="error">{{ fileError }}</div>
        <q-linear-progress
          v-if="file"
          class="q-mt-sm"
          color="primary"
          :value="store.state.progress"
        />
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
import { ref, inject, watch, watchEffect } from "vue";
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

    // allowed file types
    const types = ["image/png", "image/jpeg", "image/jpg"];

    const formData = ref({
      name: "me",
      email: "me@test.com",
      password: "123456",
    });

    // watch
    watch(
      () => file.value,
      (newVal, oldVal) => {
        console.log("You have selected: ", newVal);

        if (file.value && types.includes(file.value.type)) {
          console.log("file name: ", file.value.name);

          fileError.value = null;
          store.methods.useStorage(file.value, "smackchat");
        } else {
          file.value = null;
          fileError.value = "Please select an image file (png or jpeg/jpg)";
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
        store.methods.loginUser(formData.value);

        if (store.state.successMessage === "user login successfully") {
          store.state.login = false;
          router.push("/");
        }
      }
      if (props.tab === "register") {
        formData.value = { ...formData.value, avatar: store.state.url }
        // formData.value = {
        //   name: "me",
        //   email: "me@test.com",
        //   password: "123456",
        //   avatar: store.state.url,
        // };
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

<style lang="scss" scoped></style>
