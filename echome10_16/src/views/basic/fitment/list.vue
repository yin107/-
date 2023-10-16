<template>
  <div>
    <bread-crumb></bread-crumb>
    <input type="file" id="input" @change="parseFile" />
    <el-button @click="upload">上传</el-button>
    <div id="progress">{{ pro }}</div>
  </div>
</template>

<script>
import breadCrumb from "components/breadCrumb";
import axios from "axios";
export default {
  name: "ListVue",
  components: { breadCrumb },
  data() {
    return {
      chunkList: [],
      pro: "",
      files: null,
    };
  },
  mounted() {},
  methods: {
    parseFile(e) {
      this.files = e.target.files[0]; //读取文件
      //创建切片
      console.log(this.files);
      this.chunkList = this.createChunk(this.files);
      console.log(this.chunkList);
      //上传切片
    },
    createChunk(file, size = 2 * 2000 * 100) {
      const chunkList = [];
      let cur = 0;
      while (cur < file.size) {
        chunkList.push({
          file: file.slice(cur, cur + size),
        });
        cur += size;
      }
      return chunkList;
    },

    //对每个切片进行数据处理
    async uploadFile(list) {
      const requestList = list
        .map(({ file, fileName, index, chunkName }) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("fileName", fileName);
          formData.append("index", index);
          formData.append("chunkName", chunkName);
          return { formData, index };
        })
        .map(
          (
            { formData, index } //注意这里如果加括号的话，一定要return出去，因为这是设置请求数组，返回的应该是一个promise组成的数组
          ) =>
            axios
              .request({
                method: "post",
                url: "http://localhost:400/upload",
                header: { "Content-Type": "application/x-www-form-urlencoded" },
                data: formData,
              })
              .then((res) => {
                console.log(res);
                //显示每个切片上传的精度
                this.pro =
                  this.pro + `${list[index].chunkName}---${res.data.message}`;
              })
        );
      console.log(requestList);
      await Promise.all(requestList);
      let size = this.files.size;
      let name = this.files.name;
      console.log(size, name);
      await this.mergeChunk(size, name);
    },
    upload() {
      const uploadList = this.chunkList.map(({ file }, index) => ({
        //调用分片的函数
        file,
        size: file.size,
        percent: 0,
        chunkName: `${this.files.name}-${index}`,
        fileName: this.files.name,
        index,
      }));
      this.uploadFile(uploadList);
    },
    async mergeChunk(size, fileName) {
      await axios.request({
        method: "post",
        url: "http://localhost:400/merge",
        headers: {
          "content-type": "application/json",
        },
        data: JSON.stringify({size,fileName}),
      }).then((res) => {
        console.log(res);
      });
    },
  },
};
</script>

<style></style>
