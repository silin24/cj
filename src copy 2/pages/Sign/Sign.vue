<template>
  <div class="sign">
    <div class="signContainer">
      <div class="signHeader">
        <span>欢迎参加, {{activityName}}</span>
        <div class="headerLeft">
          <div>
          {{userList.length}}人已签到
          </div>
        </div>
      </div>
      <div class="signBody">
        <div class="signBodyContainer">
          <div class="signPerson" ref="signPerson">
              <div class="scrollContainer" ref="scrollContainer">
                <!-- <div class="animate__animated animate__flash animate__infinite" v-if="haveBounce" ref="newestSign"> -->
                <div :class="animationClass" v-if="Object.keys(newestSign).length > 0" ref="newestSign">
                  <img :src="newestSign.avatar" alt="">
                </div>
                <div v-for="(item,index) in reUserList" :key="index">
                  <img :src="item.avatar" alt="">
                </div>
                <div class="emptyItem"></div>
                <div class="emptyItem"></div>
                <div class="emptyItem"></div>
                <div class="emptyItem"></div>
                <div class="emptyItem"></div>
                <div class="emptyItem"></div>
              </div>
          </div>
          <div class="qrCode " v-show="isShowQrCode">
            <div class="animate__animated animate__pulse">
              <!-- <img src="../../assets/ewm.png" alt="ewm" class="animate__animated animate__pulse"> -->
              <img :src="qrCode" alt="ewm">
            </div>
            <span>抖音扫一扫, 立即签到</span>
          </div>
        </div>
      </div>
      <div class="signFooter">
        <div>
          <button class="endSign" @click="overSign">{{overSignText}}</button>
          <button class="readyDraw" @click="toDraw">准备抽奖</button>
          <button class="code" @click="showkQrCode">二维码</button>
          <button class="clearSign" @click="clearSign">重置签到</button>
        </div>
        <span>
          活动支持: {{copyright}}
        </span>
      </div>
    </div>
    <div class="barrageContainer" ref="barrageContainer"></div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import _ from "lodash";
  import {SAVE_USERLIST,SAVE_CARDARR,SAVE_SCREENID,SAVE_BGM,SAVE_BGVURL,SAVE_BGIMG,SAVE_ACTIVITYNAME,SAVE_COPYRIGHT} from '../../store/mutations-type'
  import {reqHome,reqSignUser,reqSignOver,reqContinueSign} from '../../api/index'
  export default {
    data() {
      return {
        isShowQrCode:false,
        //签到用户列表
        userList:[],
        //最新添加用户
        newestSign:{},
        //是否有bounce动画
        haveBounce:false,
        animationClass:'animate__animated animate__flash animate__infinite',
        qrCode:'',
        //大屏id
        screenid:'',
        //轮询签到用户定时器id
        getSignTimeId:Number,
        mid:0,
        copyright:'',
        activityName:'',
        overSignText:'结束签到'
      }
    },
    methods: {
      showkQrCode(){
        !!!this.isShowQrCode ? (this.isShowQrCode = true) : (this.isShowQrCode = false)
        let scrollContainer = this.$refs.scrollContainer
        scrollContainer.style.animation = ""
      },
      toDraw(){
        clearInterval(this.getSignTimeId)
        this.$router.push('/draw')
        // this.$store.commit(SAVE_USERLIST,this.userList)
      },
      //结束签到
      async overSign(){
        if (this.overSignText == '结束签到') {
          this.overSignText = '继续签到'
          clearInterval(this.getSignTimeId)
          this.isShowQrCode = false
          this.animationClass = ''
          // let newestSign = this.$refs.newestSign
          // newestSign && newestSign.removeAttribute("class");
          let scrollContainer = this.$refs.scrollContainer
          let scrollContainerHeight = scrollContainer.offsetHeight
          // console.log(scrollContainerHeight);
          let signPerson = this.$refs.signPerson
          let signPersonHeight = signPerson.offsetHeight
          // console.log(signPersonHeight);
          let moveTime = scrollContainerHeight/signPersonHeight * 6
          // console.log(moveTime);
          moveTime > 6 && (scrollContainer.style.animation = `autoMove ${moveTime}s infinite linear `)
          let data = await reqSignOver(this.screenid)
          // console.log(data);
        } else {
          this.overSignText = '结束签到'
          this.isShowQrCode = true
          let scrollContainer = this.$refs.scrollContainer
          scrollContainer.style.animation = ""
          !!this.getSignTimeId && clearInterval(this.getSignTimeId)
          this.getSignTimeId = setInterval(() => {
            this.getSignUser(this.screenid,this.mid)
          }, 2000);
          this.animationClass = 'animate__animated animate__flash animate__infinite'
          let data = await reqContinueSign()
          console.log(data);
        }
      },
      //创建签到弹幕
      createBarrage(avatarUrl,username) {
        let barrageContainer = this.$refs.barrageContainer
        let barrage = document.createElement('div')
        let img = document.createElement('img')
        let span = document.createElement('span')
        let top = Math.floor(Math.random()*(10 - 90) + 90);
        span.innerHTML = username
        img.src = avatarUrl
        barrage.style.top = top + '%'
        barrage.style.position = 'absolute'
        barrage.style.right = '-510px'
        barrage.style.animation = 'barrage 10s linear 0s'
        barrage.style.boxSizing = 'border-box'
        barrage.style.display = 'flex'
        barrage.style.alignItems = 'center'
        img.style.borderRadius = '50%'
        img.style.width = '0.41rem'
        img.style.height = '0.41rem'
        img.style.marginRight = '0.1rem'
        span.style.fontSize = '0.2rem'
        span.style.color = '#fff'
        barrage.appendChild(img)
        barrage.appendChild(span)
        barrageContainer.appendChild(barrage)
        setTimeout(() => {
          barrageContainer.removeChild(barrage)
        }, 10000);
      },
      //获取大屏幕首页
      async getHomePage(){
        let data =  await reqHome()
        console.log(data);
        let {code} = data
        if (code == 1) {
          let {cards,activity,screen,copyright} = data
          //版权
          this.copyright = copyright
          this.$store.commit(SAVE_COPYRIGHT,copyright)
          localStorage.setItem('copyright',copyright)
          //活动名
          this.activityName = activity.name
          document.title = activity.name
          this.$store.commit(SAVE_ACTIVITYNAME,activity.name)
          localStorage.setItem('activityName',this.activityName)
          //卡卷列表
          this.$store.commit(SAVE_CARDARR,cards.list)
          localStorage.setItem('cardList',JSON.stringify(cards.list))
          //签到二维码
          this.qrCode = screen.sign_qrcode
          //活动id
          this.screenid = activity.screenid
          this.$store.commit(SAVE_SCREENID,activity.screenid)
          localStorage.setItem('screenid', activity.screenid)
          //背景音乐 视频 图片
          if (screen.bg_music) {
            this.$store.commit(SAVE_BGM,screen.bg_music)
            localStorage.setItem('bgm', screen.bg_music)
          }
          if (screen.bg_video) {
            this.$store.commit(SAVE_BGVURL,screen.bg_video)
            localStorage.setItem('bgvUrl', screen.bg_video)
          }
          if (screen.bg_image) {
            this.$store.commit(SAVE_BGIMG,screen.bg_image)
            localStorage.setItem('bgImg',screen.bg_image)
          }
          //轮询签到用户
          if (this.overSignText == '结束签到') {
            !!this.getSignTimeId && clearInterval(this.getSignTimeId)
            this.getSignTimeId = setInterval(() => {
              this.getSignUser(this.screenid,this.mid)
            }, 2000);
          }

        } else {
          let {msg} = data
          alert(msg)
          sessionStorage.setItem('activityError',msg)
          this.$router.replace('/activityError')
        }
      },
      //轮询获取签到用户
      async getSignUser(screenId,mId) {
        let data =  await reqSignUser(screenId,mId)
        // console.log(data);
        let {code,list,mid} = data
        if (code == 1) {
          this.mid = mid
          if (list.length > 0) {
            this.newestSign = list[0]
            this.userList.unshift(list[0])
            let {avatar,nickname} = list[0]
            this.createBarrage(avatar,nickname)
            localStorage.setItem('userList',JSON.stringify(this.userList))
            this.$store.commit(SAVE_USERLIST,this.userList)
          }
        }
      },
      //重置签到
      clearSign(){
        if (window.confirm('确定重置签到')) {
          console.log('重置签到');
          this.overSignText = '结束签到'
          this.mid = 0
          this.animationClass ='animate__animated animate__flash animate__infinite',
          this.userList = []
          this.newestSign = {}
          localStorage.removeItem('mid')
          localStorage.removeItem('userList')
          localStorage.removeItem('newestSign')
          // clearInterval(this.getSignTimeId)
          !!this.getSignTimeId && clearInterval(this.getSignTimeId)
          this.getSignTimeId = setInterval(() => {
            this.getSignUser(this.screenid,this.mid)
          }, 2000);
          this.haveBounce = false
          this.isShowQrCode = true
        }
      },
      //生成guid
      getGuid(){
         let guid = ''
         for (var i = 1; i <= 10; i++) {
            var id = Math.floor(Math.random() * 16.0).toString(16);
            guid += id;
         }
         localStorage.getItem('guid') == null && localStorage.setItem('guid',guid)
      }
    },
    computed:{
      // ...mapState({
      //   userlist: state => state.userList
      // }),
      reUserList () {
        return this.userList.slice(1)
      }
    },
    mounted() {
      this.getGuid()

      let mid = localStorage.getItem('mid')
      mid && mid !=0 && (this.mid = mid)
      let newestSign = JSON.parse(localStorage.getItem('newestSign'))
      console.log(newestSign);
      newestSign && (this.newestSign = newestSign)
    },
    watch: {
      newestSign () {
        this.haveBounce = true
      },
      
    },
    activated(){
      console.log('activated');
      this.getHomePage()
      this.getGuid()
      let users = JSON.parse(localStorage.getItem('userList'))
      users && (this.userList = users)
      // let mid = localStorage.getItem('mid')
      // mid && mid !=0 && (this.mid = mid)
      // let newestSign = JSON.parse(localStorage.getItem('newestSign'))
      // console.log(newestSign);
      // newestSign && (this.newestSign = newestSign)
      // 页面刷新之前执行
      window.addEventListener('unload', () =>{
        console.log('刷新');
        localStorage.setItem('newestSign', JSON.stringify(this.newestSign))
        localStorage.setItem('mid', this.mid)
      })

    },
    deactivated() {
      clearInterval(this.getSignTimeId)
    },
  }
</script>

<style lang="scss" scoped>
  .sign {
    width: 100%;
    height: 100%;
    overflow: hidden;
    .signContainer {
      height: 100%;
      width: 100%;
      padding: 65px 80px 45px 100px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      .signHeader {
        flex-grow: 0;
        box-sizing: border-box;
        color:#fff;
        display: flex;
        align-items: center;
        justify-content: space-between;
        span {
          font-size: 60px;
        }
        .headerLeft {
          div {
            padding: 20px 36px;
            border-radius: 50px;
            border: 4px solid #8D67FF;
            background: linear-gradient(#8D67FF, #FF26FF);;
            text-align: center;
            font-size: 30px;
          }
        }
      }
      .signBody {
        flex-grow: 1;
        width: 100%;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        overflow: hidden;
        .signBodyContainer {
          height: 83%;
          width: 100%;
          display: flex;
          // overflow: hidden;
          align-items: center;
          justify-content: space-between;
          .signPerson {
            flex-grow: 1;
            height: 100%;
            overflow: scroll;
            box-sizing: border-box;
            scrollbar-width: none; // 火狐
            -ms-overflow-style: none; // ie
            &::-webkit-scrollbar {
              display: none;
              height: 0;
            }
            .scrollContainer {
              position: relative;
              top: 0;
              left: 0;
              width: 100%;
              display: flex;
              flex-wrap: wrap;
              align-content: flex-start;
              justify-content: space-between;
              .animate__animated {
                animation-duration: 2s;
              }
              div {
                width: 200px;
                height: 200px;
                border-radius: 50%;
                box-sizing: border-box;
                border: 4px solid #B762FD;
                // margin-right: 50px;
                margin: {
                  left: 25px;
                  right: 25px;
                  bottom: 32px;
                }
                // margin-bottom: 32px;
                img {
                  width: 192px;
                  height: 192px;
                  border-radius: 50%;
                }

                &.emptyItem {
                  height: 0;
                  border: 0;
                }
              }
            }
          }
          .qrCode {
            flex-grow: 0;
            display: flex;
            flex-direction: column;
            div {
              img {
                width: 400px;
                height: 400px;
              }
            }
            span {
              margin-top: 30px;
              color: #fff;
              font-size: 40px;
              text-align: center;
            }
          }
        }
      }
      .signFooter {
        flex-grow: 0;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items:flex-end;
        div {
          display: flex;
          button {
            padding: 15px 20px;
            box-sizing: border-box;
            border-radius: 60px;
            margin-right: 30px;
            font-size: 30px;
            color: #fff;
            border: 1px solid transparent;
            outline: none;
          }
          .endSign {
            background: linear-gradient(#C862FF, #981ADF);
          }
          .readyDraw {
            background:linear-gradient(#698EFF, #5F2DF9);
          }
          .code {
            background:linear-gradient(#698EFF, #5F2DF9);
          }
          .clearSign {
            background:linear-gradient(#698EFF, #5F2DF9);
          }
        }
        span {
          color: #a29fa7;
          font-size: 25px;
        }
      }
    }
    .barrageContainer {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      pointer-events:none;
    }
  }
</style>