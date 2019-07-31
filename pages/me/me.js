const app = getApp()
// 云数据库实例
const db = wx.cloud.database()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    list: [],
    tops: [],
    openID: wx.getStorageSync('openID')
  },

  onPullDownRefresh() {
    this.getList(true)
  },
  onReachBottom() {
    this.page += 1
    this.getList()
  },
  getList(isInit) {
    const PAGE = 8
    wx.showLoading({
      title: '加载中',
    })
    db.collection('blackboard').orderBy('time', 'desc').skip(this.page * PAGE).limit(PAGE).where({
      _openid: this.data.openID,
    }).get({
      success: res => {
        console.log('xx', res.data)
        if (isInit) {
          this.setData({
            list: res.data
          })
        } else {
          // 下拉刷新，不能直接覆盖而是累加
          this.setData({
            list: this.data.list.concat(res.data)
          })
          wx.stopPullDownRefresh()
        }
        wx.hideLoading()
      }
    })
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
 
  onLoad: function () {
    
    console.log(wx.getStorageSync('openID'))
    console.log(wx.getStorageSync('userInfo'))
    if (wx.getStorageSync('openID') && wx.getStorageSync('userInfo')){
      app.globalData.userInfo = wx.getStorageSync('userInfo')
      this.setData({
        userInfo: wx.getStorageSync('userInfo'),
        hasUserInfo: true
      })
      this.getList(true)
    } else if (app.globalData.userInfo) {
        this.page = 0
        this.getList(true)
        this.setData({
          userInfo: app.globalData.userInfo,
          hasUserInfo: true
        })
      } else if (this.data.canIUse) {
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        app.userInfoReadyCallback = res => {
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      } else {
        // 在没有 open-type=getUserInfo 版本的兼容处理
        wx.getUserInfo({
          success: res => {
            app.globalData.userInfo = res.userInfo
            this.setData({
              userInfo: res.userInfo,
              hasUserInfo: true
            })
          }
        })
      }
  },

  onShow: function () {
    this.onLoad();
  },

  getUserInfo: function(e) {
    wx.cloud.callFunction({
      name: 'login',
      data:{
        a: 10,
        b: 20
      },
      success:res=>{
        // console.log(res.result.wxInfo.OPENID)
        e.detail.userInfo.openid = res.result.wxInfo.OPENID

        wx.setStorageSync('openID', res.result.wxInfo.OPENID)
        this.setData({
          openID: wx.getStorageSync('openID')
        })
        this.page = 0
        this.getList(true)

        // 需要Openid
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
          userInfo: e.detail.userInfo,
          hasUserInfo: true
        })
        wx.setStorageSync('userInfo', e.detail.userInfo)
        
      }
    })


  }
})
