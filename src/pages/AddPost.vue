<template>
  <q-page style="overflow: hidden;">
    <q-header>
      <q-toolbar class="constraint" style="padding: 0;">
        <q-btn
          round
          dense
          flat
          color=""
          size="18px"
          icon="eva-arrow-ios-back-outline"
          @click="router.push('/')"
        />
        <span
          class=" text-bold"
          style="font-size: 18px; width: 100%"
        >
          {{ t('addPost') }}
        </span>
      </q-toolbar>
    </q-header>
    <div class="q-ma-md">
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi ullam
        nobis omnis dignissimos vitae quisquam a natus sint ipsa explicabo
        debitis expedita optio voluptatem illo sed facilis eos suscipit ex,
        dolorum harum eius. Earum accusamus recusandae et inventore nostrum
        fugit placeat fugiat velit reprehenderit odit harum, sunt animi. Aperiam
        sunt unde tenetur eos, iusto illo perspiciatis minima fugit! Ex neque
        quam quisquam sunt labore eius, fugiat at, quod tenetur dolorum
        voluptate, vitae maiores doloremque nulla a totam est molestias minima.
        Id itaque consequuntur architecto neque inventore, quisquam magnam
        voluptatibus est deleniti officiis iure fuga, blanditiis nostrum libero
        animi veritatis harum.
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi ullam
        nobis omnis dignissimos vitae quisquam a natus sint ipsa explicabo
        debitis expedita optio voluptatem illo sed facilis eos suscipit ex,
        dolorum harum eius. Earum accusamus recusandae et inventore nostrum
        fugit placeat fugiat velit reprehenderit odit harum, sunt animi. Aperiam
        sunt unde tenetur eos, iusto illo perspiciatis minima fugit! Ex neque
        quam quisquam sunt labore eius, fugiat at, quod tenetur dolorum
        voluptate, vitae maiores doloremque nulla a totam est molestias minima.
        Id itaque consequuntur architecto neque inventore, quisquam magnam
        voluptatibus est deleniti officiis iure fuga, blanditiis nostrum libero
        animi veritatis harum.
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi ullam
        nobis omnis dignissimos vitae quisquam a natus sint ipsa explicabo
        debitis expedita optio voluptatem illo sed facilis eos suscipit ex,
        dolorum harum eius. Earum accusamus recusandae et inventore nostrum
        fugit placeat fugiat velit reprehenderit odit harum, sunt animi. Aperiam
        sunt unde tenetur eos, iusto illo perspiciatis minima fugit! Ex neque
        quam quisquam sunt labore eius, fugiat at, quod tenetur dolorum
        voluptate, vitae maiores doloremque nulla a totam est molestias minima.
        Id itaque consequuntur architecto neque inventore, quisquam magnam
        voluptatibus est deleniti officiis iure fuga, blanditiis nostrum libero
        animi veritatis harum.
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi ullam
        nobis omnis dignissimos vitae quisquam a natus sint ipsa explicabo
        debitis expedita optio voluptatem illo sed facilis eos suscipit ex,
        dolorum harum eius. Earum accusamus recusandae et inventore nostrum
        fugit placeat fugiat velit reprehenderit odit harum, sunt animi. Aperiam
        sunt unde tenetur eos, iusto illo perspiciatis minima fugit! Ex neque
        quam quisquam sunt labore eius, fugiat at, quod tenetur dolorum
        voluptate, vitae maiores doloremque nulla a totam est molestias minima.
        Id itaque consequuntur architecto neque inventore, quisquam magnam
        voluptatibus est deleniti officiis iure fuga, blanditiis nostrum libero
        animi veritatis harum.
      </p>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi ullam
        nobis omnis dignissimos vitae quisquam a natus sint ipsa explicabo
        debitis expedita optio voluptatem illo sed facilis eos suscipit ex,
        dolorum harum eius. Earum accusamus recusandae et inventore nostrum
        fugit placeat fugiat velit reprehenderit odit harum, sunt animi. Aperiam
        sunt unde tenetur eos, iusto illo perspiciatis minima fugit! Ex neque
        quam quisquam sunt labore eius, fugiat at, quod tenetur dolorum
        voluptate, vitae maiores doloremque nulla a totam est molestias minima.
        Id itaque consequuntur architecto neque inventore, quisquam magnam
        voluptatibus est deleniti officiis iure fuga, blanditiis nostrum libero
        animi veritatis harum.
      </p>
    </div>
  </q-page>
</template>

<script>
import { useI18n } from "vue-i18n";
import { useRouter } from 'vue-router'

export default {
  setup() {
    const router = useRouter()

    const { t, locale } = useI18n();

    return {
      t, 
      locale,
      router,
    }
  }
};
</script>

<style lang="scss" scoped></style>
