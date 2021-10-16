<template>
  <div class="q-py-md user-page-header" :style="{ maxWidth: store.state.leftDrawerOpen ? 'calc(100% - 300px)' : '100%' }">
    <div class="row justify-between full-width q-pl-md q-pr-sm">
      <span
        class="text-bold text-primary"
        style="font-size: 25px; font-weight: 700"
      >
        {{ t("messages") }}
      </span>
      <q-btn
        round
        dense
        flat
        size="md"
        class="text-primary"
        icon="eva-plus-outline"
        style="margin-left: auto; font-weight: 700"
        @click="store.state.rightDrawerOpen = true"
      />
    </div>
    <userspageheader-components />
  </div>
</template>

<script>
import { inject } from "vue";
import { useI18n } from "vue-i18n";
import UserspageheaderComponents from "./UserspageheaderComponents";

export default {
  components: {
    UserspageheaderComponents,
  },
  setup(props, { emit }) {
    const store = inject("store");

    const { t, locale } = useI18n();

    const openUsersMapModal = () => {
      emit("openUsersMapModal");
    };

    return {
      t,
      store,
      locale,
      openUsersMapModal,
    };
  },
};
</script>

<style lang="scss" scoped>
.user-page-header {
  position: fixed;
  top: 0;
  z-index: 300;
  width: 100%;
  background: #e7eaed;
  border-bottom-left-radius: 35px;
  border-bottom-right-radius: 35px;
}
</style>
