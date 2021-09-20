<template>
  <q-page>
    <!-- <transition-group
      appear
      enter-active-class="animated fadeIn"
      leave-active-class="animated fadeOut"
    > -->
      <div>
        <q-btn
          round
          dense
          size="md"
          class="bg-red-8"
          icon="eva-close-outline"
          style="
            position: fixed;
            left: 50%;
            transform: translate(-50%);
            bottom: 20px;
            z-index: 700;
            opacity: 0.5;
          "
          @click="closeMapModal"
        />
      </div>
      <div id="map"></div>
    <!-- </transition-group> -->
  </q-page>
</template>

<script>
import { ref, onMounted, inject } from "vue";
import { useRoute, useRouter } from "vue-router";

export default {
  setup(props, context) {
    const route = useRoute();
    const router = useRouter();

    const store = inject("store");

    const map = ref(null);
    const me = ref(null);

    const zoom = ref(7);
    const zoomControl = ref(null);

    const otherUser = ref(null);

    const closeMapModal = () => {
      context.emit("close-mapModal");
    };

    const initMap = () => {
      map.value = L.map("map", {
        center: [store.state.otherUser.lat, store.state.otherUser.lng],
        zoom: zoom.value,
        maxZoom: 18,
        zoomControl: false,
      });

      setControl();
      setIcon();

      me.value = L.marker(
        [store.state.otherUser.lat, store.state.otherUser.lng],
        { icon: otherUser.value }
      )
        .addTo(map.value)
        .bindPopup(store.state.otherUser.name + " is here")
        .openPopup();

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>         contributors',
        maxZoom: 18,
      }).addTo(map.value);
    };

    const setIcon = () => {
      otherUser.value = new L.Icon({
        iconUrl: store.state.otherUser.avatar,
        shadowUrl: "/marker/marker-shadow.png",
        iconSize: [40, 40],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });
    };

    const setControl = () => {
      zoomControl.value = L.control
        .zoom({
          position: "topright",
        })
        .addTo(map.value);
    };

    onMounted(() => {
      initMap();
    });

    return {
      store,
      route,
      router,

      closeMapModal,
    };
  },
};
</script>

<style lang="scss" scoped>
#map {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 600;
}
</style>
