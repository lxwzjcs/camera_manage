<template>
  <div class="login" clearfix>
    <div class="login-wrap">
      <el-row type="flex" justify="center">
        <el-form
          ref="loginForm"
          :model="user"
          :rules="rules"
          status-icon
          label-width="80px"
          @keyup.enter.native="doLogin()"
        >
          <h3>登录</h3>
          <hr />
          <el-form-item prop="username" label="账 号">
            <el-input
              v-model="user.username"
              placeholder="请输入账号"
              prefix-icon
            ></el-input>
          </el-form-item>
          <el-form-item id="password" prop="password" label="密      码">
            <el-input
              v-model="user.password"
              show-password
              placeholder="请输入密码"
            ></el-input>
          </el-form-item>
          <!-- <router-link to="/">找回密码</router-link>
          <router-link to="/register">注册账号</router-link> -->
          <el-form-item>
            <el-button type="primary" icon="el-icon-upload" @click="doLogin()"
              >登 录</el-button
            >
          </el-form-item>
        </el-form>
      </el-row>
    </div>
  </div>
</template>
 
<script>
// import axios from "axios";
import ajax from "../utils/ajax";
export default {
  name: "login",
  data() {
    return {
      user: {
        username: "",
        password: "",
      },
      rules: {},
    };
  },
  created() {},
  methods: {
    doLogin() {
      if (!this.user.username) {
        this.$message.error("请输入用户名！");
        return;
      } else if (!this.user.password) {
        this.$message.error("请输入密码！");
        return;
      } else {
        ajax(
          "/api/index/login",
          { userAccount: this.user.username, userPassword: this.user.password },
          "Post"
        )
          .then((res) => {
            // console.log(res)
            //  let myName=JSON.parse(sessionStorage.getItem("role"));
            //  console.log(myName)
            // if(res.status==200){
            this.$store.state.islogin = true;
            if (res.data.role == 1) {
              this.$store.state.ismanager = true;
            } else {
              this.$store.state.ismanager = false;
            }
            this.$store.state.userName = res.data.userName;

            // }else{
            // alert('登录失败！')
            // }
          })
          .catch((err) => {
            alert(err.response.data.message);
          });

        //校验用户名和密码是否正确;
        // this.$router.push({ path: "/personal" });
        // axios
        //   .post("/login/", {
        //     name: this.user.username,
        //     password: this.user.password
        //   })
        //   .then(res => {
        //     // console.log("输出response.data.status", res.data.status);
        //     if (res.data.status === 200) {
        //       this.$router.push({ path: "/personal" });
        //     } else {
        //       alert("您输入的用户名或密码错误！");
        //     }
        //   });
      }
    },
  },
};
</script>
 
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.login {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: 100% 100%;
  background-attachment: fixed;
  background-image: url("https://eportal.uestc.edu.cn/new/portal/css/dark/indigo/images/bg/login_bg.jpg");
}
.login-wrap {
  background-size: cover;
  width: 400px;
  height: 300px;
  margin: 15% auto;
  overflow: hidden;
  padding-top: 10px;
  line-height: 40px;
  background: rgba(248, 241, 241, 0.664);
  border-radius: 20px;
}
#password {
  margin-bottom: 5px;
}
h3 {
  color: #0babeab8;
  font-size: 24px;
}
hr {
  background-color: #444;
  margin: 20px auto;
}

.el-button {
  margin-top: 30px;
  margin-left: 50px;
  width: 40%;
}
</style>

