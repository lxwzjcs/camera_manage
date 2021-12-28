<template>

<el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
  <el-form-item label="组别" prop="cameraGroupName">
     <el-cascader
    :options="options"
    :props="props"
    clearable
    v-model="ruleForm.cameraGroupId" 
    :disabled="this.ruleForm.cameraGroupName!=''"></el-cascader>
  </el-form-item>
   <el-form-item label="新增组名">
    <el-input v-model="ruleForm.cameraGroupName" :disabled="this.ruleForm.cameraGroupId!=''"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="addForm('ruleForm')">立即添加</el-button>
    <el-button type="primary" @click="deleteForm('ruleForm')">立即删除</el-button>
    <el-button @click="resetForm('ruleForm')">重置</el-button>
    <el-button @click="quit">取消</el-button>
  </el-form-item>
</el-form>
</template>
<script>
import ajax from '../utils/ajax'
  export default {
    data() {
      return {
        ruleForm: {
          cameraGroupName:'',
          cameraGroupId:''
        },
        
        props: { multiple: true },
        options: [{
          value: 1,
          label: '东南',
          children: [{
            value: 2,
            label: '上海',
            children: [
              { value: 3, label: '普陀' },
              { value: 4, label: '黄埔' },
              { value: 5, label: '徐汇' }
            ]
          }, {
            value: 7,
            label: '江苏',
            children: [
              { value: 8, label: '南京' },
              { value: 9, label: '苏州' },
              { value: 10, label: '无锡' }
            ]
          }, {
            value: 12,
            label: '浙江',
            children: [
              { value: 13, label: '杭州' },
              { value: 14, label: '宁波' },
              { value: 15, label: '嘉兴' }
            ]
          }]
        }, 
        {
          value: 17,
          label: '西北',
          children: [{
            value: 18,
            label: '陕西',
            children: [
              { value: 19, label: '西安' },
              { value: 20, label: '延安' }
            ]
          }, {
            value: 21,
            label: '新疆维吾尔族自治区',
            children: [
              { value: 22, label: '乌鲁木齐' },
              { value: 23, label: '克拉玛依' }
            ]
          }]
        }]
      };
    },
    props:['adduser'],
    created(){
      ajax('/api/cameragroup/getlist').then(res=>{
        // console.log(res)
        // console.log('qian',this.options)
        this.options = res.data
        this.options = this.options.map(v=>{return {value: v.cameraGroupId,label:v.cameraGroupName}})
        // console.log('hou',this.options)
      })
    },
    methods: {
      quit(){
            this.$emit("changeTable")
        },
      addForm() {
        
          if (this.ruleForm.cameraGroupName!='') {
            
            ajax('/api/cameragroup/add',{cameraGroupName:this.ruleForm.cameraGroupName},'Post').then(()=>{
              // console.log(res)
              this.$message({
        type:'success',
        message:'新增成功'
      })        
            this.$emit("changeTable")
            }).catch(()=>{
              this.$message({
                type:'error',
                message:'新增失败'
              })
            })
            
            
          } else {
            this.$message({
        type:'error',
        message:'新增失败'
      })
            return false;
          }
        
      },
      deleteForm() {
        
          if (this.ruleForm.cameraGroupId!='') {
            ajax('/api/cameragroup/delete',{cameraGroupId:this.ruleForm.cameraGroupId},'Post').then(res=>{
              // console.log(res)
              console.log('this.ruleForm.cameraGroupId',this.ruleForm.cameraGroupId)

              this.$message({
        type:'success',
        message:'删除成功'
      })
              this.$emit("changeTable")
            }).catch(()=>{
              this.$message({
                type:'error',
                message:'删除失败'
              })
            })
          } else {
            this.$message({
        type:'error',
        message:'删除失败'
      })
            return false;
          }
        
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>

<style>
.demo-ruleForm{
    position: fixed;
    top: 15vh;
    z-index: 300;
    background-color: aliceblue;
    left: 0;
    padding: 50px 50px 50px 50px;
    margin-left: 40%;
    border-radius: 2%;
}
.el-input{
  width: 260px;
}
.el-select{
  width: 260px;
}
</style>