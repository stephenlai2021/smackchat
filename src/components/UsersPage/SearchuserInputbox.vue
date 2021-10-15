<template>
  <div class="full-width q-px-md q-my-sm" style="display: block">
    <q-input      
      rounded
      label-color="secondary"
      standout="text-secondary bg-white"
      v-model="search"
      :label="t('searchUser')"
    >
      <template v-slot:prepend>
        <q-icon
          name="eva-search-outline"
          class="q-ml-sm text-secondary"
          style="cursor: pointer"
        />
      </template>
    </q-input>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

export default {
  setup() {
    const { t, locale } = useI18n()

    const search = ref('')

    return {
      t, 
      locale,
      search,
    }
  }

};
</script>

<style lang="scss" scoped></style>
