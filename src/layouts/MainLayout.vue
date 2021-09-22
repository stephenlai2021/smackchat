<template>
  <q-layout view="lHr lpR lFr">
    <q-drawer
      show-if-above
      v-model="store.state.rightDrawerOpen"
      side="right"
      bordered
      class=""
    >
      <div class="q-ma-md">
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi
          ullam nobis omnis dignissimos vitae quisquam a natus sint ipsa
          explicabo debitis expedita optio voluptatem illo sed facilis eos
          suscipit ex, dolorum harum eius. Earum accusamus recusandae et
          inventore nostrum fugit placeat fugiat velit reprehenderit odit harum,
          sunt animi. Aperiam sunt unde tenetur eos, iusto illo perspiciatis
          minima fugit! Ex neque quam quisquam sunt labore eius, fugiat at, quod
          tenetur dolorum voluptate, vitae maiores doloremque nulla a totam est
          molestias minima. Id itaque consequuntur architecto neque inventore,
          quisquam magnam voluptatibus est deleniti officiis iure fuga,
          blanditiis nostrum libero animi veritatis harum.
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi
          ullam nobis omnis dignissimos vitae quisquam a natus sint ipsa
          explicabo debitis expedita optio voluptatem illo sed facilis eos
          suscipit ex, dolorum harum eius. Earum accusamus recusandae et
          inventore nostrum fugit placeat fugiat velit reprehenderit odit harum,
          sunt animi. Aperiam sunt unde tenetur eos, iusto illo perspiciatis
          minima fugit! Ex neque quam quisquam sunt labore eius, fugiat at, quod
          tenetur dolorum voluptate, vitae maiores doloremque nulla a totam est
          molestias minima. Id itaque consequuntur architecto neque inventore,
          quisquam magnam voluptatibus est deleniti officiis iure fuga,
          blanditiis nostrum libero animi veritatis harum.
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi
          ullam nobis omnis dignissimos vitae quisquam a natus sint ipsa
          explicabo debitis expedita optio voluptatem illo sed facilis eos
          suscipit ex, dolorum harum eius. Earum accusamus recusandae et
          inventore nostrum fugit placeat fugiat velit reprehenderit odit harum,
          sunt animi. Aperiam sunt unde tenetur eos, iusto illo perspiciatis
          minima fugit! Ex neque quam quisquam sunt labore eius, fugiat at, quod
          tenetur dolorum voluptate, vitae maiores doloremque nulla a totam est
          molestias minima. Id itaque consequuntur architecto neque inventore,
          quisquam magnam voluptatibus est deleniti officiis iure fuga,
          blanditiis nostrum libero animi veritatis harum.
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi
          ullam nobis omnis dignissimos vitae quisquam a natus sint ipsa
          explicabo debitis expedita optio voluptatem illo sed facilis eos
          suscipit ex, dolorum harum eius. Earum accusamus recusandae et
          inventore nostrum fugit placeat fugiat velit reprehenderit odit harum,
          sunt animi. Aperiam sunt unde tenetur eos, iusto illo perspiciatis
          minima fugit! Ex neque quam quisquam sunt labore eius, fugiat at, quod
          tenetur dolorum voluptate, vitae maiores doloremque nulla a totam est
          molestias minima. Id itaque consequuntur architecto neque inventore,
          quisquam magnam voluptatibus est deleniti officiis iure fuga,
          blanditiis nostrum libero animi veritatis harum.
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi
          ullam nobis omnis dignissimos vitae quisquam a natus sint ipsa
          explicabo debitis expedita optio voluptatem illo sed facilis eos
          suscipit ex, dolorum harum eius. Earum accusamus recusandae et
          inventore nostrum fugit placeat fugiat velit reprehenderit odit harum,
          sunt animi. Aperiam sunt unde tenetur eos, iusto illo perspiciatis
          minima fugit! Ex neque quam quisquam sunt labore eius, fugiat at, quod
          tenetur dolorum voluptate, vitae maiores doloremque nulla a totam est
          molestias minima. Id itaque consequuntur architecto neque inventore,
          quisquam magnam voluptatibus est deleniti officiis iure fuga,
          blanditiis nostrum libero animi veritatis harum.
        </p>
      </div>
    </q-drawer>

    <q-drawer
      v-model="store.state.leftDrawerOpen"
      show-if-above
      bordered
      side="left"
      style="overflow: hidden"
    >
      <div>
        <q-toolbar></q-toolbar>
        <div class="flex row justify-center">
          <div style="position: relative">
            <img
              :src="
                store.state.userDetails.avatar
                  ? store.state.userDetails.avatar
                  : 'https://www.clipartmax.com/png/full/98-984206_profile-photo-facebook-profile-picture-icon.png'
              "
              alt="my avatar"
              style="width: 120px; border-radius: 8px"
            />
            <label class="full-width btn-1" style="cursor: pointer">
              <input class="file-input" type="file" @change="handleChange" />
              <q-icon
                color="green"
                size="md"
                name="eva-camera-outline"
                style="position: absolute; bottom: -8px; right: -13px"
              />
            </label>
          </div>
        </div>
        <div v-if="file" class="row justify-center">
          <div class="output-1 text-center q-mt-sm" style="width: 200px">
            <div v-if="fileError" class="error">{{ fileError }}</div>
            <div>{{ file.name }}</div>
            <div
              class="progress-bar q-mt-sm"
              :style="{ width: store.state.progress + '%' }"
            ></div>
          </div>
        </div>
        <p class="text-center q-mt-sm text-h5 text-grey-6 text-bold">
          {{ store.state.userDetails.name }}
        </p>

        <q-list class="q-mt-lg">
          <span class="q-ml-md text-grey">{{ t("settings") }}</span>
          <q-item>
            <q-item-section avatar>
              <q-icon
                color="white"
                name="dark_mode"
                class="icon"
                style="background: black"
              />
            </q-item-section>

            <q-item-section>{{ t("dark") }}</q-item-section>
            <q-toggle v-model="store.state.darkMode" color="black" />
          </q-item>
          <q-item>
            <q-item-section avatar>
              <q-icon
                color="white"
                name="translate"
                class="icon"
                style="background: #2196f3"
              />
            </q-item-section>

            <q-item-section>{{ t("chinese") }}</q-item-section>
            <q-btn-group flat dense round>
              <q-btn
                label="Eng"
                size="md"
                dense
                flat
                rounded
                @click="locale = 'en-US'"
              />
              <q-btn
                label="Chn"
                size="md"
                dense
                flat
                rounded
                @click="locale = 'zh'"
              />
            </q-btn-group>
          </q-item>
          <q-item
            v-if="store.state.userDetails.online"
            clickable
            v-ripple
            @click="logoutUser"
          >
            <q-item-section avatar>
              <q-icon
                color="white"
                name="logout"
                class="icon"
                style="background: red"
              />
            </q-item-section>

            <q-item-section>{{ t("logout") }}</q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view class="constraint" />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref, computed, inject, watch, watchEffect, onMounted } from "vue";
// import useStorage from "src/composables/useStorage";
import { useRoute, useRouter } from "vue-router";
import { localdb } from "src/boot/localbase";
import { useQuasar } from "quasar";
import { useI18n } from "vue-i18n";

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();

    const $q = useQuasar();

    const { t, locale } = useI18n();
    console.log("locale: ", locale);

    const store = inject("store");

    const online = ref(true);
    const userPage = ref(false);
    const chatPage = ref(false);
    const leftDrawerOpen = ref(null);

    const file = ref(null);
    const fileError = ref(null);

    // allowed file types
    const types = ["image/png", "image/jpeg", "image/jpg"];

    // computed
    const title = computed(() => {
      let currentPath = route.fullPath;
      if (currentPath === "/") return store.state.userDetails.name;
      if (
        currentPath ===
        `/chat/${store.state.userDetails.name}/${route.params.to}`
      )
        return route.params.to;
      if (currentPath === "/auth") return "Smackchat";
      if (currentPath === "/users") return "Chat Room";
      if (currentPath === "/finduser") return "Find User";
      if (currentPath === "/addpost") return "Add Post";
      if (currentPath === "/settings") return "Settings";
      if (currentPath === "/chat") return store.state.user.name;
      return route.params.to;
    });

    /* watch, watchEffect */
    watch(
      () => store.state.darkMode,
      (newVal, oldVal) => {
        localdb.collection("smackchat").doc("darkmode").set({ state: newVal });

        if (store.state.darkMode) {
          $q.dark.set(true);
        }
        if (!store.state.darkMode) {
          $q.dark.set(false);
        }
      }
    );

    const handleChange = (e) => {
      let selected = e.target.files[0];
      console.log("You have selected: ", selected);

      if (selected && types.includes(selected.type)) {
        file.value = selected;
        fileError.value = null;
        store.state.register = true

        store.methods.useStorage(file.value, "smackchat");
      } else {
        file.value = null;
        fileError.value = "Please select an image file (png or jpeg/jpg)";

        $q.notify({
          message: fileError.value,
          color: "purple",
          position: "bottom",
          timeout: 2000,
        });
      }
    };

    watch(
      () => store.state.url,
      (newVal, oldVal) => {
        if (store.state.uploadCompleted) {
          file.value = null;
        }
      }
    );

    watchEffect(() => {
      if (route.fullPath.includes(`/chat/`)) {
        userPage.value = false;
        chatPage.value = true;
      }
      if (!route.fullPath.includes(`/chat/`)) {
        userPage.value = true;
        chatPage.value = false;
      }

      if (route.fullPath.includes("/users")) store.state.tab = "chat";
    });

    // methods
    const logoutUser = () => {
      store.methods.logoutUser();
      if (!store.state.userDetails) {
        router.push("/auth");
      }
    };

    const toggleDark = () => {
      store.state.darkMode.value = !store.state.darkMode.value;

      if (store.state.darkMode.value) {
        $q.dark.set(true);
      }
      if (!store.state.darkMode.value) {
        $q.dark.set(false);
      }
    };

    const toggleLeftDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    };

    const toggleRightDrawer = () => {
      store.state.rightDrawerOpen = !store.state.rightDrawerOpen;
    };

    const checkRoute = () => {
      if (route.fullPath.includes("/addpost")) {
        router.push("/");
      }
      if (
        route.fullPath.includes("/chat") ||
        route.fullPath.includes("/finduser")
      ) {
        router.push("/users");
      }
    };

    // lifecycle
    onMounted(() => {
      localdb
        .collection("smackchat")
        .doc("darkmode")
        .get()
        .then((result) => {
          if (!result) return;

          console.log("darkmode: ", result.state);
          store.state.darkMode = result.state;

          if (store.state.darkMode) {
            $q.dark.set(true);
          }
          if (!store.state.darkMode) {
            $q.dark.set(false);
          }
        });
    });

    return {
      t,
      locale,

      store,
      route,
      router,

      file,
      fileError,

      title,
      online,
      userPage,
      chatPage,
      leftDrawerOpen,

      // methods
      logoutUser,
      toggleDark,
      checkRoute,
      handleChange,
      toggleLeftDrawer,
      toggleRightDrawer,
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
.file-input {
  height: 0;
  width: 0;
  opacity: 0;
}
.spinner {
  width: calc(100vw - 60px);
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.icon {
  border-radius: 50%;
  width: 30px;
  height: 30px;
}
.q-toolbar__title.ellipsis {
  padding-left: 0;
  // font-size: 1rem;
}
.q-toolbar {
  .q-btn {
    line-height: 1.2;
  }
}
.logout-text {
  margin-left: 5px;
}
.q-badge {
  border: 1px solid white;
  top: -2px;
  right: -5px;
  border-radius: 50%;
}
.title {
  border: 1px solid white;
}
.pointer {
  cursor: pointer;
}
</style>
