<template>
  <q-page class="">
    <!-- <q-header reveal class="bg-white" style="border-bottom: 1px solid red;"> -->
    <q-header reveal class="">
      <q-toolbar class="constraint">
        <span class="text-bold q-ml-sm" style="font-size: 20px; width: 100%">
          {{ t("chatRoom") }}
        </span>
        <div class="flex row justify-end full-width">
          <q-btn
            round
            dense
            flat
            color=""
            size="md"
            icon="eva-person-add-outline"
            @click="router.push('/finduser')"
          />
        </div>
      </q-toolbar>
    </q-header>

    <!-- <q-page-sticky expand position="top" style="z-index: 500" class="q-my-sm"> -->
    <!-- <q-toolbar class="constraint"> -->
    <div class="full-width q-px-md" style="display: inline-block">
      <q-input
        v-model="search"
        standout
        :label="t('searchUser')"
        dense
        bg-color=""
        class="q-my-md"
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
    <!-- </q-toolbar> -->
    <!-- </q-page-sticky> -->

    <div
      @click="goChat(user)"
      v-for="(user, index) in matchingUsers"
      :key="index"
      style="display: inline-block"
      class="flex row q-ml-md q-my-sm"
    >
      <q-avatar size="45px" style="position: relative">
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
      <div class="flex">
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

    <q-list v-else class="full-width q-mt-md">
      <q-item
        v-for="(user, index) in matchingUsers"
        :key="index"
        clickable
        v-ripple
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

    <q-btn
      round
      color="orange"
      icon="eva-arrow-circle-up-outline"
      style="position: absolute; right: 16px; bottom: 20px"
    />

    <!-- <q-page-sticky class="constraint" position="bottom-right" :offset="[18, 18]">
      <q-btn
        round
        size="15px"
        icon="eva-arrow-ios-upward-outline"
        style="background: #69f0ae"
      />
    </q-page-sticky> -->

    <q-footer>
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
      </div>
    </q-footer>
  </q-page>
</template>

<script>
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { ref, onMounted, computed, inject, watch, watchEffect } from "vue";

export default {
  setup() {
    const store = inject("store");

    const router = useRouter();

    const { t, locale } = useI18n();

    const search = ref("");
    const noUserMessages = ref(false);

    // methods
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
      // i18n
      t,
      locale,

      store,
      router,

      // ref
      search,
      noUserMessages,

      // computed
      matchingUsers,

      // methods
      goChat,
      findUser,
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
