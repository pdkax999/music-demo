// pages/personal/personal.js

let moveCoord = {}


Page({
  /**
   * 页面的初始数据
   */
  data: {
    translateY: 'translateY(0rpx)',
    transition: '',
    userInfo: {}
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

    if (disY < 0) return

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

    if (this.data.userInfo.nickname) {
      return
    }
    wx.redirectTo({
      url: '/pages/login/login'
    })
  },
  /* 获取播放历史列表 */
  getplaylist(){


  },
  /**
   * 生命周期函数--监听页面加载
   */

  /* 动态显示页面信息 */
  /* 不同情境 用不同的路由跳转  */
  onLoad: function (options) {

    let userInfo = wx.getStorageSync('userInfo')

    if (userInfo) {

      this.setData({
        userInfo
      })
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