<template>
  <transition-group
    appear
    enter-active-class="animated slideInUp"
    leave-active-class="animated slideOutDown"
  >
    <div class="menu-modal bg-dark q-pa-md full-width" key="item1">
      <p key="item2" class="text-white">Menu Modal</p>
    </div>
  </transition-group>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.menu-modal {
  position: fixed;
  bottom: 56px;
}
</style>
