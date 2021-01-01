module.exports = {
  title: 'Vue-Act-Master',
  description: 'A frontend-way to separate business logic from application view.',
  base: process.env.DEV ? '/' : '/vue-act-master',

  themeConfig: {
    repo: 'avil13/vue-act-master',
    docsDir: 'packages/docs/src',

    editLinks: true,
    editLinkText: 'Edit this page on GitHub',
    lastUpdated: 'Last Updated',

    sidebar: getSidebar(),
  },
}


function getSidebar() {
  return [
    {
      text: 'Intro', link: '/',
    },
    {
      text: 'Installation', link: '/action/01-installation'
    },
    {
      text: 'Actions',
      children: [
        {
          text: 'Adding actions', link: '/action/02-add-action'
        },
        {
          text: 'Subscribe/Unsubscribe (on/off),once', link: '/action/03-subscribtion'
        },
        {
          text: 'ActMasterAction', link: '/action/04-actions'
        },
      ],
    },
    {
      text: 'Tests',
      children: [

        {
          text: 'ActMaster test-utils', link: '/testing/05-testing'
        },
      ],
    },
  ];
}
