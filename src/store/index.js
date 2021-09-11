import { reactive, watchEffect } from "vue";
import { auth, db, disk, timestamp } from "src/boot/firebase";
import { formatDistanceToNow } from "date-fns";
import router from "../router";
import { route } from "quasar/wrappers";

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
  // avatar: null,
  user: {},
  darkMode: false,
  chinese: false,
  desktop: false,
  login: false,
  tab: "home",
  to: null,
  geoLocation: null,
  // userName: null,

  // storeage
  url: null,
  error: null,
  progress: null,
  uploadCompleted: false,

  isChatPage: false,
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

          db.collection("chat-users").doc(state.userDetails.name).update({
            avatar: state.url,
          });
        }
      );
    })
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
        }
      );
    });
  },
  // saveOtherPeerId(to, id) {
  //   db.collection("chat-users").doc(to).update({
  //     peerId: id,
  //   });
  // },
  // savePeerId() {
  //   db.collection("chat-users").doc(state.userDetails.userId).update({
  //     peerId: state.peerId,
  //   });
  // },
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

              db.collection("chat-users")
                .doc(state.userDetails.name)
                .update({ online: true })
                .then(() => {
                  state.online = true;
                  state.login = false;
                });
            });
          })
          .catch((err) => {
            console.log("error message: ", err.message);
          });
      }
      if (!user) {
        console.log("there is no user | auth state change");
        state.userDetails = {};
        state.online = false;

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
          avatar: data.avatar,
          userId: user.uid,
          geolocation: null,
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
        .update({ online: false })
        .then(() => {
          console.log("user is offline");
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
        // state.typing = doc.data()
        state.typing.typing = doc.data().typing;
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
  getUser(to) {
    const unsub = db
      .collection("chat-users")
      .doc(to)
      .onSnapshot((doc) => {
        state.otherUser = doc.data();
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
