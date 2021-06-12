<template>
  <div class="activityError">
    <span>{{activityError}}</span>
  </div>
</template>

<script>
  export default {
    mounted() {
      let activityError = sessionStorage.getItem('activityError')
      activityError && (this.activityError = activityError)

    },
    data() {
      return {
        activityError:'',
      }
    }
  }
</script>

<style lang="scss" scoped>
  .activityError {
    span {
      position: absolute;
      top: 40%;
      left: 50%;
      transform: translateX(-50%);
      font-size: 80px;
      color: #fff;
    }
  }
</style>