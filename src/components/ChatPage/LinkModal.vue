<template>
  <transition-group
    appear
    enter-active-class="animated slideInUp"
    leave-active-class="animated slideOutDown"
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
        borderless
        standout
        color="grey"
        bg-color="pink-2"
        :placeholder="t('url')"
        style="width: 80%"
        class="q-ml- bg- text-dark"
      >
        <template v-slot:append>
          <q-icon
            round
            size="sm"
            ref="btnEmoji"
            style="cursor: pointer"
            class="q-mr- text-white"
            name="eva-navigation-2-outline"
            @click="sendURL"
          />
        </template>
      </q-input>
      <div class="row justify-center" style="width: 10%">
        <q-btn
          flat
          round
          key="item5"
          size="md"
          class="text-white btn-close q-ml-md"
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
  emits: ['close-linkModal'],
  setup(props, context) {
    const { t, locale } = useI18n();

    const closeLinkModal = () => {
      context.emit("close-linkModal");
    };

    const sendURL = () => {
      console.log('send url to firestore')
    }

    return {
      t,
      locale,
      sendURL,
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
