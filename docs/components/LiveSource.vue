<template>
  <h3>自定义组件</h3>
  <button @click="download(true)">下载电视源</button>
  <br />
  <button @click="download(false)">预览电视源</button>
  <div class="grid-container">
    <div v-for="item in data" :key="item.tvName" class="tv">
      <div>{{ item.tvName }}</div>
      <div class="source">
        <span v-if="item.ipv4" @click="copy({ ...item, url: item.ipv4 })">IPV4</span>
        <span v-if="item.ipv6" @click="copy({ ...item, url: item.ipv6 })">IPV6</span>
      </div>
    </div>
  </div>
</template>
<script setup>
import axios from 'axios';
import { reactive, ref } from 'vue';
import { isMobile } from '@/utils';

const data = reactive([]);
function copy(item) {
  const { url, ...others } = item;
  console.log(others);
  isMobile() ? window.open(url) : navigator.clipboard.writeText(url);
}

async function download(isdownload) {
  const data = await genLiveSorceFile();
  const blob = new Blob([data], {
    type: 'text/plain;charset=utf-8'
  });
  const url = URL.createObjectURL(blob);

  setTimeout(() => {
    if (isdownload) {
      const a = document.createElement('a');
      a.href = url;
      a.setAttribute('download', 'iptv.m3u');
      a.click();
    } else {
      window.open(url);
    }
    URL.revokeObjectURL(url);
  }, 500);
}

const uri = ref('https://raw.githubusercontent.com/Kimentanm/aptv/master/m3u/iptv.m3u');
const filterList = reactive(['央视IPV6', '卫视IPV6', '央视', '卫视']);
async function getLiveSource() {
  const res = await genLiveSorceFile();
  const groupByTitleList = filterList.reduce((intialVal, item, index) => {
    const reg = new RegExp(`.*group-title="${item}".*[\r\n|\n].*`, 'g');
    const sortReg = /CCTV(\d+)/;
    const result = res.match(reg) || [];
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
    .flat()
    .reduce((initialiVal, item) => {
      const reg = /tvg-name="(.*?)".*group-title="(.*?)",(.*)[\r\n|\n](.*)/;
      const [, tvgName, groupTitle, name, url] = item.match(reg);
      const tvName = (tvgName || name).trim();
      initialiVal[tvName] ??= { tvName };
      groupTitle.includes('IPV6')
        ? (initialiVal[tvName].ipv6 = url)
        : (initialiVal[tvName].ipv4 = url);
      return initialiVal;
    }, {});
  data.push(...Object.values(list));
}

getLiveSource();

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
  return res.data;
}
</script>

<style lang="scss">
.grid-container {
  margin-top: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: repeat(4, 1fr);
  gap: 20px 20px;

  .tv {
    padding: 10px;
    border-radius: 5px;
    background-color: skyblue;
    text-align: center;
    line-height: 40px;
    display: flex;
    align-items: stretch;
    flex-flow: column nowrap;

    .source {
      display: flex;
      justify-content: space-around;

      span {
        flex: 0 1 40%;
        border-radius: 5px;
        background-color: rgba($color: antiquewhite, $alpha: 0.5);
        cursor: pointer;
        &:hover {
          border-radius: 10px;
          transform: scale(1.1);
        }
      }
    }
  }
}
</style>
