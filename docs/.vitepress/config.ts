import { defineConfigWithTheme } from 'vitepress';
import mathjax3 from 'markdown-it-mathjax3';
import { fileURLToPath, URL } from 'node:url';

const customElements = ['mjx-container'];
const themeConfig = {
  logo: '/image.png',
  siteTitle: false,
  nav: [
    { text: 'Guide', link: 'https://vitepress.vuejs.org/guide/what-is-vitepress' },
    { text: 'Configs', link: 'https://vitepress.vuejs.org/config/introduction' },
    { text: 'Changelog', link: 'https://github.com/holger2138/docs-vitepress' }
  ],
  socialLinks: [{ icon: 'github', link: 'https://github.com/holger2138/holger2138.github.io' }],
  sidebar: [
    {
      text: '前端',
      collapsible: true,
      collapsed: false,
      items: [
        { text: 'Guide', link: '/guide' },
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
        { text: 'VitePress相关语法', link: '/guide' }
      ]
    },
    {
      text: '数据结构与算法',
      collapsible: true,
      collapsed: false,
      items: [
        // Data Structures and Algorithms
        { text: '数据结构与算法', link: '/数据结构与算法.md' },
        { text: '面试题及相关数据处理', link: '/面试题及相关数据处理.md' },
        { text: '面试题', link: '/面试题' }
        // {
        //   text: '相关网站',
        //   items: [
        //     {
        //       text: '百度',
        //       link: 'https://www.baidu.com'
        //     }
        //   ]
        // }
      ]
    }
  ],
  footer: {
    message:
      'Released under the MIT License | Copyright © 2022-present <a href="mailto:holger2138@foxmail.com">HOUJIAN<a>'
  }
};

export default defineConfigWithTheme({
  lang: 'zh-CN',
  title: '个人学习博客',
  description: '记录 | 学习 | 笔记 | 前端 | linux',
  base: '/',
  appearance: true,
  markdown: {
    theme: { light: 'vitesse-light', dark: 'monokai' },
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
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('../../docs', import.meta.url))
      }
    }
  },
  themeConfig: themeConfig,
  // lastUpdated: true
});
