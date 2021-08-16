import reqAddress from "./config";

export default function (url, data = {}, method = "GET") {

  return new Promise((resolve, reject) => {
    wx.request({
      url: reqAddress.host + url,
      data,
      method,
      success: (res) => {
        // if(res.data.code == 200) {
          resolve(res.data)
        //   return
        // }
        // console.log(res.data.data);
      },
      fail: (err) => {
        console.log(err);
        //  reject(err);
      }
    })
  })

}