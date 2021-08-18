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
    gotoScrollItemid: '',
    playId: '',
    playRecord: {}, // 播放时间保存
    playRecords: [], // 用数组结构保存
    isTriggered: false
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
    this.getVideoData(this.data.activeId);
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
      videos: datas,
      isTriggered: false
    })
  },


  /* 点击显示当前的高亮 */
  selected(event) {

    let id = event.currentTarget.id

    let ids = event.currentTarget.dataset.id

    this.setData({
      activeId: ids,
      gotoScrollItemid: id,
      videoList: []
    })
    wx.showLoading({
      title: '正在加载'
    })

    this.getVideoData(ids)
  },
  /* 
   同时播放多个视屏
   点击下一个视频时 关闭 上一个视屏
   怎么关闭视屏
   怎么找到上一个播放视屏的对象
   注意点， 如果上一个视屏和下一个视屏一样，播放的视频不能够被暂停
  */
  playVideo(event) {

    let id = event.currentTarget.id
    // let time = this.data.playRecord[id]
    //  console.log(id);
    // if (this.oldId && this.oldId !==id) {
    // let  videoContext = wx.createVideoContext(this.oldId)
    //  videoContext.stop()
    // }
    // this.oldId = id
    // this.videoContext && this.vid !== id && this.videoContext.stop()
    //经常犯语法错误
    const {
      playRecords
    } = this.data

    this.videoContext = wx.createVideoContext(id)
    /* 动态显示播放的视频 */
    this.setData({
      playId: id
    })
    /* if (typeof time == 'number' && time > 0) {
      console.log('设置秒数');
      this.videoContext.seek(time + 's')  
    } */
    let timeobj = playRecords.find(item => item.vid == event.currentTarget.id)

    if (timeobj) {
      this.videoContext.seek(timeobj + 's')
    }
    this.videoContext.play();
    // 判断当前视频是否已播放，已播放设置播放时间
    // this.vid = id  
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
  timeUpdate: function (event) {
    //实时播放进度 秒数
    // e.currentTarget.id
    const {
      playRecords
    } = this.data

    var currentTime = event.detail.currentTime

    // playRecord[e.currentTarget.id] = currentTime //有则添加无则修改

    let playTime = {
      vid: event.currentTarget.id,
      time: currentTime
    }

    let timeobj = playRecords.find(item => {
      return item.vid == event.currentTarget.id
    })

    if (timeobj) {
      timeobj.time = currentTime
    } else {
      playRecords.push(playTime)
    }
    /* 保存当前视频播放的时间 */
    this.setData({
      playRecords
    })

  },

  handelEnded(e) {

    const {
      playRecord
    } = this.data

    //播放结束从列表中删除对应时间
    delete playRecord[e.currentTarget.id]

    this.setData({
      playRecord
    })

  },

  handelDropDownRefresh() {

    this.getVideoData(this.data.activeId)

  },

  scrolltolower() {

    let video = [{
        "type": 1,
        "displayed": false,
        "alg": "onlineHotGroup",
        "extAlg": null,
        "data": {
          "alg": "onlineHotGroup",
          "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
          "threadId": "R_VI_62_7E06FEA1D104A4D0C4FD9F92FF707680",
          "coverUrl": "https://p2.music.126.net/ETsTtA9p2xfazgQkq91ayQ==/109951164899298309.jpg",
          "height": 1016,
          "width": 540,
          "title": "my beautiful",
          "description": null,
          "commentCount": 0,
          "shareCount": 0,
          "resolutions": [{
              "resolution": 240,
              "size": 9398904
            },
            {
              "resolution": 480,
              "size": 15025602
            }
          ],
          "creator": {
            "defaultAvatar": false,
            "province": 120000,
            "authStatus": 0,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/_B-nPLHBwKQ50-4Dr-v_jg==/109951165841593201.jpg",
            "accountStatus": 0,
            "gender": 1,
            "city": 120101,
            "birthday": 953740800000,
            "userId": 368750251,
            "userType": 0,
            "nickname": "馥芮白323",
            "signature": "粉色没有恶意 一直很温柔",
            "description": "",
            "detailDescription": "",
            "avatarImgId": 109951165841593200,
            "backgroundImgId": 109951164888204900,
            "backgroundUrl": "http://p1.music.126.net/EzHdbhlBHQkWCHgV3JhhZQ==/109951164888204902.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": null,
            "djStatus": 10,
            "vipType": 11,
            "remarkName": null,
            "avatarImgIdStr": "109951165841593201",
            "backgroundImgIdStr": "109951164888204902"
          },
          "urlInfo": {
            "id": "7E06FEA1D104A4D0C4FD9F92FF707680",
            "url": "http://vodkgeyttp9.vod.126.net/cloudmusic/wc5M8lLs_2968817717_hd.mp4?ts=1629165650&rid=5C05631DBF8D50CDCAB5DF7C5ECD65AB&rl=3&rs=nYXbgeRocAGFrYQNFLAnpwgTTdKrjtSm&sign=5dd2d40360d67323ea7fe337729079d0&ext=agUQQRULD8JpVPTJ%2B8omLRrcwXsmRslvZ5t%2FSGYUiy69dJ1iqh25MJySKGEafSDxz2hMdlRwVH%2BizusOmuHBvwqqrMx1LQWDTJRL%2FqloUJDo1QiU2HUgl91L%2FtMsYWEOeLiZKRr%2Fqc9Q%2FPlqu68wEZy0lgHLkm9Lh0lou160EALdtrsRDrr2WYMEPSyjDEFp%2F7Hmky73xqVdBcOqEXOXji5O7QdYU8iaOiACmIfe6Kcka4C8Tphwr1QZ4j7Cfl%2FY",
            "size": 15025602,
            "validityTime": 1200,
            "needPay": false,
            "payInfo": null,
            "r": 480
          },
          "videoGroup": [{
              "id": 60100,
              "name": "翻唱",
              "alg": null
            },
            {
              "id": 57113,
              "name": "国人男声",
              "alg": null
            },
            {
              "id": 12100,
              "name": "流行",
              "alg": null
            },
            {
              "id": 5100,
              "name": "音乐",
              "alg": null
            },
            {
              "id": 24134,
              "name": "弹唱",
              "alg": null
            }
          ],
          "previewUrl": null,
          "previewDurationms": 0,
          "hasRelatedGameAd": false,
          "markTypes": null,
          "relateSong": [{
            "name": "My beautiful",
            "id": 1439374208,
            "pst": 0,
            "t": 0,
            "ar": [{
                "id": 32172259,
                "name": "Davin大文",
                "tns": [],
                "alias": []
              },
              {
                "id": 28304068,
                "name": "小郭雨儿",
                "tns": [],
                "alias": []
              }
            ],
            "alia": [],
            "pop": 100,
            "st": 0,
            "rt": "",
            "fee": 8,
            "v": 3,
            "crbt": null,
            "cf": "",
            "al": {
              "id": 87855281,
              "name": "My beautiful",
              "picUrl": "http://p3.music.126.net/sl9AJN53iMkn4v0WtitcLg==/109951164890315366.jpg",
              "tns": [],
              "pic_str": "109951164890315366",
              "pic": 109951164890315360
            },
            "dt": 140282,
            "h": {
              "br": 320000,
              "fid": 0,
              "size": 5614125,
              "vd": -9135
            },
            "m": {
              "br": 192000,
              "fid": 0,
              "size": 3368493,
              "vd": -6505
            },
            "l": {
              "br": 128000,
              "fid": 0,
              "size": 2245677,
              "vd": -4764
            },
            "a": null,
            "cd": "01",
            "no": 1,
            "rtUrl": null,
            "ftype": 0,
            "rtUrls": [],
            "djId": 0,
            "copyright": 0,
            "s_id": 0,
            "mst": 9,
            "cp": 0,
            "mv": 0,
            "rtype": 0,
            "rurl": null,
            "publishTime": 0,
            "privilege": {
              "id": 1439374208,
              "fee": 8,
              "payed": 0,
              "st": 0,
              "pl": 128000,
              "dl": 0,
              "sp": 7,
              "cp": 1,
              "subp": 1,
              "cs": false,
              "maxbr": 999000,
              "fl": 128000,
              "toast": false,
              "flag": 64,
              "preSell": false
            }
          }],
          "relatedInfo": null,
          "videoUserLiveInfo": null,
          "vid": "7E06FEA1D104A4D0C4FD9F92FF707680",
          "durationms": 85000,
          "playTime": 4407,
          "praisedCount": 35,
          "praised": false,
          "subscribed": false
        }
      },
      {
        "type": 1,
        "displayed": false,
        "alg": "onlineHotGroup",
        "extAlg": null,
        "data": {
          "alg": "onlineHotGroup",
          "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
          "threadId": "R_VI_62_7E8482962179B5C0E336DB12E61C317F",
          "coverUrl": "https://p2.music.126.net/neAwV1JbGE9_x99g8RlgfQ==/109951164477477252.jpg",
          "height": 1080,
          "width": 1920,
          "title": "The lazy song 其实很“中国风”（Cover Bruno Mars）",
          "description": "The lazy song 其实很“中国风”（Cover Bruno Mars）在这之前你们觉得吗？[呲牙][呲牙]\n\n编录混：Bruce Ng（布老师）",
          "commentCount": 14,
          "shareCount": 6,
          "resolutions": [{
              "resolution": 240,
              "size": 4697035
            },
            {
              "resolution": 480,
              "size": 8037370
            },
            {
              "resolution": 720,
              "size": 12016654
            },
            {
              "resolution": 1080,
              "size": 24581724
            }
          ],
          "creator": {
            "defaultAvatar": false,
            "province": 820000,
            "authStatus": 1,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/1zDVBwfzcSnhUjPtWD_dPA==/109951163291535453.jpg",
            "accountStatus": 0,
            "gender": 1,
            "city": 820100,
            "birthday": 836841600000,
            "userId": 335041054,
            "userType": 4,
            "nickname": "BruceNg布老师",
            "signature": "生於澳門的音樂唱作人Bruce Ng \n微博ID：BruceNg布老师                                               Youtube；B站 ；抖音：Bruce Ng（布老师）",
            "description": "",
            "detailDescription": "",
            "avatarImgId": 109951163291535460,
            "backgroundImgId": 109951164308642430,
            "backgroundUrl": "http://p1.music.126.net/GaAjoEUUy0Bgi5Gf7Brd5Q==/109951164308642438.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": {
              "1": "音乐原创视频达人"
            },
            "djStatus": 10,
            "vipType": 11,
            "remarkName": null,
            "avatarImgIdStr": "109951163291535453",
            "backgroundImgIdStr": "109951164308642438"
          },
          "urlInfo": {
            "id": "7E8482962179B5C0E336DB12E61C317F",
            "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/IsK1SBmq_2780661735_uhd.mp4?ts=1629165650&rid=5C05631DBF8D50CDCAB5DF7C5ECD65AB&rl=3&rs=mpnsJYCBUhExjywSSIJKOJTCewLGCYGy&sign=731d507ac7fc605d122c28ab32711fbb&ext=agUQQRULD8JpVPTJ%2B8omLRrcwXsmRslvZ5t%2FSGYUiy69dJ1iqh25MJySKGEafSDxz2hMdlRwVH%2BizusOmuHBvwqqrMx1LQWDTJRL%2FqloUJDo1QiU2HUgl91L%2FtMsYWEOeLiZKRr%2Fqc9Q%2FPlqu68wEZy0lgHLkm9Lh0lou160EALdtrsRDrr2WYMEPSyjDEFp%2F7Hmky73xqVdBcOqEXOXji5O7QdYU8iaOiACmIfe6Kcka4C8Tphwr1QZ4j7Cfl%2FY",
            "size": 24581724,
            "validityTime": 1200,
            "needPay": false,
            "payInfo": null,
            "r": 1080
          },
          "videoGroup": [{
              "id": 60100,
              "name": "翻唱",
              "alg": null
            },
            {
              "id": 57112,
              "name": "英文翻唱",
              "alg": null
            },
            {
              "id": 5100,
              "name": "音乐",
              "alg": null
            },
            {
              "id": 24121,
              "name": "Bruno Mars",
              "alg": null
            },
            {
              "id": 16170,
              "name": "吉他",
              "alg": null
            },
            {
              "id": 154120,
              "name": "田柾国",
              "alg": null
            }
          ],
          "previewUrl": null,
          "previewDurationms": 0,
          "hasRelatedGameAd": false,
          "markTypes": null,
          "relateSong": [{
            "name": "The Lazy Song",
            "id": 25657280,
            "pst": 0,
            "t": 0,
            "ar": [{
              "id": 178059,
              "name": "Bruno Mars",
              "tns": [],
              "alias": []
            }],
            "alia": [],
            "pop": 100,
            "st": 0,
            "rt": "600902000009141123",
            "fee": 8,
            "v": 104,
            "crbt": null,
            "cf": "",
            "al": {
              "id": 2270045,
              "name": "Doo-Wops & Hooligans",
              "picUrl": "http://p3.music.126.net/sLF1cDb7UmYMCSvi2W2nkQ==/17862665905224639.jpg",
              "tns": [],
              "pic_str": "17862665905224639",
              "pic": 17862665905224640
            },
            "dt": 195986,
            "h": {
              "br": 320000,
              "fid": 0,
              "size": 7842003,
              "vd": -22100
            },
            "m": {
              "br": 192000,
              "fid": 0,
              "size": 4705219,
              "vd": -19600
            },
            "l": {
              "br": 128000,
              "fid": 0,
              "size": 3136827,
              "vd": -17700
            },
            "a": null,
            "cd": "1",
            "no": 5,
            "rtUrl": null,
            "ftype": 0,
            "rtUrls": [],
            "djId": 0,
            "copyright": 1,
            "s_id": 0,
            "mst": 9,
            "cp": 7003,
            "mv": 241,
            "rtype": 0,
            "rurl": null,
            "publishTime": 1286208000007,
            "privilege": {
              "id": 25657280,
              "fee": 8,
              "payed": 0,
              "st": 0,
              "pl": 128000,
              "dl": 0,
              "sp": 7,
              "cp": 1,
              "subp": 1,
              "cs": false,
              "maxbr": 999000,
              "fl": 128000,
              "toast": false,
              "flag": 4,
              "preSell": false
            }
          }],
          "relatedInfo": null,
          "videoUserLiveInfo": null,
          "vid": "7E8482962179B5C0E336DB12E61C317F",
          "durationms": 45738,
          "playTime": 67585,
          "praisedCount": 689,
          "praised": false,
          "subscribed": false
        }
      },
      {
        "type": 1,
        "displayed": false,
        "alg": "onlineHotGroup",
        "extAlg": null,
        "data": {
          "alg": "onlineHotGroup",
          "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
          "threadId": "R_VI_62_BE9FD5EDA267BF004242ED1A6A0C8A8A",
          "coverUrl": "https://p2.music.126.net/ZHIDmEu9V1espEK_EZwmvA==/109951164145058981.jpg",
          "height": 720,
          "width": 1280,
          "title": "带上中阮 | 闯码头",
          "description": null,
          "commentCount": 5,
          "shareCount": 18,
          "resolutions": [{
              "resolution": 240,
              "size": 5858292
            },
            {
              "resolution": 480,
              "size": 10603197
            },
            {
              "resolution": 720,
              "size": 17364595
            }
          ],
          "creator": {
            "defaultAvatar": false,
            "province": 330000,
            "authStatus": 1,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/WBzJ8_glmXksFpsLKBkqdg==/109951165993463854.jpg",
            "accountStatus": 0,
            "gender": 1,
            "city": 330400,
            "birthday": 787766400000,
            "userId": 49024692,
            "userType": 4,
            "nickname": "黄顺Chayel",
            "signature": "形式逻辑的典范，辩证逻辑的障碍。",
            "description": "",
            "detailDescription": "",
            "avatarImgId": 109951165993463860,
            "backgroundImgId": 109951165891094300,
            "backgroundUrl": "http://p1.music.126.net/oHlRl2xVa8VvyA6i5fD3Zg==/109951165891094300.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": {
              "1": "音乐原创视频达人",
              "2": "生活图文达人"
            },
            "djStatus": 10,
            "vipType": 11,
            "remarkName": null,
            "avatarImgIdStr": "109951165993463854",
            "backgroundImgIdStr": "109951165891094300"
          },
          "urlInfo": {
            "id": "BE9FD5EDA267BF004242ED1A6A0C8A8A",
            "url": "http://vodkgeyttp9.vod.126.net/cloudmusic/LyDMbenm_2548842587_shd.mp4?ts=1629165650&rid=5C05631DBF8D50CDCAB5DF7C5ECD65AB&rl=3&rs=gqdPIaYsTyWzVqZPUkpQkjtHijQrwdKy&sign=97ac4e81b53237517e2f7d66c3cf40c8&ext=agUQQRULD8JpVPTJ%2B8omLRrcwXsmRslvZ5t%2FSGYUiy69dJ1iqh25MJySKGEafSDxz2hMdlRwVH%2BizusOmuHBvwqqrMx1LQWDTJRL%2FqloUJDo1QiU2HUgl91L%2FtMsYWEOeLiZKRr%2Fqc9Q%2FPlqu68wEZy0lgHLkm9Lh0lou160EALdtrsRDrr2WYMEPSyjDEFp%2F7Hmky73xqVdBcOqEXOXji5O7QdYU8iaOiACmIfe6Kcka4C8Tphwr1QZ4j7Cfl%2FY",
            "size": 17364595,
            "validityTime": 1200,
            "needPay": false,
            "payInfo": null,
            "r": 720
          },
          "videoGroup": [{
              "id": 60100,
              "name": "翻唱",
              "alg": null
            },
            {
              "id": 57111,
              "name": "中文翻唱",
              "alg": null
            },
            {
              "id": 59110,
              "name": "国内音乐人",
              "alg": null
            },
            {
              "id": 12100,
              "name": "流行",
              "alg": null
            },
            {
              "id": 5100,
              "name": "音乐",
              "alg": null
            }
          ],
          "previewUrl": null,
          "previewDurationms": 0,
          "hasRelatedGameAd": false,
          "markTypes": null,
          "relateSong": [{
            "name": "闯码头续集",
            "id": 80543,
            "pst": 0,
            "t": 0,
            "ar": [{
              "id": 2614,
              "name": "大哲",
              "tns": [],
              "alias": []
            }],
            "alia": [],
            "pop": 50,
            "st": 0,
            "rt": "",
            "fee": 0,
            "v": 92,
            "crbt": null,
            "cf": "",
            "al": {
              "id": 7904,
              "name": "下定决心忘记你",
              "picUrl": "http://p3.music.126.net/kdtf-ACrjmHSL8qPButiWQ==/738871813913971.jpg",
              "tns": [],
              "pic": 738871813913971
            },
            "dt": 265280,
            "h": {
              "br": 320000,
              "fid": 0,
              "size": 10614117,
              "vd": -21099
            },
            "m": {
              "br": 192000,
              "fid": 0,
              "size": 6368488,
              "vd": -18700
            },
            "l": {
              "br": 128000,
              "fid": 0,
              "size": 4245673,
              "vd": -16800
            },
            "a": null,
            "cd": "1",
            "no": 10,
            "rtUrl": null,
            "ftype": 0,
            "rtUrls": [],
            "djId": 0,
            "copyright": 2,
            "s_id": 0,
            "mst": 9,
            "cp": 0,
            "mv": 0,
            "rtype": 0,
            "rurl": null,
            "publishTime": 1328889600000,
            "privilege": {
              "id": 80543,
              "fee": 0,
              "payed": 0,
              "st": 0,
              "pl": 320000,
              "dl": 999000,
              "sp": 7,
              "cp": 1,
              "subp": 1,
              "cs": false,
              "maxbr": 999000,
              "fl": 320000,
              "toast": false,
              "flag": 128,
              "preSell": false
            }
          }],
          "relatedInfo": null,
          "videoUserLiveInfo": null,
          "vid": "BE9FD5EDA267BF004242ED1A6A0C8A8A",
          "durationms": 60000,
          "playTime": 34171,
          "praisedCount": 63,
          "praised": false,
          "subscribed": false
        }
      },
      {
        "type": 1,
        "displayed": false,
        "alg": "onlineHotGroup",
        "extAlg": null,
        "data": {
          "alg": "onlineHotGroup",
          "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
          "threadId": "R_VI_62_0B1FE8704543A42D1A6B525B812F8EED",
          "coverUrl": "https://p2.music.126.net/AmcFnWPuueC6qlN-9jv2AQ==/109951163574154648.jpg",
          "height": 720,
          "width": 1280,
          "title": "【卢凯彤】翻唱林宥嘉《坏与更坏》",
          "description": "无论多么坏，好心态。泪目了",
          "commentCount": 54,
          "shareCount": 210,
          "resolutions": [{
              "resolution": 240,
              "size": 21930909
            },
            {
              "resolution": 480,
              "size": 37727692
            },
            {
              "resolution": 720,
              "size": 50422486
            }
          ],
          "creator": {
            "defaultAvatar": false,
            "province": 440000,
            "authStatus": 0,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/mQSdfbrKKNUUfh1djAIsUg==/109951163453908877.jpg",
            "accountStatus": 0,
            "gender": 2,
            "city": 440100,
            "birthday": 1533571200000,
            "userId": 1532056087,
            "userType": 0,
            "nickname": "老板来杯港乐",
            "signature": "",
            "description": "",
            "detailDescription": "",
            "avatarImgId": 109951163453908880,
            "backgroundImgId": 109951163458801070,
            "backgroundUrl": "http://p1.music.126.net/oGTzC4Lf1blVf8OLyeOF8g==/109951163458801071.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": null,
            "djStatus": 0,
            "vipType": 0,
            "remarkName": null,
            "avatarImgIdStr": "109951163453908877",
            "backgroundImgIdStr": "109951163458801071"
          },
          "urlInfo": {
            "id": "0B1FE8704543A42D1A6B525B812F8EED",
            "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/nWOEFV6C_1871762009_shd.mp4?ts=1629165650&rid=5C05631DBF8D50CDCAB5DF7C5ECD65AB&rl=3&rs=eToMWnCJKpgRoZOlWzGneVqwMrVRtMsp&sign=83943a8419e51f879d0ed95846c6671e&ext=agUQQRULD8JpVPTJ%2B8omLRrcwXsmRslvZ5t%2FSGYUiy69dJ1iqh25MJySKGEafSDxz2hMdlRwVH%2BizusOmuHBvwqqrMx1LQWDTJRL%2FqloUJDo1QiU2HUgl91L%2FtMsYWEOeLiZKRr%2Fqc9Q%2FPlqu68wEZy0lgHLkm9Lh0lou160EALdtrsRDrr2WYMEPSyjDEFp%2F7Hmky73xqVdBcOqEXOXji5O7QdYU8iaOiACmIfe6Kcka4C8Tphwr1QZ4j7Cfl%2FY",
            "size": 50422486,
            "validityTime": 1200,
            "needPay": false,
            "payInfo": null,
            "r": 720
          },
          "videoGroup": [{
              "id": 60100,
              "name": "翻唱",
              "alg": null
            },
            {
              "id": 57111,
              "name": "中文翻唱",
              "alg": null
            },
            {
              "id": 59111,
              "name": "素人草根",
              "alg": null
            },
            {
              "id": 12100,
              "name": "流行",
              "alg": null
            },
            {
              "id": 5100,
              "name": "音乐",
              "alg": null
            },
            {
              "id": 14233,
              "name": "林宥嘉",
              "alg": null
            }
          ],
          "previewUrl": null,
          "previewDurationms": 0,
          "hasRelatedGameAd": false,
          "markTypes": null,
          "relateSong": [],
          "relatedInfo": null,
          "videoUserLiveInfo": null,
          "vid": "0B1FE8704543A42D1A6B525B812F8EED",
          "durationms": 312760,
          "playTime": 40720,
          "praisedCount": 414,
          "praised": false,
          "subscribed": false
        }
      },
      {
        "type": 1,
        "displayed": false,
        "alg": "onlineHotGroup",
        "extAlg": null,
        "data": {
          "alg": "onlineHotGroup",
          "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
          "threadId": "R_VI_62_AEF6F4F5C9A45E6747F897059F99CF51",
          "coverUrl": "https://p2.music.126.net/qn8EU4h6_P-ek22tSFE_gw==/109951163779547780.jpg",
          "height": 1080,
          "width": 1920,
          "title": "小姐姐翻唱治愈版【光年之外】",
          "description": null,
          "commentCount": 1,
          "shareCount": 0,
          "resolutions": [{
              "resolution": 240,
              "size": 12623655
            },
            {
              "resolution": 480,
              "size": 19814049
            },
            {
              "resolution": 720,
              "size": 29146365
            },
            {
              "resolution": 1080,
              "size": 54962740
            }
          ],
          "creator": {
            "defaultAvatar": false,
            "province": 350000,
            "authStatus": 0,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/MkfbKBhGlg6njobWbrzhfw==/109951163781005774.jpg",
            "accountStatus": 0,
            "gender": 0,
            "city": 350100,
            "birthday": -2209017600000,
            "userId": 1714761092,
            "userType": 0,
            "nickname": "唱跳俱佳林某某",
            "signature": "",
            "description": "",
            "detailDescription": "",
            "avatarImgId": 109951163781005780,
            "backgroundImgId": 109951162868126480,
            "backgroundUrl": "http://p1.music.126.net/_f8R60U9mZ42sSNvdPn2sQ==/109951162868126486.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": null,
            "djStatus": 0,
            "vipType": 0,
            "remarkName": null,
            "avatarImgIdStr": "109951163781005774",
            "backgroundImgIdStr": "109951162868126486"
          },
          "urlInfo": {
            "id": "AEF6F4F5C9A45E6747F897059F99CF51",
            "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/sQZ19JWx_2238692430_uhd.mp4?ts=1629165650&rid=5C05631DBF8D50CDCAB5DF7C5ECD65AB&rl=3&rs=dHmhTJhomvjBTFVTIpASuCGOXyEFGMeM&sign=ed9229ffc163f340be14d5ff1ce9ffa9&ext=agUQQRULD8JpVPTJ%2B8omLRrcwXsmRslvZ5t%2FSGYUiy69dJ1iqh25MJySKGEafSDxz2hMdlRwVH%2BizusOmuHBvwqqrMx1LQWDTJRL%2FqloUJDo1QiU2HUgl91L%2FtMsYWEOeLiZKRr%2Fqc9Q%2FPlqu68wEZy0lgHLkm9Lh0lou160EALdtrsRDrr2WYMEPSyjDEFp%2F7Hmky73xqVdBcOqEXOXji5O7QdYU8iaOiACmIfe6Kcka4C8Tphwr1QZ4j7Cfl%2FY",
            "size": 54962740,
            "validityTime": 1200,
            "needPay": false,
            "payInfo": null,
            "r": 1080
          },
          "videoGroup": [{
              "id": 60100,
              "name": "翻唱",
              "alg": null
            },
            {
              "id": 57111,
              "name": "中文翻唱",
              "alg": null
            },
            {
              "id": 59111,
              "name": "素人草根",
              "alg": null
            },
            {
              "id": 57114,
              "name": "钢琴演奏",
              "alg": null
            },
            {
              "id": 4103,
              "name": "演奏",
              "alg": null
            },
            {
              "id": 12100,
              "name": "流行",
              "alg": null
            },
            {
              "id": 5100,
              "name": "音乐",
              "alg": null
            },
            {
              "id": 26117,
              "name": "钢琴",
              "alg": null
            },
            {
              "id": 16233,
              "name": "G.E.M.邓紫棋",
              "alg": null
            }
          ],
          "previewUrl": null,
          "previewDurationms": 0,
          "hasRelatedGameAd": false,
          "markTypes": null,
          "relateSong": [{
            "name": "光年之外",
            "id": 449818741,
            "pst": 0,
            "t": 0,
            "ar": [{
              "id": 7763,
              "name": "G.E.M.邓紫棋",
              "tns": [],
              "alias": []
            }],
            "alia": [
              "电影《太空旅客》中文主题曲"
            ],
            "pop": 100,
            "st": 0,
            "rt": null,
            "fee": 8,
            "v": 96,
            "crbt": null,
            "cf": "",
            "al": {
              "id": 35093341,
              "name": "光年之外",
              "picUrl": "http://p4.music.126.net/fkqFqMaEt0CzxYS-0NpCog==/18587244069235039.jpg",
              "tns": [],
              "pic_str": "18587244069235039",
              "pic": 18587244069235040
            },
            "dt": 235505,
            "h": {
              "br": 320000,
              "fid": 0,
              "size": 9422933,
              "vd": -14400
            },
            "m": {
              "br": 192000,
              "fid": 0,
              "size": 5653777,
              "vd": -11900
            },
            "l": {
              "br": 128000,
              "fid": 0,
              "size": 3769199,
              "vd": -10100
            },
            "a": null,
            "cd": "1",
            "no": 0,
            "rtUrl": null,
            "ftype": 0,
            "rtUrls": [],
            "djId": 0,
            "copyright": 2,
            "s_id": 0,
            "mst": 9,
            "cp": 1415926,
            "mv": 5404646,
            "rtype": 0,
            "rurl": null,
            "publishTime": 1483027200007,
            "privilege": {
              "id": 449818741,
              "fee": 8,
              "payed": 0,
              "st": 0,
              "pl": 128000,
              "dl": 0,
              "sp": 7,
              "cp": 1,
              "subp": 1,
              "cs": false,
              "maxbr": 999000,
              "fl": 128000,
              "toast": false,
              "flag": 4,
              "preSell": false
            }
          }],
          "relatedInfo": null,
          "videoUserLiveInfo": null,
          "vid": "AEF6F4F5C9A45E6747F897059F99CF51",
          "durationms": 289322,
          "playTime": 779,
          "praisedCount": 4,
          "praised": false,
          "subscribed": false
        }
      },
      {
        "type": 1,
        "displayed": false,
        "alg": "onlineHotGroup",
        "extAlg": null,
        "data": {
          "alg": "onlineHotGroup",
          "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
          "threadId": "R_VI_62_025BF8D7D1C26CEE1CF21B12371AA450",
          "coverUrl": "https://p2.music.126.net/Rfxmgzz66dfbWxWp4_K7Aw==/109951165211840215.jpg",
          "height": 1280,
          "width": 720,
          "title": "七周年快乐啵啵",
          "description": null,
          "commentCount": 12,
          "shareCount": 0,
          "resolutions": [{
              "resolution": 240,
              "size": 1249456
            },
            {
              "resolution": 480,
              "size": 1968298
            },
            {
              "resolution": 720,
              "size": 2767341
            }
          ],
          "creator": {
            "defaultAvatar": false,
            "province": 330000,
            "authStatus": 1,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/4NVxpmEPY1II3jMAhqcE0Q==/109951166256616462.jpg",
            "accountStatus": 0,
            "gender": 2,
            "city": 330100,
            "birthday": 1510402283244,
            "userId": 587832858,
            "userType": 4,
            "nickname": "阿玫冲鸭",
            "signature": "谢谢你这么可爱还点进我的主页❤️\n感谢聆听❤️❤️❤️\ndy：Ay阿玫",
            "description": "",
            "detailDescription": "",
            "avatarImgId": 109951166256616460,
            "backgroundImgId": 109951163555555820,
            "backgroundUrl": "http://p1.music.126.net/ZJ5TYyBO_nuOPDDlj2ilHA==/109951163555555826.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": null,
            "djStatus": 10,
            "vipType": 11,
            "remarkName": null,
            "avatarImgIdStr": "109951166256616462",
            "backgroundImgIdStr": "109951163555555826"
          },
          "urlInfo": {
            "id": "025BF8D7D1C26CEE1CF21B12371AA450",
            "url": "http://vodkgeyttp9.vod.126.net/cloudmusic/iYByAWJ8_3081630986_shd.mp4?ts=1629165650&rid=5C05631DBF8D50CDCAB5DF7C5ECD65AB&rl=3&rs=rdQazkmuzdlrEoMpotMVOeIZpHVgUrEZ&sign=f2b076c66ec2ec29ba6b798c08932029&ext=agUQQRULD8JpVPTJ%2B8omLRrcwXsmRslvZ5t%2FSGYUiy69dJ1iqh25MJySKGEafSDxz2hMdlRwVH%2BizusOmuHBvwqqrMx1LQWDTJRL%2FqloUJDo1QiU2HUgl91L%2FtMsYWEOeLiZKRr%2Fqc9Q%2FPlqu68wEZy0lgHLkm9Lh0lou160EALdtrsRDrr2WYMEPSyjDEFp%2F7Hmky73xqVdBcOqEXOXji5O7QdYU8iaOiACmIfe6Kcka4C8Tphwr1QZ4j7Cfl%2FY",
            "size": 2767341,
            "validityTime": 1200,
            "needPay": false,
            "payInfo": null,
            "r": 720
          },
          "videoGroup": [{
              "id": 60100,
              "name": "翻唱",
              "alg": null
            },
            {
              "id": 57111,
              "name": "中文翻唱",
              "alg": null
            },
            {
              "id": 12100,
              "name": "流行",
              "alg": null
            },
            {
              "id": 5100,
              "name": "音乐",
              "alg": null
            },
            {
              "id": 24134,
              "name": "弹唱",
              "alg": null
            }
          ],
          "previewUrl": null,
          "previewDurationms": 0,
          "hasRelatedGameAd": false,
          "markTypes": null,
          "relateSong": [],
          "relatedInfo": null,
          "videoUserLiveInfo": null,
          "vid": "025BF8D7D1C26CEE1CF21B12371AA450",
          "durationms": 19343,
          "playTime": 5696,
          "praisedCount": 38,
          "praised": false,
          "subscribed": false
        }
      },
      {
        "type": 1,
        "displayed": false,
        "alg": "onlineHotGroup",
        "extAlg": null,
        "data": {
          "alg": "onlineHotGroup",
          "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
          "threadId": "R_VI_62_132C4FC682E764C5750BCAB2ECD8E0A9",
          "coverUrl": "https://p2.music.126.net/0-jeC4BwmxOkCxi2MMOD2w==/109951163470005829.jpg",
          "height": 720,
          "width": 1280,
          "title": "【翻唱】Daniel Caesar/H.E.R.《Best Part》女声吉他弹唱",
          "description": "女声吉他弹唱Daniel Caesar/H.E.R.《Best Part》，听前奏就知道是一首很悠闲很舒服的歌。亲爱的你不知道当你拥我入怀，轻柔的轻吻我时，是多么的美妙，这种感觉永远不会改变。（Cover by Isa Ramos）",
          "commentCount": 11,
          "shareCount": 10,
          "resolutions": [{
              "resolution": 240,
              "size": 14308249
            },
            {
              "resolution": 480,
              "size": 23971222
            },
            {
              "resolution": 720,
              "size": 41100230
            }
          ],
          "creator": {
            "defaultAvatar": false,
            "province": 1000000,
            "authStatus": 0,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/GRjb0cFgb_mteU0uEYNlRg==/109951163137690786.jpg",
            "accountStatus": 0,
            "gender": 1,
            "city": 1010000,
            "birthday": 631123200000,
            "userId": 1337833355,
            "userType": 0,
            "nickname": "狗爷翻唱",
            "signature": "为翻唱狗打电话╰(*°▽°*)╯你还可以上B站搜索：狗爷翻唱 找到我～跟大家一起来刷弹幕听国内外优质翻唱！",
            "description": "",
            "detailDescription": "",
            "avatarImgId": 109951163137690780,
            "backgroundImgId": 109951162868126480,
            "backgroundUrl": "http://p1.music.126.net/_f8R60U9mZ42sSNvdPn2sQ==/109951162868126486.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": {
              "1": "音乐视频达人"
            },
            "djStatus": 0,
            "vipType": 0,
            "remarkName": null,
            "avatarImgIdStr": "109951163137690786",
            "backgroundImgIdStr": "109951162868126486"
          },
          "urlInfo": {
            "id": "132C4FC682E764C5750BCAB2ECD8E0A9",
            "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/yKzMvMZT_1893714439_shd.mp4?ts=1629165650&rid=5C05631DBF8D50CDCAB5DF7C5ECD65AB&rl=3&rs=ecZirBwLxcVFUkBQlPzhkMVzWcsfmpyn&sign=e923f705afea13ee0f3f215fc3ce6b4f&ext=agUQQRULD8JpVPTJ%2B8omLRrcwXsmRslvZ5t%2FSGYUiy69dJ1iqh25MJySKGEafSDxz2hMdlRwVH%2BizusOmuHBvwqqrMx1LQWDTJRL%2FqloUJDo1QiU2HUgl91L%2FtMsYWEOeLiZKRr%2Fqc9Q%2FPlqu68wEZy0lgHLkm9Lh0lou160EALdtrsRDrr2WYMEPSyjDEFp%2F7Hmky73xqVdBcOqEXOXji5O7QdYU8iaOiACmIfe6Kcka4C8Tphwr1QZ4j7Cfl%2FY",
            "size": 41100230,
            "validityTime": 1200,
            "needPay": false,
            "payInfo": null,
            "r": 720
          },
          "videoGroup": [{
              "id": 60100,
              "name": "翻唱",
              "alg": null
            },
            {
              "id": 57112,
              "name": "英文翻唱",
              "alg": null
            },
            {
              "id": 58109,
              "name": "国外达人",
              "alg": null
            },
            {
              "id": 12100,
              "name": "流行",
              "alg": null
            },
            {
              "id": 5100,
              "name": "音乐",
              "alg": null
            },
            {
              "id": 16170,
              "name": "吉他",
              "alg": null
            }
          ],
          "previewUrl": null,
          "previewDurationms": 0,
          "hasRelatedGameAd": false,
          "markTypes": null,
          "relateSong": [{
            "name": "Best Part",
            "id": 496902058,
            "pst": 0,
            "t": 0,
            "ar": [{
                "id": 1021293,
                "name": "Daniel Caesar",
                "tns": [],
                "alias": []
              },
              {
                "id": 12107900,
                "name": "H.E.R.",
                "tns": [],
                "alias": []
              }
            ],
            "alia": [],
            "pop": 100,
            "st": 0,
            "rt": null,
            "fee": 8,
            "v": 11,
            "crbt": null,
            "cf": "",
            "al": {
              "id": 35919022,
              "name": "Freudian",
              "picUrl": "http://p4.music.126.net/6qyAQaurxhRrfoqhdZoQwQ==/18792852743952302.jpg",
              "tns": [],
              "pic_str": "18792852743952302",
              "pic": 18792852743952304
            },
            "dt": 209831,
            "h": {
              "br": 320000,
              "fid": 0,
              "size": 8395799,
              "vd": -2
            },
            "m": {
              "br": 192000,
              "fid": 0,
              "size": 5037497,
              "vd": 820
            },
            "l": {
              "br": 128000,
              "fid": 0,
              "size": 3358346,
              "vd": 0
            },
            "a": null,
            "cd": "1",
            "no": 2,
            "rtUrl": null,
            "ftype": 0,
            "rtUrls": [],
            "djId": 0,
            "copyright": 0,
            "s_id": 0,
            "mst": 9,
            "cp": 7001,
            "mv": 5888061,
            "rtype": 0,
            "rurl": null,
            "publishTime": 1503590400000,
            "privilege": {
              "id": 496902058,
              "fee": 8,
              "payed": 0,
              "st": 0,
              "pl": 128000,
              "dl": 0,
              "sp": 7,
              "cp": 1,
              "subp": 1,
              "cs": false,
              "maxbr": 999000,
              "fl": 128000,
              "toast": false,
              "flag": 0,
              "preSell": false
            }
          }],
          "relatedInfo": null,
          "videoUserLiveInfo": null,
          "vid": "132C4FC682E764C5750BCAB2ECD8E0A9",
          "durationms": 226068,
          "playTime": 9679,
          "praisedCount": 92,
          "praised": false,
          "subscribed": false
        }
      },
      {
        "type": 1,
        "displayed": false,
        "alg": "onlineHotGroup",
        "extAlg": null,
        "data": {
          "alg": "onlineHotGroup",
          "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
          "threadId": "R_VI_62_2F1072BEB805EF9C8C9E3EFD1494C95E",
          "coverUrl": "https://p2.music.126.net/n05tq8UvgjNTKGw6TPDzWw==/109951165374575249.jpg",
          "height": 1080,
          "width": 1768,
          "title": "御姐装扮，可爱风歌曲 阿冷翻唱《睫毛弯弯》",
          "description": "御姐装扮，可爱风歌曲 阿冷翻唱《睫毛弯弯》",
          "commentCount": 27,
          "shareCount": 12,
          "resolutions": [{
              "resolution": 240,
              "size": 11228413
            },
            {
              "resolution": 480,
              "size": 18603551
            },
            {
              "resolution": 720,
              "size": 27715684
            },
            {
              "resolution": 1080,
              "size": 42195045
            }
          ],
          "creator": {
            "defaultAvatar": false,
            "province": 310000,
            "authStatus": 0,
            "followed": false,
            "avatarUrl": "http://p1.music.126.net/PRts_PdAgcvaTmF9xs84Jg==/109951164949678122.jpg",
            "accountStatus": 0,
            "gender": 2,
            "city": 310101,
            "birthday": 720979200000,
            "userId": 498328848,
            "userType": 204,
            "nickname": "阿冷丶天蝎座的杀手",
            "signature": "",
            "description": "",
            "detailDescription": "",
            "avatarImgId": 109951164949678130,
            "backgroundImgId": 109951163367994290,
            "backgroundUrl": "http://p1.music.126.net/eZin7e7WBdCGXQuyhnvjvg==/109951163367994286.jpg",
            "authority": 0,
            "mutual": false,
            "expertTags": null,
            "experts": {
              "1": "音乐视频达人"
            },
            "djStatus": 0,
            "vipType": 0,
            "remarkName": null,
            "avatarImgIdStr": "109951164949678122",
            "backgroundImgIdStr": "109951163367994286"
          },
          "urlInfo": {
            "id": "2F1072BEB805EF9C8C9E3EFD1494C95E",
            "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/AsBr1eN6_1789564960_uhd.mp4?ts=1629165650&rid=5C05631DBF8D50CDCAB5DF7C5ECD65AB&rl=3&rs=EyHKskFKbstjQMEHQeRjjXfdkTFQXqvh&sign=1d776b4f5796f4268cb80b2fed533baa&ext=agUQQRULD8JpVPTJ%2B8omLRrcwXsmRslvZ5t%2FSGYUiy69dJ1iqh25MJySKGEafSDxz2hMdlRwVH%2BizusOmuHBvwqqrMx1LQWDTJRL%2FqloUJDo1QiU2HUgl91L%2FtMsYWEOeLiZKRr%2Fqc9Q%2FPlqu68wEZy0lgHLkm9Lh0lou160EALdtrsRDrr2WYMEPSyjDEFp%2F7Hmky73xqVdBcOqEXOXji5O7QdYU8iaOiACmIfe6Kcka4C8Tphwr1QZ4j7Cfl%2FY",
            "size": 42195045,
            "validityTime": 1200,
            "needPay": false,
            "payInfo": null,
            "r": 1080
          },
          "videoGroup": [{
              "id": 60100,
              "name": "翻唱",
              "alg": null
            },
            {
              "id": 57111,
              "name": "中文翻唱",
              "alg": null
            },
            {
              "id": 12100,
              "name": "流行",
              "alg": null
            },
            {
              "id": 5100,
              "name": "音乐",
              "alg": null
            }
          ],
          "previewUrl": null,
          "previewDurationms": 0,
          "hasRelatedGameAd": false,
          "markTypes": null,
          "relateSong": [],
          "relatedInfo": null,
          "videoUserLiveInfo": null,
          "vid": "2F1072BEB805EF9C8C9E3EFD1494C95E",
          "durationms": 203988,
          "playTime": 61300,
          "praisedCount": 243,
          "praised": false,
          "subscribed": false
        }
      }
    ]


    let {
      videos
    } = this.data
    console.log(video);

    videos = videos.concat(video)

    this.setData({
      videos
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
  onShareAppMessage: function ({
    from
  }) {
    return {
      title: '自定义转发标题',
      path: '/pages/video/video',
      
    }
  }
})