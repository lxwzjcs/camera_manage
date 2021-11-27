
<template>
 
 
    <el-menu
      default-active="1"
      class="el-menu-vertical"
      @open="handleOpen"
      @close="handleClose"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      router>
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>用户管理</span>
        </template>
        <el-menu-item-group>
          
          <el-menu-item index="User" >普通用户</el-menu-item>
          <el-menu-item index="Manager" >管理员</el-menu-item>
        </el-menu-item-group>
        
      </el-submenu>
      <el-menu-item index="Device">
        <i class="el-icon-menu"></i>
        <span slot="title">设备管理</span>
      </el-menu-item>
      <el-menu-item index="Config">
        <i class="el-icon-document"></i>
        <span slot="title">配置管理</span>
      </el-menu-item>
      
    </el-menu>
  
</template>

<script>
  export default {
      
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      }
    }
  }
</script>

<style>

.el-menu-vertical{
    position: fixed;
    top: 0;
    left: 0;
    width: 250px;
    height: 100vh;
}

</style>