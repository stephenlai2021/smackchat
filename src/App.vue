<template>
  <router-view />
</template>
<script>
import { provide, onMounted } from "vue";
import store from "./store";

export default {
  setup() {
    provide("store", store);

    onMounted(() => {
      store.methods.handleAuthStateChanged();
      store.methods.getUsers();
    });
  },
};
</script>
