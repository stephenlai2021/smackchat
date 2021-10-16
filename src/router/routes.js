import { auth } from 'src/boot/firebase'
import MainLayout from 'layouts/MainLayout';
import Users from 'pages/Users';
import FindUser from 'pages/FindUser';
import Auth from 'pages/Auth';
import Chat from 'pages/Chat';

const routes = [
  {
    path: "/",
    component: MainLayout,
    children: [
      {
        path: "/",
        component: Users,
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
        component: FindUser,
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
        component: Auth,
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
        component: Chat,
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
    component: () => import("src/pages/Error404.vue"),
  },
];

export default routes;
