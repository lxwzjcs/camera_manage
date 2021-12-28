<template>
  <div class="User-table">
    <div v-if="showgroup==false">
    <div class="set">
      <div class="elsearch">
        <el-input placeholder="请输入内容" v-model="cameraId">
          <template slot="prepend">摄像头号</template>
        </el-input>
      </div>
      <div class="search elsearch">
        <el-input placeholder="请输入内容" v-model="cameraName">
          <template slot="prepend">摄像头名</template>
        </el-input>
      </div>
      <div class="search elsearch">
        <el-input placeholder="请输入内容" v-model="cameraConfigName">
          <template slot="prepend"> 别&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名 </template>
        </el-input>
      </div>
    </div>
    <div class="set">
      <div class=" elsearch">
        <el-input placeholder="请输入内容" v-model="cameraGroupName">
          <template slot="prepend"> 组&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别 </template>
        </el-input>
      </div>
      <div class="search elsearch">
        <el-input placeholder="请输入内容" v-model="ip">
          <template slot="prepend">IP&nbsp;&nbsp;地&nbsp;址&nbsp;</template>
        </el-input>
      </div>

      <div class="search justchoose">
        <el-select placeholder="请选择状态" v-model="cameraStatus">
          <el-option label="丢失（异常不可用）" value="2"></el-option>
          <el-option label="网络波动" value="1"></el-option>
          <el-option label="正常" value="3"></el-option>
        </el-select>
      </div>
      <el-button icon="el-icon-search" circle @click="handleSearch" class="icon-search"></el-button>
      <el-button type="success" round @click="handleReset">重置</el-button>
    </div></div>
    
    <div v-if="showgroup">
      <div class="set">
      <div class="elsearch">
        <el-input placeholder="请输入内容" v-model="cameraGroupId">
          <template slot="prepend">摄像头组号</template>
        </el-input>
      </div>
      <div class="search elsearch">
        <el-input placeholder="请输入内容" v-model="cameraGroupName">
          <template slot="prepend">摄像头组名</template>
        </el-input>
      </div>
      <el-button icon="el-icon-search" circle @click="handleSearchGroup" class="icon-search"></el-button>
      <el-button type="success" round @click="handleReset">重置</el-button>
      </div>
    </div>
    <hr />

    <el-button
      type="danger"
      plain
      class="delete-button"
      @click="deleteMore"
      v-if="this.$store.state.ismanager && showgroup == false"
      >删除</el-button
    >
    <el-button
      type="warning"
      plain
      class="refresh-button"
      @click="handleRefresh"
      v-if="showgroup == false"
      :disabled="disabled"
      >刷新状态</el-button
    >
    <el-button
      type="primary"
      plain
      class="group-button"
      @click="showGroup"
      v-if="showgroup == false"
      >设备组管理</el-button
    ><el-button
      type="primary"
      plain
      class="add-device"
      @click="adduser = true"
      v-if="this.$store.state.ismanager && showgroup == false"
      >新增</el-button
    >

    <el-button
      type="primary"
      plain
      class="add-device"
      @click="addgroup = true"
      v-if="this.$store.state.ismanager && showgroup"
      >新增组</el-button
    >
    <el-button
      type="info"
      plain
      class="back-button"
      @click="showgroup = false"
      v-if="showgroup"
      >返回</el-button
    >
    <div
      class="dialog-cover back"
      v-if="adduser || changeuser || addgroup || changegroup"
      @click="
        adduser = false;
        changeuser = false;
        addgroup = false;
        changegroup = false;
      "
    ></div>
    <AddDevice v-if="adduser" @changeTable="changeTable" />
    <ChangeDevice
      v-if="changeuser"
      :changerow="changerow"
      @changeTable="changeTable"
    />

    <AddGroup v-if="addgroup" @changeTable="changeTable" />
    <ChangeGroup
      v-if="changegroup"
      :changerow="changerow"
      @changeTable="changeTable"
    />

    <el-table
      :data="groupTable"
      border
      class="table2"
      height="56%"
      v-if="showgroup"
    >
      <el-table-column type="selection" width="55" fixed> </el-table-column>

      <el-table-column prop="cameraGroupId" label="摄像头组号">
      </el-table-column>
      <el-table-column prop="cameraGroupName" label="摄像头组名">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="150"
        v-if="this.$store.state.ismanager"
      >
        <template slot-scope="scope">
          <el-button @click="changeGroup(scope.row)" size="small" round
            >修改</el-button
          >
          <el-button size="small" @click="deleteGroupRow(scope.row)" round
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-table
      :data="tableData"
      border
      class="table2"
      ref="multipleTable"
      height="56%"
      v-if="showgroup == false"
    >
      <el-table-column type="selection" width="55" fixed> </el-table-column>
      <el-table-column prop="cameraId" label="摄像头号"> </el-table-column>
      <el-table-column prop="cameraName" label="摄像头名" width="100"> </el-table-column>
      <el-table-column prop="cameraConfigName" label="别名" width="100"> </el-table-column>
      <el-table-column prop="cameraGroupName" label="组名" width="200"> </el-table-column>
      <el-table-column prop="ip" label="IP地址" width="200"> </el-table-column>
      <el-table-column prop="taskCount" label="使用次数" width="100"> </el-table-column>
      <el-table-column prop="rtsp" label="rtsp" class="rtsp" width="600">
</el-table-column>
      

      <el-table-column
        prop="cameraStatus"
        label="状态"
        fixed="right"
        width="100"
      >
        <template slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cameraStatus == 3"></i>
          <i class="el-icon-error" v-if="scope.row.cameraStatus == 2"></i>
          <i class="el-icon-warning" v-if="scope.row.cameraStatus == 1"></i>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="刷新" width="70">
        <template slot-scope="scope">
          <el-button size="small" @click="refreshRow(scope.row)" round :disabled="disabled"
            >刷新</el-button
          >
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="150"
        v-if="this.$store.state.ismanager"
      >
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" size="small" round
            >修改</el-button
          >
          <el-button size="small" @click="deleteRow(scope.row)" round
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="paginationClass">
      <el-pagination
        @current-change="handleCurrentChange1"
        :current-page="currentPage1"
        :page-sizes="[6]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total1"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import AddDevice from "../components/AddDevice.vue";
import ChangeDevice from "../components/ChangeDevice.vue";
import AddGroup from "../components/AddGroup.vue";
import ChangeGroup from "../components/ChangeGroup.vue";
import ajax from "../utils/ajax";
export default {
  methods: {
    //修改设备显示组件
    handleClick(row) {
      // console.log(row);
      this.changeuser = true;
      this.changerow = row;
    },
    
    //设备组管理切换
    changeGroup(row) {
      // console.log(row);
      this.changegroup = true;
      this.changerow = row;
    },

    //删除单行
    deleteRow(row) {
      this.$confirm("此操作将删除该行数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        //接口删除
        //接口删除
        ajax("/api/camera/delete", { cameraId: row.cameraId }, "post").then(
          () => {
            // console.log(res);
            
            const newreset = this.reset.filter((obj) => {
          // console.log(row.cameraId);
          return obj.cameraId !== row.cameraId;
        });
        this.tableData = newreset;
        this.reset = newreset;
        this.$message({
                type:'success',
                message:'删除成功',
              })
          }
        ).catch(() => {
            this.$message({
                type:'error',
                message:'删除失败',
              })
            })
        
        // if(result.status==200){
        
        // }else if(result.status==501){
        // alert(row.cameraId+'该摄像头下配置了任务，无法删除摄像头')
        // break
        // }else{
        // alert('删除失败!')
        // break
        // }
      });
    },
    
    //删除多行
    deleteGroupRow(row) {
      this.$confirm("此操作将删除该行数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        //接口删除
        //接口删除

        ajax(
          "/api/cameragroup/delete",
          { cameraGroupId: row.cameraGroupId },
          "post"
        )
          .then(() => {
            // console.log(res);

            const newreset = this.groupTable.filter((obj) => {
              // console.log(row.cameraGroupId);
              return obj.cameraGroupId !== row.cameraGroupId;
            });
            this.groupTable = newreset;
            this.$message({
                type:'success',
                message:'删除成功',
              })
          })
          .catch(() => {
            this.$message({
                type:'error',
                message:'删除失败',
              })
          });

        // if(result.status==200){

        // }else if(result.status==501){
        // alert(row.cameraId+'该摄像头下配置了任务，无法删除摄像头')
        // break
        // }else{
        // alert('删除失败!')
        // break
        // }
      });
    },

    //刷新单行状态
    refreshRow(row) {
      this.disabled = true
      this.$message({
        type:'warning',
        message:'刷新中'
      })
      //接口刷新单个状态
      ajax("/api/camera/refresh", { cameraId: [row.cameraId] }, "Post").then(
        () => {
          this.disabled = false
          this.$message({
        type:'success',
        message:'刷新成功'
      })
          // console.log(res);
          // if(res.status == 200){
          ajax("/api/camera/getlist").then((result) => {
            // console.log(result);
            this.tableData = result.data;
            // console.log("this.tableData", this.tableData);
            this.reset = this.tableData;
            this.total1 = this.reset.length;
          });
          // }else{
          //   alert('刷新失败!')
          // }
        }
      ).catch(()=>{
        this.disabled = false
        this.$message({
        type:'error',
        message:'刷新失败'
      })
      })
    },

    //刷新所有状态
    handleRefresh() {
      this.disabled = true
      this.$message({
        type:'warning',
        message:'刷新中'
      })
      //接口刷新所有状态
      ajax("/api/camera/refresh", { cameraId: [] }, "Post").then(() => {
        // if(res.status==200){
        // console.log(res);
        this.disabled = false
        this.$message({
        type:'success',
        message:'刷新成功'
      })
        ajax("/api/camera/getlist").then((result) => {
          // console.log(result);
          this.tableData = result.data;
          // console.log("this.tableData", this.tableData);
          this.reset = this.tableData;
          this.total1 = this.reset.length;
        });

        this.tableData = this.tableData.slice(
          (this.currentPage1 - 1) * this.pageSize,
          this.currentPage1 * this.pageSize
        );
        // }else{
        //   alert('刷新失败')
        // }
      }).catch(()=>{
        this.disabled = false
        this.$message({
        type:'error',
        message:'刷新失败'
      })
      })
    },

    //改变弹框状态
    changeTable() {
      this.adduser = false;
      this.changeuser = false;
      this.addgroup = false;
      this.changegroup = false;
      // if (this.adduser == false || this.changeuser == false) {
        ajax("/api/camera/getlist").then((result) => {
          // console.log(result);
          this.tableData = result.data;
          // console.log("this.tableData", this.tableData);
          this.reset = this.tableData;
          this.total1 = this.reset.length;
        });
      // }else if(this.showgroup == true) {
        ajax("/api/cameragroup/getlist").then((res) => {
          // console.log(res);
          this.groupTable = res.data;
          this.total1 = this.groupTable.length;
        });
      // }
    },

    //搜索
    handleSearch() {
      // if (this.cameraId) {
      this.search = {
        cameraId: this.cameraId,
        cameraName: this.cameraName,
        cameraConfigName: this.cameraConfigName,
        cameraGroupName: this.cameraGroupName,
        ip: this.ip,
        cameraStatus: this.cameraStatus,
        taskId:'',
      };
      ajax(
        "/api/camera/search",
        { type: 0, information: this.search },
        "Post"
      ).then((res) => {
        // console.log(res);
        this.tableData = res.data;
        // console.log("this.tableData", this.tableData);
        this.reset = this.tableData;
        this.total1 = this.reset.length;
      });
    },

    //重置搜索框
    handleReset() {
      this.cameraId = "";
      this.cameraName = "";
      this.cameraGroupId = '';
      this.cameraConfigName = "";
      this.cameraGroupName = "";
      this.ip = "";
      this.cameraStatus = "";
    },
    
    //设备组搜索
    handleSearchGroup(){
      this.search = {
        cameraGroupId:this.cameraGroupId,
        cameraGroupName: this.cameraGroupName,
        
      };
      ajax(
        "/api/cameragroup/search",
        { information: this.search },
        "Post"
      ).then((res) => {
        // console.log(res);
        this.groupTable = res.data;
        this.total1 = this.groupTable.length;
      });
    },

    //批量删除
    deleteMore() {
      this.$confirm("此操作将删除该行数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        //接口删除
        // console.log(this.$refs.multipleTable.selection);
        const deletelist = this.$refs.multipleTable.selection;
        // let result = {};
        for (let i = 0; i < deletelist.length; i++) {
          ajax(
            "/api/camera/delete",
            { cameraId: deletelist[i].cameraId },
            "post"
          ).then(() => {
            // console.log(res);
            // result = res;
            const newreset = this.reset.filter((obj) => {
            // console.log(deletelist[i].cameraId);
            return obj.cameraId !== deletelist[i].cameraId;
          });
          this.tableData = newreset;
          this.reset = newreset;
            this.$message({
                type:'success',
                message:'删除成功',
              })
          }).catch(()=>{
              this.$message({
                type:'error',
                message:'删除失败'
              })
            })
          // console.log("result", result);
          // if(result.status==200){
          // const newreset = this.reset.filter((obj) => {
          //   console.log(deletelist[i].cameraId);
          //   return obj.cameraId !== deletelist[i].cameraId;
          // });
          // this.tableData = newreset;
          // this.reset = newreset;
          // }else if(result.status==501){
          // alert(deletelist[i].cameraId+'该摄像头下配置了任务，无法删除摄像头')
          // break
          // }else{
          // alert('删除失败!')
          // break
          // }
        }
      });
    },

    handleCurrentChange1(currentPage) {
      //页码切换
      this.currentPage1 = currentPage;
      this.currentChangePage(this.reset, currentPage);
    },

    //分页方法（重点）
    currentChangePage(list, currentPage) {
      let from = (currentPage - 1) * this.pageSize;
      let to = currentPage * this.pageSize;
      this.tableData = [];
      for (; from < to; from++) {
        if (list[from]) {
          this.tableData.push(list[from]);
        }
      }
    },
    
    //设备组表格显示
    showGroup() {
      this.showgroup = true;
      // console.log(this.showgroup);
      ajax("/api/cameragroup/getlist").then((res) => {
        // console.log(res);
        this.groupTable = res.data;
        this.total1 = this.groupTable.length;
      });
    },
  },
  
  created() {
    ajax("/api/camera/getlist").then((res) => {
      // console.log(res);
      this.tableData = res.data;
      // console.log("this.tableData", this.tableData);
      this.reset = this.tableData;
      this.total1 = this.reset.length;
    });

    this.tableData = this.tableData.slice(
      (this.currentPage1 - 1) * this.pageSize,
      this.currentPage1 * this.pageSize
    );
  },
  components: {
    AddDevice,
    ChangeDevice,
    AddGroup,
    ChangeGroup,
  },

  data() {
    return {
      disabled:false,
      search: {},
      changegroup: false,
      addgroup: false,
      groupTable: [{}, {}],
      showgroup: false,
      changeuser: false,
      adduser: false,
      changerow: {},
      cameraId: "",
      cameraName: "",
      cameraConfigName: "",
      cameraGroupName: "",
      cameraGroupId:'',
      ip: "",
      cameraStatus: "",
      reset: [],
      total1: 0,
      currentPage1: 1,
      pageSize: 6,
      tableData: [
        {
          camera_id: 1,
          camera_name: "shexiangtou1",
          camera_othername: "camera1",
          camera_group: 1,
          camera_ip: "123.4.3",
          cameraStatus: 0,
          task_count: 3,
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          cameraStatus: 0,
          id: 2,
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          cameraStatus: 1,
          id: 3,
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          cameraStatus: 1,
          id: 4,
        },
        {
          date: "2016-05-08",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          cameraStatus: 2,
          id: 5,
        },
        {
          date: "2016-05-06",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          cameraStatus: 2,
          id: 6,
        },
        {
          date: "2016-05-07",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          cameraStatus: 0,
          id: 7,
        },
        {
          date: "2016-05-07",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          cameraStatus: 1,
          id: 8,
        },
        {
          date: "2016-05-07",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          state: 2,
          id: 9,
        },
        {
          date: "2016-05-07",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          state: 2,
          id: 10,
        },
        {
          date: "2016-05-07",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          state: 0,
          id: 11,
        },
      ],
    };
  },
};
</script>

<style>
.el-table {
  overflow-x: auto;
  height: 57%;
  padding-bottom: 20px;
}

.el-table .cell {
  height: 32px;
  text-align: center;
  
}

.icon-search{
  margin-left: 20px;
}

.dialog-cover {
  background: rgba(0, 0, 0, 0.8);
  position: fixed;
  z-index: 20;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.set {
  display: flex;
  margin-bottom: 20px;
  margin-right: 50px;
}

.search {
  margin-left: 30px;
  margin-right: 10px;
}

.elsearch .el-input-group__prepend {
  width: 56px;
}

.elsearch .el-input__inner {
  width: 206px;
}

.justchoose .el-input__inner{
  
  width: 304px;
}

.justchoose .el-select{
  width: 304px;
}

.el-icon-success {
  color: green;
}

.el-icon-error {
  color: red;
}

.el-icon-warning {
  color: rgba(223, 223, 46, 0.938);
}

.rtsp{
  overflow-y: auto;
}

.refresh-button {
  float: right;
  margin-right: 30px;
  margin-bottom: 10px;
}

.add-device {
  float: right;
  margin-right: 30px;
  margin-bottom: 10px;
}

.delete-button {
  float: right;
  margin-right: 30px;
}

.group-button {
  float: right;
  margin-right: 30px;
}

.back-button {
  margin-right: 30px;
  margin-bottom: 10px;
}

.User-table {
  position: fixed;
  top: 0;
  left: 280px;
  width: 80%;
  height: 100%;
  margin-top: 11vh;
  margin-left: 20px;
  z-index: 3;
}
</style>