# Vue-Act-Master example

## Uses:

- vue 3 (vitejs)
- vue-router
- vue-act-master

### Map of project:

```
├── main.js   . . . . . // Connection of vue-act-master and actions
├── App.vue . . . . . . // Adding a DI and subscribe to login events
├── acts
│   ├── auth  . . . . . // Action Folder
│   │   ├── check.ts  . // Authentication check
│   │   ├── login.ts  . // Authentication or error response
│   │   └── logout.ts . // Logout action
│   ├── di-names.ts
│   ├── event-names.ts
│   └── index.ts  . . . // The file in which all actions are collected
├── api
│   └── api.ts  . . . . // Here are methods for working with API
├── index.css
├── pages
│   ├── login.vue  . . // Sending authorization request and error handling
│   └── main.vue
├── router.ts
└── shims-vue.d.ts

```