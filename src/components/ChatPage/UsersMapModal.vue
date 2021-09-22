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
import { useI18n } from "vue-i18n";
import { ref, onMounted, onBeforeMount, onBeforeUnmount, inject } from "vue";
import { useRoute, useRouter } from "vue-router";

export default {
  setup(props, context) {
    const route = useRoute();
    const router = useRouter();

    const store = inject("store");

    const { t, locale } = useI18n();

    const me = ref(null);
    const map = ref(null);
    const mapTile = ref(null);
    const filteredUsers = ref(null);

    const zoom = ref(3);
    const zoomControl = ref(null);

    const closeUsersMapModal = () => {
      map.value.removeLayer(me.value);
      map.value.removeLayer(mapTile.value);
      map.value.removeLayer(filteredUsers.value);

      context.emit("close-usersMapModal");
    };

    const initMap = () => {
      map.value = L.map("map", {
        center: [store.state.userDetails.geolocation.lat, store.state.userDetails.geolocation.lng],
        zoom: zoom.value,
        maxZoom: 18,
        zoomControl: false,
      });

      me.value = L.marker(
        [store.state.userDetails.geolocation.lat, store.state.userDetails.geolocation.lng],
        {
          icon: new L.Icon({
            iconUrl: store.state.userDetails.avatar,
            shadowUrl: "/marker/marker-shadow.png",
            iconSize: [40, 40],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41],
          }),
        }
      )
        .addTo(map.value)
        .bindPopup(t('singleLocation'))
        .openPopup();

      setControl();

      store.getters.filteredUsers().map((item) => {
        return (filteredUsers.value = L.marker([item.geolocation.lat, item.geolocation.lng], {
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
          .bindPopup(item.name + ' ' + t('location')));
        // .openPopup()
      });

      mapTile.value = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution:
            '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>         contributors',
          maxZoom: 18,
        }
      ).addTo(map.value);
    };

    const setControl = () => {
      zoomControl.value = L.control
        .zoom({
          position: "topright",
        })
        .addTo(map.value);
    };

    onBeforeUnmount(() => {
      map.value.removeLayer(me.value);
      map.value.removeLayer(filteredUsers.value);
      map.value.removeLayer(mapTile.value);

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
