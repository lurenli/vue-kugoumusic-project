<template>
	<!--排行列表 某个点击之后的列表-->
	<div class="rank-info-content">
		<div class="rank-banner-wrap" :style="{backgroundImage:'url('+ imgurl + ')'}">
			<div class="rank-status container">
				<p>上次更新时间：{{getToday()}}</p>
			</div>
		</div>
		
		<div class="rank-info-list">
			<mt-cell v-for="(item,index) in songList" :title="item.filename" @click.native="playAudio(index)" :key="index">
				<!--span是列表前面的数字-->
				<span class="rank-index" :class="{'rank-list-good' : index<3, 'rank-list-first' : index==0, 'rank-list-second' : index==1, 'rank-list-third' : index==2}">{{index + 1}}</span>
				<img src="../assets/images/download_icon.png" width="20" height="20">
			</mt-cell>
		</div>
	</div>
</template>

<script>
	import { Indicator } from 'mint-ui'
	import { PLAY_AUDIO } from '../mixins'
	export default {
		mixins: [PLAY_AUDIO],
		data(){
			return {
				imgurl: '',
				songList: [],
				updateTime: '',
				opacity: 0
			}
		},
		/*beforeRouteEnter (to, from, next) {
		    // 在渲染该组件的对应路由被 confirm 前调用
		    // 不！能！获取组件实例 `this`
		    // 因为当钩子执行前，组件实例还没被创建
		  },
		  beforeRouteUpdate (to, from, next) {
		    // 在当前路由改变，但是该组件被复用时调用
		    // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
		    // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
		    // 可以访问组件实例 `this`
		  },
		  beforeRouteLeave (to, from, next) {
		    // 导航离开该组件的对应路由时调用
		    // 可以访问组件实例 `this`
		  }*/
		//通过路由的before钩子解除router-view缓存限制
		beforeRouteEnter (to, from, next) {
			next(vm => {
				console.log(vm)
				vm.$store.commit('showHead', true)
				vm.getList()
				window.onscroll = () => {
					vm.opacity = window.pageYOffset / 250
					vm.$store.commit('setHeadStyle', {background: `rgba(43,162,251,${vm.opacity})`})
				}
			})
		},
		// 导航离开该组件的对应路由时调用 路由进入之前的函数
		beforeRouteLeave(to, from, next){
			this.$store.commit('showHead', false)
			window.onscroll = null
			next()
		},
		mounted(){
			window.onscroll = () => {
				this.opacity = window.pageYOffset / 200
				this.$store.commit('setHeadStyle', {background: `rgba(43,162,251,${this.opacity})`})
			}
		},
		methods: {
			//上次更新时间的时间点
			getToday(){
				const time = new Date()
				const year = time.getFullYear()
				let month = time.getMonth() + 1
				let date = time.getDate()
				if(month < 10) month = '0' + month
				if(date < 10) date = '0' + date
				return `${year}-${month}-${date}`
			},
			getList(){
				//获取不同的排行列表，通过rankid 来传参
				Indicator.open({
					text: '加载中...',
					spinnerType: 'snake'
				})
				var infoID = this.$route.params.id;
				//console.log(this.$route)//打印出当前路由的信息
				this.$http.get(`/proxy/rank/info/?rankid=${infoID}&page=1&json=true`).then(({data}) => {
					Indicator.close()
					const {info, songs} = data
					//ES6	语法 从数组中提取数据const [数值1,数值2] = 数目名
					//ES6	语法 从对象中提取数据const {数值1,数值2} = 对象名
					//ES6	语法 从对象中提取数据const {数值1,数值2:{数值}} = 对象名
					//data.info   data.songs
					const {banner7url, rankname} = info
					const {list} = songs
					this.imgurl = banner7url.replace('{size}', '400')
					//replace() 方法用于在字符串中用一些字符替换另一些字符，或替换一个与正则表达式匹配的子串。
					this.songList = list
					//this.$store.commit('setHeadTitle', rankname)
				})
			}
		}
	}
</script>

<style>
	.rank-list-good {
		display: inline-block;
		padding: 2px 8px;
		left: 12px !important;
		border-radius: 8px;
		color: #fff;
		margin-top: 3px !important;
	}
	
	.rank-list-first {
		background-color: #E80000;
	}
	
	.rank-list-second {
		background-color: #FF7200;
	}
	
	.rank-list-third {
		background-color: #F8B300;
	}
</style>

