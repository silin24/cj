<template>
  <div class="draw">
    <div class="drawHeader">
      <div  class="headerLeft">
        <img src="../../assets/back.png" alt="" class="back" @click="$router.back()">
        <span>欢迎参加, {{activityName}}</span>
      </div>
      <div class="headerRight">
        <div>
        {{userList && userList.length}}人已签到
        </div>
      </div>
    </div>
    <div class="drawBody">
        <div class="left" >
          <div class="up">
            <span>抽奖名单</span>
            <span>{{userList && userList.length}}人</span>
          </div>
          <div class="down">
            <div v-for="(item,index) in userList" :key="index">
              <img :src="item.avatar" alt="">
            </div>
          </div>
        </div>
        <div class="middle">
          <!-- <img src="../../assets/winBgimg.png" alt="" class="winBgimg"> -->
          <div class="middleContainer">
            <img :src="drawUrl" alt="" ref="winImg" v-if="drawUrl">
            <!-- <div class="winnerName" v-if="drawUrl"> -->
            <span class="winnerName" v-if="drawUrl" ref="winnerName">{{winnerName}}</span>
            <!-- </div> -->
            <span v-else> ? </span>
          </div>
        </div>
        <div class="right">
          <div v-for="(item,index) in drawRounds" :key="item.round">
            <div class="rounds"
            :class="(index == winUserIndex)? 'animate__animated animate__flash animate__infinite':''"
            >
              <span>{{item.round}}</span>
            </div>
            <div class="persons">
              <div v-for="(item,index) in showAllWinUser[index]" :key="item.id">
              <!-- <div v-for="(item,index) in showAllWinUser[Object.keys(showAllWinUser)[index]]" :key="index"> -->
                <img :src="item.avatar" alt="">
              </div>
            </div>
          </div>
        </div>
    </div>
    <div class="drawFooter">
      <div class="btns">
        <button class="deployRound" @click="deployRound">{{deployRoundText}}</button>
        <button class="resetDraw" @click="resetDraw">重置抽奖</button>
        <button class="clearRound" @click="clearRound" >{{clearRoundText}}</button>
        <div class="start" @click="start" :class="animateClass" ref="start" >
          <!-- <span class="animate__animated animate__heartBeat"> -->
          <span>
            {{satrtAndOver}}
          </span>
        </div>
        <button class="win" @click="winList">获奖名单</button>
      </div>
      <span>
        活动支持: {{copyright}}
      </span>
      <div class="roundBox" v-show="showRoundBox">
        <div class="perRound" v-for="(item,index) in roundArr" :key="item.round">
          <div class="roundInfo">
            <span>第{{item.round}}轮</span>
            <span>{{item.persons}}人</span>
          </div>
          <div class="card">
           <Select  v-model="item.cardId" :cardName="item.cardName"/>
            <img src="../../assets/Card2.png" alt="">
          </div>
          <input type="checkbox" name="checkbox" class="checkbox" v-model="item['isChecked']" disabled>
        </div>
        <div class="selfRound">
          <div>
            <span>第</span>
            <input type="number" name="" v-model="round">
            <span>轮</span>
            <input type="number" name="" v-model="persons">
            <span>人</span>
          </div>
          <!-- <Select v-model="selfId"/> -->
          <SelfSelect v-model="selfId"/>
          <button @click="toAddRound">添加</button>
        </div>
        <div class="setRound">
          <button class="btn" @click="reqSetRound">提交</button>
        </div>
      </div>
      <div class="isResetDraw" v-show="showIsResetDraw">
        <span>确定重置抽奖</span>
        <div>
          <button class="no" @click="isResetDraw(0)">否</button>
          <button class="yes" @click="isResetDraw(1)">是</button>
        </div>
      </div>
      <div class="clearRoundBox" v-show="showIsClearRound">
        <div class="clearAll">
          <span>全部清空</span>
          <input type="checkbox" name="checkbox" class="checkbox" v-model="clearAllRound">
        </div>
        <div v-for="(item,index) in drawRounds" :key="item.round">
          <span>清空第{{item.round}}轮</span>
          <input type="checkbox" name="checkbox" class="checkbox" v-model="item.isClear">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import _ from "lodash";
  import Select from '../../components/select'
  import SelfSelect from '../../components/selfSelect '
  import {SAVE_WINNERLIST} from '../../store/mutations-type'
  import {reqDeployRound,reqClearRound,reqToDraw} from '../../api'
  export default {
    components:{
      Select,
      SelfSelect
    },
    data() {
      return {
        //版权,活动名
        copyright:'',
        activityName:'',
        cardList:[],
        //签到用户列表
         userList:[],
        // 签到用户id
        // signUserId:'',
        //是否回收卡卷
        recover_prize:0,
        //大屏id 用于请求
        screenId:'',
        //中奖用户显示url
        drawUrl:'',
        //当前中奖用户名
        winnerName:'',
        satrtAndOver:'开始',
        //开始按钮动画
        animateClass:'animate__animated animate__pulse animate__infinite',
        //显示配置轮次弹出框
        showRoundBox:false,
        deployRoundText:'配置轮次',
        //显示重置抽奖弹出框
        showIsResetDraw:false,
        //显示清空轮次弹出框
        showIsClearRound:false,
        clearRoundText:'清空轮次',
        //自定义的轮次和人数 v-model
        round:'',
        persons:'',
        selfId:'',
        //配置轮次处,清除轮次信息
        clearSetRoundArr:[],
        //轮次信息数组
        roundArr:[
          // {round:1,persons:1,cardId:'', cardName:'', isChecked:false,isClear:false},
          // {round:2,persons:2,cardId:'', cardName:'', isChecked:false,isClear:false},
          // {round:3,persons:3,cardId:'', cardName:'', isChecked:false,isClear:false},
          // {round:4,persons:4,cardId:'', cardName:'', isChecked:false,isClear:false}
        ],
        clearAllRound:false,
        //抽奖轮次id数组
        roundIdArr:[],
        //抽奖轮次,是第几轮
        roundIndex:1,
        //用于判断清空轮次时,轮次所在的具体位置
        roundNameArr:[],
        //中奖用户
        // winUser:[],
        winUser:{},
        //用于判断抽奖是否完成
        winUserNum:0,
        //用于从winUser取数据
        winUserIndex:0,
        //右侧用于展示所有中奖用户头像
        // showAllWinUser:[],
        showAllWinUser:{},
        //用于判断抽奖是否完成
        showAllWinUserNum:0,
        //右侧用于展示每轮中奖用户头像数组
        showPerWinUser:[],
        //配置出的抽奖轮次数据
        drawRounds:[],
        //总中奖人数
        allWinNum:Number,
        //当前轮次中奖数据,用于中间展示中奖用户,
        roundData:{},
        //用于从roundData取数据
        roundDataIndex:0,
        //定时器id
        timeId:Number
      }
    },
    created() {
      let _this = this
      document.onkeydown = function(e) {
        let key = window.event.keyCode;
        if (key == 32) {
          _this.start()
        }
      };
    },
    computed:{
      ...mapState({
        userlist: state => state.userList,
        // copyright: state => state.copyright,
        // activityName: state => state.activityName,
        // cardArr: state => state.cardArr,
      }),
    },
    methods: {
      //显示配置轮次
      async deployRound(){
        !!!this.showRoundBox ? (this.showRoundBox = true) : (this.showRoundBox = false)
        this.showIsResetDraw = false
        this.showIsClearRound = false
        this.clearRoundText = '清空轮次'
        // this.drawRounds.length>0 && (this.roundArr = this.drawRounds)
        this.drawRounds.length>0 && (this.roundArr = JSON.parse(JSON.stringify(this.drawRounds)))
      },
      //发送配置轮次请求
      async reqSetRound(){
        this.showRoundBox = false
        //取出选中的轮次信息
        let roundInfo = this.roundArr.filter((item)=>{
          return item.isChecked === true
        })
        console.log(roundInfo);
        if (roundInfo.length == 0) {
          this.showAllWinUser = {}
          this.roundIndex = 1
          this.winUser = {}
          this.winUserIndex = 0
          this.winUserNum = 0
          this.showAllWinUserNum = 0
          this.roundDataIndex = 0
          this.roundData = {}
          this.roundNameArr = []
          this.roundIdArr = []
          localStorage.removeItem('winUserDatas')
          localStorage.removeItem('showAllWinUserDatas')
        }
        // this.drawRounds = roundInfo
        this.allWinNum = roundInfo.reduce((pre,cur)=>{
          return pre + cur.persons*1
        },0)
        localStorage.setItem('drawRoundsDatas', JSON.stringify(this.drawRounds))
        //配置请求后台需要的参数
        let reqRoundData = roundInfo.map((item)=>{
          let reItem = {
            round_number : item.persons,
            round_card : item.cardId,
            round : item.round,
          }
          return reItem
        })
        console.log(reqRoundData);
        if (reqRoundData.length>0) {
          let guid = localStorage.getItem('guid')
          let data =  await reqDeployRound(guid,reqRoundData,this.screenId)
          console.log(data);
          let {code} = data
          delete data.code
          //轮次id数组
          let idArr = []
          //轮次name数组(本地配置的round)
          let nameArr = []
          if (code == 1) {
            this.drawRounds = roundInfo
            //取出成功请求后的轮次id,用于发送抽奖请求
            Object.keys(data).forEach((key)=>{
              idArr.push(data[key].id)
              nameArr.push(data[key].name*1)
            })
            console.log(idArr);
            console.log(nameArr);
            //抽奖所需的轮次id
            this.roundIdArr = idArr
            this.roundNameArr = nameArr
            localStorage.setItem('roundIdArrDatas', JSON.stringify(this.roundIdArr))
            localStorage.setItem('roundNameArrDatas', JSON.stringify(this.roundNameArr))
          } else {
            alert('配置轮次请求失败,请稍后再试')
          }
        }
      },
      //开始抽奖
      async start(){
        if (this.drawRounds.length == 0) {
          window.confirm('请配置抽奖轮次')
          return
        }
        if (this.allWinNum > this.userList.length) {
          window.confirm('中奖人数不足,请重新配置')
          this.satrtAndOver = '开始'
          return
        }
        if(this.winUserNum !=0 && this.winUserNum == this.showAllWinUserNum && Object.keys(this.showAllWinUser).length == this.drawRounds.length){
        // if(this.winUserNum !=0 && this.winUserNum == this.showAllWinUserNum ){
          this.drawUrl = ''
          return
        }
        if (this.satrtAndOver === '开始') {
          this.satrtAndOver = '停'
          this.animateClass= ''
          //取出轮次id 发请求获取中奖用户列表
          let reqRoundId = this.roundIdArr[this.roundIndex - 1]
          reqRoundId && (this.roundIndex = this.roundIndex*1+1)

          if (this.roundIndex>this.roundIdArr.length) {
            localStorage.setItem('roundIndex', this.roundIndex)
          }
          console.log(reqRoundId);
          if (reqRoundId) {
            let data = await reqToDraw(this.screenId,reqRoundId)
            console.log(data);
            let {code,msg} = data
            delete data.code
            if (code == 1) {
              this.winUser[this.roundIndex-1] = data
              localStorage.setItem('winUserDatas', JSON.stringify(this.winUser))
              //中奖用户数量
              this.winUserNum = 0
              Object.keys(this.winUser).forEach((item)=>{
                this.winUserNum = this.winUserNum +  Object.keys(this.winUser[item]).length
              })
              console.log(this.winUserNum);
              localStorage.setItem('winUserNum',this.winUserNum)
              //前端模拟抽奖动画
              let num = this.userList.length
              !!this.timeId && clearInterval(this.timeId)
              this.timeId = setInterval(() => {
                var index = Math.floor(Math.random()*(1- num) + num);
                if (this.userlist.length > 0 ) {
                  this.userlist[index] && (this.drawUrl =  this.userlist[index].avatar)
                  this.userlist[index] && (this.winnerName =  this.userlist[index].nickname)
                } else {
                  this.userList[index] && (this.drawUrl =  this.userList[index].avatar)
                  this.userList[index] && (this.winnerName =  this.userList[index].nickname)
                }
              }, 50);
            } else {
              alert(msg)
            }
          } else {
            //前端模拟抽奖动画
            let num = this.userList.length
            !!this.timeId && clearInterval(this.timeId)
            this.timeId = setInterval(() => {
              var index = Math.floor(Math.random()*(1- num) + num);
              if (this.userlist.length > 0 ) {
                this.userlist[index] && (this.drawUrl =  this.userlist[index].avatar)
                this.userlist[index] && (this.winnerName =  this.userlist[index].nickname)
              } else {
                this.userList[index] && (this.drawUrl =  this.userList[index].avatar)
                this.userList[index] && (this.winnerName =  this.userList[index].nickname)
              }
            }, 50);
          }

        } else {
          this.satrtAndOver = '开始'
          this.animateClass = 'animate__animated animate__pulse animate__infinite'
          clearInterval(this.timeId)
          let win = this.$refs.winImg
          //取出每轮中奖用户列表
          this.roundData = this.winUser[this.winUserIndex+1]
          console.log(this.roundData);
          if (this.roundData) {
            console.log(Object.keys(this.roundData));
            let key = Object.keys(this.roundData)[this.roundDataIndex]
            this.roundDataIndex = this.roundDataIndex + 1
            console.log(key);
            if (key) {
              win &&  (win.src = this.roundData[key].avatar)
              this.roundData[key].nickname && (this.winnerName = this.roundData[key].nickname)
              this.showPerWinUser.unshift(
                {
                  avatar:this.roundData[key].avatar,
                  id:this.roundData[key].id
                }
              )
              this.showAllWinUser[this.winUserIndex] = this.showPerWinUser
              localStorage.setItem('showAllWinUserDatas', JSON.stringify(this.showAllWinUser))
              //用于判断抽奖轮次,判断当前轮次的中奖用户是否抽完
              if (this.showPerWinUser.length == Object.keys(this.roundData).length) {
                // this.winUserIndex < Object.keys(this.winUser).length && (this.winUserIndex = this.winUserIndex+1)
                if (this.winUserIndex < Object.keys(this.winUser).length) {
                  this.winUserIndex = this.winUserIndex+1
                  localStorage.setItem('winUserIndex', this.winUserIndex)
                }
                this.roundDataIndex = 0
                this.showPerWinUser = []
              }
            }
          }
        }
      },
      //重置抽奖显示框
      resetDraw(){
        this.showIsResetDraw = true
        this.showIsClearRound = false
        this.showRoundBox = false
        this.clearRoundText = '清空轮次'
        this.deployRoundText = '配置轮次'
      },
      //清空轮次
      async clearRound(){
        !!!this.showIsClearRound ? (this.showIsClearRound = true) : (this.showIsClearRound = false)
        this.showIsResetDraw = false
        this.showRoundBox = false
        if (this.clearRoundText === '清空轮次' ) {
          this.clearRoundText = '确定'
          this.clearAllRound = false
          this.drawRounds = this.drawRounds.map((item)=>{
            item.isClear = false
            return item
          })
          console.log(this.drawRounds);
        } else {
          this.clearRoundText = '清空轮次'
          if (this.clearAllRound === true) {
            this.showAllWinUser = {}
            this.roundIndex = 1
            this.winUser = {}
            this.winUserIndex = 0
            this.winUserNum = 0
            this.showAllWinUserNum = 0
            this.roundDataIndex = 0
            localStorage.setItem('roundIndex', this.roundIndex)
            localStorage.setItem('winUserIndex', this.winUserIndex)
            localStorage.removeItem('winUserDatas')
            localStorage.removeItem('showAllWinUserDatas')
            //判断是否选择卡卷
            let isHaveCard = this.drawRounds.find((item)=> item.cardId != '')
            if (typeof(isHaveCard) === 'object') {
              if (window.confirm('是否回收卡卷')) {
                this.recover_prize = 1
              } else {
                this.recover_prize = 0
              }
            }
            let data = await reqClearRound(this.screenId,this.roundIdArr,this.recover_prize)
            console.log(data);
            let {code} = data
            if (code !== 1) {
              alert('清空轮次失败,请重新清空')
            }
          } else {
            //取选择清除的轮次
            let clearRoundInfo = this.drawRounds.filter((item)=>{
              return item.isClear === true
            })
            console.log(clearRoundInfo);
            if (clearRoundInfo.length) {
              // this.winUserNum = 0
              // this.showAllWinUserNum = 0
              this.winUserNum = 1
              this.showAllWinUserNum = 1
              let clearRoundIds = []
              clearRoundInfo.forEach((item1)=>{
                let id = this.roundNameArr.indexOf(item1.round*1)
                clearRoundIds.push(this.roundIdArr[id])
              })
              console.log(clearRoundIds);
              let isHaveCard = clearRoundInfo.find((item)=> item.cardId != '')
              if (typeof(isHaveCard) === 'object') {
                if (window.confirm('是否回收卡卷')) {
                  this.recover_prize = 1
                } else {
                  this.recover_prize = 0
                }
              }
              let data = await reqClearRound(this.screenId,clearRoundIds,this.recover_prize)
              console.log(data);
              let {code} = data
              //清空轮次成功
              if (code == 1) {
                console.log('清空轮次成功');
                clearRoundInfo.forEach((item)=>{
                  if (this.roundNameArr) {
                    let b = this.roundNameArr.indexOf(clearRoundInfo[0].round*1)
                    let a = this.roundNameArr.indexOf(item.round*1)
                    this.roundIndex = b+1
                    localStorage.setItem('roundIndex', this.roundIndex)
                    this.winUserIndex = b
                    localStorage.setItem('winUserIndex', this.winUserIndex)
                    //清除右侧显示的中奖信息
                    delete this.showAllWinUser[a]
                    delete this.winUser[a+1]
                  }
                })
                localStorage.setItem('winUserDatas', JSON.stringify(this.winUser))
                localStorage.setItem('showAllWinUserDatas', JSON.stringify(this.showAllWinUser))
              } else {
                alert('清空轮次失败,请重新清空')
              }
            }
          }
        }
      },
      // 获奖名单
      winList(){
        this.$router.push('/winnerlist')
        this.$store.commit(SAVE_WINNERLIST,this.winUser)
      },
      //是否重置抽奖
      async isResetDraw(a){
        this.showIsResetDraw = false
        if (a == 1) {
          console.log('重置抽奖-----------------');
          this.showAllWinUser = {}
          this.showPerWinUser = []
          this.winUser = {}
          this.winUserIndex = 0
          this.winUserNum = 0
          this.showAllWinUserNum = 0
          this.roundDataIndex = 0
          this.drawRounds = []
          this.roundIndex = 1
          this.drawUrl=''
          //初始配置轮次数组
          // this.roundArr.forEach((item)=>{
          //   item.cardId = ''
          //   item.cardName = ''
          //   item.isChecked = false
          // })
          this.roundArr = []
          this.round = '',
          this.persons = '',
          this.selfId = '',
          localStorage.removeItem('winUserDatas')
          localStorage.removeItem('showAllWinUserDatas')
          localStorage.removeItem('drawRoundsDatas')
          localStorage.removeItem('roundIdArrDatas')
          localStorage.removeItem('roundIndex')
          localStorage.removeItem('winUserIndex')
          localStorage.removeItem('winUserNum')
          localStorage.removeItem('showAllWinUserNum')
          localStorage.removeItem('roundNameArrDatas')
          //判断是否选择卡卷
          let isHaveCard = this.drawRounds.find((item)=> item.cardId != '')
          if (typeof(isHaveCard) === 'object') {
            if (window.confirm('是否回收卡卷')) {
              this.recover_prize = 1
            } else {
              this.recover_prize = 0
            }
          }
          let data = await reqClearRound(this.screenId,this.roundIdArr,this.recover_prize)
          console.log(data);
          this.roundIdArr = []

        }
        console.log(a);
      },
      //添加轮次
      toAddRound(){
        if (this.round!= '' && this.persons != '') {
          var cardName
          this.cardList.forEach((item)=>{
            item.id == this.selfId && (cardName = item.name)
          })
          console.log(cardName);
          let selfAddRound = {
            round:this.round,
            persons:this.persons,
            cardId:this.selfId,
            isChecked:true,
            isClear:false,
            cardName:cardName
          }
          this.roundArr.push(selfAddRound)
        } else {
          window.confirm('未填入轮次信息')
        }
      },
    },
    watch:{
      showPerWinUser(){
        this.showAllWinUserNum = 0
        let that = this
        Object.keys(this.showAllWinUser).forEach((item)=>{
          that.showAllWinUserNum = that.showAllWinUserNum + that.showAllWinUser[item].length
        })
        localStorage.setItem('showAllWinUserNum',this.showAllWinUserNum)
        console.log(this.showAllWinUserNum);
      },
    },
    activated(){
      //签到用户列表,版权,活动名字,大屏id(来自sign页)
      this.userList = JSON.parse(localStorage.getItem('userList'))
      this.copyright = localStorage.getItem('copyright')
      this.activityName = localStorage.getItem('activityName')
      let screenid = localStorage.getItem('screenid')
      screenid && (this.screenId = screenid)
      //中奖用户数据
      let winUserDatas = JSON.parse(localStorage.getItem('winUserDatas'))
      //右侧展示中奖用户的数据
      let showAllWinUserDatas = JSON.parse(localStorage.getItem('showAllWinUserDatas'))
      //配置出的抽奖轮次信息
      let drawRoundsDatas = JSON.parse(localStorage.getItem('drawRoundsDatas'))
      let roundIdArrDatas = JSON.parse(localStorage.getItem('roundIdArrDatas'))
      winUserDatas && (this.winUser = winUserDatas)
      showAllWinUserDatas && (this.showAllWinUser = showAllWinUserDatas)
      drawRoundsDatas && (this.drawRounds = drawRoundsDatas)
      roundIdArrDatas && (this.roundIdArr = roundIdArrDatas)
      this.roundNameArr = JSON.parse(localStorage.getItem('roundNameArrDatas'))
      //中奖用户人数
      this.winUserNum = localStorage.getItem('winUserNum')
      this.showAllWinUserNum = localStorage.getItem('showAllWinUserNum')
      //用于刷新后能正常添加抽奖
      //roundIndex
      let roundIndex = JSON.parse(localStorage.getItem('roundIndex'))
      roundIndex && (this.roundIndex = roundIndex)
      //winUserIndex
      let winUserIndex = JSON.parse(localStorage.getItem('winUserIndex'))
      winUserIndex && (this.winUserIndex = winUserIndex)
      //cardList
      let cardList = JSON.parse(localStorage.getItem('cardList'))
      cardList && (this.cardList = cardList)
      // unload事件在页面确定刷新，但是还没有真正刷新的时候，     页面即将刷新之前执行
      window.addEventListener('unload', () =>{
        // 将最新的shopDatas存入sessionStorage
        // localStorage.setItem('shopDatas', JSON.stringify(this.shopDatas))
      })

    },
    deactivated() {
    },
  }
</script>

<style lang="scss" scoped>
  .draw {
    height: 100%;
    width: 100%;
    padding: 65px 80px 45px 100px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .drawHeader {
      flex-grow: 0;
      box-sizing: border-box;
      color:#fff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .headerLeft {
        display: flex;
        align-items: center;
        overflow: hidden;
        .back {
          width: 80px;
          height: 80px;
          margin-right: 20px;
        }
        span {
          font-size: 60px;
        }
      }
      .headerRight {
        div {
          padding: 20px 36px;
          border-radius: 50px;
          border: 4px solid #8D67FF;
          background: linear-gradient(#8D67FF, #FF26FF);
          text-align: center;
          font-size: 30px;
        }
      }
    }
    .drawBody {
      flex-grow: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .left {
        border: 4px solid #B762FD;
        width: 437px;
        height: 650px;
        border-radius: 60px;
        overflow: hidden;
        .up {
          height: 18%;
          display: flex;
          justify-content: space-around;
          font-size: 30px;
          color: #fff;
          align-items: center;
        }
        .down {
          height: 82%;
          display: flex;
          flex-wrap: wrap;
          align-content: flex-start;
          box-sizing: border-box;
          padding-left: 32px;
          margin-top: 5px;
          overflow: scroll;
          scrollbar-width: none; // 火狐
          -ms-overflow-style: none; // ie
          &::-webkit-scrollbar {
            display: none;
            height: 0;
          }
          div {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            box-sizing: border-box;
            border: 3px solid #B762FD;
            margin: 0 33px 33px 0;
            img {
              width: 94px;
              height: 94px;
              border-radius: 50%;
            }
          }
        }
      }
      .middle {
        width: 600px;
        height: 600px;
        border-radius: 50%;
        box-sizing: border-box;
        border: 16px solid #8D67FF;
        background: rgba(0, 0, 0, 0.6);
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        .middleContainer {
          // height: 100%;
          // width: 100%;
          height: 600px;
          width: 600px;
          border-radius: 50%;
          box-sizing: border-box;
          .winnerName {
            position: absolute;
            box-sizing: border-box;
            padding: 10px 150px 0;
            text-align: center;
            line-height: 50px;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 500px;
            height: 80px;
            background: linear-gradient( #E75DFA,#8D67FF);
            display: inline-block;
            color: #fff;
            font-size: 40px;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
          }
          img {
            // height: 100%;
            // width: 100%;
            height: 600px;
            width: 600px;
            border-radius: 50%;
          }
          span {
            color: #EC5CFA;
            display: block;
            font-size: 400px;
            text-align: center;
            line-height: 600px;
          }
        }
      }
      .right {
        // background-color: green;
        width: 484px;
        height: 650px;
        display: flex;
        flex-direction: column;
        // overflow: hidden;
        overflow: scroll;
        scrollbar-width: none; // 火狐
        -ms-overflow-style: none; // ie
        &::-webkit-scrollbar {
          display: none;
          height: 0;
        }
        >div {
          width: 480px;
          height: 95px;
          box-sizing: border-box;
          padding: 10px 15px 10px 9px;
          border-radius: 50px;
          border: 4px solid #8D67FF;
          margin-bottom: 17px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .rounds {
            width: 66px;
            height: 66px;
            border-radius: 50%;
            // background-color: #B762FD;
            background: linear-gradient(#9167FF, #E75DFA);
            text-align: center;
            line-height: 66px;
            &.animate__animated {
              animation-duration: 2s;
            }
            span {
              font-size: 40px;
              color: #fff;
            }
          }
          .persons {
            display: flex;
            width: 306px;
            overflow: scroll;
            scrollbar-width: none; // 火狐
            -ms-overflow-style: none; // ie
            &::-webkit-scrollbar {
              display: none;
              width: 0;
            }
            div {
              width: 66px;
              height: 66px;
              border-radius: 50%;
              box-sizing: border-box;
              border: 3px solid #B762FD;
              margin-right: 15px;
              img {
                width: 60px;
                height: 60px;
                border-radius: 50%;
              }
           }
          }
        }

      }
    }
    .drawFooter {
      flex-grow: 0;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items:flex-end;
      position: relative;
      .btns {
        display: flex;
        align-items: flex-end;
        button {
          width: 165px;
          height: 65px;
          box-sizing: border-box;
          overflow: hidden;
          text-align: center;
          line-height: 65px;
          border-radius: 60px;
          font-size: 30px;
          color: #fff;
          border: 1px solid transparent;
          outline: none;
        }
        .deployRound {
          background: linear-gradient(#C862FF 40%, #981ADF);
          margin-right: 30px;
        }
        .resetDraw {
          background:linear-gradient(#698EFF, #5F2DF9);
          margin-right: 30px;
        }
        .clearRound {
          background: linear-gradient(#698EFF, #5F2DF9);
          margin-right: 70px;
        }
        .start {
          width: 458px;
          height: 127px;
          border-radius: 140px;
          background: linear-gradient(#FF6FD9,#F72F9E 40%,#B0129D 70%, #50015A 90% );
          // font-size: 60px;
          margin-right: 70px;
          text-align: center;
          line-height: 127px;
          span {
            color: #fff;
            display: block;
            font-size: 60px;
            &.animate__animated {
                animation-duration: 2s;
              }
          }
        }
        .win {
          background: linear-gradient(#698EFF, #5F2DF9);
        }
      }
      span {
        color: #a29fa7;
        font-size: 25px;
      }
      .roundBox {
        position: absolute;
        bottom: 80px;
        left: 0;
        // width: 400px;
        width: 500px;
        padding: 5px 0 10px;
        box-sizing: border-box;
        border-radius: 10px;
        border: 1px solid #B762FD;
        background-color: #fff;
        .perRound {
          display: flex;
          height: 50px;
          // width: 400px;
          width: 100%;
          padding:0 20px;
          box-sizing: border-box;
          justify-content: space-between;
          align-items: center;
          position: relative;
          &::after {
            position: absolute;
            bottom: 0;
            left: 0;
            display: block;
            content: '';
            width: 100%;
            height: 1px;
            transform: scaleX(0.95);
            background-color: #B762FD;
          }
          .roundInfo {
            width: 38%;
            span {
              margin-right: 12px;
              color: black;
              font-size: 20px;
            }
          }
          .card {
            width: 55%;;
            display: flex;
            align-items: center;
            img {
              margin-left: 10px;
              width: 20px;
              height: 20px;
            }
          }
          .checkbox {
            text-align: center;
            // zoom:200%;
            width: 20px;
            height: 20px;
          }
        }
        .selfRound {
          padding:0 10px 0 20px;
          height: 50px;
          width: 100%;
          box-sizing: border-box;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          &::after {
            position: absolute;
            bottom: 0;
            left: 0;
            display: block;
            content: '';
            width: 100%;
            height: 1px;
            transform: scaleX(0.95);
            background-color: #B762FD;
          }
          >div {
            display: flex;
            align-items: center;
            span {
              margin-right: 5px;
              color: black;
              font-size: 20px;
            }
            input {
              width: 45px;
              height: 30px;
              border: 1px solid #A6A6A6;
              box-sizing: border-box;
              margin-right: 5px;
              outline: none;
              font-size: 15px;
            }
          }
          button {
            background: linear-gradient(#698EFF, #5F2DF9);
            border: 1px solid #5f2df9;
            border-radius: 15px;
            box-sizing: border-box;
            padding: 4px 8px;
            color: #fff;
            font-size: 15px;
          }
        }
        .setRound {
          height: 50px;
          line-height: 70px;
          text-align: center;
          .btn {
            color: #fff;
            box-sizing: border-box;
            border-radius: 20px;
            padding: 8px 20px;
            font-size: 20px;
            background: linear-gradient(#698EFF, #5F2DF9);
            border: 1px solid #5f2df9;
          }
        }
      }
      .isResetDraw {
        position: absolute;
        bottom: 80px;
        left: 195px;
        width: 165px;
        height: 100px;
        border-radius: 10px;
        background:#fff;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        span {
          font-size: 20px;
          color: black;
        }
        div {
          button {
            border-radius: 20px;
            padding: 2px 20px;
            font-size: 15px;
          }
          .no {
            margin-right: 15px;
            background-color: #fff;
            color: #6077FF;
            border: 1px solid #6077FF;
          }
          .yes {
            color: #fff;
            background-color: #6077FF;
            border: 1px solid #6077FF;
          }
        }
      }
      .clearRoundBox {
        position: absolute;
        bottom: 80px;
        left: 390px;
        width: 163px;
        border-radius: 10px;
        background-color: #fff;
        div {
          width: 100%;
          height: 50px;
          padding: 0 10px;
          box-sizing: border-box;
          // line-height: 50px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          span {
            font-size: 20px;
            color: black;
          }
          .checkbox {
            width: 20px;
            height: 20px;
          }
        }
      }
    }
  }

</style>