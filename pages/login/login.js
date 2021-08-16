// pages/login/login.js
/* 
  登录 
*/
import request from "../../utils/request.js";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    phone: '17763020535',
    password: 'current520'
  },
  getUserInfo(event) {
    let type = event.target.id
    this.setData({
      [type]: event.detail.value
    })
  },
  async gotoLogin() {
    /* 微信小程序没有数据代理 */
    const {
      phone,
      password
    } = this.data
    let phoneReg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/
    /*
     校验规则
      手机号不能为空
      手机号格式是否正确
    */
    if (!phone) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none'
      })
      return
    } else if (!phoneReg.test(phone)) {
      wx.showToast({
        title: '手机号格式不正确',
        icon: 'none'
      })
      return
    }
    if (!password) {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none'
      })
      return
    }


    /* 后端验证 */
    let result = await request('/login/cellphone', {
      phone,
      password,
      isLogin:true
    })      

    /* 失败种类太多，先处理成功 */
    if (result.code == 200) {
      wx.showToast({
        title: '登录成功',
        icon: 'success'
      })
      // 用户主动删除或因存储空间原因被系统清理，
      //否则数据都一直可用。单个 key 允许存储的最大数据
      //长度为 1MB，所有数据存储上限为 10MB
      wx.setStorage({
        key: 'userInfo',
        data: result.profile
      })
      wx.switchTab({
        url: '/pages/personal/personal'
      });
    } else if (result.code == 501) {

      wx.showToast({
        title: '账号不存在',
        icon: 'none'
      })
    } else if (result.code == 502) {
      wx.showToast({
        title: '密码错误',
        icon: 'none'
      })
    } else {
      wx.showToast({
        title: '网络繁忙,请稍后重试',
        icon: 'none'
      })
    }





  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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