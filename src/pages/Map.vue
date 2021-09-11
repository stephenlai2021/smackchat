<template>
  <q-page>
    <div>
      <q-btn
        round
        dense
        size="md"
        class="bg-amber-2"
        icon="eva-arrow-ios-back-outline"
        style="
          position: fixed;
          left: 50%;
          transform: translate(-50%);
          top: 10px;
          z-index: 500;
        "
        @click="
          router.push(
            `/chat/${store.state.userDetails.name}/${store.state.user.name}`
          )
        "
      />
    </div>
    <div id="map"></div>
  </q-page>
</template>

<script>
import { ref, onMounted, inject } from "vue";
import { useRoute, useRouter } from "vue-router";

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();

    const store = inject("store");

    // ref
    const lat = ref(null);
    const lng = ref(null);
    const map = ref(null);
    const me = ref(null);
    const user = ref(null);

    // init zoom
    const zoom = ref(7);
    const zoomControl = ref(null);

    /* init icon */
    const red = ref(null);
    const green = ref(null);
    const grey = ref(null);
    const icon = ref(null);

    // methods
    const getUserGeoLocation = () => {
      map.value = L.map("map", {
        center: [store.state.geoLocation.lat, store.state.geoLocation.lng],
        zoom: zoom.value,
        maxZoom: 18,
        zoomControl: false,
      });

      setControl();

      user.value = L.marker([store.state.user.geoLocation.lat, store.state.user.geoLocation.lng])
        .addTo(map.value)
        .bindPopup(`${store.state.user.name} is here`)
        .openPopup();

      // addStores();

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>         contributors',
        maxZoom: 18,
      }).addTo(map.value);
    };

    const initMap = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          lat.value = pos.coords.latitude;
          lng.value = pos.coords.longitude;

          map.value = L.map("map", {
            center: [lat.value, lng.value],
            zoom: zoom.value,
            maxZoom: 18,
            zoomControl: false,
          });

          setControl();
          // setIcon();

          // me.value = L.marker([lat.value, lng.value], { icon: red.value })
          me.value = L.marker([lat.value, lng.value])
            .addTo(map.value)
            .bindPopup("您的位置")
            .openPopup();

          // addStores();

          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
              '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>         contributors',
            maxZoom: 18,
          }).addTo(map.value);
        });
      }
    };

    const setIcon = () => {
      red.value = new L.Icon({
        iconUrl: "/marker/marker-icon-2x-red.png",
        shadowUrl: "/marker/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      green.value = new L.Icon({
        iconUrl: "/marker/marker-icon-2x-green.png",
        shadowUrl: "/marker/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      grey.value = new L.Icon({
        iconUrl: "/marker/marker-icon-2x-grey.png",
        shadowUrl: "marker/marker-shadow.png",
        iconSize: [25, 41],
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

      // getUserGeoLocation()
    });

    return {
      store,
      route,
      router,
    };
  },
};
</script>

<style lang="scss" scoped>
#map {
  position: fixed;
  left: 0;
  // top: 50px;
  width: 100%;
  height: 100vh;
  z-index: 300;
}
</style>
