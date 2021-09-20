<template>
  <q-page>
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
        @click="closeUsersMapModal"
      />
    </div>
    <div id="map"></div>
  </q-page>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, inject } from "vue";
import { useRoute, useRouter } from "vue-router";

export default {
  setup(props, context) {
    const route = useRoute();
    const router = useRouter();

    const store = inject("store");

    const map = ref(null);

    const zoom = ref(3);
    const zoomControl = ref(null);

    const closeUsersMapModal = () => {
      context.emit("close-usersMapModal");
    };

    const initMap = () => {
      removeAllMarkers()
      
      map.value = L.map("map", {
        center: [store.state.userDetails.lat, store.state.userDetails.lng],
        zoom: zoom.value,
        maxZoom: 18,
        zoomControl: false,
      });

      setControl();

      store.state.users.map((item) => {
        return L.marker([item.lat, item.lng], {
          icon: new L.Icon({
            iconUrl: item.avatar,
            shadowUrl: "/marker/marker-shadow.png",
            iconSize: [40, 40],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
          }),
        })
          .addTo(map.value)
          .bindPopup(item.name + " is here")
          .openPopup();
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>         contributors',
        maxZoom: 18,
      }).addTo(map.value);
    };

    const setControl = () => {
      zoomControl.value = L.control
        .zoom({
          position: "topright",
        })
        .addTo(map.value);
    };

    const removeAllMarkers = () => {
      map.value.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          map.value.removeLayer(layer);
        }
      });
    };

    onBeforeUnmount(() => {
      // removeAllMarkers()

      if (!route.fullPath.includes("/users")) {
        store.state.tab = "home";
      }
    });

    onMounted(() => {
      initMap();
    });

    return {
      store,
      route,
      router,

      closeUsersMapModal,
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
