<template>
  <transition-group
    appear
    enter-active-class="animated fadeIn"
    leave-active-class="animated fadeOut"
  >
    <div
      class="
        link-modal
        full-width
        bg-dark
        row
        items-center
        q-pl-
        justify-center
      "
      key="item2"
    >
      <q-input
        dense
        rounded
        outlined
        color="white"
        :placeholder="t('url')"
        style="width: 80%"
        class="q-ml- bg-transparent text-white"
      />
      <div class="row justify-center" style="width: 10%">
        <q-btn
          flat
          round
          key="item5"
          size="md"
          class="text-white btn-close q-ml-sm"
          icon="eva-close-outline"
          @click="closeLinkModal"
        />
      </div>
    </div>
  </transition-group>
</template>

<script>
import { useI18n } from "vue-i18n";

export default {
  setup(props, context) {
    const { t, locale } = useI18n();

    const closeLinkModal = () => {
      context.emit("close-linkModal");
    };

    return {
      t,
      locale,
      closeLinkModal,
    };
  },
};
</script>

<style lang="scss" scoped>
.btn-close {
  cursor: pointer;
  // margin-left: auto;
}
.link-modal {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 64px;
  z-index: 600;
}
</style>
