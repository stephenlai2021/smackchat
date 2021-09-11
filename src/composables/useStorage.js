import { file } from "@babel/types";
import { disk } from "src/boot/firebase";
import { ref, watchEffect } from 'vue'

const useStorage = (file, data) => {
  const url = ref(null)
  const error = ref(null)
  const progress = ref(null)

  watchEffect(() => {
    // references
    const storageRef = disk.ref(data + '/' + file.name)

    // upload file
    storageRef.put(file).on('state_change', snap => {
      // update the progress as file uploads
      console.log(snap)
    }, err => {
      error.value = err
    }, async () => {
      // get the dl url & make firestore doc
      const dlUrl = await storageRef.getDownloadURL()
      url.value = dlUrl
    })
  })

  return {
    url,
    error,
    progress,
  }
};

export default useStorage;
