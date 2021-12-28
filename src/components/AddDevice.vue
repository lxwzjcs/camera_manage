<template>

<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
  <el-form-item label="摄像头名" prop="cameraName">
    <el-input v-model="ruleForm.cameraName"></el-input>
  </el-form-item>
  <el-form-item label="摄像头别名" prop="cameraConfigName">
    <el-input v-model="ruleForm.cameraConfigName"></el-input>
  </el-form-item>
  <el-form-item label="组别" prop="cameraGroupName">
     <el-cascader
    :options="options"
    :props="props"
    clearable
    v-model="ruleForm.cameraGroupName"></el-cascader>
  </el-form-item>
  <el-form-item label="IP地址" prop="ip">
    <el-input v-model="ruleForm.ip"></el-input>
  </el-form-item>
  <el-form-item label="rtsp" prop="rtsp">
    <el-input v-model="ruleForm.rtsp" type="textarea"></el-input>
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
          cameraName:'',
          cameraConfigName:'',
          cameraGroupName:'',
          ip:'',
          cameraGroupId:'',
          rtsp:'',
        },
        rules: {
          cameraName: [
            { required: true, message: '请输入摄像头名', trigger: 'blur' },
          ],
          cameraConfigName: [
            { required: true, message: '请输入摄像头别名', trigger: 'blur' }
          ],
          ip: [
            { required: true, message: '请输入摄像头IP', trigger: 'blur' }
          ],
          cameraGroupName:[
            { required: true, message: '请选择组别', trigger: 'blur' }
          ],
          rtsp:[
            { required: true, message: '请输入rtsp', trigger: 'blur' }
          ],
          
        },
        
        options: [{
          value: 1,
          label: '东南',
          children: [{
            value: 2,
            label: '上海',
            children: [
              { value: 3, label: '普陀' },
              { value: 4, label: '黄埔' },
              { value: 5, label: '徐汇' }
            ]
          }, {
            value: 7,
            label: '江苏',
            children: [
              { value: 8, label: '南京' },
              { value: 9, label: '苏州' },
              { value: 10, label: '无锡' }
            ]
          }, {
            value: 12,
            label: '浙江',
            children: [
              { value: 13, label: '杭州' },
              { value: 14, label: '宁波' },
              { value: 15, label: '嘉兴' }
            ]
          }]
        }, 
        {
          value: 17,
          label: '西北',
          children: [{
            value: 18,
            label: '陕西',
            children: [
              { value: 19, label: '西安' },
              { value: 20, label: '延安' }
            ]
          }, {
            value: 21,
            label: '新疆维吾尔族自治区',
            children: [
              { value: 22, label: '乌鲁木齐' },
              { value: 23, label: '克拉玛依' }
            ]
          }]
        }]
      };
    },
    created(){
      ajax('/api/cameragroup/getlist').then(res=>{
        // console.log(res)
        // console.log('qian',this.options)
        this.options = res.data
        this.options = this.options.map(v=>{return {value: v.cameraGroupId,label:v.cameraGroupName}})
        // console.log('hou',this.options)
      })
    },
    methods: {
      quit(){
            this.$emit("changeTable")
        },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            //接口传递并再次请求刷新
            this.ruleForm.cameraGroupId = this.ruleForm.cameraGroupName.toString()
            ajax('/api/camera/add',this.ruleForm,'Post').then(()=>{
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

            
            
            
          } else {
            // console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>

<style scoped>
.demo-ruleForm{
    position: fixed;
    top: 15vh;
    z-index: 300;
    background-color: aliceblue;
    left: 40%;
    padding: 50px 50px 50px 50px;
    margin-left: 0;
    border-radius: 2%;
}
.el-input{
  width: 260px;
}
.el-select{
  width: 260px;
}
</style>