import { defineConfig, HeadConfig } from 'vitepress'
import { DefaultTheme } from 'vitepress/types';

const baseUrl = process.env.DEV ? '/' : '/vue-act-master';

module.exports = defineConfig({
  lang: 'en-US',
  title: 'Act-Master',
  description: 'A frontend-way to separate business logic from application view.',
  base: baseUrl,
  head: getHead(),
  markdown: {
    headers: false,
    toc: {
      level: [1],
      shouldAllowNested: false
    },
  },
  lastUpdated: true,
  cleanUrls: true,
  themeConfig: {
    logo: '/assets/act-master-logo.svg',

    editLink: {
      pattern: 'https://github.com/avil13/vue-act-master/packages/docs/src:path',
      text: 'Edit this page on GitHub'
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/avil13/vue-act-master' }
    ],

    algolia: {
      appId: 'AQG3LF64RJ',
      apiKey: '9f0fdad2d4a7100a6d70b1e8fa5a136c',
      indexName: 'vue-act-master',
    },

    nav: [
      {
        text: 'Guide', link: '/guide/',
        items: [
          { text: 'Installation', link: '/guide/installation.html' },
        ]
      },
    ],

    sidebar: getSidebar(),
  },
});


function getSidebar(filterItem = ''): DefaultTheme.SidebarItem[] {
  return [
    { text: 'Intro', link: '/' },
    { text: 'Installation', link: '/guide/installation.html' },

    {
      text: 'Actions',
      items: [
        {
          text: 'Adding actions',
          link: '/v1/action/02-add-action',
        },
        {
          text: 'Subscribe/Unsubscribe (on/off),once',
          link: '/v1/action/03-subscribtion',
        },
        {
          text: 'ActMasterAction',
          link: '/v1/action/04-actions',
        },
        {
          text: 'VanillaJS, React, or Composition API',
          link: '/v1/action/05-composition-api',
        },
      ],
    },
    {
      text: 'Tests',
      items: [
        {
          text: 'ActMaster test-utils',
          link: '/v1/testing/05-testing',
        },
      ],
    },
    {
      text: 'Advanced',
      items: [
        {
          text: 'Advanced unsubscribe',
          link: '/v1/advanced/06-subsList',
        },
        {
          text: 'Advanced single execution',
          link: '/v1/advanced/07-single-execution',
        },
        {
          text: 'Advanced emit many results',
          link: '/v1/advanced/08-emit-many-results',
        },
        {
          text: 'Convert function to action',
          link: '/v1/advanced/09-function-to-action',
        },
      ],
    },
    {
      text: 'Tips and tricks',
      items: [
        {
          text: 'WebSocket',
          link: '/v1/tips/web-socket',
        },
      ],
    },
  ];
}



function getHead(): HeadConfig[] {
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
    ['meta', { name: 'theme-color', content: '#3c8772' }],
  ];
}
