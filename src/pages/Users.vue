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

    <!-- Do not remove this block !!! -->
    <!-- <div
      v-else-if="!store.state.users.length && noUserMessages"
      class="spinner"
    >
      <p class="text-center text-h6 text-primary border">
        Sorry, we can't find any user in database, please try again later !
      </p>
    </div> -->

    <div v-else class="users-list-container">
      <q-list class="full-width q-pt-sm q-pb-sm">
        <!-- <div class="spacer" style="height: 20px"></div> -->
        <q-item
          v-for="(user, index) in matchingUsers"
          :key="index"
          clickable
          v-ripple
          class="user-list"
          @click="goChat(user)"
        >
          <q-item-section avatar>
            <q-avatar size="50px" style="">
              <img :src="user.avatar" alt="user avatar" />
            </q-avatar>
            <div
              class="online-indication"
              :style="{
                background: user.online ? '#ED4F5C' : 'none',
                border: user.online ? '2px solid white' : 'none',
              }"
            ></div>
          </q-item-section>

          <q-item-section>
            <q-item-label
              class="text-secondary"
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
    </div>
  </div>
</template>

<script>
import { useQuasar } from "quasar";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { ref, onMounted, computed, inject, watchEffect } from "vue";

import UserspageHeader from "../components/UsersPage/UserspageHeader";
import UserspageFooter from "../components/UsersPage/UserspageFooter";
import UsersmapModal from "../components/UsersPage/UsersmapModal";

export default {
  components: {
    UsersmapModal,
    UserspageHeader,
    UserspageFooter,
  },
  setup() {
    const $q = useQuasar();

    const store = inject("store");

    const router = useRouter();

    const { t, locale } = useI18n();

    const search = ref("");
    const noUserMessages = ref(false);
    const showUsersMapModal = ref(false);

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
      $q,
      locale,
      store,
      router,
      search,
      noUserMessages,
      showUsersMapModal,
      matchingUsers,
      goChat,
      findUser,
    };
  },
};
</script>

<style lang="scss" scoped>
.user-list {
  padding: 15px 16px;
}
.online-indication {
  position: absolute;
  left: 50px;
  top: 52px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
}
.footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 300;
  padding: 17px;
}
.users-list-container {
  padding-top: 256px;
  width: 100%;
  // border: 1px solid;
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
