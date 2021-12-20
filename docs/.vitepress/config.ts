import { DefaultTheme, defineConfig } from 'vitepress';
import mathjax3 from 'markdown-it-mathjax3';

const customElements = ['mjx-container'];
const themeConfig: DefaultTheme.Config = {
  logo: '/logo.svg',
  siteTitle: 'vitePress',
  nav: [
    { text: 'Guide', link: 'https://vitepress.vuejs.org/guide/what-is-vitepress' },
    { text: 'Configs', link: 'https://vitepress.vuejs.org/config/introduction' },
    { text: 'Changelog', link: 'https://github.com/holger2138/docs-vitepress' }
  ],
  socialLinks: [{ icon: 'github', link: 'https://github.com/holger2138/docs-vitepress' }],
  sidebar: [
    {
      text: '前端',
      collapsible: true,
      collapsed: false,
      items: [
        { text: 'DOM', link: '/DOM' },
        { text: 'vue', link: '/vue 源码分析' },
        { text: 'js高级', link: '/js高级' },
        { text: 'TypeScript', link: '/TypeScript' }
      ]
    },
    {
      text: '计算机相关',
      collapsible: true,
      collapsed: false,
      items: [
        { text: '计算机网络', link: '/计算机网络' },
        { text: 'Linux', link: '/Linux' }
      ]
    },
    {
      text: '工具相关',
      collapsible: true,
      collapsed: false,
      items: [
        { text: 'Tool-Document', link: '/Tool-Document.md' },
        { text: 'VitePress相关语法', link: '/' }
      ]
    },
    {
      text: '数据结构与算法',
      collapsible: true,
      collapsed: false,
      items: [
        { text: '数据结构与算法', link: '/数据结构与算法.md' },
        { text: '面试题及相关数据处理', link: '/面试题及相关数据处理.md' },
        { text: '面试题', link: '/面试题' },
        {
          text: '相关网站',
          items: [
            {
              text: '百度',
              link: 'https://www.baidu.com'
            }
          ]
        }
      ]
    }
  ],
  footer: {
    message: 'Released under the MIT License.',
    copyright: 'Copyright © 2022-present HOUJIAN'
  }
};

export default defineConfig({
  lang: 'zh-CN',
  title: 'VitePress',
  description: 'docs',
  base: '/',
  appearance: true,
  markdown: {
    theme: { light: 'dracula-soft', dark: 'monokai' },
    lineNumbers: true,
    config(md) {
      md.use(mathjax3);
    }
  },
  vue: {
    template: {
      compilerOptions: {
        isCustomElement: tag => customElements.includes(tag)
      }
    }
  },
  themeConfig,
  lastUpdated: true
});
