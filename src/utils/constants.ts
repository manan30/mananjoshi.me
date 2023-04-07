export const links = (url: URL) => [
  { text: 'Home', href: '/', highlighted: url.pathname === '/' },
  {
    text: 'Journey',
    href: '/journey',
    highlighted: url.pathname.includes('/journey')
  },
  {
    text: 'Articles',
    href: '/articles',
    highlighted: url.pathname.includes('/articles')
  },
  {
    text: 'Resume',
    href: '/resume.pdf'
  }
  // {
  //   text: 'Projects',
  //   href: '/projects',
  //   highlighted: url.pathname.includes('/projects')
  // }
];
