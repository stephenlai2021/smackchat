<template>
  <div class="full-width q-px-md q-mb-md q-mt-md">
    <input type="text" name="search" placeholder="Search" />
  </div>  
</template>

<script>
import { ref } from "vue";
import { useI18n } from "vue-i18n";

export default {
  setup() {
    const { t, locale } = useI18n();

    const search = ref("");

    return {
      t,
      locale,
      search,
    };
  },
};
</script>

<style lang="scss" scoped>
.icon-search {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
}
::placeholder {
  font-size: 14px;
  font-weight: 600;
  color: #a9b5c1;
  // border: 1px solid;
  padding-left: 1px;
}
input[type="text"] {
  width: 100%;
  box-sizing: border-box;
  border: none;
  border-radius: 15px;
  font-size: 16px;
  color: grey;
  background-color: white;
  background-image: url("https://www.w3schools.com/css/searchicon.png");
  background-position: 15px 20px;
  background-repeat: no-repeat;
  background-size: 20px;
  padding: 15px 20px 15px 40px;
  box-shadow: 0px 5px 5px rgb(206, 204, 204);
}
</style>
