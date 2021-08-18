// pages/songDetail/songDetail.js
import request from "../../utils/request";
import PubSub from 'pubsub-js'
var appInstance = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false,
    songInfo: {},
    musicId: '',
    progress:50
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

  progressBar(){
    
   let duration = this.backgroundAudioManager.duration
   console.log(duration);
    


  },
  updateMusic(songInfo) {
    this.setData({
      songInfo,
      musicId: songInfo.id
    })

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
    this.musicControl(isPlay, this.data.musicId)
  },

  /*播放音频*/
  async musicControl(isPlay, id) {

    if (isPlay) {

      let musicLink = await request('/song/url', {
        id
      })

      
      this.progressBar()

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
      

      backgroundAudioManager

      appInstance.globalData.musicId = this.data.musicId

    })
  },

  handleSwitch(event) {

    let action = event.currentTarget.id

    PubSub.publish('music', {
      action,
      id: this.data.musicId
    });


  },

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