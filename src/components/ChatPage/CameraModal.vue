<template>
  <transition-group
    appear
    enter-active-class="animated zoomIn"
    leave-active-class="animated zoomOut"
  >
    <div v-if="showCameraModal" class="camera-modal">
      <div class="constraint" style="height: 100vh">
        <div class="full-width camera-panel">
          <div style="width: 100%; position: relative">
            <video
              v-show="!imageCaptured"
              ref="video"
              autoplay
              style="width: 100%"
            />
            <q-btn
              v-if="showCaptureBtn"
              color="red"
              icon="eva-close-outline"
              size="md"
              round
              style="position: absolute; top: 20px; right: 20px; opacity: 0.5"
              @click="cancelCapture"
            />
            <q-btn
              v-if="showCaptureBtn"
              color="blue"
              icon="eva-camera-outline"
              size="lg"
              round
              style="
                position: absolute;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                opacity: 0.5;
              "
              @click="captureImage"
            />
            <q-btn
              v-if="showCaptureBtn && btnSwap"
              :disable="hideCameraBtn"
              color="amber-8"
              icon="eva-swap-outline"
              size="md"
              round
              style="
                position: absolute;
                bottom: 30px;
                right: 20px;
                opacity: 0.5;
              "
              @click="frontCamera = !frontCamera"
            />
            <canvas
              v-show="imageCaptured"
              ref="canvas"
              class="full-width"
              height="240"
            />
            <div v-if="imageCaptured" class="constraint text-center q-pa-md">
              <div>Uploading... {{ store.state.progress }}%</div>
              <div
                class="progress-bar"
                :style="{ width: store.state.progress + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition-group>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped></style>
