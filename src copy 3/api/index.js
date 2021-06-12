import ajax from './ajax'

var url = window.location.href
var baseUrl = url.split('?')[0];
var params = url.split('?')[1];
var cs_arr = params.split('&');
var cs={};
for(var index=0 ; index<cs_arr.length; index++){
    cs[cs_arr[index].split('=')[0]] = cs_arr[index].split('=')[1]
}
// console.log(cs);
// 公众号id 活动id
let i = cs['i']
let ay = cs['ay'].split('#')[0];
const BASE_URL = `${baseUrl}?i=${i}&c=entry&m=crab_cloud_video`
// let i = 1
// let ay = 8
// const BASE_URL = `/app/index.php?i=${i}&c=entry&m=crab_cloud_video`

// 配置轮次
export const reqDeployRound = (guid,roundData,screenid) => ajax.post(`${BASE_URL}&do=douyin&op=screen&fn=setRound`,
    {
      data:{
        guid,
        roundData,
        winagain:1,
        screenid,
        ay
      }
    }
)


//大屏幕首页
export const reqHome = () => ajax({
  method: 'POST',
  url:  BASE_URL+'&do=douyin&op=screen&fn=index',
  data:{
    ay
  }
})

//中奖用户列表
export const reqWinnerList = (screenid,roundid) => ajax({
  method: 'POST',
  url:  BASE_URL+'&do=douyin&op=screen&fn=winnerList',
  data:{
    ay,
    screenid,
    roundid
  }
})

//签到用户列表
export const reqSignUserList = (screenid) => ajax({
  method: 'POST',
  url:  BASE_URL+'&do=douyin&op=screen&fn=signList',
  data:{
    screenid
  }
})

//轮询获取签到用户
export const reqSignUser = (screenid,mid) => ajax({
  method: 'POST',
  url:  BASE_URL+'&do=douyin&op=screen&fn=signUser',
  data:{
    screenid,
    mid
  }
})

//清空轮次
export const reqClearRound = (screenid,roundids,recover_prize=1) => ajax({
  method: 'POST',
  url:  BASE_URL+'&do=douyin&op=screen&fn=clearRound',
  data:{
    ay,
    screenid,
    roundids,
    recover_prize
  }
})

//抽奖请求
export const reqToDraw = (screenid,roundid) => ajax({
  method: 'POST',
  url:  BASE_URL+'&do=douyin&op=screen&fn=drawPrize',
  data:{
    screenid,
    roundid,
    ay
  }
})

//签到结束
export const reqSignOver = (screenid) => ajax({
  method: 'POST',
  url:  BASE_URL+'&do=douyin&op=screen&fn=signOver',
  data:{
    screenid
  }
})
//继续签到
export const reqContinueSign = (screenid) => ajax({
  method: 'POST',
  url:  BASE_URL+'&do=douyin&op=screen&fn=signContinue',
  data:{
    screenid
  }
})

//得奖回调
export const reqSetWinner = (userids,screenid) => ajax({
  method: 'POST',
  url:  BASE_URL+'&do=douyin&op=screen&fn=setWinner',
  data:{
    userids,
    screenid
  }
})