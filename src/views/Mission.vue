<template>
  <div class="User-table">
    <div v-if="showcamera == false">
      <div class="set">
        <div class="justchoose1">
          <el-select v-model="taskType" placeholder="请选择任务类别">
            <el-option
              :label="item"
              :value="i + 1"
              v-for="(item, i) in this.GL.type"
              :key="item"
            ></el-option>
          </el-select>
        </div>
        <div class="search elsearch1">
          <el-input placeholder="请输入内容" v-model="taskId">
            <template slot="prepend">任务号</template>
          </el-input>
        </div>
      </div>
      <div class="set">
        <div class="justchoose1">
          <el-select v-model="gpuId" placeholder="请选择显卡号">
            <el-option
              :label="item"
              :value="item"
              v-for="item in this.GL.gpu"
              :key="item"
            ></el-option>
          </el-select>
        </div>
        <div class="search">
          <div class="justchoose1">
            <el-select placeholder="请选择运行状态" v-model="taskStatus">
              <el-option label="启动" value="1"></el-option>
              <el-option label="停止" value="2"></el-option>
            </el-select>
          </div>
        </div>

        <el-button
          icon="el-icon-search"
          circle
          @click="handleSearch"
          class="icon-search"
        ></el-button>
        <el-button type="success" round @click="handleReset">重置</el-button>
      </div>
    </div>

    <div v-if="showcamera">
      <div class="set">
        <div class="search elsearch1">
          <el-input placeholder="请输入内容" v-model="cameraId">
            <template slot="prepend">摄像头号</template>
          </el-input>
        </div>
        <div class="search elsearch1">
          <el-input placeholder="请输入内容" v-model="cameraName">
            <template slot="prepend">摄像头名</template>
          </el-input>
        </div>
        <div class="search elsearch1">
          <el-input placeholder="请输入内容" v-model="cameraConfigName">
            <template slot="prepend">别名</template>
          </el-input>
        </div>
        <div class="search elsearch1">
          <el-input placeholder="请输入内容" v-model="cameraGroupName">
            <template slot="prepend">组名</template>
          </el-input>
        </div>
      </div>
      <div class="set2">
        <el-button
          icon="el-icon-search"
          circle
          @click="handleSearchCamera"
          class="icon-search"
        ></el-button>
        <el-button type="success" round @click="handleReset">重置</el-button>
      </div>
    </div>

    <hr />

    <el-button
      type="danger"
      plain
      class="delete-button"
      @click="deleteMore"
      v-if="this.$store.state.ismanager && showcamera == false"
      >删除</el-button
    >
    <el-button
      type="warning"
      plain
      class="refresh-button"
      @click="handleRefresh"
      v-if="showcamera == false"
      :disabled="disabled"
      >刷新状态</el-button
    >
    <el-button
      type="info"
      plain
      class="back-button"
      @click="showcamera = false"
      v-if="showcamera"
      >返回</el-button
    >
    <el-button
      type="primary"
      plain
      class="add-device"
      @click="adduser = true"
      v-if="this.$store.state.ismanager && showcamera == false"
      >新增</el-button
    >
    <div
      class="dialog-cover back"
      v-if="adduser || changeuser || drawarea"
      @click="
        adduser = false;
        changeuser = false;
        drawarea = false;
      "
    ></div>
    <AddMission v-if="adduser" @changeTable="changeTable" />
    <ChangeMission
      v-if="changeuser"
      :changerow="changerow"
      @changeTable="changeTable"
    />
    <Draw v-if="drawarea" @changeTable="changeTable" :changerow="changerow" />

    <el-table
      :data="cameraTable"
      border
      class="table2"
      height="56%"
      v-if="showcamera"
    >
      <el-table-column type="selection" width="55" fixed> </el-table-column>

      <el-table-column prop="cameraId" label="摄像头号"> </el-table-column>
      <el-table-column prop="cameraName" label="摄像头名"> </el-table-column>
      <el-table-column prop="cameraConfigName" label="别名"> </el-table-column>
      <el-table-column prop="cameraGroupName" label="组名"> </el-table-column>
      <el-table-column fixed="right" label="区域配置" width="200">
        <template slot-scope="scope">
          <el-button size="small" @click="draw(scope.row)" round
            >区域配置</el-button
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
      v-if="showcamera == false"
    >
      <el-table-column type="selection" width="55" fixed> </el-table-column>
      <el-table-column prop="taskType" label="任务类型"> </el-table-column>
      <el-table-column prop="taskId" label="任务号"> </el-table-column>
      <el-table-column prop="gpuId" label="显卡号"> </el-table-column>

      <el-table-column
        prop="taskStatus"
        label="运行状态"
        fixed="right"
        width="120"
      >
        <template slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.taskStatus == 1"></i>
          <i class="el-icon-error" v-if="scope.row.taskStatus == 2"></i>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="配置路数" width="100">
        <template slot-scope="scope">
          <el-button size="small" @click="showCamera(scope.row)" round>{{
            scope.row.cameraCount != "" ? scope.row.cameraCount : "配置路数"
          }}</el-button>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="启停" width="150">
        <template slot-scope="scope">
          <el-button
            size="small"
            @click="startMission(scope.row)"
            round
            :disabled="disabled"
            >启动</el-button
          >
          <el-button size="small" @click="stopMission(scope.row)" round
            >停止</el-button
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
import AddMission from "../components/AddMission.vue";
import ChangeMission from "../components/ChangeMission.vue";
import Draw from "../components/Draw.vue";
import ajax from "../utils/ajax";

export default {
  methods: {
    //修改任务
    handleClick(row) {
      // console.log(row);
      this.changeuser = true;
      this.changerow = row;
    },

    //单个删除
    deleteRow(row) {
      this.$confirm("此操作将删除该行数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        //接口删除
        // let result = {};
        ajax("/api/task/delete", { taskId: row.taskId }, "post")
          .then(() => {
            // console.log(res);
            // result = res;
            // console.log("result", result);
            // if(result.status==200){
            const newreset = this.reset.filter((obj) => {
              console.log(row.taskId);
              return obj.taskId !== row.taskId;
            });
            this.tableData = newreset;
            this.reset = newreset;
            this.$message({
              type: "success",
              message: "删除成功",
            });
          })
          .catch((err) => {
            this.$message({
              type: "error",
              message: "删除失败" + err.response.data.message,
            });
            alert(err.response.data.message);
          });
        // console.log("result", result);
        // // if(result.status==200){
        // const newreset = this.reset.filter((obj) => {
        //   console.log(row.taskId);
        //   return obj.taskId !== row.taskId;
        // });
        // this.tableData = newreset;
        // this.reset = newreset;
        // }else if(result.status==501){
        // alert(row.taskId+'该摄像头下配置了任务，无法删除摄像头')
        // break
        // }else{
        // alert('删除失败!')
        // break
        // }
      });
    },

    //刷新所有状态
    handleRefresh() {
      this.disabled = true;
      this.$message({
        type: "warning",
        message: "刷新中",
      });
      //接口刷新所有状态
      ajax("/api/task/refresh", { taskIdList: [] }, "Post")
        .then(() => {
          // if(res.status==200){
          this.disabled = false;
          this.$message({
            type: "success",
            message: "刷新成功",
          });
          // console.log(res);
          ajax("/api/task/getlist").then((result) => {
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
        })
        .catch(() => {
          this.disabled = false;
          this.$message({
            type: "error",
            message: "刷新失败",
          });
        });
    },

    //切换弹窗状态
    changeTable() {
      this.adduser = false;
      this.changeuser = false;
      this.drawarea = false;
      ajax("/api/task/getlist").then((res) => {
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

    //搜索
    handleSearch() {
      // console.log(
      //   this.taskType,
      //   this.taskId,
      //   this.gpuId,
      //   this.taskStatus
      // );
      let search = {
        taskType: this.taskType,
        taskId: this.taskId,
        gpuId: this.gpuId,
        taskStatus: this.taskStatus,
      };

      // if (this.taskType) {
      ajax("/api/task/search", { type: 2, information: search }, "Post").then(
        (res) => {
          // console.log(res);
          this.tableData = res.data;
          for (let item in this.tableData) {
            let typec = this.tableData[item].taskType;
            if (typec == "1") {
              this.tableData[item].taskType = "杂物检测";
            } else if (typec == "2") {
              this.tableData[item].taskType = "烟雾检测";
            } else if (typec == "3") {
              this.tableData[item].taskType = "奔跑检测";
            } else if (typec == "4") {
              this.tableData[item].taskType = "人头检测";
            } else if (typec == "5") {
              this.tableData[item].taskType = "进出检测";
            } else if (typec == "6") {
              this.tableData[item].taskType = "火焰检测";
            } else if (typec == "7") {
              this.tableData[item].taskType = "斗殴检测";
            } else if (typec == "8") {
              this.tableData[item].taskType = "跌倒检测";
            }
          }
          // console.log("this.tableData", this.tableData);
          this.reset = this.tableData;
          this.total1 = this.reset.length;
        }
      );
      // } else if (this.taskId) {
      //   ajax(
      //     "/api/task/search",
      //     { type: 1, information: this.taskId },
      //     "Post"
      //   ).then((res) => {
      //     console.log(res);
      //     this.tableData = res.data;
      //     console.log("this.tableData", this.tableData);
      //     this.reset = this.tableData;
      //     this.total1 = this.reset.length;
      //   });
      // } else if (this.gpuId) {
      //   ajax(
      //     "/api/task/search",
      //     { type: 4, information: this.gpuId },
      //     "Post"
      //   ).then((res) => {
      //     console.log(res);
      //     this.tableData = res.data;
      //     console.log("this.tableData", this.tableData);
      //     this.reset = this.tableData;
      //     this.total1 = this.reset.length;
      //   });
      // } else if (this.taskStatus) {
      //   ajax(
      //     "/api/task/search",
      //     { type: 3, information: this.taskStatus },
      //     "Post"
      //   ).then((res) => {
      //     console.log(res);
      //     this.tableData = res.data;
      //     console.log("this.tableData", this.tableData);
      //     this.reset = this.tableData;
      //     this.total1 = this.reset.length;
      //   });
      // }
      //接口
      // console.log(this.search);
      // let filterList = Object.keys(this.tableData[0]);
      // if (this.search) {
      //   let res = this.reset;

      //   this.tableData = res.filter((v) => {
      //     //some是一个为true，即结果为true
      //     return filterList.some((key) => {
      //       //要toString是因为对象里有id，id是int类型，要转为字符串类型
      //       return v[key].toString().indexOf(this.search) > -1;
      //     });
      //   });
      // }
    },

    //重置
    handleReset() {
      this.taskType = "";
      this.taskId = "";
      this.gpuId = "";
      this.taskStatus = "";
      this.cameraId = "";
      this.cameraName = "";
      this.cameraConfigName = "";
      this.cameraGroupName = "";
    },

    //搜索摄像头
    handleSearchCamera() {
      let search = {
        cameraId: this.cameraId,
        cameraName: this.cameraName,
        cameraConfigName: this.cameraConfigName,
        cameraGroupName: this.cameraGroupName,
        taskId: this.taskid,

        ip: "",
        cameraStatus: "",
      };

      // console.log(search)
      ajax("/api/camera/search", { information: search }, "Post").then(
        (res) => {
          // console.log(res);
          this.cameraTable = res.data;

          this.total1 = this.cameraTable.length;
        }
      );
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
        for (let i = 0; i < deletelist.length; i++) {
          ajax("/api/task/delete", { taskId: deletelist[i].taskId }, "post")
            .then(() => {
              // console.log(res);
              const newreset = this.reset.filter((obj) => {
                // console.log(deletelist[i].taskId);
                return obj.taskId !== deletelist[i].taskId;
              });
              this.tableData = newreset;
              this.reset = newreset;
              this.$message({
                type: "success",
                message: "删除成功",
              });
            })
            .catch((err) => {
              this.$message({
                type: "error",
                message: "删除失败" + err.response.data.message,
              });
            });

          // if(result.status==200){
          const newreset = this.reset.filter((obj) => {
            // console.log(deletelist[i].taskId);
            return obj.taskId !== deletelist[i].taskId;
          });
          this.tableData = newreset;
          this.reset = newreset;
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

    //启动
    startMission(row) {
      //接口请求启动该任务
      this.disabled = true;
      this.$message({
        type: "warning",
        message: "启动中",
      });
      ajax("/api/task/start", { taskId: row.taskId }, "Post")
        .then(() => {
          // console.log('start',res)
          this.disabled = false;
          row.taskStatus = 1;
          this.$message({
            type: "success",
            message: "启动成功",
          });
        })
        .catch(() => {
          this.disabled = false;
          this.$message({
            type: "error",
            message: "启动失败",
          });
        });
    },

    //停止
    stopMission(row) {
      //接口请求停止该任务
      ajax("/api/task/stop", { taskId: row.taskId }, "Post")
        .then(() => {
          // console.log('stop',res)

          row.taskStatus = 2;
        })
        .catch(() => {
          this.$message({
            type: "error",
            message: "停止失败",
          });
        });
    },

    //配置路数点击展示摄像头
    showCamera(row) {
      this.showcamera = true;
      this.taskid = row.taskId.toString();
      //接口请求该taskId存入cameraTable
      ajax(
        "/api/camera/searchByTask",
        { taskId: row.taskId.toString() },
        "Post"
      ).then((res) => {
        // console.log(res);
        this.cameraTable = res.data;
        this.total1 = this.cameraTable.length;
        // console.log("this.cameraTable", this.cameraTable);

        // console.log(this.total1);
      });

      this.cameraTable = this.cameraTable.slice(
        (this.currentPage1 - 1) * this.pageSize,
        this.currentPage1 * this.pageSize
      );
    },

    //展示画图组件
    draw(row) {
      this.drawarea = true;
      this.changerow = row;
      // console.log(row)
    },
  },
  created() {
    ajax("/api/task/getlist").then((res) => {
      // console.log(res);
      this.tableData = res.data;
      for (let item in this.tableData) {
        let typec = this.tableData[item].taskType;
        if (typec == "1") {
          this.tableData[item].taskType = "杂物检测";
        } else if (typec == "2") {
          this.tableData[item].taskType = "烟雾检测";
        } else if (typec == "3") {
          this.tableData[item].taskType = "奔跑检测";
        } else if (typec == "4") {
          this.tableData[item].taskType = "人头检测";
        } else if (typec == "5") {
          this.tableData[item].taskType = "进出检测";
        } else if (typec == "6") {
          this.tableData[item].taskType = "火焰检测";
        } else if (typec == "7") {
          this.tableData[item].taskType = "斗殴检测";
        } else if (typec == "8") {
          this.tableData[item].taskType = "跌倒检测";
        }
      }
      // console.log("this.tableData", this.tableData);
      // type:['杂物检测','烟雾检测','奔跑检测','人头检测','进出检测','火焰检测','斗殴检测','跌倒检测'],
      this.reset = this.tableData;
      this.total1 = this.reset.length;
    });

    this.tableData = this.tableData.slice(
      (this.currentPage1 - 1) * this.pageSize,
      this.currentPage1 * this.pageSize
    );
  },
  components: {
    AddMission,
    ChangeMission,
    Draw,
  },
  updated() {
    for (let item in this.tableData) {
      let typec = this.tableData[item].taskType;
      if (typec == "1") {
        this.tableData[item].taskType = "杂物检测";
      } else if (typec == "2") {
        this.tableData[item].taskType = "烟雾检测";
      } else if (typec == "3") {
        this.tableData[item].taskType = "奔跑检测";
      } else if (typec == "4") {
        this.tableData[item].taskType = "人头检测";
      } else if (typec == "5") {
        this.tableData[item].taskType = "进出检测";
      } else if (typec == "6") {
        this.tableData[item].taskType = "火焰检测";
      } else if (typec == "7") {
        this.tableData[item].taskType = "斗殴检测";
      } else if (typec == "8") {
        this.tableData[item].taskType = "跌倒检测";
      }
    }
  },
  // computed:{
  //   typechi:{
  //     get:function(){
  //       for(let item in this.tableData){
  //       let typec = this.tableData[item].taskType
  //       if(typec == '1'){
  //         return '杂物检测'
  //       }else if(typec == '2'){
  //         return '烟雾检测'
  //       }else if(typec == '3'){
  //         return '奔跑检测'
  //       }else if(typec == '4'){
  //         return '人头检测'
  //       }else if(typec == '5'){
  //         return '进出检测'
  //       }else if(typec == '6'){
  //         return '火焰检测'
  //       }else if(typec == '7'){
  //         return '斗殴检测'
  //       }else if(typec == '8'){
  //         return '跌倒检测'
  //       }
  //     }
  //     }
  //   }
  // },
  // computed:{
  //     cameraId:{
  //       get:function(){
  //         const newid = []
  //            if(this.mission_camera){
  //             for(let i=0;i<this.mission_camera.length;i++){

  //         newid.push(this.mission_camera[i][this.mission_camera[i].length-1])
  //       }

  //       return newid.toString()
  //         }else{
  //             return '无'
  //         }

  //       },

  //       }

  //   },

  data() {
    return {
      disabled: false,
      drawarea: false,
      showcamera: false,
      changegroup: false,
      changeuser: false,
      adduser: false,
      changerow: {},
      cameraId: "",
      cameraName: "",
      cameraConfigName: "",
      cameraGroupName: "",
      taskType: "",
      taskid: "",
      taskId: "",
      gpuId: "",
      taskStatus: "",
      reset: [],
      total1: 0,
      currentPage1: 1,
      pageSize: 6,
      cameraTable: [
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          state: 0,
          id: 1,
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          state: 0,
          id: 2,
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          state: 1,
          id: 3,
        },
      ],
      tableData: [
        {
          mission_ip: "1213.11",
          task_count: 2,
          mission_state: 0,
          mission_type: "111",
          mission_id: "4554",
          gpu: "222",
          mission_group: "11",
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          state: 0,
          id: 2,
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          state: 1,
          id: 3,
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          state: 1,
          id: 4,
        },
        {
          date: "2016-05-08",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          state: 1,
          id: 5,
        },
        {
          date: "2016-05-06",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          state: 1,
          id: 6,
        },
        {
          date: "2016-05-07",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          state: 0,
          id: 7,
        },
        {
          date: "2016-05-07",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          state: 1,
          id: 8,
        },
        {
          date: "2016-05-07",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          state: 0,
          id: 9,
        },
        {
          date: "2016-05-07",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          state: 0,
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

.set2 {
  display: flex;

  margin-bottom: 20px;
  margin-left: 83%;
}

.search {
  margin-left: 10px;
  margin-right: 10px;
}

.elsearch1 .el-input-group__prepend {
  width: 28px;
}

.elsearch1 .el-input__inner {
  width: 192px;
}

.justchoose1 .el-input__inner {
  width: 275px;
}

.justchoose1 .el-select {
  width: 275px;
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

.refresh-button {
  float: right;
  margin-right: 30px;
  margin-bottom: 10px;
}

.icon-search {
  margin-left: 20px;
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

.back-button {
  margin-right: 30px;
  margin-bottom: 10px;
}

.el-table .cell {
  height: 32px;
  text-align: center;
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