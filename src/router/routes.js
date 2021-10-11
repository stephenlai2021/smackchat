import { auth } from 'src/boot/firebase'

const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout"),
    children: [
      {
        path: "/",
        component: () => import("pages/post"),
        beforeEnter: (to, from, next) => {
          auth.onAuthStateChanged((user) => {
            if (user) {
              console.log("user is logged in | route guard");
              next();
            } else {
              console.log("user logged out | route guard");
              next("/auth");
            }
          });
        },
      },
      {
        path: "/users",
        component: () => import("pages/users"),
        beforeEnter: (to, from, next) => {
          auth.onAuthStateChanged((user) => {
            if (user) {
              console.log("user is logged in | route guard");
              next();
            } else {
              console.log("user logged out | route guard");
              next("/auth");
            }
          });
        },
      },
      {
        path: "/finduser",
        component: () => import("pages/findUser"),
        beforeEnter: (to, from, next) => {
          auth.onAuthStateChanged((user) => {
            if (user) {
              console.log("user is logged in | route guard");
              next();
            } else {
              console.log("user logged out | route guard");
              next("/auth");
            }
          });
        },
      },
      {
        path: "/addpost",
        component: () => import("pages/addPost"),
        beforeEnter: (to, from, next) => {
          auth.onAuthStateChanged((user) => {
            if (user) {
              console.log("user is logged in | route guard");
              next();
            } else {
              console.log("user logged out | route guard");
              next("/auth");
            }
          });
        },
      },
      {
        path: "/auth",
        component: () => import("pages/auth"),
        beforeEnter: (to, from, next) => {
          auth.onAuthStateChanged((user) => {
            if (user) {
              console.log("user is logged in | route guard");
              next();
            } else {
              console.log("user logged out | route guard");
              next();
            }
          });
        },
      },
      {
        path: "/chat/:from/:to",
        name: "chat",
        component: () => import("pages/chat"),
        beforeEnter: (to, from, next) => {
          auth.onAuthStateChanged((user) => {
            if (user) {
              console.log("user is logged in | route guard");
              next();
            } else {
              console.log("user logged out | route guard");
              next("/auth");
            }
          });
        },
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/error404"),
  },
];

export default routes;
