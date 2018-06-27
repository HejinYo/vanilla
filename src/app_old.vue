<template>
  <div id="main" class="app-main">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'app',
    data () {
      return {
        theme: this.$store.state.app.themeColor
      }
    },
    mounted () {
      this.$nextTick(function () {
        // 保证完全挂载
      })
    },
    methods: {},
    beforeCreate: function () {
      // 组件实例化之前
    },
    created: function () {
      // 组件实例化了
    },
    beforeMount: function () {
      // 组件写入dom结构之前
    },
    beforeUpdate: function () {
      // 组件更新前
    },
    updated: function () {
      // 组件更新比如修改了文案
    },
    beforeDestroy: function () {
      // 组件销毁之前
    },
    destroyed: function () {
      // 组件已经销毁
    }
  }
</script>

<style>
  html, body {
    width: 100%;
    height: 100%;
    background: #f0f0f0;
    overflow: hidden;
  }

  .app-main {
    width: 100%;
    height: 100%;
  }
</style>
