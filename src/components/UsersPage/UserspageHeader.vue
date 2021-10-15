<template>
  <div reveal elevated class="q-py-md user-page-header">
    <div elevated>
      <div
        class="row justify-between full-width q-pl-md q-pr-sm"
      >
        <span
          class="text-bold text-primary"
          style="font-size: 25px; font-weight: 700"
        >
          {{ t("chatRoom") }}
        </span>
        <q-btn
          round
          dense
          flat
          size="md"
          class="text-primary"
          icon="eva-plus-outline"
          style="margin-left: auto; font-weight: 700"
          @click="openUsersMapModal"
        />
      </div>
    </div>
    <users-list />
  </div>
</template>

<script>
import { useI18n } from "vue-i18n";
import UsersList from "./UsersList";

export default {
  components: {
    UsersList,
  },
  setup(props, { emit }) {
    const { t, locale } = useI18n();

    const openUsersMapModal = () => {
      emit("openUsersMapModal");
    };

    return {
      t,
      locale,
      openUsersMapModal,
    };
  },
};
</script>

<style lang="scss" scoped>
.user-page-header {
  background: #e7eaed;
  border-bottom-left-radius: 35px;
  border-bottom-right-radius: 35px;
}
</style>
