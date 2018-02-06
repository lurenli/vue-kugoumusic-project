<template>
  <div v-show="detailPlayerFlag">
    <!--<div class="detail_player" :style="{backgroundImage:`url(${audio.imgUrl})`}"></div>-->
    <!--filter blur 实现 模糊图片效果-->
    <div class="detail_player"
         :style="{backgroundImage:`url(${audio.imgUrl})`,filter: 'blur(5px)', '-webkit-filter':'blur(5px)'}"></div>
    <div class="detail_player-content">
      <div class="detail_player-title container">
        <span class="detail_player-back" @click="hideDetailPlayer()"></span>
        {{audio.title}}
      </div>
      <div class="detail_player-img">
        <img :src="audio.imgUrl">
      </div>
      <div class="detail_player-lrc">
        <div class="lrc-content" :style="{marginTop: lrcOffset + 'px' }">
          <p v-for="(item,index) in songLrc"
             :class="{isCurrentLrc:item.seconds >= audio.currentLength}">
            {{item.lrcContent}}</p>
          }
        </div>
      </div>
      <div class="detail_player-range container">
        <span class="detail_player-time">{{audio.currentLength | time}}</span><!--开始为零 0.00-->
        <!--input事件会一直触发，所以禁用range，改为onclick-->
        <!--v-model="audio.currentLength" 绑定歌曲的进度条-->
        <mt-range
          id="range"
          :min="0"
          :max="audio.songLength"
          v-model="audio.currentLength"
          :bar-height="3"
          @click.native="rangeChange($event)" disabled style="width: 80%"></mt-range>
        <span class="detail_player-time">{{audio.songLength | time}}</span><!--歌曲词长-->
      </div>
      <div class="detail_player-control player-padding">
        <i class="detail_player-btn play-prev player_btn-sm" @click="prev()"></i><!--上一首歌曲按钮>-->
        <i class="detail_player-btn play-play player_btn-lg" :class="{'play-pause':isPlay}" @click="toggleStatus()"></i>
        <i class="detail_player-btn play-next player_btn-sm" @click="next()"></i><!--下一首歌曲按钮>-->
      </div>
    </div>
  </div>
</template>

<script type="es6">
  import {mapGetters} from 'vuex';
  export default {
    data(){
      return {
        rangeValue: 0
      }
    },
    filters: {
      time(value){
      	//value 刚开始是歌曲的最长时间秒数
      	//console.log(value + '-----')

        var length = Math.floor(parseInt(value));//向下取整 
        var minute = Math.floor(value / 60);//向下取整 秒数计算成分钟数
       // console.log(minute+'=====')
        if (minute < 10) {
          minute = '0' + minute;
          //console.log(minute)
        }
        var second = length % 60;//计算出秒数
        if (second < 10) {
          second = '0' + second;
        }
        return minute + ':' + second; //格式是 分钟数:秒数
      }
    },
    computed: {
      ...mapGetters(['audio', 'detailPlayerFlag', 'isPlay']),
      songLrc(){
        if (this.audio.lrc) {
          //console.log(this.audio.lrc)
          var temp = this.audio.lrc.split('\r\n')
         //split() 方法用于把一个字符串分割成字符串数组。
          //\r\n回车换行符 ，进行替换
        //  console.log(temp)
          temp = temp.splice(0, temp.length - 1)
          //splice() 方法向/从数组中添加/删除项目，然后返回被删除的项目。
          //splice(index,length) index必需。整数，规定添加/删除项目的位置，使用负数可从数组结尾处规定位置。
          //length 必需。要删除的项目数量。如果设置为 0，则不会删除项目。
          //console.log(temp) 歌词,除去了结尾的空项
          temp = temp.map((value)=> {
            //map遍历数组中的每一项
            //console.log(value + '--')
            var time = value.substr(1, 5)//[00.00]
            //substr(start,length) 方法可在字符串中抽取从 start 下标开始的指定数目的字符
            //start 必需。要抽取的子串的起始下标。必须是数值。如果是负数，那么该参数声明从字符串的尾部开始算起的位置。也就是说，-1 指字符串中最后一个字符，-2 指倒数第二个字符，以此类推。
            //length  可选。子串中的字符数。必须是数值。如果省略了该参数，那么返回从 stringObject 的开始位置到结尾的字串。
            //console.log(time + '======')
            var seconds = parseInt(time.split(':')[0]) * 60 + parseInt(time.split(':')[1])//时间点 2 4 6 8....
          // var  a = parseInt(time.split(':')[0] *60) //转化成数组后，获取第一项
           //var b = parseInt(time.split(':')[1]) //转化成数组后，获取第二项
            //console.log(a +"-----------------")
           //console.log(b+"++++")
           //console.log(seconds)
            var lrcContent = value.substr(10)//获取每一行的字样 ,除去时间点 00.00

           // console.log(lrcContent  + '----------')
            return {
              seconds,
              lrcContent
            }
          })
          return temp;
        }
      },
      lrcOffset(){
        if (this.songLrc) {
          var offset = (this.songLrc.length - document.querySelectorAll('.isCurrentLrc').length - 2) * (-20)
          //console.log(offset)
           
          return this.audio.currentLength + offset - this.audio.currentLength
          //currentLength当前歌词的位置点 秒数
         
        }
      }
    },
    methods: {
      //返回按钮,播放详情页面关闭
      hideDetailPlayer(){
        this.$store.commit("showDetailPlayer", false)
      },
      //快进 ，快退的点击事件
      rangeChange(event){
        var offset = event.offsetX
        var rangeWidth = (document.documentElement.clientWidth - 20) * 0.8 - 20
        var clickLength = Math.floor(offset * this.audio.songLength / rangeWidth)
        if (offset < rangeWidth) {
          this.$store.commit('setAudioTime', clickLength)
          this.$store.commit('setCurrent', true)
        }
      },
      toggleStatus(){//歌曲详情页面播放暂停事件
        if (this.isPlay) {
          document.getElementById('audioPlay').pause()
          $(".detail_player-img").css("animation-play-state", "paused")
        } else {
          document.getElementById('audioPlay').play()
          $(".detail_player-img").css("animation-play-state", "running")
        }
        this.$store.commit('isPlay', !this.isPlay)
      },
      prev(){
        this.$store.dispatch('prev')
      },
      next(){
        this.$store.dispatch('next')
      }
    }
  }
</script>
