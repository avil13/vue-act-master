const baseUrl = process.env.DEV ? '/' : '/vue-act-master'

module.exports = {
  title: 'Vue-Act-Master',
  description: 'A frontend-way to separate business logic from application view.',
  base: baseUrl,

  head: getHead(),

  themeConfig: {
    repo: 'avil13/vue-act-master',
    docsDir: 'packages/docs/src',

    editLinks: true,
    editLinkText: 'Edit this page on GitHub',
    lastUpdated: 'Last Updated',

    algolia: {
      apiKey: 'edacacfa4a106834b28b9016bb5c3bfd',
      indexName: 'vue-act-master',
    },

    sidebar: getSidebar(),
  },
};


function getSidebar() {
  return [{
      text: 'Intro',
      link: '/',
    },
    {
      text: 'Installation',
      link: '/action/01-installation'
    },
    {
      text: 'Actions',
      children: [{
          text: 'Adding actions',
          link: '/action/02-add-action'
        },
        {
          text: 'Subscribe/Unsubscribe (on/off),once',
          link: '/action/03-subscribtion'
        },
        {
          text: 'ActMasterAction',
          link: '/action/04-actions'
        },
      ],
    },
    {
      text: 'Tests',
      children: [{
        text: 'ActMaster test-utils',
        link: '/testing/05-testing'
      }, ],
    },
    {
      text: 'Advanced',
      children: [{
        text: 'Advanced methods',
        link: '/advanced/06-advanced'
      }, ],
    },
    {
      text: 'Tips and tricks',
      children: [{
        text: 'WebSocket',
        link: '/tips/web-socket'
      }, ],
    },
  ];
}



function getHead() {
  return [
    ['link', {
      rel: 'icon',
      href: `${baseUrl}/icon.svg`,
      type: 'image/svg+xml',
      sizes: 'any'
    }],
    ['link', {
      rel: 'icon',
      href: `${baseUrl}/favicon.ico`
    }], // <!-- 32×32 -->
    ['link', {
      rel: 'apple-touch-icon',
      href: `${baseUrl}/apple.png`
    }], // <!-- 180×180 -->
    ['link', {
      rel: 'manifest',
      href: `${baseUrl}/manifest.json`
    }],
  ];
}
