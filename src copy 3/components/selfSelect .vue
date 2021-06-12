<template>
  <div class="divInput"  @mouseleave="mouseLeave">
    <div class="input" @click="openValue">
      <!-- <input v-model="value" type="text" v-if="cardArr[0].name" :placeholder="cardArr[0].name"> -->
      <!-- <input v-model="defaultCardName" type="text"> -->
      <input type="text" :placeholder="value" ref="input">
      <img src="../assets/arrow.png" alt="">
    </div>
    <div class="list" v-show="show">
      <div @click="getvalue(index,item)" v-for="(item,index) in cardList" :key="item.id">
      <!-- <div @click="getvalue(index,item)" v-for="(item,index) in selfCardArr" :key="item.id"> -->
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
  export default {
    props: {
        cardName: String,
    },
    model: {
        prop: 'cardId',
        event: 'returnBack'
    },
    data(){
      return{
        show:false,
        value:'无卡券',
        cardList:[],
        // selfCardArr:[]
      }
    },
    mounted() {
      this.cardList = JSON.parse(localStorage.getItem('cardList'))
      // if (this.cardList == '') {
      //   this.cardList = []
      // }
      this.cardList && this.cardList.unshift({'name':'无卡券','id':''})

    },
    computed:{
      // ...mapState({
      //   cardArr: state => state.cardArr,
      // }),
      // reCardArr(){
      //   this.selfCardArr = JSON.parse(JSON.stringify(this.cardArr))
      //   this.selfCardArr.unshift({'name':'无卡券'})
      // },
      // defaultCardName () {
      //   if (this.cardArr[0]) {
      //     return this.cardArr[0].name
      //   }
      // }
    },
    methods: {
      openValue(e){
        this.show=!this.show;
      },
      getvalue(index,item){
        this.value=item.name;
        this.show=false;
        this.$emit('returnBack', item.id);
      },
      mouseLeave(){
        console.log(222);
        this.show=false
      }
    },
  }
</script>

<style lang="scss" scoped>
  .divInput{
    z-index: 2;
    position: relative;
    background-color: #fff;
    font-size: 15px;
    .input {
      // width: 120px;
      width: 150px;
      height: 35px;
      line-height: 30px;
      box-sizing: border-box;
      overflow: hidden;
      border: 1px solid #cccccc;
      display: flex;
      position: relative;
      input {
        border: none;
        outline: none;
        height: 30px;
        // background-color: #fff;
      }
      img {
        position: absolute;
        top: 50%;
        right: 5px;
        transform: translateY(-50%);
        width: 12px;
        height: 12px;
      }
    }
    .list {
      // width: 120px;
      width: 200px;
      box-sizing: border-box;
      border: 1px solid #cccccc;
      background-color: #fff;
      overflow: hidden;
      position: absolute;
      bottom: 35px;
      left: 0;
      div {
        height: 30px;
        cursor: pointer;
        line-height: 30px;
        &:hover {
          // background-color: #cccccc;
          background-color: #B9279A;
        }
      }
    }
   }
</style>