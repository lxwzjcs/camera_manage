<template>
  <header class="header">
    <h2>智慧视频分析平台管理端</h2>
    <el-dropdown @command="handleLogOut" class="avatar">
    <el-avatar  icon="el-icon-s-custom"></el-avatar>
    <el-dropdown-menu slot="dropdown" class="menu">
      <span>&nbsp;&nbsp;用户名：{{this.$store.state.userName}} &nbsp;&nbsp;</span><br><br>
      <span> &nbsp;&nbsp;权&nbsp;&nbsp;&nbsp;限：{{this.$store.state.ismanager?'管理员':'普通用户'}} &nbsp;&nbsp;</span><br><br>
      <el-dropdown-item>登出</el-dropdown-item>
    </el-dropdown-menu>
    </el-dropdown>
     
  </header>
 
</template>

<script>
export default {
data(){
  return {
    circleUrl:'../assets/avatar.png',
    name:'',
    limits:'',
  }
},
methods:{
  handleLogOut(){
    // console.log('logout',a)
    this.$confirm('确认退出?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        this.$store.state.islogin = false
      })
  }
}
}
</script>

<style>
.el-dropdown-menu__item{
  text-align: center;
}
.avatar{
  
  margin-left: 70%;
  margin-top: 2%;
}



h2{
  color: aliceblue;
}

.header{
    position: fixed;
    top: 0;
    left: 0;
    background-color: #02508b;
    z-index: 2;
    width: 100%;
    height: 10vh ;
    display: flex;

}
</style>