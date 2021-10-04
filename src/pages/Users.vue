<template>
  <q-page>
    <q-header reveal style="z-index: 600">
      <q-toolbar class="constraint">
        <span class="text-bold q-ml-sm" style="font-size: 20px; width: 100%">
          {{ t("chatRoom") }}
        </span>
        <div class="flex row justify-end full-width">
          <q-btn
            round
            dense
            flat
            size="md"
            icon="eva-pin-outline"
            @click="showUsersMapModal = true"
          />
        </div>
      </q-toolbar>
    </q-header>

    <usersmap-modal
      v-if="showUsersMapModal"
      @close-usersMapModal="showUsersMapModal = false"
    />

    <div class="full-width q-pa-sm" style="display: inline-block">
      <q-input
        v-model="search"
        standout
        :label="t('searchUser')"
        dense
        class="q-mb-"
      >
        <template v-slot:prepend>
          <q-icon
            name="eva-search-outline"
            class="q-ml-sm"
            @click="findUser"
            style="cursor: pointer"
          />
        </template>
      </q-input>
    </div>

    <div style="overflow-x: auto; overflow-y: hidden; white-space: nowrap">
      <q-btn
        round
        color="grey"
        class="q-ml-md text-red"
        size="15px"
        icon="eva-plus-outline"
       
        @click="router.push('/finduser')"
      />
      <div
        @click="goChat(user)"
        v-for="(user, index) in matchingUsers"
        :key="index"
        style="display: inline-block"
        class="flex row q-ml-md q-my-sm"
      >
        <q-avatar size="45px" style="position: relative; cursor: pointer">
          <img
            :src="user.avatar"
            alt="user avatar"
            :style="{
              border: user.online ? '2px solid #e6ee9c' : '2px solid #e0e0e0',
            }"
          />
          <q-badge
            rounded
            class="float-right"
            style="position: absolute; left: 32px; top: 32px"
            :style="{ background: user.online ? '#dcedc8' : '#e0e0e0' }"
          />
        </q-avatar>
        <!-- <div class="flex">
          <span
            style="
              white-space: break-spaces;
              word-wrap: break-word;
              height: 21px;
              width: 50px;
              text-align: center;
            "
          >
            {{
              user.name.split(" ")[0].length > 6
                ? user.name.split(" ")[0].substring(6, 0) + "."
                : user.name.split(" ")[0]
            }}
          </span>
        </div> -->
      </div>
    </div>

    <div class="spinner" v-if="!store.state.users.length && !noUserMessages">
      <q-spinner-ios color="primary" size="3em" />
    </div>

    <div
      v-else-if="!store.state.users.length && noUserMessages"
      class="spinner"
    >
      <p class="text-center text-h6 text-primary border">
        Sorry, we can't find any user in database, please try again later !
      </p>
    </div>

    <q-list v-else class="full-width q-mt">
      <q-item
        v-for="(user, index) in matchingUsers"
        :key="index"
        clickable
        v-ripple
        class="q-my-xs"
        @click="goChat(user)"
      >
        <q-item-section avatar>
          <q-avatar size="55px" style="position: relative">
            <img
              :src="user.avatar"
              alt="user avatar"
              :style="{
                border: user.online ? '2px solid #e6ee9c' : '2px solid #e0e0e0',
              }"
            />
          </q-avatar>
          <q-badge
            rounded
            class="float-right"
            style="position: absolute; left: 57px; top: 50px"
            :style="{ background: user.online ? '#e6ee9c' : '#e0e0e0' }"
          />
        </q-item-section>

        <q-item-section>
          <q-item-label class="text-subtitle2">{{ user.name }}</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-badge
            class="q-pa-xs"
            :style="{ background: user.online ? '#e6ee9c' : '#e0e0e0' }"
          >
            <span class="text-primary">
              {{ user.online ? t("online") : t("offline") }}
            </span>
          </q-badge>
        </q-item-section>
      </q-item>
    </q-list>

    <!-- <q-btn
      round
      color="orange"
      icon="eva-person-add-outline"
      style="
        position: fixed;
        right: 16px;
        bottom: 65px;
        z-index: 500;
        backdrop-filter: blur(20px);
      "
      @click="router.push('/finduser')"
    /> -->
    <q-footer style="z-index: 500" reveal>
      <div class="constraint">
        <q-tabs
          v-model="store.state.tab"
          inline-label
          no-caps
          class="flex row justify-evenly full-width"
        >
          <q-tab
            name="home"
            :label="t('posts')"
            class="text-"
            icon="eva-home-outline"
            style="width: 33.3%"
            @click="router.push('/')"
          />
          <q-tab
            name="chat"
            class="text-"
            :label="t('chat')"
            icon="eva-message-circle-outline"
            style="width: 33.3%"
            @click="router.push('/users')"
          />
          <q-btn
          flat
            class="text-"
            icon="eva-settings-2-outline"
            style="width: 33.3%"
            @click="toggleLeftDrawer"
          />
        </q-tabs>
      </div>
    </q-footer>
  </q-page>
</template>

<script>
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import {
  ref,
  onMounted,
  onBeforeMount,
  computed,
  inject,
  watch,
  watchEffect,
} from "vue";

export default {
  components: {
    "usersmap-modal": require("components/ChatPage/UsersMapModal.vue").default,
  },
  setup() {
    const store = inject("store");

    const router = useRouter();

    const { t, locale } = useI18n();

    const search = ref("");
    const noUserMessages = ref(false);
    const showUsersMapModal = ref(false);

    // methods
    const toggleLeftDrawer = () => {
      store.state.leftDrawerOpen = !store.state.leftDrawerOpen;
    };

    const findUser = () => {
      console.log("search: ", search.value);
      store.getters.filteredUsers().filter((user) => {
        return user.name.includes(search.value);
      });
    };

    const goChat = (user) => {
      store.state.online = user.online;
      store.state.user = user;
      store.state.avatar = user.avatar;

      // store.state.otherUserId = user.userId
      // console.log('otherUserId | Users: ', store.state.otherUserId)

      router.push(`/chat/${store.state.userDetails.name}/${user.name}`);
    };

    const matchingUsers = computed(() => {
      return store.getters.filteredUsers().filter((user) => {
        return user.name.includes(
          search.value
          // search.value.toLowerCase() || search.value.toUpperCase()
        );
      });
    });

    // watch
    watchEffect(() => {
      console.log("all users | watch: ", store.state.users);

      setTimeout(() => {
        if (!store.state.users.length) {
          noUserMessages.value = true;
        }
      }, 10000);
    });

    onMounted(() => {
      // store.state.tab = 'users'
      setTimeout(() => {
        if (!store.state.users.length) {
          noUserMessages.value = true;

          router.push("/auth");
        }
      }, 10000);
    });

    return {
      // i18n
      t,
      locale,

      store,
      router,

      // ref
      search,
      noUserMessages,
      showUsersMapModal,

      // computed
      matchingUsers,

      // methods
      goChat,
      findUser,
      toggleLeftDrawer,
    };
  },
};
</script>

<style lang="scss" scoped>
.spinner {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  z-index: 500;
  height: cal(100vh -98px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
}
</style>
