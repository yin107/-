<template>
  <el-form :ref="name" :model="FormRes" :rules="FormData.Rules" label-position="right" label-width="130px">
    <template v-for="item in FormData.Info">
      <el-form-item :key="item.prop" :prop="item.prop" :label="item.label" >
        <el-input
          v-if="item.type === 'input'"
          v-model="FormRes[item.prop]"
          :type="item.ispass ? 'password' : ''"
          style="width: 60%"
        ></el-input>
        <el-switch
          v-if="item.type === 'switch'"
          v-model="FormRes[item.prop]"
          :active-color="item.actCol"
          :inactive-color="item.inacCol"
          :active-value="item.actV"
          :inactive-value="item.inacV"
        ></el-switch>
        <el-input-number
          v-if="item.type === 'inputNumber'"
          v-model="FormRes[item.prop]"
          :control-position="item.controlPos"
          :min="item.min"
        ></el-input-number>
		<!-- 使用elemnent的级联选择器实现地址的选择 -->
		<el-cascader v-if="item.type==='address'" size="large" :options="options" v-model="selectOptions" @change="handleChange()"></el-cascader>
      </el-form-item>
    </template>
  </el-form>
</template>

<script>
	import { provinceAndCityData, regionData, provinceAndCityDataPlus, regionDataPlus, CodeToText, TextToCode } from 'element-china-area-data'
export default {
  name: "formFinish",
  props: ["name", "FormRes", "FormData"],
  data() {
    return {
		options:regionData,
		form:{
			provinces:'',
			city:'',
			area:""
		},
		selectOptions:''
	};
  },
  methods: {
	handleChange(){
		this.form.provinces=CodeToText[this.selectOptions[0]]
		this.form.city=CodeToText[this.selectOptions[1]]
		this.form.area=CodeToText[this.selectOptions[2]]
		this.$emit('selectedAddress',[this.form.provinces,this.form.city,this.form.area])
	},
	edit(item){
		console.log(item);
		this.selectOptions.push(TextToCode[this.form.provinces].code,TextToCode[this.form.provinces][this.form.city].code)
	}
}
};
</script>

<style></style>
