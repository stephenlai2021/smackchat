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
    const closeMapModal = () => {
      context.emit("close-mapmodal");
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
          setIcon();

          // me.value = L.marker([lat.value, lng.value], { icon: red.value })
          me.value = L.marker([lat.value, lng.value])
            .addTo(map.value)
            .bindPopup("您的位置")
            .openPopup();

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
