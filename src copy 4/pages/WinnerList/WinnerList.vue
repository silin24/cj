<template>
  <div class="winnerList">
    <div class="backBtn">
     <button @click="$router.back()">返回</button>
    </div>
    <div class="swiper-container">
      <div class="swiper-wrapper">
        <!-- <div class="swiper-slide" v-for="(item,index) in ( Object.keys(winnerList).length >0 ? winnerList : winnerListData)" :key="index"> -->
        <div class="swiper-slide" v-for="(item,index) in (Object.keys(winnerListData))" :key="index">
          <div class="up">
            <!-- <span>第{{index}}轮中奖名单</span> -->
            <!-- <span v-if="drawRoundsDatas[index-1]">第{{drawRoundsDatas[index-1].round ? drawRoundsDatas[index-1].round : index}}轮中奖名单</span> -->
            <span v-if="drawRoundsDatas[index].round">第{{drawRoundsDatas[index].round}}轮中奖名单</span>
            <!-- <span>{{Object.keys(item).length}}人</span> -->
            <span>{{
              Object.keys(winnerListData[Object.keys(winnerListData)[index]]).length
              }}人</span>
          </div>
          <div class="down" id="down">
            <div v-for="(item1 , index) in item" :key="index" class="winUser">
              <div class="avator">
                <img :src="item1.avatar" alt="头像">
              </div>
              <span class="username">{{item1.nickname}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="swiper-pagination"></div>
    </div>
    <div class="copyright">
      <span v-if="copyRight">活动支持: {{copyRight}}</span>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import Swiper from "swiper";
  import "swiper/css/swiper.min.css";

  export default {
    mounted() {
    },
    data() {
      return {
        copyRight:'',
        winnerListData:{},
        drawRoundsDatas:[]
      }
    },
    computed:{
      ...mapState({
        winnerList: state => state.winnerList,
      }),
    },
    watch:{
      winnerList(){
        console.log(this.winnerList);
        this.$nextTick(()=>{
          new Swiper('.swiper-container', {
          slidesPerView: 2,
          direction: 'vertical',
          spaceBetween: 30,
          mousewheel: true,
          speed:200,//滚动速度
          mousewheel: {
            releaseOnEdges: true,//PC端释放滑动
          },
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
          },
          });
        })
      }
    },
    methods: {
      initSwiper(){
        setTimeout(() => {
          new Swiper('.swiper-container', {
            slidesPerView: 2,
            direction: 'vertical',
            spaceBetween: 30,
            mousewheel: true,
            speed:200,//滚动速度
            mousewheel: {
              releaseOnEdges: true,//PC端释放滑动
            },
            pagination: {
              el: '.swiper-pagination',
              clickable: true,
            },
          });
        }, 0);
      },
    },
    activated(){
      this.initSwiper()
      document.title = localStorage.getItem('activityName')
      this.copyRight = localStorage.getItem('copyright')
      this.winnerListData = JSON.parse(localStorage.getItem('winUserDatas'))
      this.drawRoundsDatas = JSON.parse(localStorage.getItem('drawRoundsDatas'))
    },
  }
</script>

<style lang="scss" scoped>
  .winnerList {
    height: 100%;
    width: 100%;
    padding: 45px 100px 45px 120px;
    box-sizing: border-box;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .backBtn {
      margin-bottom: 40px;
      flex-grow: 0;
      box-sizing: border-box;
      color:#fff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      button {
        padding: 12px 50px;
        box-sizing: border-box;
        border-radius: 60px;
        margin-right: 30px;
        font-size: 33px;
        color: #fff;
        border: 1px solid transparent;
        outline: none;
        background:linear-gradient(#698EFF, #5F2DF9);
      }
    }
    .swiper-container {
      // height: 100%;
      flex-grow: 1;
      width: 100%;
      box-sizing: border-box;
      display: flex;
      // overflow: hidden;
      .swiper-wrapper {
        .swiper-slide {
          padding:0 90px;
          box-sizing: border-box;
          border-radius: 35px;
          border: 4px solid #FF3BFF;
          background-color:rgba(0,0,0,0.4);
          .up {
            height: 22%;
            width: 100%;
            font-size: 30px;
            color: #fff;
            display: flex;
            align-items: center;
            span {
              margin-right: 20px;
              font-weight: 700;
            }
          }
          .down {
            height: 78%;
            width: 100%;
            // white-space: nowrap;
            display: flex;
            // justify-content: space-between;
            // justify-content: space-around;
            align-items: center;
            overflow: scroll;
            scrollbar-width: none; // 火狐
            -ms-overflow-style: none; // ie
            &::-webkit-scrollbar {
              display: none;
              height: 0;
            }
            .winUser {
              // display: flex;
              text-align: center;
              margin-right: 60px;
              .avator {
                width: 200px;
                height: 200px;
                border-radius: 50%;
                box-sizing: border-box;
                border: 4px solid #B762FD;
                margin-bottom: 20px;
                img {
                  width: 192px;
                  height: 192px;
                  border-radius: 50%;
                }
              }
              .username {
                color: #fff;
                font-size: 30px;
              }
            }
          }
        }
      }
      .swiper-pagination {
        /deep/span.swiper-pagination-bullet {
         width: 20px;
         height: 20px;
         background-color: white;
       }
       /deep/span.swiper-pagination-bullet-active {
          background: red;
        }
      }
    }
    .copyright {
      margin-top: 20px;
      text-align: right;
      flex-grow: 0;
      color: #a29fa7;
      font-size: 25px;
    }
  }
</style>