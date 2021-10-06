<template>
  <transition-group
    appear
    enter-active-class="animated fadeIn"
    leave-active-class="animated fadeOut"
  >
    <div class="link-modal bg-primary q-pa-sm">
      <p>Link Modal</p>
    </div>
  </transition-group>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.link-modal {
  position: fixed;
  bottom: 56px;
  width: 100%;
  height: 70px;
}
</style>
