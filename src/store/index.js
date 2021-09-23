import router from "../router";
import { reactive, watchEffect } from "vue";
import { formatDistanceToNow } from "date-fns";
import { auth, db, disk, timestamp } from "src/boot/firebase";

const state = reactive({
  users: [],
  messages: [],
  errorMessage: "",
  successMessage: "",
  userDetails: {},
  online: false,
  today: null,
  leftDrawerOpen: false,
  rightatDrawerOpen: false,
  typing: {
    from: null,
    typing: false,
  },
  user: {},
  darkMode: false,
  chinese: false,
  desktop: false,
  login: false,
  tab: "home",
  to: null,
  geoLocation: null,
  register: false,

  url: null,
  error: null,
  progress: null,
  uploadCompleted: false,

  isChatPage: false,
  videochat: false,
  videochatIndicator: false,
  from: null,
});

const methods = {
  useStorage(file, data) {
    watchEffect(() => {
      // references
      const storageRef = disk.ref(data + "/" + file.name);

      // upload file
      storageRef.put(file).on(
        "state_changed",
        (snap) => {
          // update the progress as file uploads
          let percentage = (snap.bytesTransferred / snap.totalBytes) * 100;

          state.progress = percentage;
          console.log("progress: ", state.progress);

          if (state.progress >= 100) {
            state.uploadCompleted = true;
            console.log("image upload completed: ", state.uploadCompleted);
          }
        },
        (err) => {
          state.error = err.message;
        },
        async () => {
          state.url = await storageRef.getDownloadURL();
          console.log("image url | store: ", state.url);

          if (state.register) {
            db.collection("chat-users").doc(state.userDetails.name).update({
              avatar: state.url,
            });
          }
        }
      );
    });
  },
  useStorage2(file, data) {
    watchEffect(() => {
      // references
      const storageRef = disk.ref(data + "/" + file.name);

      // upload file
      storageRef.put(file).on(
        "state_changed",
        (snap) => {
          // update the progress as file uploads
          let percentage = (snap.bytesTransferred / snap.totalBytes) * 100;

          // state.progress = percentage;
          state.progress = Math.round(percentage);
          console.log("progress: ", state.progress);

          if (state.progress >= 100) {
            state.uploadCompleted = true;
            console.log("image upload completed: ", state.uploadCompleted);
          }
        },
        (err) => {
          state.error = err.message;
        },
        async () => {
          state.url = await storageRef.getDownloadURL();
          console.log("image url | store: ", state.url);

          // let tempUrl = await storageRef.getDownloadURL();
          // console.log("image url | store: ", tempUrl);

          // const url =
          //   "https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=AIzaSyBm9VXXj0pjKwkWrr4lJqsGrpBHkLUdRho";

          // fetch(url, {
          //   method: "POST",
          //   headers: {
          //     "Content-Type": "application/json",
          //   },
          //   body: JSON.stringify({
          //     longDynamicLink: `https://slai.page.link/?link=${tempUrl}`,
          //     suffix: {
          //       option: "SHORT", // "UNGUESSABLE"
          //     },
          //   }),
          // })
          //   .then((res) => {
          //     return res.json();
          //   })
          //   .then((data) => {
          //     console.log("firebase dynamic links: ", data);
          //     state.url = data.shortLink;
          //     tempUrl = null
          //   });
        }
      );
    });
  },
  handleAuthStateChanged() {
    console.log("handle auth state change | store");
    auth.onAuthStateChanged((user) => {
      if (user) {
        db.collection("chat-users")
          .where("userId", "==", user.uid)
          // .get()
          // .then((snapshot) => {
          .onSnapshot((snapshot) => {
            snapshot.docs.map((doc) => {
              state.userDetails = doc.data();
              console.log("user details | store", state.userDetails);

              state.login = false;
            });
          });
      }
      if (!user) {
        console.log("there is no user | auth state change");
        state.userDetails = {};
        console.log("user details | store", state.userDetails);
        router.push("/auth");
      }
    });
  },
  registerUser(data) {
    auth
      .createUserWithEmailAndPassword(data.email, data.password)
      .then((cred) => {
        const user = cred.user;
        console.log("user: ", user);

        db.collection("chat-users").doc(data.name).set({
          name: data.name,
          email: data.email,
          password: data.password,

          avatar: data.avatar,
          peerId: data.peerId,
          geolocation: data.geolocation,

          userId: user.uid,
          online: true,
        });

        state.tab = "home";
        router.push("/");
      })
      .catch((err) => {
        console.log("err message: ", err.message);
        state.errorMessage = err.message;
      });
  },
  loginUser(data) {
    auth
      .signInWithEmailAndPassword(data.email, data.password)
      .then((cred) => {
        const user = cred.user;
        console.log("user: ", user);

        db.collection("chat-users").doc(data.name).update({
          online: true,
          geolocation: data.geolocation,
          peerId: data.peerId,
        });

        state.tab = "home";
        state.login = true;
        state.errorMessage = null;

        router.push("/");
      })
      .catch((err) => {
        console.log("err message: ", err.message);
        state.errorMessage = err.message;
        state.login = false;
      });
  },
  logoutUser() {
    auth.signOut().then(() => {
      db.collection("chat-users")
        .doc(state.userDetails.name)
        .update({ online: false, lat: null, lng: null, peerId: null })
        .then(() => {
          state.userDetails = {};
        });
    });
  },
  getMessages(from, to) {
    const unsub = db
      .collection("chat-messages")
      .doc(from)
      .collection(to)
      .orderBy("createdAt", "asc")
      .onSnapshot((snapshot) => {
        console.log("snapshot: getMessages");

        // state.messages = snapshot.docs.map((doc) => {
        //   // let time = formatDistanceToNow(doc.createdAt.toDate())
        //   // return { ...doc.data(), createdAt: time }
        //   return doc.data()
        // });

        let results = [];
        snapshot.docs.forEach((doc) => {
          doc.data().createdAt && results.push(doc.data());
        });
        state.messages = results;

        console.log("messages | store: ", state.messages);
      });

    watchEffect((onInvalidate) => {
      onInvalidate(() => unsub());
    });
  },
  sendMessage(data) {
    let from = state.userDetails.name;

    db.collection("chat-messages")
      .doc(data.to)
      .collection(from)
      .doc("typing indicator")
      .update({
        typing: false,
      });

    db.collection("chat-messages").doc(from).collection(data.to).add({
      from: "me",
      text: data.text,
      createdAt: data.createdAt,
    });

    db.collection("chat-messages").doc(data.to).collection(from).add({
      from: "them",
      text: data.text,
      createdAt: data.createdAt,
    });
  },
  sendTypingIndicator(data) {
    let from = state.userDetails.name;

    db.collection("chat-messages")
      .doc(from)
      .collection(data.to)
      .doc("typing indicator")
      .set({
        from: "me",
        typing: false,
      });

    db.collection("chat-messages")
      .doc(data.to)
      .collection(from)
      .doc("typing indicator")
      .set({
        from: "them",
        typing: true,
      });

    setTimeout(() => {
      db.collection("chat-messages")
        .doc(data.to)
        .collection(from)
        .doc("typing indicator")
        .update({
          typing: false,
        })
        .then(() => {
          state.typing.typing = false;
        });
    }, 2000);
  },
  getTypingIndicator(from, to) {
    const unsub = db
      .collection("chat-messages")
      .doc(from)
      .collection(to)
      .doc("typing indicator")
      .onSnapshot((doc) => {
        state.typing.typing = doc.data().typing;
      });

    watchEffect((onInvalidate) => {
      onInvalidate(() => unsub());
    });
  },
  sendVideochatNotification(data) {
    let from = state.userDetails.name;

    db.collection("chat-messages")
      .doc(from)
      .collection(data.to)
      .doc("videochat notification")
      .set({
        from: "me",
        videochat: false,
      });

    db.collection("chat-messages")
      .doc(data.to)
      .collection(from)
      .doc("videochat notification")
      .set({
        from: "them",
        videochat: true,
      });
  },
  getVideochatNotification(from, to) {
    const unsub = db
      .collection("chat-messages")
      .doc(from)
      .collection(to)
      .doc("videochat notification")
      .onSnapshot((doc) => {
        state.from = doc.data().from;
        state.videochat = doc.data().videochat;
      });

    watchEffect((onInvalidate) => {
      onInvalidate(() => unsub());
    });
  },
  getUsers() {
    const unsub = db.collection("chat-users").onSnapshot((snap) => {
      console.log("snapshot: getUsers");
      state.users = snap.docs.map((doc) => {
        // return { ...doc.data(), userId: doc.id };
        return doc.data();
      });
      console.log("init users | store: ", state.users);
    });

    watchEffect((onInvalidate) => {
      onInvalidate(() => unsub());
    });
  },
  getOtherUser(to) {
    const unsub = db
      .collection("chat-users")
      .doc(to)
      .onSnapshot((doc) => {
        state.otherUser = doc.data();
        console.log("other user | store", state.otherUser);
      });

    watchEffect((onInvalidate) => {
      onInvalidate(() => unsub());
    });
  },
  getOnlineStatus(id) {
    const unsub = db
      .collection("chat-users")
      .where("name", "==", id)
      .onSnapshot((snapshot) => {
        console.log("snapshot: getOnlineStatus");
        snapshot.docs.map((doc) => {
          state.online = doc.data().online;
          console.log("state: ", state.online);
        });
      });

    watchEffect((onInvalidate) => {
      onInvalidate(() => unsub());
    });
  },
  getToday() {
    state.today = new Date().toLocaleString();
  },
  toggleLeftDrawer() {
    state.leftDrawerOpen = !state.leftDrawerOpen;
  },
  savePeerId(id) {
    db.collection("chat-users").doc(state.userDetails.name).update({
      peerId: id,
    });
  },
};

const getters = {
  filteredUsers() {
    return state.users.filter((user) => {
      return user.userId !== state.userDetails.userId;
    });
  },
  formattedMessages() {
    return state.messages.map((doc) => {
      let time = formatDistanceToNow(doc.createdAt.toDate());

      return { ...doc, createdAt: time };
    });
  },
};

export default {
  state,
  methods,
  getters,
};
