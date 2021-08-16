// pages/video/video.js

import request from "../../utils/request";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 导航条数据
    groupList: [],
    videos: [],
    activeId: '', // 当前选中的导航条列表
    playId: '',
    playRecord: {} // 播放时间保存
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.groupList()
  },
  /* 获取导航条列表 */
  async groupList() {

    let result = await request('/video/group/list');

    this.setData({
      groupList: result.data.slice(0, 14),
      activeId: result.data[0].id
    })
    this.getVideoData(this.data.groupList[1].id);
  },
  /*
   获取播放视频列表  
   什么时候获取列表
   初始化显示 获取一次
   用户点击切换 获取一次
  */
  async getVideoData(id) {
    // 只是一个单纯发请求的函数
    let result = await request('/video/group', {
      id
    });

    if (!result.datas) return

    let datas = result.datas.map((item, index) => {
      item.id = index
      return item
    })
    wx.hideLoading()

    this.setData({
      videos: datas
    })
  },


  /* 点击显示当前的高亮 */
  selected(event) {

    let id = event.currentTarget.id

    this.setData({
      activeId: id * 1,
      videoList: []
    })
    wx.showLoading({
      title: '正在加载'
    })

    this.getVideoData(id)

  },
  /* 
   同时播放多个视屏
   点击下一个视频时 关闭 上一个视屏
   怎么关闭视屏
   怎么找到上一个播放视屏的对象
   注意点， 如果上一个视屏和下一个视屏一样，播放的视频不能够被暂停
  */
  playVideo(event) {
    console.log(event.currentTarget.id);
    

    let id = event.currentTarget.id
    let time = this.data.playRecord[id]
    //  console.log(id);
    // if (this.oldId && this.oldId !==id) {
    // let  videoContext = wx.createVideoContext(this.oldId)
    //  videoContext.stop()
    // }
    // this.oldId = id
    // this.videoContext && this.vid !== id && this.videoContext.stop()
    //经常犯语法错误
    this.videoContext = wx.createVideoContext(id)
    /* 动态显示播放的视频 */
    this.setData({
      playId: id
    })

    if (typeof time == 'number' && time > 0) {

      console.log('设置秒数');
      
      this.videoContext.seek(time + 's')
      
    }
    this.videoContext.play();
    // 判断当前视频是否已播放，已播放设置播放时间
    this.vid = id
  },

  /*
   当再次播放时，视频进度又从0开始播放
    
   视频怎么跳转到已播放位置    //VideoContext.seek(number position)

    已播放的秒数怎么保存        

    {
      vid: s 
    }

    当用户再次访问当前视屏，尝试读取并并设置秒数
  
   */
  timeUpdate: function (e) {
    //实时播放进度 秒数
    // e.currentTarget.id
    const {
      playRecord
    } = this.data

    var currentTime = e.detail.currentTime

    playRecord[e.currentTarget.id] = currentTime //有则添加无则修改

    /* 保存当前视频播放的时间 */
    this.setData({
      playRecord
    })

  },

  handelEnded(e) {

    const {
      playRecord
    } = this.data

    delete playRecord[e.currentTarget.id]

    this.setData({
      playRecord
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