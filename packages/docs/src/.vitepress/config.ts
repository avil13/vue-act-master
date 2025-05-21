import { defineConfig, type DefaultTheme, type HeadConfig } from 'vitepress';

const baseUrl = process.env.DEV ? '/' : '/vue-act-master';

export default defineConfig({
  lang: 'en-US',
  title: 'Act-Master',
  description:
    'A frontend-way to separate business logic from application view.',
  base: baseUrl,
  head: getHead(),
  markdown: {
    headers: false,
    toc: {
      level: [1],
      shouldAllowNested: false,
    },
  },
  lastUpdated: false,
  cleanUrls: true,
  themeConfig: {
    logo: '/assets/act-master-logo.svg',

    editLink: {
      pattern:
        'https://github.com/avil13/vue-act-master/packages/docs/src/:path',
      text: 'Edit this page on GitHub',
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/avil13/vue-act-master' },
    ],

    algolia: {
      appId: 'AQG3LF64RJ',
      apiKey: '9f0fdad2d4a7100a6d70b1e8fa5a136c',
      indexName: 'vue-act-master',
    },

    nav: [
      {
        text: 'Quick Start',
        items: getSidebar(),
      },
    ],

    sidebar: getSidebar(),
  },
});

function getSidebar(filterItem = ''): DefaultTheme.NavItemWithLink[] {
  return [
    // { text: 'Intro', link: '/' },
    { text: 'Installation', link: '/guide/installation.html' },
    { text: 'ActMasterAction', link: '/guide/act-master-action.html' },
    { text: 'exec and subscribe', link: '/guide/exec-and-subscribe.html' },
    { text: 'Testing', link: '/guide/testing.html' },
    { text: 'Act-Master-cli', link: '/guide/cli.html' },
  ];
}

function getHead(): HeadConfig[] {
  return [
    [
      'link',
      {
        rel: 'icon',
        href: `${baseUrl}/icon.svg`,
        type: 'image/svg+xml',
        sizes: 'any',
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        href: `${baseUrl}/favicon.ico`,
      },
    ], // <!-- 32×32 -->
    [
      'link',
      {
        rel: 'apple-touch-icon',
        href: `${baseUrl}/apple.png`,
      },
    ], // <!-- 180×180 -->
    [
      'link',
      {
        rel: 'manifest',
        href: `${baseUrl}/manifest.json`,
      },
    ],
    ['meta', { name: 'theme-color', content: '#3c8772' }],

    ['meta', { property: 'og:type', content: 'website' }],
  ];
}
