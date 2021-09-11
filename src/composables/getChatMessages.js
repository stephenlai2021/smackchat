import { ref, watchEffect } from "vue";
import { db } from "src/boot/firebase";

const getChatMessages = (to, from) => {
  const chats = ref([]);
  const error = ref(null)

  let chatRef = db
    .collection("chat-messages")
    .doc(from)
    .collection(to)
    .orderBy("createdAt", "asc");

  const unsub = chatRef.onSnapshot(
    (snapshot) => {
      console.log("snapshot");

      chats.value.length = 0;
      chats.value = snapshot.docs.map((doc) => {
        return { ...doc.data() };
      });
      error.value = null
    },
    (err) => {
      console.log(err.message);
      messages.value = null;
      error.value = "could not fetch data";
    }
  );

  watchEffect((onInvalidate) => {
    // unsub from prev collection when watcher is stopped (component unmounted)
    onInvalidate(() => unsub());
  });

  return { chats, error };
};

export default getChatMessages;
