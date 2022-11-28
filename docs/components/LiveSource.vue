<template>
  <h3>自定义组件</h3>
  <h3 @click="genLiveSorceFile">获取电视源点击复制</h3>
  <div class="grid-container">
    <div v-for="item in data" :key="item.name" @click="copy(item)">{{ item.name }}</div>
  </div>
</template>
<script setup>
import axios from 'axios';
import { reactive, ref, onMounted } from 'vue';
import { isMobile } from '@/utils';

const data = reactive([]);
function copy(item) {
  const { name, url } = item;
  console.log(name, url);
  isMobile() ? window.open(url) : navigator.clipboard.writeText(url);
}

onMounted(() => {
  genLiveSorceFile();
});

const uri = ref('https://raw.githubusercontent.com/Kimentanm/aptv/master/m3u/iptv.m3u');
const filterList = reactive(['央视IPV6', '卫视IPV6', '其他']);
function handleData(res) {
  const groupByTitleList = filterList.reduce((intialVal, item, index) => {
    const reg = new RegExp(`.*group-title="${item}".*[\r\n|\n].*`, 'g');
    const sortReg = /CCTV(\d+)/;
    const result = res.data.match(reg) || [];
    intialVal[item] =
      index === 0
        ? result.sort((a, b) => {
            const n1 = a.match(sortReg)?.[1] || result.length;
            const n2 = b.match(sortReg)?.[1] || result.length;
            // console.log(a.match(sortReg)?.[1], b.match(sortReg)?.[1]);
            return n1 - n2;
          })
        : result;
    return intialVal;
  }, {});

  const list = Object.values(groupByTitleList)
    .reduce((data, el) => data.concat(...el), [])
    .map(item => {
      const reg = /group-title=".*?",(.*)[\r\n|\n](.*)/;
      const [, name, url] = item.match(reg);
      return { name, url };
    });
  console.log(list);
  data.push(...list);
}

async function genLiveSorceFile() {
  let flag = true,
    res;
  // 用于处理国内无法访问外网，通过 github CICD 远程下载进行处理
  try {
    res = await axios.get(uri.value);
  } catch (error) {
    flag = false;
    res = await axios.get('/iptv.m3u');
  }
  flag ? console.log('通过网络请求') : console.log('通过本地请求');
  handleData(res);
}
</script>

<style>
.grid-container {
  margin-top: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: repeat(4, 1fr);
  gap: 20px 20px;
}
.grid-container > div {
  border-radius: 5px;
  line-height: 40px;
  text-align: center;
  background-color: skyblue;
}
</style>
