// pages/personal/personal.js

import request from "../../utils/request";

let moveCoord = {}


Page({
  /**
   * 页面的初始数据
   */
  data: {
    translateY: 'translateY(0rpx)',
    transition: '',
    userInfo: {},
    playlist: [] //播放列表
  },
  /* 
    个人中心过渡效果
    怎么动 动多少 ，什么时候动
  */
  handelTouchstart(event) {

    moveCoord.start = event.touches[0].clientY

    this.setData({
      transition: ''
    })

  },
  handelTouchmove(event) {

    moveCoord.end = event.touches[0].clientY

    let disY = moveCoord.end - moveCoord.start

    if (disY <=0) return

    if (disY >= 80) disY = 80

    this.setData({
      translateY: `translateY(${disY}rpx)`
    })
  },
  handelTouchend() {

    this.setData({
      translateY: `translateY(0rpx)`,
      transition: 'transform 1s linear'
    })


  },
  /* 去登录 */
  gotoLogin() {
    /* 登录之后不再允许进入登录页面 */
    
    if (this.data.userInfo.nickname) {
      return
    }

    wx.navigateTo({
      url: '/pages/login/login'
    })
  
  },
  /* 更具用户ID获取播放历史列表 */
  async getplaylist(uid) {
    // 需要携带用户的唯一id 
    let result = await request('/user/record', {
      uid,
      type: 1
    })
    if (result.code != 200) return

    this.setData({
      playlist: result.weekData.slice(0, 10)

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  /* 动态显示页面信息 */
  /* 不同情境 用不同的路由跳转  */
  onLoad: function (options) {

    let userInfo = wx.getStorageSync('userInfo')

    if (userInfo) {
      /* 同步修改 */
      this.setData({
        userInfo
      })

      this.getplaylist(this.data.userInfo.userId)
    }
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