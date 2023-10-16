//src/vue.config.js  这里的webpack配置会和公共的webpack.config.js进行合并
const path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir);
}
const assetsCDN = {
  // webpack build externals（webpack构建外链）
  externals: {
    vue: "Vue",
    vuex: "Vuex",
    axios: "axios",
    "vue-router": "VueRouter",
	'xlsx': 'XLSX',
	'element-ui': 'ELEMENT',
	"echarts": "echarts"
  },
  css: [],
  // https://unpkg.com/browse/vue@2.6.10/ (vue的cdn地址)
  js: [
    // vue的压缩js （也可以下载下来，改成本地文件访问；因为有时候这个镜像会在国外，我们国内访问的话慢或者访问不到。可以使用unpkg.com的国内镜像地址: unpkg.zhimg.com）
    "https://cdn.bootcss.com/vue/2.6.10/vue.min.js",
    "https://cdn.bootcss.com/vue-router/3.1.2/vue-router.min.js",
    "https://unpkg.com/axios/dist/axios.min.js",
    "https://cdn.bootcss.com/vuex/3.1.0/vuex.min.js",
	"https://cdn.bootcdn.net/ajax/libs/xlsx/0.16.1/xlsx.min.js",
	"https://unpkg.com/element-ui@2.10.1/lib/index.js",
	"https://cdn.bootcss.com/echarts/4.1.0/echarts.min.js"
  ],
};

module.exports = {
  configureWebpack: {
    // 视为一个外部库，而不将它打包进来
    externals: assetsCDN.externals,
  },
  lintOnSave: false, //是否再保存的时候使用'eslint-loader进行检查  默认为true  最好修改为false
  chainWebpack: (config) => {
    config.resolve.alias
      .set("@", resolve("src"))
      .set("assets", resolve("src/assets"))
      .set("components", resolve("src/components"))
      .set("network", resolve("src/network"))
      .set("views", resolve("src/views"));
    config.plugin("html").tap((args) => {
      args[0].cdn = assetsCDN;
      return args;
    });
  },
  devServer: {
    open: true,
    proxy: {
      "/pc": {
        target: "http://127.0.0.1:4523/m1/2437227-0-default",
        changeOrigin: true,
      },
    },
   // host: "10.23.21.126",
    // httpsn:true,
    // port: 8081,
    // client: {
    //   webSocketURL: "ws://10.23.21.126:8081/ws",
    // },
    // headers: {
    //   "Access-Control-Allow-Origin": "*",
    // },
  },
};
