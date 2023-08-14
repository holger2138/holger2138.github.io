import { h } from 'vue';
import DefaultTheme from 'vitepress/theme';
import Home from '@/components/Home.vue';

export default {
  ...DefaultTheme,
  // Layout: Home,

  // Layout() {
  //   return h(DefaultTheme.Layout, null, {
  //     'layout-top': () => h(layout)
  //   });
  // },
  enhanceApp(...args) {
    // console.log(args);
  }
};

// (option.xAxis as XAXisOption[])[0].push(...res);
// (option.xAxis as XAXisOption).data.push(...res);

// (option.series as SeriesOption$1[])[0].push(...res)
// (option.series as SeriesOption$1).data.push(...res)
