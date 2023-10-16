import axios from "axios";
const codeMessage = {
  200: "服务器成功返回请求的数据",
  201: "新建或修改数据成功",
  204: "删除数据成功",
  400: "发出的请求有错误，服务器没有进行新建或修改数据的操作",
  401: "用户没有访问权限（令牌、用户名、密码错误）",
};
//登录注册时候的axios封装
export function mylocalrequest(config) {
  const instance = axios.create({
    baseURL: "http://127.0.0.1:300/pc",
  });
  //响应拦截器
  instance.interceptors.response.use((res) => {
    if (res.data.code === 200) {
      console.log(res);
      localStorage.setItem("refreshToken", res.data.data.refreshToken);
      this.notifySuccess(res.msg);
    }
    return res.data;
  });
  return instance(config);
}
//有权限接口
export function myrequest(config) {
  const instance = axios.create({
    baseURL: "http://127.0.0.1:300/pc",
  });

  const clearAuth = () => {
    window.location.replace("/user/login");
    localStorage.clear();
  };
  instance.interceptors.request.use((config) => {
    let token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = token;
    }
    return config;
  });
  instance.interceptors.response.use(
    (res) => {
	if(res.headers["content-disposition"]){return res}
      //在2xx范围内的任何状态码都会触发此函数，主要用于处理响应数据
     else{ return res.data}
    },
    (err) => {
      //任何超出2xx范围内的状态码都会触发此函数，主要用于处理响应错误
      let { status } = err.response;
      if (status === 401) {
        //表示未授权
        if (err.response.data.error === "invalid token") {
          //token无效,值得是token的值不正确
          clearAuth();
        } else if (err.response.data.error == "jwt expired") {
          //token过期
         //发起刷新token的请求,此时请求头是之前获取到的refreshToken,在后端中，如果判断refreshToken验证成功的话，那么就刷新token并返回
          axios
            .get("http://127.0.0.1:300/pc/user/refresh", {
              headers: { Authorization: localStorage.getItem("refreshToken") },
            })
            .then(() => {
				clearAuth();//这里后端的接口还不知道怎么写
            });
        }
      }

      return Promise.reject(err); //将未处理的异常往外抛
    }
  );
  return instance(config);
}

export function request(config) {
  const instance = axios.create({
    baseURL: "/pc",
  });

  instance.interceptors.response.use(
    (res) => {
      if (Object.keys(codeMessage).includes(`${res.data.code}`)) {
        this.notifySuccess(codeMessage[res.data.code]);
      }
      return res;
    },
    (err) => {
      return err;
    }
  );
  return instance(config);
}
