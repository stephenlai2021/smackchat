<template>
  <div class="pic-modal bg-dark">
    <img :src="url" alt="user pic" class="image">
    <q-btn 
      round
      class="btn-close"
      color="pink-3"
      icon="eva-close-outline"
      @click="closePicModal"
    />
  </div>
</template>

<script>
import { onMounted } from 'vue'

export default {
  props: ['url'],
  setup(props, context) {
    console.log('image url: ', props.url)

    const closePicModal = () => {
      context.emit('close-picmodal')
    }

    onMounted(() => {

    })

    return {
      closePicModal
    }
  }
}
</script>

<style lang="scss" scoped>
.btn-close {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
}
.image {
  width: 100%;
}
.pic-modal {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100vh;  
  z-index: 500;
  display: flex;
  align-items: center;
}
</style>