<template>

<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm1">
  <el-form-item label="新增组名" prop="cameraGroupName">
    <el-input v-model="ruleForm.cameraGroupName"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
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
          
        },
        rules: {
          cameraGroupName: [
            { required: true, message: '请输入组名', trigger: 'blur' },
          ],
          
          
        }
      };
    },
    props:['adduser'],
    methods: {
        quit(){
            this.$emit("changeTable")
        },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            ajax('/api/cameragroup/add',this.ruleForm,'Post').then(()=>{
            //   if(res.status==200){
            //     alert('submit!');
            // console.log(this.ruleForm)
            
            // this.$emit("changeTable")
            //   }else{alert('添加失败')}
            // console.log(res)
              this.$message({
        type:'success',
        message:'新增成功'
      })
            // console.log(this.ruleForm)
            
            this.$emit("changeTable")
            }).catch(()=>{
              this.$message({
                type:'error',
                message:'新增失败'
              })
            })
            
            
          } 
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>

<style>
.demo-ruleForm1{
    position: fixed;
    top: 30vh;
    z-index: 300;
    background-color: aliceblue;
    left: 0;
    padding: 50px 50px 50px 50px;
    margin-left: 40% ;
    border-radius: 2%;
}
.el-input{
  width: 260px;
}
.el-select{
  width: 260px;
}
</style>