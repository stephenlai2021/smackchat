<template>
  <div class="q-my-lg">
    <div
      class="items-center"
      style="overflow-x: auto; overflow-y: hidden; white-space: nowrap"
    >
      <div
        @click="goChat(user)"
        v-for="(user, index) in matchingUsers"
        :key="index"
        class="row q-ml-md items-center"
        style="display: inline-block"
      >
        <q-avatar size="60px" style="position: relative; cursor: pointer">
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
            style="
              position: absolute;
              left: 42px;
              top: 45px;
              border: 1px solid white;
            "
            :style="{
              background: user.online ? '#ED4F5C' : 'none',
              border: user.online ? '1px solid white' : 'none'
            }"
          />
        </q-avatar>
      </div>
    </div>
  </div>
  <!-- <div class="full-width q-px-md q-my-sm" style="display: block">
    <q-input
      rounded
      elevated
      standout="bg-grey-6 text-white"
      v-model="search"
      :label="t('searchUser')"
    >
      <template v-slot:prepend>
        <q-icon
          name="eva-search-outline"
          class="q-ml-sm"
          style="cursor: pointer"
        />
      </template>
    </q-input>
  </div> -->
  <searchuser-inputbox />
</template>

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

<script>
import { useI18n } from "vue-i18n";
import { inject, computed, ref } from "vue";
import { useRouter } from "vue-router";
import SearchuserInputbox from './SearchuserInputbox.vue'

export default {
  components: {
    SearchuserInputbox,
  },
  setup() {
    const store = inject("store");

    const router = useRouter();

    const { t, locale } = useI18n();

    const search = ref("");

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

    return {
      t,
      locale,
      router,
      search,
      goChat,
      matchingUsers,
    };
  },
};
</script>

<style lang="scss" scoped></style>
