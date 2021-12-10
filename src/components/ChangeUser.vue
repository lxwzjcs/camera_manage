<template>
  <el-form
    :model="ruleForm"
    :rules="rules"
    ref="ruleForm"
    label-width="100px"
    class="demo-ruleForm"
  >
    <el-form-item label="用户名称" prop="userName">
      <el-input v-model="ruleForm.userName"></el-input>
    </el-form-item>
    <el-form-item label="账号" prop="userAccount">
      <el-input v-model="ruleForm.userAccount" disabled></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="userPassword">
      <el-input v-model="ruleForm.userPassword"></el-input>
    </el-form-item>
    <el-form-item label="权限" prop="role">
      <el-select v-model="ruleForm.role" placeholder="请选择权限">
        <el-option label="普通用户" value="0"></el-option>
        <el-option label="管理员" value="1"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')"
        >立即修改</el-button
      >
      <el-button @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import ajax from '../utils/ajax'
export default {
  data() {
    return {
      ruleForm: this.changerow,

      rules: {
        userName: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          
        ],
        role: [{ required: true, message: "请选择权限", trigger: "change" }],
        userAccount: [{ required: true, message: "请输入账号", trigger: "blur" }],
        userPassword: [{  message: "请输入密码", trigger: "blur" }],
      },
    };
  },
  props: ["changerow"],
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          ajax('/api/user/update',this.ruleForm,'Post').then(res=>{
            //   if(res.status==200){
            //     alert('submit!');
            // console.log(this.ruleForm)
            
            // this.$emit("changeTable")
            //   }else{alert('添加失败')}
            console.log(res)
              alert('submit!');
            
            
            this.$emit("changeTable")
            })
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style>
.demo-ruleForm {
  position: fixed;
  top: 15vh;
  z-index: 300;
  background-color: aliceblue;
  left: 40%;
  padding: 50px 50px 50px 50px;

  border-radius: 2%;
}
</style>