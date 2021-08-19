// pages/songDetail/songDetail.js
import request from "../../utils/request";
import PubSub from 'pubsub-js'
import dayjs from "dayjs";
var appInstance = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false,
    songInfo: {}, //音乐信息
    musicId: '', //音乐ID
    progress: 0, //进度条
    duration: '00:00',
    currentTime: '00:00',
    musicLink: ''
  },

  onLoad: function (options) {

    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('getSongInfo', (songInfo) => {

      this.updateMusic(songInfo)

      if (appInstance.globalData.musicId == songInfo.id && appInstance.globalData.isMusicPlay) {

        this.setData({
          isPlay: true
        })

      }

    })

    this.backgroundAudioManager = wx.getBackgroundAudioManager();

    this.onBackgroundAudioControl(this.backgroundAudioManager)

    /* 进度条 */


    PubSub.subscribe('switchMusic', (msg, songInfo) => {

      this.updateMusic(songInfo)

      this.musicControl(true, this.data.musicId)

    })
  },

  /* 更新当前歌曲信息 */
  updateMusic(songInfo) {

    this.setData({
      songInfo,
      musicId: songInfo.id,
      duration: dayjs(songInfo.duration).format('mm:ss'),

    })
    /* 保存歌曲总时间 */
    this.duration = songInfo.duration

    wx.setNavigationBarTitle({
      title: songInfo.name
    })
  },

  onMusicPlay() {
    let isPlay = !this.data.isPlay
    // this.setData({
    //   isPlay
    // })
    /* 更具功能划分函数利于维护 */
    let {
      musicLink
    } = this.data
    this.musicControl(isPlay, this.data.musicId, musicLink)
  },

  /*播放音频*/
  async musicControl(isPlay, id, musicLink) {

    if (isPlay) {

      if (!musicLink) {
        let musicData = await request('/song/url', {
          id
        })
        musicLink = musicData.data[0].url
        this.setData({
          musicLink
        })
      }

      this.backgroundAudioManager.src = musicLink
      this.backgroundAudioManager.title = this.data.songInfo.name

    } else {
      this.backgroundAudioManager.pause()
      // appInstance.isMusicPlay = false
    }
  },

  /*  */
  onBackgroundAudioControl(backgroundAudioManager) {

    backgroundAudioManager.onPause(() => {

      this.setAudioStatus(false)

    })
    backgroundAudioManager.onStop(() => {

      this.setAudioStatus(false)

    })

    backgroundAudioManager.onPlay(() => {

      this.setAudioStatus(true)
      appInstance.globalData.musicId = this.data.musicId

    })

    backgroundAudioManager.onEnded(() => {
      this.setData({
        currentTime: '00:00',
        progress: 0
      })
      PubSub.publish('music',{
        action: 'next',
        id: this.data.musicId
      });
    })

    backgroundAudioManager.onTimeUpdate(() => {

      let currentTime = Math.floor(backgroundAudioManager.currentTime)

      let duration = Math.floor(this.duration / 1000)

      this.setData({
        currentTime: dayjs(backgroundAudioManager.currentTime * 1000).format('mm:ss'),
        progress: Math.floor((currentTime / duration) * 100)
      })
    })
  },

  handleSwitch(event) {

    let action = event.currentTarget.id

    this.backgroundAudioManager.stop()

    PubSub.publish('music', {
      action,
      id: this.data.musicId
    });
  },

  /* 更新播放状态的函数*/
  setAudioStatus(status) {
    this.setData({
      isPlay: status
    })
    appInstance.globalData.isMusicPlay = status
  },
  /* 摇杆位置丢失
    页面返回之后实例对象被销毁，再次进入重新初始化  保存  
  */
  /**
   * 生命周期函数--监听页面加载
   */
  /* 返回会销毁当前页面实例 */

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})