import { auth } from 'src/boot/firebase'

const routes = [
  {
    path: "/",
    component: () => import("../layouts/MainLayout.vue"),
    children: [
      {
        path: "/",
        component: () => import("../pages/post.vue"),
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
        component: () => import("../pages/users.vue"),
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
        component: () => import("../pages/findUser.vue"),
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
        component: () => import("../pages/addPost.vue"),
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
        component: () => import("../pages/auth.vue"),
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
        component: () => import("../pages/chat.vue"),
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
    component: () => import("src/pages/error404.vue"),
  },
];

export default routes;
