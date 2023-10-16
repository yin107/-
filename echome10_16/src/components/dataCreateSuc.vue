<template>
  <div>
    <p
      style="
        font-size: 65px;
        color: green;
        margin-top: 20px;
        margin-bottom: 0px;
      "
    >
      <i class="el-icon-success"></i>
    </p>
    <p style="font-size: 25px"><slot name="suce-info"></slot></p>
    <div class="box">
		<slot name="mention-info"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "dataCreateSuc",
  methods: {

  },
};
</script>

<style scoped>
.box {
  width: 80%;
  margin: 0 auto;
  background-color: rgb(245, 240, 240);
  text-align: left;
  padding: 10px 20px;
  box-sizing: border-box;
  margin-bottom: 20px;
}
</style>
