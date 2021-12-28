<template>
  <div class="User-table">
    <div class="set">
      <div class="elsearch">
        <el-input placeholder="请输入内容" v-model="userName">
          <template slot="prepend">用户名</template>
        </el-input>
      </div>
      <div class="search">
        <el-input placeholder="请输入内容" v-model="userAccount">
          <template slot="prepend">账号</template>
        </el-input>
      </div>
      <el-button icon="el-icon-search" circle @click="handleSearch"></el-button>
      <el-button type="success" round @click="handleReset">重置</el-button>
    </div>
    <hr />

    <el-button
      type="danger"
      plain
      class="delete-button"
      @click="deleteMore"
      v-if="this.$store.state.ismanager"
      >删除</el-button
    ><el-button
      type="primary"
      plain
      class="add-device"
      @click="adduser = true"
      v-if="this.$store.state.ismanager"
      >新增</el-button
    >
    <div
      class="dialog-cover back"
      v-if="adduser || changeuser"
      @click="
        adduser = false;
        changeuser = false;
      "
    ></div>
    <AddUser v-if="adduser" @changeTable="changeTable" />
    <ChangeUser
      v-if="changeuser"
      :changerow="changerow"
      @changeTable="changeTable"
    />

    <el-table :data="tableData" border class="usertable" ref="multipleTable">
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column prop="userName" label="用户名"> </el-table-column>
      <el-table-column prop="userAccount" label="账号"> </el-table-column>
      <el-table-column prop="role" label="权限"> </el-table-column>
      <el-table-column prop="createTime" label="创建时间"> </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="150"
        v-if="this.$store.state.ismanager"
        :key="2"
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
        :page-sizes="[7]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total1"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import AddUser from "../components/AddUser.vue";
import ChangeUser from "../components/ChangeUser.vue";
import ajax from "../utils/ajax";
export default {
  methods: {
    //点击修改
    handleClick(row) {
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
        ajax("/api/user/delete", { userId: row.userId }, "Post")
          .then(() => {
            // if(res.status == 200){}else{}
            // console.log(res);
            const newreset = this.reset.filter((obj) => {
              // console.log(row.userAccount);
              return obj.userAccount !== row.userAccount;
            });
            this.tableData = newreset;
            this.reset = newreset;
            this.$message({
              type: "success",
              message: "删除成功",
            });
          })
          .catch(() => {
            this.$message({
              type: "error",
              message: "删除失败",
            });
          });
      });
    },

    //搜索
    handleSearch() {
      this.search = {
        userName: this.userName,
        userAccount: this.userAccount,
        role: "1",
      };
      // if (this.userName) {
      ajax(
        "/api/user/search",
        { type: 2, information: this.search },
        "Post"
      ).then((res) => {
        // console.log(res);
        this.tableData = res.data;
        // console.log("this.tableData", this.tableData);
        this.reset = this.tableData;
        this.total1 = this.reset.length;
      });
      // } else if (this.role) {
      //   ajax(
      //     "/api/user/search",
      //     { type: 3, information: this.role },
      //     "Post"
      //   ).then((res) => {
      //     console.log(res);
      //     this.tableData = res.data;
      //     console.log("this.tableData", this.tableData);
      //     this.reset = this.tableData;
      //     this.total1 = this.reset.length;
      //   });
      // } else {
      //   alert("请输入内容");
      // }
    },

    //重置
    handleReset() {
      this.userName = "";
      this.role = "";
    },

    //切换弹窗状态
    changeTable() {
      this.adduser = false;
      this.changeuser = false;
      ajax("/api/user/getlist").then((res) => {
        // console.log(res);
        this.tableData = res.data.filter((v) => {
          return v.role == "1";
        });
        this.tableData.map((v) => {
          if (v.role == "1") {
            return (v.role = "管理员");
          } else if (v.role == "3") {
            return (v.role = "普通用户");
          }
        });
        // console.log("this.tableData", this.tableData);
        this.reset = this.tableData;
        this.total1 = this.reset.length;
      });

      this.tableData = this.tableData.slice(
        (this.currentPage1 - 1) * this.pageSize,
        this.currentPage1 * this.pageSize
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
          ajax("/api/user/delete", { userId: deletelist[i].userId }, "post")
            .then(() => {
              // console.log(res);
              // if (res.status == 200) {
              const newreset = this.reset.filter((obj) => {
                // console.log(deletelist[i].userAccount);
                return obj.userAccount !== deletelist[i].userAccount;
              });
              this.tableData = newreset;
              this.reset = newreset;
              this.$message({
                type: "success",
                message: "删除成功",
              });
              // } else {
              //   alert("删除失败!");
              // }
            })
            .catch(() => {
              this.$message({
                type: "error",
                message: "删除失败",
              });
            });
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
  },

  components: {
    AddUser,
    ChangeUser,
  },

  created() {
    ajax("/api/user/getlist").then((res) => {
      // console.log(res);
      this.tableData = res.data.filter((v) => {
        return v.role == "1";
      });
      this.tableData.map((v) => {
        if (v.role == "1") {
          return (v.role = "管理员");
        } else if (v.role == "3") {
          return (v.role = "普通用户");
        }
      });
      // console.log("this.tableData", this.tableData);
      this.reset = this.tableData;
      this.total1 = this.reset.length;
    });

    this.tableData = this.tableData.slice(
      (this.currentPage1 - 1) * this.pageSize,
      this.currentPage1 * this.pageSize
    );
  },

  updated() {
    this.total1 = this.reset.length;
    this.tableData.map((v) => {
      if (v.role == "1") {
        return (v.role = "管理员");
      } else if (v.role == "3") {
        return (v.role = "普通用户");
      }
    });
  },

  data() {
    return {
      search: {},
      changerow: {},
      changeuser: false,
      userName: "",
      userAccount: "",
      role: "",
      adduser: false,
      reset: [],
      total1: 0,
      currentPage1: 1,
      pageSize: 7,
      tableData: [
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          id: 1,
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          id: 2,
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          id: 3,
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          id: 4,
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          id: 5,
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          id: 6,
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          id: 7,
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          id: 8,
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          id: 9,
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          id: 10,
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          id: 11,
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          id: 12,
        },
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          id: 13,
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          id: 14,
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          id: 15,
        },
        {
          date: "2016-05-08",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          id: 16,
        },
        {
          date: "2016-05-06",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          id: 17,
        },
        {
          date: "2016-05-07",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          id: 18,
        },
        {
          date: "2016-05-07",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          id: 19,
        },
        {
          date: "2016-05-07",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          id: 20,
        },
        {
          date: "2016-05-07",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          id: 21,
        },
        {
          date: "2016-05-07",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          id: 22,
        },
        {
          date: "2016-05-07",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          id: 23,
        },
        {
          date: "2016-05-07",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          id: 24,
        },
        {
          date: "2016-05-07",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          id: 25,
        },
        {
          date: "2016-05-08",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
          id: 26,
        },
      ],
    };
  },
};
</script>

<style scoped>
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
  margin-left: 10px;
  margin-right: 10px;
}

.usertable {
  height: 65%;
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

.el-table .cell {
  height: 32px;
  text-align: center;
}

.elsearch .el-input-group__prepend {
  width: 56px;
}

.elsearch .el-input__inner {
  width: 206px;
}

.justchoose3 .el-input__inner {
  width: 275px;
}

.justchoose3 .el-select {
  width: 275px;
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