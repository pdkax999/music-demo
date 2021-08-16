import request from "../../utils/request";


Page({

  /**
   * 页面的初始数据
   */
  data: {
    banners: [],
    recommends: [],
    tops: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getinitData()
  },

  async getinitData() {
    let result = await request('/banner', {
      type: 1
    })
    this.setData({
      banners: result.banners
    })
    result = await request('/personalized')
    this.setData({
      recommends: result.result
    })
    // this.getRankingList()
    this.getRankingList1()
  },
  /* 通过Promise处理请求回来的数据 */
  async getRankingList1() {

    let data = [request('/top/list', {
        idx: 0
      }), request('/top/list', {
        idx: 1
      }),
      request('/top/list', {
        idx: 2
      }), request('/top/list', {
        idx: 3
      }), request('/top/list', {
        idx: 4
      })
    ]

    let result = await Promise.all(data)
    let ending = result.map((item) => {
      return {
        id: item.playlist.id,
        name: item.playlist.name,
        tracks: this.processArr(item.playlist.tracks.slice(0, 3))
      }
    })

    this.setData({
      tops: ending
    })
  },

  /* 自己手动处理 */
  async getRankingList() {

    let result = [{}, {}, {}, {}, {}];
    let arr = []
    result.map(async (item, index) => {
      let val = await request('/top/list', {
        idx: index
      })
      arr.push({
        tracks: this.processArr(val.playlist.tracks.slice(0, 3)),
        name: val.playlist.name,
        id: val.playlist.id
      })
    })
    this.setData({
      tops: arr
    })
  
  },

  processArr(arr) {
    return arr.map((item) => {
      return {
        id: item.al.id,
        name: item.al.name,
        picUrl: item.al.picUrl
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