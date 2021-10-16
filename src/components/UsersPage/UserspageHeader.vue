<template>
  <!-- <div class="bg-white"> -->
    <div class="q-py-md user-page-header">
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
          @click="openUsersMapModal"
        />
      </div>
      <userspageheader-components />
    </div>
  <!-- </div> -->
</template>

<script>
import { useI18n } from "vue-i18n";
import UserspageheaderComponents from "./UserspageheaderComponents";

export default {
  components: {
    UserspageheaderComponents,
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
  position: fixed;
  top: 0;
  z-index: 300;
  width: 100%;
  background: #e7eaed;
  border-bottom-left-radius: 35px;
  border-bottom-right-radius: 35px;
}
</style>
