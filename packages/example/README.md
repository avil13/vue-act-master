# Vue-Act-Master example

## Uses:

- vue 3 (vitejs)
- vue-router
- vue-act-master

### Map of project:

```
├── App.vue . . . . . . // Adding a DI and subscribe to login events
├── acts
│   ├── auth  . . . . . // Action Folder
│   │   ├── check.ts  . // Authentication check
│   │   ├── login.ts  . // Authentication or error response
│   │   └── logout.ts . // Logout action
│   ├── di-names.ts
│   ├── event-names.ts
│   └── index.ts  . . . // The file in which all actions are collected.
├── api
│   └── api.ts  . . . . // Here are methods for working with API.
├── index.css
├── main.js   . . . . . // Connection of vue-act-master and action.
├── pages
│   ├── login.vue
│   └── main.vue
├── router.ts
└── shims-vue.d.ts

```