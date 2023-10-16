<template>
  <div>
    <div class="box">
      <!-- 上传 -->
      <el-upload
        class="upload-demo"
        drag
        action="#"
        :before-upload="parseFile"
        :disabled="status !== Status.wait"
      >
        <i class="el-icon-upload"></i>

        <div class="el-upload-text">
          <p v-if="container.file">已选择：{{ container.file.name }}</p>
          点击或拖拽访固定资产导入文件到此处，导入住在、商户数量受许可限制
        </div>
      </el-upload>
      <el-progress
        type="circle"
        :percentage="fakeUploadPercentage"
        class="progress"
      >
      </el-progress>
    </div>

    <el-button @click="upFileParse" :disabled="uploadDisabled"
      >上传文件</el-button
    >
    <el-button @click="handleResume" v-if="status === Status.pause"
      >恢复上传</el-button
    >
    <el-button
      v-else
      @click="handlePause"
      :disabled="
        status !== Status.uploading || !container.hash || !container.file
      "
      >暂停上传</el-button
    >
    本次已经上传成功的文件有：
    {{ [...new Set(hashUploadFile)] }}
    <!-- 这个进度有时候会回退，因为如果点击中途暂停，后面在上传又会从0开始 -->
    <el-progress
      type="circle"
      :percentage="uploadPercentage"
      v-if="isshow"
    ></el-progress>

    <!-- 文件名hash的计算进度 -->
    <div v-if="isshow">calculate chunk hash</div>
    <el-progress :percentage="hashPercentage" v-if="isshow"></el-progress>
    <!-- 每个分片的上传进度 -->
    <el-table :data="data" v-if="isshow">
      <el-table-column
        prop="hash"
        label="chunk hash"
        align="center"
      ></el-table-column>
      <el-table-column label="size(KB)" align="center" width="120">
        <template v-slot="{ row }">
          {{ row.size | transformByte }}
        </template>
      </el-table-column>
      <el-table-column label="percentage" align="center">
        <template v-slot="{ row }">
          <el-progress
            :percentage="row.percentage"
            color="#909399"
          ></el-progress>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import axios from "axios";
const SIZE = 10 * 1024 * 2;
const Status = {
  wait: "wait",
  pause: "pause",
  uploading: "uploading",
};
const CancelToken = axios.CancelToken;
let source = CancelToken.source();
export default {
  name: "fileUpload",
  filters: {
    transformByte(val) {
      return Number((val / 1024).toFixed(0));
    },
  },
  computed: {
    uploadPercentage() {
      if (!this.container.file || !this.data.length) return 0;
      const loaded = this.data
        .map((item) => item.size * item.percentage)
        .reduce((acc, cur) => acc + cur);
      console.log(parseInt((loaded / this.container.file.size).toFixed(2)));
      return parseInt((loaded / this.container.file.size).toFixed(2));
    },
    uploadDisabled() {
      return (
        !this.container.file ||
        [Status.pause, Status.uploading].includes(this.status)
      );
    },
  },
  data() {
    return {
      isshow: false,
      Status,
      status: Status.wait,
      container: {
        file: null,
        hash: "",
        worker: null,
      },
      requestList: [],
      hashPercentage: 0,
      data: [], //保存切片文件数组
      fakeUploadPercentage: 0,
      hashUploadFile: [],
    };
  },
  watch: {
    uploadPercentage(now) {
      if (now > this.fakeUploadPercentage) {
        this.fakeUploadPercentage = now;
      }
    },
    hashUploadFile(newValue) {//只要文件里面有内容就可以告诉父组件可以进行下一步了
      if (newValue.length) {
        this.$emit("cando");
      }
    },
  },
  methods: {
    //生成文件hash
    calculateHash(fileChunkList) {
      return new Promise((resolve) => {
        this.container.worker = new Worker("/hash.js");
        this.container.worker.postMessage({ fileChunkList });
        this.container.worker.onmessage = (e) => {
          const { percentage, hash } = e.data;
          this.hashPercentage = percentage;
          if (hash) {
            resolve(hash);
          }
        };
      });
    },
    parseFile(file) {
      source.cancel("终止上传");
      source = CancelToken.source();
      this.fakeUploadPercentage = 0; //重新选择文件的时候需要做一些必要的初始化
      this.data = [];
      this.requestList = [];
      this.container.file = file;
    },
    //上传文件前先判断服务端是否已经存在上传资源，如果已经有了则直接返回上传成功的信息
    async verifyUpload(filename, fileHash) {
      const { data } = await axios.request({
        url: "http://localhost:401/verify",
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({ filename, fileHash }),
      });
      return data; //不需要使用JSON.parse(data),axios内部已经做了转换
    },
    createFileChunk(file, size = SIZE) {
      const fileChunkList = [];
      let cur = 0;
      while (cur < file.size) {
        fileChunkList.push({ file: file.slice(cur, cur + size) });
        cur += size;
      }
      return fileChunkList;
    },
    async uploadChunks(uploadedList = []) {
      const requestList = this.data
        .filter(({ hash }) => !uploadedList.includes(hash))
        .map(({ chunk, hash, index }) => {
          const formData = new FormData();
          formData.append("chunk", chunk);
          formData.append("hash", hash);
          formData.append("fileHash", this.container.hash);
          formData.append("filename", this.container.file.name);
          return { formData, index }; //一定要加括号
        })
        .map(({ formData, index }) =>
          axios
            .request({
              method: "post",
              url: "http://localhost:401",
              header: { "Content-Type": "application/x-www-form-urlencoded" },
              onUploadProgress: this.uploadProgressEvent(this.data[index]),
              cancelToken: source.token,
              data: formData,
            })
            .then(() => {
              this.requestList.push(requestList[index]);
            })
            .catch(() => {})
        );
      await Promise.all(requestList);
      console.log(uploadedList, this.requestList, this.data);
      if (uploadedList.length + this.requestList.length >= this.data.length) {
        await this.mergeRequest();
        this.status = Status.wait;
        this.hashUploadFile.push(this.container.file.name);
      }
    },
    async mergeRequest() {
      axios
        .request({
          url: "http://localhost:401/merge",
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          data: JSON.stringify({
            filename: this.container.file.name,
            size: SIZE,
            fileHash: this.container.hash,
          }),
        })
        .then(() => {
          this.status = Status.wait;
        });
    },
    async upFileParse() {
      if (!this.container.file) return;
      this.status = Status.uploading;
      const fileChunkList = this.createFileChunk(this.container.file);
      this.container.hash = await this.calculateHash(fileChunkList);
      const { shouldUpload, uploadedList } = await this.verifyUpload(
        this.container.file.name,
        this.container.hash
      );
      if (!shouldUpload) {
        this.fakeUploadPercentage = 100;
        this.hashUploadFile.push(this.container.file.name);
        this.status = Status.wait;
        return;
      }
      this.data = fileChunkList.map(({ file }, index) => ({
        chunk: file,
        fileHash: this.container.hash,
        index,
        hash: this.container.file.name + "-" + index,
        size: file.size,
        percentage: uploadedList.includes(index) ? 100 : 0,
      }));
      await this.uploadChunks(uploadedList);
    },
    uploadProgressEvent(item) {
      return (e) => {
        item.percentage = parseInt(String((e.loaded / e.total) * 100));
      };
    },
    //暂停上传
    handlePause() {
      this.status = Status.pause;
      this.requestList = [];
      console.log("暂停上传了");
      source.cancel("暂停上传了");
      source = CancelToken.source(); //重置source，确保能够续传
    },
    async handleResume() {
      this.status = Status.uploading;
      const { uploadedList } = await this.verifyUpload(
        this.container.file.name,
        this.container.hash
      );
      await this.uploadChunks(uploadedList);
    },
  },
};
</script>

<style lang="less">
.box {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 20px;
  .upload-demo {
    margin-right: 20px;
  }
  .progress {
      height:125px;
    }
}
</style>
