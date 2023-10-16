const state = {
  taglist: [],
  //taglist:[{path:'',title:'']
};
const mutations = {
  //初始化
  initag(state, val) {
     let ishave = false;
    ishave = state.taglist.some((item) => item.path === val.path); //返回true就代表有
    if (!ishave) {
      state.taglist.push(val);
    }
  },
  //增加标签
  addtag(state, val) {
    //如果之前的数组里面没有的话，就新增进去
    let ishave = false;
    ishave = state.taglist.some((item) => item.path === val.path); //返回true就代表有
    if (!ishave) {
      state.taglist.push(val);
    }
  },
  deleteTag(state,val){
	let inde
	inde=state.taglist.indexOf(val)
	state.taglist.splice(inde,1)
  }
};

export default {
  namespaced: true,
  state,
  mutations,
};
