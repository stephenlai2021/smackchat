<template>
  <q-layout view="lHr lpR lFr">
    <q-header class="bg-white" reveal style="border-bottom: 1px solid #eeeeee">
      <q-toolbar class="constraint">
        <!-- <q-avatar
          v-if="
            !route.fullPath.includes('/users') &&
            !route.fullPath.includes('/finduser') &&
            !route.fullPath.includes('/addpost') &&
            !route.fullPath.includes('/settings') &&
            !route.fullPath.includes('/chat')
          "
        >
          <img
            style="width: 30px; height: 30px"
            :src="
              !store.state.userDetails.avatar
                ? 'https://www.clipartmax.com/png/full/98-984206_profile-photo-facebook-profile-picture-icon.png'
                : store.state.userDetails.avatar
            "
            alt="user avatar"
            @click="toggleLeftDrawer"
          />
        </q-avatar>

        <q-btn
          round
          dense
          flat
          color="primary"
          size="18px"
          icon="eva-arrow-ios-back-outline"
          @click="checkRoute"
          v-if="
            route.fullPath.includes('/chat') ||
            route.fullPath.includes('/addpost') ||
            route.fullPath.includes('/finduser')
          "
          class="pointer"
        />
        <span
          class="text-primary text-bold"
          style="font-size: 18px; width: 100%"
        >
          {{ title }}
        </span>
        <div class="flex row justify-end full-width">
          <q-icon
            name="eva-person-add-outline"
            size="sm"
            @click="router.push('/finduser')"
            class="pointer"
            color="primary"
            v-if="route.fullPath.includes('/users')"
          />
          <q-icon
            name="eva-edit-2-outline"
            size="sm"
            color="primary"
            @click="router.push('/addpost')"
            class="q-mr-md pointer"
            v-if="
              !route.fullPath.includes('/users') &&
              !route.fullPath.includes('/finduser') &&
              !route.fullPath.includes('/addpost') &&
              !route.fullPath.includes('/settings') &&
              !route.fullPath.includes('/chat') &&
              !route.fullPath.includes('/auth')
            "
          />
          <q-icon
            name="eva-settings-2-outline"
            size="sm"
            color="primary"
            @click="toggleLeftDrawer"
            class="justify-end pointer"
            v-if="
              !route.fullPath.includes('/users') &&
              !route.fullPath.includes('/finduser') &&
              !route.fullPath.includes('/addpost') &&
              !route.fullPath.includes('/settings') &&
              !route.fullPath.includes('/chat') &&
              !route.fullPath.includes('/auth')
            "
          />
          <q-icon
            name="eva-pin-outline"
            size="sm"
            color="primary"
            class="justify-end pointer q-mr-md"
            v-if="route.fullPath.includes('/chat')"
          />
          <q-icon
            name="eva-camera-outline"
            size="sm"
            color="primary"
            class="justify-end pointer"
            v-if="route.fullPath.includes('/chat')"
          />
        </div> -->
      </q-toolbar>
    </q-header>

    <q-drawer
      show-if-above
      v-model="store.state.rightDrawerOpen"
      side="right"
      bordered
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
      class="bg-grey-1"
      style="overflow: hidden"
    >
      <div>
        <q-toolbar></q-toolbar>
        <div class="flex row justify-center">
          <img
            :src="
              store.state.userDetails.avatar
                ? store.state.userDetails.avatar
                : 'https://www.clipartmax.com/png/full/98-984206_profile-photo-facebook-profile-picture-icon.png'
            "
            alt="my avatar"
            style="width: 90px; border-radius: 50%"
          />
        </div>
        <p class="text-center q-mt-sm text-h5 text-bold">
          {{ store.state.userDetails.name }}
        </p>

        <q-list class="q-mt-md">
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
            <q-toggle v-model="store.state.dark" color="black" />
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
             <q-toggle v-model="store.state.chinese" color="blue" />
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
            clickable
            v-ripple
            @click="
              !store.state.online
                ? router.push('/auth')
                : store.methods.logoutUser()
            "
            v-if="store.state.online"
          >
            <q-item-section avatar>
              <q-icon
                color="white"
                :name="!store.state.online ? 'login' : 'logout'"
                class="icon"
                style="background: red"
              />
            </q-item-section>

            <q-item-section>{{
              !store.state.online ? "" : t("logout")
            }}</q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-drawer>

    <!-- <q-footer
      class="bg-white constraint"
      reveal
      style="border-top: 1px solid #eeeeee"
      v-if="
        !route.fullPath.includes('/auth') &&
        !route.fullPath.includes('/finduser') &&
        !route.fullPath.includes('/addpost')
      "
    >
      <q-tabs
        v-model="store.state.tab"
        no-caps
        class="flex row justify-evenly full-width text-primary"
      >
        <q-tab
          name="home"
          icon="eva-home-outline"
          style="width: 50%"
          @click="router.push('/')"
        />
        <q-tab
          name="chat"
          icon="eva-message-circle-outline"
          style="width: 50%"
          @click="router.push('/users')"
        />
      </q-tabs>
    </q-footer> -->

    <q-page-container>
      <router-view class="constraint" />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref, computed, inject, watch, watchEffect, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { localdb } from "src/boot/localbase";
import { useI18n } from "vue-i18n";

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();

    const { t, locale } = useI18n();

    const store = inject("store");

    const userPage = ref(false);
    const chatPage = ref(false);
    const online = ref(true);
    const leftDrawerOpen = ref(null);

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

    // methods
    const toggleLeftDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    };

    const toggleRightDrawer = () => {
      store.state.rightDrawerOpen = !store.state.rightDrawerOpen;
    };

    const sayHi = () => {
      console.log("hi");
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

    // watch
    watch(
      () => leftDrawerOpen.value,
      (newVal, oldVal) => {
        console.log("left drawer open state: ", newVal);

        localdb
          .collection("leftDrawerOpen")
          .doc("imessenger")
          .set({ state: newVal });
      }
    );

    watch(
      () => store.state.chinese,
      (newVal, oldVal) => {
        console.log("is chinese ? ", newVal);
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

      // if (store.state.chinese) { locale = 'zh' }
      // if (!store.state.chinese) { locale = 'en-US' }
    });

    // lifecycle
    onMounted(() => {
      localdb
        .collection("leftDrawerOpen")
        .doc("imessenger")
        .get()
        .then((result) => {
          console.log("left open drawer state | onMounted ", result.state);
          leftDrawerOpen.value = result.state;
        });

      console.log(
        "left drawer open state: | main layout: ",
        leftDrawerOpen.value
      );
    });

    return {
      t,
      locale,

      store,
      route,
      router,

      title,
      online,
      userPage,
      chatPage,
      leftDrawerOpen,

      checkRoute,
      toggleLeftDrawer,
      toggleRightDrawer,
      sayHi,
    };
  },
};
</script>

<style lang="scss" scoped>
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
