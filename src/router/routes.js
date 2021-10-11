import { auth } from 'src/boot/firebase'
import MainLayout from 'layouts/MainLayout';
import Posts from 'pages/Posts';
import Users from 'pages/Users';
import FindUser from 'pages/FindUser';
import AddPost from 'pages/AddPost';
import Auth from 'pages/Auth';
import Chat from 'pages/Chat';

const routes = [
  {
    path: "/",
    // component: () => import("src/layouts/MainLayout.vue"),
    component: MainLayout,
    children: [
      {
        path: "/",
        // component: () => import("src/pages/Post.vue"),
        component: Posts,
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
        // component: () => import("src/pages/Users.vue"),
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
        // component: () => import("src/pages/FindUser.vue"),
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
        path: "/addpost",
        // component: () => import("src/pages/AddPost.vue"),
        component: AddPost,
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
        // component: () => import("src/pages/Auth.vue"),
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
        name: "chat",
        // component: () => import("src/pages/Chat.vue"),
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
