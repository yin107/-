<template>
  <div>
    新建装修
    <input
      type="file"
      id="input"
      @change="parseFile"
      :disabled="status !== Status.wait"
    />
    <el-button @click="upFileParse" :disabled="uploadDisabled">上传</el-button>
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
    <el-button @click="handleDelete">删除该所有上传的文件</el-button>

    <el-progress type="circle" :percentage="uploadPercentage"></el-progress>
    <el-progress type="circle" :percentage="fakeUploadPercentage">
    </el-progress>
    <div>calculate chunk hash</div>
    <el-progress :percentage="hashPercentage"></el-progress>

    <el-table :data="data">
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

    <bread-crumb></bread-crumb>
  </div>
</template>

<script>
import breadCrumb from "components/breadCrumb";
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
  components: { breadCrumb },
  name: "createVue",
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
  mounted() {
    this.testaxios();
  },
  data() {
    return {
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
    };
  },
  watch: {
    uploadPercentage(now) {
      if (now > this.fakeUploadPercentage) {
        this.fakeUploadPercentage = now;
      }
    },
  },
  methods: {
    async testaxios() {
      let request1 = axios.request({
        url: "http://localhost:401/test",
        method: "post",
      });
      let request2 = axios
        .request({
          url: "http://localhost:401/test2",
          method: "post",
        })
        .then((res) => {
          console.log(res);
        }).catch(err=>{console.log(err);})
    //   let res = await Promise.all([request1, request2]);
    //   console.log(res);
    //   console.log(3);
    //   await axios.all([request1, request2]);
    //   console.log(66);
      Promise.all([request1, request2]).then((res) => {
        console.log(res);
      });
    },
    async handleDelete() {
      const { data } = await axios.request({
        url: "http://localhost:401/delete",
        method: "post",
      });
      if (data.code === 0) {
        this.$message.success("delete success");
      }
    },
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
    parseFile(e) {
      source.cancel("终止上传");
      source = CancelToken.source();
      this.fakeUploadPercentage = 0; //重新选择文件的时候需要做一些必要的初始化
      this.data = [];
      this.requestList = [];
      this.container.file = e.target.files[0];
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
          this.container = {
            file: null,
            hash: "",
            worker: null,
          };
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
        this.status = Status.wait;
        this.container.file = null;
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

<style></style>
