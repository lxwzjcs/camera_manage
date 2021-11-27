<template>
<div class="User-table">
  <h2>设备管理</h2>
   <el-button type="primary" plain class="add-device" @click="adduser=true" v-if="this.$store.state.ismanager" :key="12">新增</el-button>
   <div class="dialog-cover back" v-if="adduser" @click="adduser=false"></div>
   <AddDevice v-if="adduser"/>
   
  <el-table
    :data="tableData"
    height="100%"
    border
    class="table2"
    
    >
    <el-table-column
      prop="date"
      label="日期"
      width="180">
    </el-table-column>
    <el-table-column
      prop="date"
      label="日期"
      width="180">
    </el-table-column>
    <el-table-column
      prop="name"
      label="姓名"
      width="180">
    </el-table-column>
    <el-table-column
      prop="address"
      label="地址">
    </el-table-column>
    <el-table-column
      prop="address"
      label="地址">
    </el-table-column>
    <el-table-column
      prop="address"
      label="地址">
    </el-table-column><el-table-column
      prop="address"
      label="地址">
    </el-table-column>
    <el-table-column
      prop="address"
      label="地址">
    </el-table-column>
    <el-table-column
      prop="state"
      label="状态"
      fixed="right"
      width="50">
      <template slot-scope="scope" >
      <i class="el-icon-success " v-if="scope.row.state" :key="4"></i>
      <i class="el-icon-error" v-if="!scope.row.state" :key="5"></i>
      </template>
    </el-table-column>
    
    <el-table-column
      fixed="right"
      label="操作"
      width="100"
      v-if="this.$store.state.ismanager"
      >
      <template slot-scope="scope">
        <el-button @click="handleClick(scope.row)" type="text" size="small">修改</el-button>
        <el-button type="text" size="small">删除</el-button>
      </template>
    </el-table-column>
  </el-table></div>
</template>

<script>
import AddDevice from '../components/AddDevice.vue'
  export default {
     methods: {
      handleClick(row) {
        console.log(row);
      },
      
    },
    created(){
      console.log("created",typeof this.$store.state.ismanager)
    },
    components:{
      AddDevice
    },
    data() {
      return {
        adduser:false,
        tableData: [{
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          state:true
          
        }, {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          state:true
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          state:false
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          state:true
        }, {
          date: '2016-05-08',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          state:true
        }, {
          date: '2016-05-06',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          state:true
        }, {
          date: '2016-05-07',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          state:true
        },
        {
          date: '2016-05-07',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          state:true
        },
        {
          date: '2016-05-07',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          state:true
        },
        {
          date: '2016-05-07',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          state:true
        },{
          date: '2016-05-07',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          state:false
        }]
      }
    },
    mounted(){
      console.log(this.$store.state.ismanager)
    }
  }
</script>

<style>
.dialog-cover {
 background: rgba(0,0,0, 0.8);
 position: fixed;
 z-index: 20;
 top: 0;
 left: 0;
 width: 100%;
 height: 100%;
 
 }

.el-icon-success{
  color: green;

}

.el-icon-error{
  color: red;
}


.add-device{
    float: right;
    margin-right: 30px;
    margin-bottom: 10px;
    
}

.User-table{
  position: fixed;
  top: 10px;
  left: 270px;
  width: 80%;
  height: 100%;
 
}



</style>