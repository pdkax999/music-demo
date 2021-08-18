// pages/songDetail/songDetail.js
import request from "../../utils/request";
var appInstance = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false,
    songInfo: {},
    musicId: ''
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
    let backgroundAudioManager = wx.getBackgroundAudioManager();
    if (isPlay) {

      let musicLink = await request('/song/url', {
        id
      })
      backgroundAudioManager.src = musicLink.data[0].url
      backgroundAudioManager.title = this.data.songInfo.name
      // appInstance.isMusicPlay = true
      // appInstance.musicId = id
      // appInstance
      this.onBackgroundAudioControl(backgroundAudioManager,id)
    } else {
      backgroundAudioManager.pause()
      // appInstance.isMusicPlay = false
    }
  },

  /*  */
  onBackgroundAudioControl(backgroundAudioManager,id) {


    backgroundAudioManager.onPause(() => {
      this.setData({
        isPlay: false
      })
      appInstance.isMusicPlay = false

      console.log('我调用了');
      
    })
    backgroundAudioManager.onPlay(() => {
      this.setData({
        isPlay: true
      })
      appInstance.isMusicPlay = true
      appInstance.musicId = id

    })
  },
  /* 摇杆位置丢失
    页面返回之后实例对象被销毁，再次进入重新初始化  保存  
  */
  /**
   * 生命周期函数--监听页面加载
   */
  /* 返回会销毁当前页面实例 */
  onLoad: function (options) {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('getSongInfo', (songInfo) => {
      this.setData({
        songInfo,
        musicId: songInfo.id
      })
      wx.setNavigationBarTitle({
        title: songInfo.name
      })

      if (appInstance.musicId == songInfo.id && appInstance.isMusicPlay) {

        this.setData({
          isPlay: true
        })

      }

    })
  },
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