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
        constraint
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
        bg-color="lime-1"
        label-color="dark"
        :label="t('url')"
        style="width: 80%"
        class="q-ml- bg- text-dark"
        v-model="url"
      >
        <template v-slot:append>
          <q-icon
            round
            size="sm"
            ref="btnEmoji"
            style="cursor: pointer"
            class="q-mr- text-dark"
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
          class="text-pink-2 btn-close q-ml-md"
          icon="eva-close-outline"
          @click="closeLinkModal"
        />
      </div>
    </div>
  </transition-group>
</template>

<script>
import { useI18n } from "vue-i18n";
import { ref, inject } from 'vue'
import { useRoute } from 'vue-router'
import { timestamp } from "src/boot/firebase";

export default {
  emits: ["close-linkModal"],
  setup(props, { emit }) {
    const { t, locale } = useI18n();

    const store = inject('store')

    const route = useRoute()

    const url = ref(null)

    const closeLinkModal = () => {
      emit("close-linkModal");
    };

    const sendURL = () => {
      if (url.value === "") return;

      store.methods.sendMessage({
        from: "me",
        text: url.value,
        url: true,
        image: false,
        to: route.params.to,
        createdAt: timestamp(),
      });

      url.value = "";

      emit('close-linkModal')
    };

    return {
      t,
      url,
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
