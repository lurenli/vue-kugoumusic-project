<template>
  <div class="header-nav">
    <mt-navbar v-model="headNav" class="container">
      <mt-tab-item id="head-nav1">新歌</mt-tab-item>
      <mt-tab-item id="head-nav2">排行</mt-tab-item>
      <mt-tab-item id="head-nav3">歌单</mt-tab-item>
      <mt-tab-item id="head-nav4">歌手</mt-tab-item>
    </mt-navbar>
  </div>
</template>
<!--setter：设置值时触发。

    getter：获取值时触发，与setter是没有必然联系的-->
<script type="es6">
  export default {
    name: 'head-nav',
    computed: {
    	headNav: {
        //get和set属于ES5的东西..
        //简单说当你读取一个变量的时候会触发该变量的getter.
        //当你修改该变量时候会触发他的setter.
    		get(){
    			return this.$store.getters.headNav
		    },
		    set(nav) {
          //console.log(nav)// 就是对应的id
    			const index = nav.substr(-1) //substr(start,length) substr() 方法可在字符串中抽取从 start 下标开始的指定数目的字符。 -1 指字符串中最后一个字符，-2 指倒数第二个字符，以此类推。
         // console.log(index)
					this.$store.commit('setHeadNav', nav) //commit    获取headnav 的值 向上提交
			    this.goRouter(Number(index))
		    }
	    }
    },
    methods: {
      goRouter(index){
        switch (index) {
          case 1:
            this.$router.push({path: '/'});
            break;
          case 2:
            this.$router.push({path: '/rank'});
            break;
          case 3:
            this.$router.push({path: '/plist'});
            break;
          case 4:
            this.$router.push({path: '/singer'});
            break;
        }
      }
    }
  }
</script>

<style>
  .mint-tab-item {
    padding: 12px 0 !important;
  }

  .mint-tab-item-label {
    font-size: 16px !important;
  }
</style>
