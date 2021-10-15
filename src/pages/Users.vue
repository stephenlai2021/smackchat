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
            <img :src="user.avatar" alt="user avatar" />
          </q-avatar>
          <div
            style="
              position: absolute;
              left: 50px;
              top: 45px;
              width: 12px;
              height: 12px;
              border-radius: 50%;
            "
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

    <q-footer class="footer bg-primary q-py-lg q-px-lg row justify-between">
      <!-- <q-tabs
        no-caps
        indicator-color="transparent"
        active-color="white"
        v-model="store.state.tab"
        class="row justify-evenly text-grey-5 q-py-sm"
      > -->
      <!-- <q-tab
          name="home"
          icon="eva-home-outline"
          style="width: 50%"
          @click="router.push('/')"
        /> -->
      <!-- <q-tab
          name="chat"
          icon="eva-message-circle-outline"
          style="width: 50%"
          @click="router.push('/users')"
        /> -->
      <router-link to="/">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="27.584"
          height="25.195"
          viewBox="0 0 27.584 25.195"
        >
          <g
            id="Group_97"
            data-name="Group 97"
            transform="translate(-30.212 -765)"
          >
            <g id="support" transform="translate(30.212 769.588)">
              <g id="Group_95" data-name="Group 95" transform="translate(0 0)">
                <g
                  id="Group_94"
                  data-name="Group 94"
                  transform="translate(0 0)"
                >
                  <path
                    id="Path_253"
                    data-name="Path 253"
                    d="M91.718,41.206H74.294a1.889,1.889,0,0,0-1.882,1.882V53.914A1.889,1.889,0,0,0,74.294,55.8H86.305l2.718,2.741a.582.582,0,0,0,.418.186.6.6,0,0,0,.6-.6V55.8h1.673A1.889,1.889,0,0,0,93.6,53.914V43.088A1.889,1.889,0,0,0,91.718,41.206ZM76.966,50.522a1.742,1.742,0,1,1,1.742-1.742A1.755,1.755,0,0,1,76.966,50.522Zm6.11,0a1.742,1.742,0,1,1,1.742-1.742A1.755,1.755,0,0,1,83.076,50.522Zm6.087,0a1.742,1.742,0,1,1,1.742-1.742A1.755,1.755,0,0,1,89.163,50.522Z"
                    transform="translate(-68.206 -41.206)"
                    fill="#fff"
                  />
                  <path
                    id="Path_254"
                    data-name="Path 254"
                    d="M3.137,200.9v-3.694H1.232A1.239,1.239,0,0,0,0,198.437v7.109a1.222,1.222,0,0,0,1.231,1.278H2.324v1.533a.407.407,0,0,0,.395.395A.385.385,0,0,0,3,208.637l1.789-1.789h7.9a1.239,1.239,0,0,0,1.231-1.231v-1.766H6.088A2.955,2.955,0,0,1,3.137,200.9Z"
                    transform="translate(0 -188.145)"
                    fill="#fff"
                  />
                </g>
              </g>
            </g>
            <g
              id="Ellipse_16"
              data-name="Ellipse 16"
              transform="translate(49.036 765)"
              fill="#0b2f5b"
              stroke="#ed4f5c"
              stroke-width="1"
            >
              <circle cx="4.38" cy="4.38" r="4.38" stroke="none" />
              <circle cx="4.38" cy="4.38" r="3.88" fill="none" />
            </g>
          </g>
        </svg>
      </router-link>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="31.09"
        height="22.418"
        viewBox="0 0 31.09 22.418"
      >
        <g id="group" transform="translate(0 -46.782)" opacity="0.784">
          <circle
            id="Ellipse_17"
            data-name="Ellipse 17"
            cx="4.091"
            cy="4.091"
            r="4.091"
            transform="translate(19.584 48.579)"
            fill="#ffc7cc"
          />
          <path
            id="Path_255"
            data-name="Path 255"
            d="M9.336,187.928A9.336,9.336,0,0,0,0,197.264H18.671A9.336,9.336,0,0,0,9.336,187.928Z"
            transform="translate(0 -128.064)"
            fill="#ffc7cc"
          />
          <path
            id="Path_256"
            data-name="Path 256"
            d="M206.5,184.442a7.383,7.383,0,0,0-5,1.941,11.993,11.993,0,0,1,2.568,5.474h9.845A7.415,7.415,0,0,0,206.5,184.442Z"
            transform="translate(-182.828 -124.901)"
            fill="#ffc7cc"
          />
          <circle
            id="Ellipse_18"
            data-name="Ellipse 18"
            cx="5.151"
            cy="5.151"
            r="5.151"
            transform="translate(4.185 46.782)"
            fill="#ffc7cc"
          />
        </g>
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="23.311"
        height="23.311"
        viewBox="0 0 23.311 23.311"
      >
        <g id="Settings" transform="translate(-0.003 0)">
          <g id="Group_96" data-name="Group 96" transform="translate(0.003 0)">
            <path
              id="Path_257"
              data-name="Path 257"
              d="M23.241,10.362a.759.759,0,0,0-.749-.574A2.574,2.574,0,0,1,20.73,5.308a.647.647,0,0,0,.071-.879,11.534,11.534,0,0,0-1.847-1.865.649.649,0,0,0-.886.072,2.686,2.686,0,0,1-2.907.653A2.589,2.589,0,0,1,13.587.759a.647.647,0,0,0-.572-.681A11.637,11.637,0,0,0,10.393.071a.649.649,0,0,0-.577.667,2.593,2.593,0,0,1-1.6,2.487,2.694,2.694,0,0,1-2.885-.657.65.65,0,0,0-.88-.074A11.577,11.577,0,0,0,2.569,4.358a.648.648,0,0,0,.07.886A2.583,2.583,0,0,1,3.29,8.152,2.7,2.7,0,0,1,.754,9.728a.634.634,0,0,0-.673.572,11.676,11.676,0,0,0-.005,2.651.771.771,0,0,0,.764.573,2.556,2.556,0,0,1,2.4,1.6A2.592,2.592,0,0,1,2.587,18a.648.648,0,0,0-.071.878A11.575,11.575,0,0,0,4.36,20.747a.648.648,0,0,0,.887-.07,2.682,2.682,0,0,1,2.906-.654,2.585,2.585,0,0,1,1.577,2.53.647.647,0,0,0,.572.681,11.6,11.6,0,0,0,2.622.007.649.649,0,0,0,.577-.668A2.591,2.591,0,0,1,15.1,20.088a2.69,2.69,0,0,1,2.887.657.651.651,0,0,0,.88.074,11.6,11.6,0,0,0,1.886-1.864.647.647,0,0,0-.07-.886,2.583,2.583,0,0,1-.653-2.908,2.609,2.609,0,0,1,2.384-1.58l.144,0a.649.649,0,0,0,.682-.571A11.666,11.666,0,0,0,23.241,10.362ZM11.677,15.568a3.888,3.888,0,1,1,3.888-3.888A3.892,3.892,0,0,1,11.677,15.568Z"
              transform="translate(-0.003 0)"
              fill="#ffc7cc"
              fill-rule="evenodd"
            />
          </g>
        </g>
      </svg>

      <!-- </q-tabs> -->
    </q-footer>
  </div>
</template>

<script>
import { useQuasar } from "quasar";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { ref, onMounted, computed, inject, watchEffect } from "vue";

import UserspageHeader from "../components/UsersPage/UserspageHeader";
import UsersmapModal from "../components/UsersPage/UsersmapModal";
import UsersList from "../components/UsersPage/UsersList";

export default {
  components: {
    UsersList,
    UsersmapModal,
    UserspageHeader,
  },
  setup() {
    const $q = useQuasar();

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
      toggleLeftDrawer,
    };
  },
};
</script>

<style lang="scss" scoped>
.router-link-active {
  font-weight: 600;
}
.footer {
  z-index: 300;
  // border-top-left-radius: 35px;
  // border-top-right-radius: 35px;
}
.users-list {
  border-bottom-left-radius: 35px;
  border-bottom-right-radius: 35px;
  // border: 1px solid black;
  // height: 550px;
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
