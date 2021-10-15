<template>
  <div class="q-my-lg">
    <div
      class="items-center q-ml-md"
      style="overflow-x: auto; overflow-y: hidden; white-space: nowrap"
    >
      <div
        @click="goChat(user)"
        v-for="(user, index) in matchingUsers"
        :key="index"
        class="row q-mr-lg items-center"
        style="display: inline-block;"
      >
        <q-avatar size="60px" style="position: relative; cursor: pointer">
          <img
            :src="user.avatar"
            alt="user avatar"
          />
          <div
            style="
              position: absolute;
              left: 42px;
              top: 45px;
              width: 12px;
              height: 12px;
              border-radius: 50%; 
            "
            :style="{
              background: user.online ? '#ED4F5C' : 'none',
              border: user.online ? '2px solid white' : 'none'
            }"
          ></div>
        </q-avatar>
      </div>
    </div>
  </div>
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
