const NEXT_PUBLIC_SHOWCASE_LIST = process.env.NEXT_PUBLIC_SHOWCASE_LIST

const ENV_SHOWCASE_LIST = NEXT_PUBLIC_SHOWCASE_LIST && NEXT_PUBLIC_SHOWCASE_LIST.split(',').map(i => {
  return {
    url: i
  }
}) || []

export const showcases = [
  {
    // title: 'Landing Page Boilerplate',
    url: 'https://landingpage.weijunext.com',
    // logo: '',
    // og: 'https://landingpage.weijunext.com/og.png'
  },
  {
    url: 'https://PHCopilot.ai/'
  },
  {
    url: 'https://regeai.com/'
  },
].concat(ENV_SHOWCASE_LIST)