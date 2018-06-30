module.exports = {
  title: "GeekHub",
  description: "A team of geeeeky powered and diverse geeks.",
  markdown: {
    lineNumbers: true
  },
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Blog', link: '/blog/' },
      { text: 'About', link: '/about/' },
      { text: 'Github', link: 'https://github.com/geekhub-lab' } 
    ],
    sidebar: 'auto',
    sidebarDepth: 2,
    displayAllHeaders: true,
    searchMaxSuggestions: 10,
    lastUpdated: 'Last Updated',
  },
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],
  ga: "UA-121610926-1"
}