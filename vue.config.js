const path = require("path");
const px2rem = require("postcss-px2rem"); // postcss的一个插件
const postcss = px2rem({
  remUnit: 192, //设计稿等分之后的值，等分的比例同页面rem的比例是一致的
});
module.exports = {
  // 只能写vue封装的配置
  productionSourceMap: false,
  runtimeCompiler: true,
  lintOnSave: false, // 关闭EsLint的规则
  publicPath: process.env.NODE_ENV === 'production' ? '/addons/crab_cloud_video/' : './',
  assetsDir: './static/screen/',
  indexPath: './app/douyin/view/screen.html',
  css: {
    // 添加postcss配置
    loaderOptions: {
      postcss: {
        plugins: [postcss],
      },
    },
  },

  configureWebpack: {
    // 内部写webpack原生配置
    resolve: {
      extensions: [".js", ".vue", ".json"], // 可以省略的后缀名
      alias: {
        // 路径别名(简写方式)
        // 'vue$': 'vue/dist/vue.esm.js',  // 表示精准匹配   带vue编译器
        "@": path.resolve(__dirname, "src"),
        "@components": path.resolve(__dirname, "src/components"),
      },
    },
  },
  devServer: {
    // disableHostCheck: true,
    proxy: {
      "/api": {
        target: "http://192.168.31.137", // 转发的目标地址
        pathRewrite: {
          "^/api": "",
        },
        changeOrigin: true, // 支持跨域, 如果协议/主机也不相同, 必须加上

      },
    }
  }
}
