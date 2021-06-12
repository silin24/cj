<template>
  <div id="appContainer">
    <video :src="bgvUrl || bgv" autoplay loop v-if="bgvUrl || bgv"></video>
    <!-- <img :src="bgImage || bgImg" alt="" v-else-if="bgImage || bgImg"> -->
    <!-- <img :src="bgImage || bgImg || './assets/bgimg1.png'" alt="" v-else> -->
    <img :src="bgImage || bgImg " alt="" v-if="!(bgvUrl || bgv)">
    <img src="./assets/bgimg1.png" alt="" v-if="!(bgvUrl || bgv || bgImage || bgImg)">
    <!-- <audio src="./assets/bgm.mp3" autoplay loop></audio> -->
    <audio :src="bgmUrl || bgm" autoplay="true" loop ref="audio" v-if="!(bgvUrl || bgv)"></audio>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  export default {
    name: 'App',
    data() {
      return {
        bgm:'',
        bgv:'',
        bgImg:'',
      }
    },
    mounted() {
      // console.log('app mounted');
      let bgm = localStorage.getItem('bgm')
      bgm && (this.bgm = bgm)
      let bgv = localStorage.getItem('bgvUrl')
      bgv && (this.bgv = bgv)
      let bgImg = localStorage.getItem('bgImg')
      bgImg && (this.bgImg = bgImg)

    },
    computed:{
      ...mapState({
          bgmUrl: state => state.bgm,
          bgvUrl:state => state.bgvUrl,
          bgImage:state => state.bgImage
        }),
    },
    watch:{
    },
    beforeDestroy() {
      localStorage.removeItem('screenid')
    },
  }
</script>


<style lang="scss" scoped>
  #appContainer {
    height: 100%;
    width: 100%;
    // background-color: brown;
    // background: {
    //   image: url('./assets/bgimg1.png');
    //   size: cover;
    //   repeat: no-repeat;
    //   position: left center;
    // };
    img {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      z-index: -1;
    }
    video  {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      z-index: -1;
    }

  }
</style>
