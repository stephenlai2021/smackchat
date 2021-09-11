import { boot } from "quasar/wrappers";
import CameraInput from "../components/CameraInput.vue";

// export default boot(async ({ app }) => {
export default ({ app }) => {
  app.component("camera-input", CameraInput);
}
