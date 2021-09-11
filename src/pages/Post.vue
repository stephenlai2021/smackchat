<template>
  <q-page class="constraint">
    <q-header reveal>
      <q-toolbar class="constraint">
        <q-avatar>
                <!-- ? 'https://www.clipartmax.com/png/full/98-984206_profile-photo-facebook-profile-picture-icon.png' -->
          <img
            style="width: 30px; height: 30px"
            :src="
              !store.state.userDetails.avatar
                ? '/avatar.png'
                : store.state.userDetails.avatar
            "
            alt="user avatar"
          />
        </q-avatar>

        <span class="text-bold q-ml-sm" style="font-size: 18px; width: 100%">
          {{ store.state.userDetails.name }}
        </span>
        <div class="flex row justify-end full-width">
          <q-btn
            round
            dense
            flat
            color=""
            size="md"
            icon="post_add"
            class="q-mr-sm"
            @click="router.push('/addpost')"
          />
          <q-btn
            round
            dense
            flat
            color=""
            size="md"
            icon="eva-settings-2-outline"
            @click="toggleLeftDrawer"
          />
        </div>
      </q-toolbar>
    </q-header>
    <div class="q-pa-md">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae commodi
      eligendi aspernatur a ullam! Illo quod excepturi cumque debitis esse odio
      inventore unde doloremque tempore. Repudiandae velit, sint nobis corrupti
      animi quo modi amet esse iusto excepturi quidem porro expedita inventore
      cupiditate autem, odio ratione rem pariatur doloremque? Eos assumenda cum
      porro numquam corrupti quibusdam quod labore soluta autem, placeat saepe
      eaque molestiae laborum incidunt inventore veniam? Voluptates consequatur
      aperiam tenetur laudantium? Deleniti incidunt error odio cupiditate maxime
      repellendus dolores eaque doloremque, dignissimos ut similique quae
      assumenda iusto, perspiciatis repellat aut nemo asperiores reprehenderit
      est voluptatibus praesentium, ipsum ea ex. Officia error tempora tempore
      expedita! Sequi nobis officiis perspiciatis! Molestiae est temporibus
      suscipit nisi nam consequuntur eum? Quod ipsam porro natus dolor corrupti
      incidunt inventore hic numquam quas fugiat at pariatur molestiae sequi quo
      ducimus soluta modi, nemo tenetur nostrum vitae. Debitis est vero
      asperiores architecto. Consequuntur consectetur similique quod?
    </div>
    <q-footer>
      <div class="constraint">
        <q-tabs
          v-model="store.state.tab"
          no-caps
          inline-label
          class="flex row justify-evenly full-width"
        >
          <q-tab
            name="home"
            :label="t('posts')"
            icon="eva-home-outline"
            style="width: 50%"
            @click="router.push('/')"
          />
          <q-tab
            name="chat"
            :label="t('chat')"
            icon="eva-message-circle-outline"
            style="width: 50%"
            @click="router.push('/users')"
          />
        </q-tabs>
      </div>
    </q-footer>
  </q-page>
</template>

<script>
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { inject, onMounted, ref } from "vue";
import { localdb } from "src/boot/localbase";

export default {
  setup() {
    const { t, locale } = useI18n();

    const store = inject("store");

    const router = useRouter();

    const leftDrawerOpen = ref(false);

    const toggleLeftDrawer = () => {
      store.state.leftDrawerOpen = !store.state.leftDrawerOpen;
    };

    onMounted(() => {
      // localdb
      //   .collection("leftDrawerOpen")
      //   .doc("imessenger")
      //   .get()
      //   .then((result) => {
      //     console.log("left open drawer state | onMounted ", result.state);
      //     leftDrawerOpen.value = result.state;
      //   });
      // console.log(
      //   "left drawer open state: | main layout: ",
      //   leftDrawerOpen.value
      // );
    });

    return {
      // i18n,
      t,
      locale,

      // others
      store,
      router,

      // methods
      toggleLeftDrawer,
    };
  },
};
</script>

<style lang="scss" scoped></style>
