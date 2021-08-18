import reqAddress from "./config";

export default function (url, data = {}, method = "GET") {

  return new Promise((resolve, reject) => {

    wx.request({
      url: reqAddress.host + url,
      data,
      method,
      header: {
        cookie: wx.getStorageSync('cookies') ?  wx.getStorageSync('cookies').find(item => item.indexOf('MUSIC_U') !== -1) : ''
      },
      success: (res) => {

        if (data.isLogin) {

          wx.setStorage({
            key:"cookies",
            data:res.cookies
          })
          // wx.setStorageSync('cookie',res.cookies)
          // wx.setStorageSync({
          //   key:"cookie",
          //   data:res.cookies
          // })
        }
        resolve(res.data)
      },

      fail: (err) => {
        console.log(err);
        //  reject(err);
      }
    })
  })

}