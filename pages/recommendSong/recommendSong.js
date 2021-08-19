// pages/recommendSong/recommendSong.js

import request from "../../utils/request";
import PubSub from 'pubsub-js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day: '',
    month: "",
    songList: []
  },

  async getSongList() {


    let result = await request('/recommend/songs');

    this.setData({
      songList: result.recommend
    })



  },
  /* 获取当前时间 */
  getTime() {

    this.setData({
      day: new Date().getDate(),
      month: new Date().getMonth() + 1
    })

  },

  gotoSongDetail(event) {

    let songInfo = event.currentTarget.dataset.data
    wx.navigateTo({
      url: '/pages/songDetail/songDetail',
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('getSongInfo', songInfo)
      }
    })


  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.getTime()
    this.getSongList()
    this.switchMusic()
  },

  switchMusic() {
    PubSub.subscribe('music', (msg, {
      id,
      action
    }) => {
      let {
        songList
      } = this.data
      let musicIndex = songList.findIndex(item => item.id == id)
      let result
      if (action == 'pre') {
        (musicIndex == 0) && (musicIndex = songList.length);
        result = musicIndex - 1
      } else {
        (musicIndex == songList.length - 1) && (musicIndex = -1);
        result = musicIndex + 1
      }
      PubSub.publish('switchMusic', this.data.songList[result]);
    });
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