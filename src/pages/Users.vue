<template>
  <div class="page-users">
    <userspage-header @openUsersMapModal="showUsersMapModal = true" />

    <usersmap-modal
      v-if="showUsersMapModal"
      @close-usersMapModal="showUsersMapModal = false"
    />

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

    <q-list v-else class="full-width q-mt-sm users-list">
      <q-item
        v-for="(user, index) in matchingUsers"
        :key="index"
        clickable
        v-ripple
        class="q-my-sm"
        @click="goChat(user)"
      >
        <q-item-section avatar>
          <q-avatar size="50px" style="">
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
            style="position: absolute; left: 50px; top: 45px"
            :style="{ background: user.online ? '#ED4F5C' : 'none', border: user.online ? '1px solid white' : 'none' }"
          />
        </q-item-section>

        <q-item-section>
          <q-item-label
            class="text-subtitle2"
            style="font-size: 18px; font-weight: 600"
            >{{ user.name }}</q-item-label
          >
        </q-item-section>

        <q-item-section side>
          <q-badge
            class="q-pa-xs"
            :style="{ background: user.online ? '#e6ee9c' : 'none' }"
          >
            <span class="text-primary">
              {{ user.online ? t("online") : t("offline") }}
            </span>
          </q-badge>
        </q-item-section>
      </q-item>
    </q-list>

    <q-footer class="footer bg-primary">
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
      </q-tabs>
    </q-footer>
  </div>
</template>

<script>
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { ref, onMounted, computed, inject, watchEffect } from "vue";

import UserspageHeader from "../components/UsersPage/UserspageHeader";
import UserspageFooter from "../components/UsersPage/UserspageFooter";
import UsersmapModal from "../components/UsersPage/UsersmapModal";
import UsersList from "../components/UsersPage/UsersList";

export default {
  components: {
    UsersList,
    UsersmapModal,
    UserspageHeader,
    UserspageFooter,
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
      setTimeout(() => {
        if (!store.state.users.length) {
          noUserMessages.value = true;

          router.push("/auth");
        }
      }, 10000);
    });

    return {
      t,
      locale,
      store,
      router,
      search,
      noUserMessages,
      showUsersMapModal,
      matchingUsers,
      goChat,
      findUser,
      toggleLeftDrawer,
    };
  },
};
</script>

<style lang="scss" scoped>
.footer {
  z-index: 300;
  border-top-left-radius: 35px;
  border-top-right-radius: 35px;
}
.users-list {
  border-bottom-left-radius: 35px;
  border-bottom-right-radius: 35px;
  // border: 1px solid black;
  height: 550px;
}
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
}
</style>
