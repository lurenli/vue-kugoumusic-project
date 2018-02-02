import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios';
Vue.use(Vuex)

export const store = new Vuex.Store({
	state: {
		audio: {
			songUrl: '',
			imgUrl: 'http://m.kugou.com/v3/static/images/index/logo_kugou.png',
			title: '',
			singer: '',
			currentLength: 0,
			songLength: 0,
			currentFlag: false
		},
		head: {
			toggle: false,
			title: '',
			style: {'background': 'rgba(43,162,251,0)'}
		},
		headNav: 'head-nav1',
		audioLoadding: false,
		detailPlayerFlag: false,
		showPlayer: false,
		listenCount: 0,
		isPlay: false,
		listInfo: {
			songList: [],
			songIndex: 0
		}
	},
	getters: {
		headNav: state => state.headNav,
		audio: state => state.audio,
		head: state => state.head,
		audioLoadding: state => state.audioLoadding,
		detailPlayerFlag: state => state.detailPlayerFlag,
		showPlayer: state => state.showPlayer,
		isPlay: state => state.isPlay
	},
	mutations: {
		//state 就是上面定义的state  
		//flag是子组件传过来的事件true  or  falase   
		//time是子组件传过来的时间
		setAudio(state, audio){
			if (!state.listenCount) {
				state.showPlayer = true //首次进入应用时不可打开播放详情
			}
			state.listenCount++
			state.audio = {...(state.audio), ...audio}
		},
		//歌曲时间点
		setAudioTime(state, time){
			state.audio.currentLength = time
		},
		//拖动歌曲进度条
		setCurrent(state, flag){
			state.audio.currentFlag = flag
		},
		//展示头部
		showHead(state, flag){
			state.head.toggle = flag
		},
		//排行每个列表的标题
		setHeadTitle(state, title){
			console.log(title)
			state.head.title = title
		},
		setHeadStyle(state, style){
			state.head.style = style
		},
		resetHeadStyle: state => {
			state.head.style = {'background': 'rgba(43,162,251,0)'}
		},
		toggleAudioLoadding: (state, flag) => {
			state.audioLoadding = flag
		},
		setHeadNav: (state, nav) => {
			state.headNav = nav
		},
		//播放详情页面
		showDetailPlayer: (state, flag) => {
			//console.log(state )
			//console.log(flag +'===')
			//detailPlayerFlag播放详情页面 设置true or  false 
			state.detailPlayerFlag = flag
		},
		showPlayer: (state, flag) => {
			state.showPlayer = flag
		},
		isPlay: (state, flag) => {
			//console.log(state)
			//console.log(flag)
			state.isPlay = flag
		},
		setLrc: (state, lrc) => {
			state.audio = {...(state.audio), lrc}
			//把歌词信息存放在audio 里面
		},
		setListInfo: (state, {list, index}) => {
			//console.log(list)
			//console.log(getSong)
			state.listInfo.songList = list
			state.listInfo.songIndex = index
		}
	},
	actions: {
		//commit=>mutations,用来触发同步操作的方法。
        //dispatch =>actions,用来触发异步操作的方法。
		getSong({commit, state}, hash){
             //console.log(commit + '----')
             // console.log(state  + '==')
             // console.log(hash  + '===========')
			commit('toggleAudioLoadding', true)
			axios.get(`/bproxy/yy/index.php?r=play/getdata&hash=${hash}`).then(({data}) => {
				data = data.data
				const songUrl = data.play_url
				//获取每一首歌曲的图片
				const imgUrl = data.img
				const title = data.audio_name
				const songLength = data.timelength / 1000
			
				const singer = data.author_name
				const currentLength = 0;
				const lrc = data.lyrics
				const	audio = {songUrl, imgUrl, title, singer, songLength, currentLength}
				commit('setAudio', audio)
				commit('setLrc', lrc)
				commit('toggleAudioLoadding', false)
			})
		},
		//上一首歌曲事件
		prev({dispatch, state}){
			var list = state.listInfo.songList
			if (state.listInfo.songIndex == 0) {
				state.listInfo.songIndex = list.length
			} else {
				state.listInfo.songIndex--
			}
			var hash = list[state.listInfo.songIndex].hash
			dispatch('getSong', hash)
			dispatch('getLrc', hash)
		},
		//下一首歌曲事件
		next({dispatch, state}){
			//console.log(dispatch)
			var list = state.listInfo.songList
			if (state.listInfo.songIndex == list.length - 1) {
				state.listInfo.songIndex = 0
			} else {
				++state.listInfo.songIndex
			}
			var hash = list[state.listInfo.songIndex].hash
			dispatch('getSong', hash)
			dispatch('getLrc', hash)
		}
	}
})
