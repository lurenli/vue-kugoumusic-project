<template>
  <div>
    <div class="search-panel">
      <div class="search-input">
        <span class="search-icon"></span>
        <input type="text" v-model="keyword" placeholder="歌手/歌名/拼音" @keydown.enter="search">
      </div>
      <a href="javascript:;" @click="search" class="search-btn">搜索</a>
    </div>

    <div class="search-list" v-show="togglePanel">
      <div class="search-list-title">最近热门</div>
      <mt-cell v-for="(item,index) in hotList" :title="item.keyword" @click.native="replaceInput(index)" :key="index"></mt-cell>
    </div>

    <div class="songs-list" v-show="!togglePanel">
      <div class="search-total">
        共有{{total}}条搜索结果
      </div>
      <mt-cell v-for="(item,index) in songList" :title="item.filename" @click.native="playAudio(index)" :key="index">
        <img src="../assets/images/download_icon.png" width="20" height="20">
      </mt-cell>
    </div>
  </div>
</template>

<script type="es6">
  import { Indicator } from 'mint-ui'
  import { PLAY_AUDIO } from '../mixins'
  import { MessageBox } from  'mint-ui';
  export default {
    mixins: [PLAY_AUDIO],
    data(){
      return {
        keyword: '',
        hotList: [],
        togglePanel: true,
        total: null,
	      songList: []

      }
    },
    created(){
    	this.getList()
    },
    methods: {
      //最近热门歌曲类型列表
      getList(){
        Indicator.open({
          text: '加载中...',
          spinnerType: 'snake'
        });
        this.$http.get('/aproxy/api/v3/search/hot?format=json&plat=0&count=30').then(({data})=> {
					Indicator.close();
	        this.hotList = data.data.info
        });
      },
      //最近热门 列表的点击事件
      replaceInput(index){
        this.keyword = this.hotList[index].keyword
        this.Search()
      },
      //搜索事件
      search(){
	      if(this.keyword){
          this.togglePanel = false
          this.$http.get(`/aproxy/api/v3/search/song?format=json&keyword=${this.keyword}&page=1&pagesize=30&showtype=1`).then(({data})=> {
  	        this.songList = data.data.info
  	        this.total = data.data.total
            Indicator.close()
          })
        }else{
           MessageBox('提示','请输入您想搜索的东东');
           this.togglePanel = true
        }
      }
    }
  }
</script>
