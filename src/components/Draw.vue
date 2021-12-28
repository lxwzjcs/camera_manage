<template>
  <div class="demo-ruleForm7">
    <img :src="oldImgUrl" width="1000" height="590"/>
    <!-- <img src="../assets/66.png" width="1000" height="590" /> -->
    <canvas
      id="node-canvas"
      width="1000"
      height="590"
      style="position: absolute; left: 30px; top: 30px; z-index: 400"
      @mousedown="start"
    ></canvas
    ><br />
    <el-button
      class="operation-btn"
      style="margin-right: 15px"
      type="primary"
      @click="dialogFormVisible = true"
      v-if="this.$store.state.ismanager == true"
      >上传摄像头画面
    </el-button>
    <el-button
      class="operation-btn"
      style="margin-right: 15px"
      type="primary"
      @click="addNode = true"
      v-if="this.$store.state.ismanager == true"

      >添加节点
    </el-button>
    <el-button
      class="operation-btn"
      style="margin-right: 15px"
      type="primary"
      @click="add"
      v-if="this.$store.state.ismanager == true"
      >确认区域/线
    </el-button>
    <el-button
      class="operation-btn"
      style="margin-right: 15px"
      type="primary"
      @click="
        isJudge = true;
        show();
      "
      v-if="this.$store.state.ismanager ==true"
      >选择区域/线
    </el-button>

    <el-dialog
      title="上传摄像头图片"
      :visible.sync="dialogFormVisible"
      :modal="false"
    >
      <el-upload
        class="upload-demo"
        action=""
        :auto-upload="false"
        ref="upload"
        :file-list="fileList"
        list-type="picture"
        :limit="1"
        :on-exceed="onExceed"
        :on-change="getFile"
      >
        <el-button size="small" type="primary">选取图片</el-button>
        <div slot="tip" class="el-upload__tip">
          只能上传jpg/png文件，且不超过3M
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitUpload">上传</el-button>
      </div>
    </el-dialog>

    <el-button
      class="operation-btn"
      style="margin-right: 15px"
      type="danger"
      @click="del"
      v-if="this.$store.state.ismanager == true"
      >删除前一节点
    </el-button>
    <el-button
      class="operation-btn"
      style="margin-right: 15px"
      type="danger"
      @click="deleteArea"
      v-if="this.$store.state.ismanager == true"
      >删除区域/线
    </el-button>
    <el-button @click="quit" style="margin-right: 15px">取消</el-button>
    <el-tooltip
      content="注意：添加节点请顺时针或逆时针添加"
      placement="bottom"
      effect="light"
    >
      <el-button icon="el-icon-question" circle></el-button>
    </el-tooltip>
  </div>
</template>
<script>
import ajax from "../utils/ajax";
export default {
  data() {
    return {
      oldImgUrl: "",
      imgName: "",
      imgUrl: "",
      dialogFormVisible: false,
      canvasWidth: 1000,
      canvasHeight: 590,
      choosearea: "",
      isJudge: false,
      isLine: false,
      nodeList: [], //新建车道、区域、车道线点集
      loop: true, //是否闭合画线
      addNode: false, //是否添加节点

      canvas: "",
      color: "red",
      id: "",
      drawList: [],
      oldList: [
        {
          coordinate: [
            "126|241",
            "318|402",
            "422|181",
            // { nodeX: 126, nodeY: 241 },
            // { nodeX: 318, nodeY: 402 },
            // { nodeX: 422, nodeY: 181 },
          ],
          frameId: 123,
          frameName: "456",
        },
        {
          coordinate: [
            "471|429",
            "696|397",
            "584|322",
            // { nodeX: 471, nodeY: 429 },
            // { nodeX: 696, nodeY: 397 },
            // { nodeX: 584, nodeY: 322 },
          ],
          frameId: 456,
          frameName: "123",
        },
        {
          coordinate: ["112|11", "345|34"],
          frameId: 789,
          frameName: "789",
        },
      ], //当前画线数据
      fileList: [],
    };
  },
created(){
  ajax('/api/frame/getpicture',{taskId: this.changerow.taskId,cameraId: this.changerow.cameraId,},'Post').then(res=>{
      this.oldImgUrl = res.data.imgUrl
    })

},
  mounted() {
    this.initCanvas();
    // console.log("draw", this.changerow);
    // this.oldList = this.oldList.map(v=>{return {...v,nodelist:this.getflot(v.coordinate)}})

    this.show();
    
  },
  methods: {
    //取消
    quit() {
      this.$emit("changeTable");
    },

    //el-upload超过限制文件数生命周期
    onExceed() {
      this.$message({
        type: "error",
        message: "只能选取一个文件",
      });
    },

    //获取未上传文件
    getFile(file) {
      this.getBase64(file.raw).then((res) => {
        this.imgUrl = res;
        // console.log(res)
      });
    },
    
    //图片转换为base64
    getBase64(file) {
      return new Promise(function (resolve, reject) {
        let reader = new FileReader();
        let imgResult = "";
        reader.readAsDataURL(file);
        reader.onload = function () {
          imgResult = reader.result;
        };
        reader.onerror = function (error) {
          reject(error);
        };
        reader.onloadend = function () {
          resolve(imgResult);
        };
      });
    },
    
    //提交图片
    submitUpload() {
      ajax(
        "/api/frame/uploadpicture",
        {
          imgUrl: this.imgUrl,
          taskId: this.changerow.taskId,
          cameraId: this.changerow.cameraId,
          imgName:'',
        },
        "Post"
      )
        .then(() => {
          this.$message({
            type: "success",
            message: "上传成功",
            
          });
          this.oldImgUrl = this.imgUrl
          this.clearCanvas()
          this.show()
          this.dialogFormVisible = false;
        })
        .catch(() => {
          this.$message({
            type: "error",
            message: "上传失败",
          });
        });
        
    },
    
    //画获取到的点和线
    show() {
      
      ajax(
        "/api/frame/getframe",
        { taskId: this.changerow.taskId, cameraId: this.changerow.cameraId },
        "Post"
      ).then((res) => {
        this.oldList = res.data;
        // console.log('show',this.oldList)
        this.oldList = this.oldList.map((v) => {
          return { ...v, nodelist: this.getflot(v.coordinate) };
        });
        // console.log("old", this.oldList);
        this.color = "red";
        for (let item in this.oldList) {
          // console.log(this.oldList[item]);
          this.drawLine(this.oldList[item].nodelist, true);
          this.drawNode(this.oldList[item].nodelist);
        }
      });
    },

    //转换点的格式---'111|222'->'nodeX:111,nodeY:222'
    getflot(arr) {
      // str = str.substring(1);
      // str = str.substring(0, str.length - 1);
      var flotList = [];
      var list = arr;
      for (let item in list) {
        var flot = list[item].split("|");
        var node = {
          nodeX: "",
          nodeY: "",
        };
        node.nodeX = parseInt(flot[0]);
        node.nodeY = parseInt(flot[1]);
        flotList.push(node);
      }
      return flotList;
    },

    //判断点的位置
    judge(dot, coordinates, noneZeroMode) {
      // 默认启动none zero mode
      noneZeroMode = noneZeroMode || 1;
      var x = dot.x,
        y = dot.y;
      var crossNum = 0;
      // 点在线段的左侧数目
      var leftCount = 0;
      // 点在线段的右侧数目
      var rightCount = 0;
      for (var i = 0; i < coordinates.length - 1; i++) {
        var start = coordinates[i];
        var end = coordinates[i + 1];

        // 起点、终点斜率不存在的情况
        if (start.x === end.x) {
          // 因为射线向右水平，此处说明不相交
          if (x > start.x) continue;

          // 从左侧贯穿
          if (end.y > start.y && y >= start.y && y <= end.y) {
            leftCount++;
            crossNum++;
          }
          // 从右侧贯穿
          if (end.y < start.y && y >= end.y && y <= start.y) {
            rightCount++;
            crossNum++;
          }
          continue;
        }
        // 斜率存在的情况，计算斜率
        var k = (end.y - start.y) / (end.x - start.x);
        // 交点的x坐标
        var x0 = (y - start.y) / k + start.x;
        // 因为射线向右水平，此处说明不相交
        if (x > x0) continue;

        if (end.x > start.x && x0 >= start.x && x0 <= end.x) {
          crossNum++;
          if (k >= 0) leftCount++;
          else rightCount++;
        }
        if (end.x < start.x && x0 >= end.x && x0 <= start.x) {
          crossNum++;
          if (k >= 0) rightCount++;
          else leftCount++;
        }
      }

      return noneZeroMode === 1
        ? leftCount - rightCount !== 0
        : crossNum % 2 === 1;
    },

    //删除区域/线
    deleteArea() {
      if (this.color == "green") {
        this.$confirm("此操作将删除该区域/线, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          ajax("/api/frame/delete", { frameId: this.choosearea }, "Post")
            .then(() => {
              this.$message({
                type: "success",
                message: "已删除区域/线: " + this.chooseareaname,
              });
              this.clearCanvas();

              this.show();
            })
            .catch(() => {
              this.$message({
                type: "error",
                message: "删除失败",
              });
            });
        });
      } else {
        this.$message({
          type: "error",
          message: "请选择区域/线",
        });
      }
    },

    //删除前一节点
    del() {
      // console.log("node", this.nodeList);
      if (this.nodeList.length > 0) {
        this.clearCanvas();
        this.show();
        this.nodeList.pop(); // this.nodeList.splice(this.nodeList.length-1,1);

        if (this.nodeList.length > 1) {
          this.drawLine(this.nodeList, this.loop);
        }

        this.drawNode(this.nodeList);
      } else {
        this.$message({
          type: "error",
          message: "无可删除节点",
        });
      }
    },

    //添加区域/线
    add() {
      if (this.nodeList.length == 0) {
        this.$message.error("坐标不存在");
        return false;
      }
      var worldCoordinate = [];

      for (let item in this.nodeList) {
        var X = this.nodeList[item].nodeX;
        var Y = this.nodeList[item].nodeY;
        var spot = X + "|" + Y;
        worldCoordinate.push(spot);
      }

      // console.log(this.nodeList);
      // console.log(worldCoordinate);
      this.$prompt("填写区域/线名称", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(({ value }) => {
          ajax(
            "/api/frame/add",
            {
              type: 0,
              coordinate: worldCoordinate,
              taskId: this.changerow.taskId,
              frameName: value,
              cameraId: this.changerow.cameraId,
            },
            "Post"
          )
            .then(() => {
              // console.log(res);
              this.$message({
                type: "success",
                message: "新区域/线名称是: " + value,
              });
              (this.nodeList = []), this.clearCanvas();
              this.show();
            })
            .catch(() => {
              this.$message({
                type: "error",
                message: "新增失败",
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入",
          });
        });
    },

    //清空画板
    clearCanvas() {
      this.canvas.width = this.canvasWidth;
      this.canvas.height = this.canvasHeight;
    },
    
    //加点进数组
    pushNode(node) {
      //添加正常画线
      this.nodeList.push(node);
      this.drawList = JSON.parse(JSON.stringify(this.nodeList));
    },
    

    //画点
    drawNode(nodelist) {
      const cxt = this.canvas.getContext("2d");
      for (let item in nodelist) {
        cxt.beginPath();
        cxt.fillStyle = this.color;
        cxt.strokeStyle = this.color;
        cxt.arc(
          nodelist[item].nodeX,
          nodelist[item].nodeY,
          3,
          0,
          Math.PI * 2,
          true
        );
        cxt.fill();
        cxt.stroke();
      }
    },

    //画线
    drawLine(nodelist, bool) {
      const cxt = this.canvas.getContext("2d");

      if (!bool) {
        cxt.font = "20px Verdana";
        cxt.fillStyle = this.color;
        cxt.fillText(this.id, nodelist[0].nodeX, nodelist[0].nodeY);
      }
      cxt.beginPath();
      cxt.strokeStyle = this.color;
      cxt.lineWidth = 3;
      for (let item in nodelist) {
        if (item == 0) {
          cxt.moveTo(nodelist[item].nodeX, nodelist[item].nodeY);
        } else {
          cxt.lineTo(nodelist[item].nodeX, nodelist[item].nodeY);
        }
      }

      if (bool) {
        cxt.closePath();
      }
      cxt.stroke();
    },
    
    //初始化Canvas
    initCanvas() {
      this.canvas = document.getElementById("node-canvas");
      this.canvas.width = this.canvasWidth;
      this.canvas.height = this.canvasHeight;
    },

    //点击画布后的操作
    start(event) {
      //添加节点
      if (this.addNode == true) {
        this.color = "red";
        var node = {
          nodeX: "",
          nodeY: "",
        };
        node.nodeX = event.offsetX;
        node.nodeY = event.offsetY;
        this.pushNode(node);
        if (this.isLine == false) {
          this.canvas.width = this.canvasWidth;
          this.canvas.height = this.canvasHeight;
          this.show();
        }

        this.drawLine(this.drawList, this.loop);
        this.drawNode(this.drawList);

        this.addNode = false;
      }
      //选择区域
      if (this.isJudge == true) {
        var node2 = {
          x: "",
          y: "",
        };
        node2.x = event.offsetX;
        node2.y = event.offsetY;
        
        if (this.nodeList.length > 0) {
          
          this.$message.error("还有未添加的节点");
        } else {
          for (let item in this.oldList) {
            //线的选取（左右平行50）
            if (this.oldList[item].nodelist.length == 2) {
              var nodeList5 = [...this.oldList[item].nodelist];              
              var new1 = nodeList5.map((v) => {
                return { x: v.nodeX + 50, y: v.nodeY };
              });
              var new2 = nodeList5.map((v) => {
                return { x: v.nodeX - 50, y: v.nodeY };
              });
              var new3 = [];
              new3.push(new1[0]);
              new3.push(new1[1]);
              new3.push(new2[1]);
              new3.push(new2[0]);
              new3.push(new1[0]);
              // console.log("new3", new3);
              if (this.judge(node2, new3) == true) {
                // console.log("jud", item, this.judge(node2, new3));
                this.color = "green";
                this.drawLine(this.oldList[item].nodelist, true);
                this.choosearea = this.oldList[item].frameId;
                // console.log("frameid", this.choosearea);
              }
            }
            var nodeList4 = [...this.oldList[item].nodelist];
            nodeList4.push(this.oldList[item].nodelist[0]);
            nodeList4 = nodeList4.map((v) => {
              return { x: v.nodeX, y: v.nodeY };
            });
            // console.log("n2", node2);
            // console.log("n4", item, nodeList4);

            if (this.judge(node2, nodeList4) == true) {
              // console.log(item, this.judge(node2, nodeList4));
              this.color = "green";
              this.drawLine(this.oldList[item].nodelist, true);
              // console.log("cho", this.choosearea);
              this.choosearea = this.oldList[item].frameId;
              this.chooseareaname = this.oldList[item].frameName;
              // console.log("frameid", this.choosearea);
            }
          }
        }

        this.isJudge = false;
      }
    },
  },
  props: ["changerow"],
};
</script>

<style scoped>
.demo-ruleForm7 {
  position: fixed;
  top: 0;
  z-index: 300;
  background-color: aliceblue;
  left: 0;
  padding: 30px 30px 10px 30px;
  margin: 3% 25%;
  border-radius: 2%;
}
</style>