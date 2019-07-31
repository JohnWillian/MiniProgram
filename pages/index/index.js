const db = wx.cloud.database()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    tops:[],
    userInfo:'',
    like_bar_style: '',
    like_id:[],
    thumbs_up:[],
    banner: ['cloud://takeout-8c2254.7461-takeout-8c2254/banner/banner1.png','cloud://takeout-8c2254.7461-takeout-8c2254/banner/banner2.png']
  },
  /**
   * 生命周期函数--监听页面加载
   */
  // search(){

  // },

  send(){
    if (app.globalData.userInfo){
      wx.navigateTo({
        url: '/pages/send/send',
      })
    }else{
      wx.switchTab({
        url: '/pages/me/me',
      })
    }
    
  },

  // addCart(e){
  //   const {item} = e.currentTarget.dataset
  //   const i = app.globalData.carts.findIndex(v=>v._id==item._id)
  //   if(i>-1){
  //     // 存在 数量加一
  //     app.globalData.carts[i].num += 1
  //   }else{
  //     item.num = 1
  //     app.globalData.carts.push(item)
  //   }
  //   app.setTabbar()
  // },

  setNotifyRemind(){
    db.collection('reply').where({
      uid: wx.getStorageSync('openID'),
      is_read: 0 // 填入当前用户 openid
    }).count({
      success: function (res) {
        console.log(res.total)
        if(res.total == 0){
          wx.removeTabBarBadge({
            index: 1,
          })
        }else{
          wx.setTabBarBadge({ index: 1, text: `${res.total}` })
        }
      }
    })
  },

  onPullDownRefresh(){
    this.getList(true)
  },
  onReachBottom(){
    this.page += 1
    this.getList()
  },

  
  getList(isInit){
    const PAGE = 8
    wx.showLoading({
      title: '加载中',
    })
    db.collection('blackboard').orderBy('time', 'desc').skip(this.page * PAGE).limit(PAGE).get({
      success:res=>{
        console.log('xx',res.data)
        if(isInit){
          this.setData({
            list:res.data
          })
        }else{
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

  // 详情页面跳转
  toDetail(e){
    const id = e.currentTarget.id
    wx.navigateTo({
      url: '/pages/detail/detail?id='+ id,
    })
    console.log(e)
  },

  // 点赞计数
  like(e){
    const { index } = e.currentTarget.dataset
    const list = [...this.data.list]
    // console.log(e.currentTarget)
   
    // 获取点赞帖子的对应ID并且录入数组
    var like_bar_stats = wx.getStorageSync('like_bar_stats');
    var like_id = wx.getStorageSync('like_id') || [];
    if(like_id.includes(e.currentTarget.id)){
      for(var i = 0;i < like_id.length;i++){
        if(like_id[i]==e.currentTarget.id){
          like_id.splice(i,1)
          console.log(like_id)
          list[index].like -= 1
          list[index].like_bar_style = 'likeBar'
          this.setData({
            list,
            like_bar_style: like_bar_stats,
          })
          // 数据库写入数据，更新赞数-1
          var incLike = db.collection('blackboard').doc(e.currentTarget.id)
          incLike.get({
            success: res => {
              console.log(res)
            }
          })
          incLike.update({
            data: {
              like: db.command.inc(-1),
            }
          })
        }
      }
    }else{
      like_id.push(e.currentTarget.id)
      console.log(like_id)
      list[index].like += 1
      list[index].like_bar_style = 'likeBar_active'
      this.setData({
        list,
        like_bar_style: like_bar_stats,
      })
      // 数据库写入数据，更新赞数+1
      var incLike = db.collection('blackboard').doc(e.currentTarget.id)
      incLike.get({
        success: res => {
          console.log(res)
        }
      })
      incLike.update({
        data: {
          like: db.command.inc(1)
        }
      })
    }
    this.setData({
      like_id: like_id
    })
    wx.setStorageSync('like_id', like_id)
  },

  


  //swiper获取
  getTop(){
    db.collection('blackboard').orderBy('like','desc').limit(3).get({
      success:res=>{
        console.log(res.data)
        this.setData({
          tops: res.data
        })
      }
    })
  },
  onShareAppMessage(){
    return{
      title:'Hello World'
    }
  },
  onLoad(){
    this.page = 0
    this.getList(true)
    this.getTop()
    this.setNotifyRemind()
    wx.showShareMenu()

    wx.getUserInfo({
      success: res => {
        console.log(res)
        app.globalData.userInfo = res.userInfo
        this.setData({
          userInfo: res.userInfo
        })
      }
    })


    
  },

  mounted() {
    this.setNotifyRemind();
    setInterval(() => {
      this.setNotifyRemind();
      console.log('15000')
    }, 15000);
  },
  onShow(){
    this.onLoad();
  },

})