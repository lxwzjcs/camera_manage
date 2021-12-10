<template>

<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
  <el-form-item label="任务类别" prop="taskType">
    <el-select v-model="ruleForm.taskType" placeholder="请选择任务类别">
      <el-option :label="item" :value="item" v-for="item in type" :key="item"></el-option>
      
    </el-select>
  </el-form-item>
  <el-form-item label="显卡号" prop="gpuId">
    <el-select v-model="ruleForm.gpuId" placeholder="请选择显卡号">
      <el-option :label="item" :value="item" v-for="item in gpu" :key="item"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="摄像头" prop="mission_camera">
     <el-cascader
    :options="options"
    :props="props"
    clearable
    v-model="ruleForm.mission_camera"></el-cascader>
  </el-form-item>
  <el-form-item label="摄像头号">
    <el-input v-model="cameraId" disabled></el-input>
  </el-form-item>
  <el-form-item label="采样间隔" prop="dropFrameInterval">
    <el-select v-model="ruleForm.dropFrameInterval" placeholder="请选择采样间隔">
      <el-option :label="item" :value="item" v-for="item in dropFrameInterval" :key="item"></el-option>
      </el-select>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
    <el-button @click="resetForm('ruleForm')">重置</el-button>
  </el-form-item>
</el-form>
</template>
<script>
import ajax from '../utils/ajax'
  export default {
    data() {
      return {
        type:['aaa','bbb','ccc'],
        gpu:['111','222','333','444'],
        dropFrameInterval:['5','10','15','20'],
        ruleForm: {
          taskType:'',
          cameraId:'',
          gpuId:'',
          mission_camera:{},
          dropFrameInterval:'',
        },
        rules: {
          taskType: [
            { required: true },
          ],
          gpuId: [
            { required: true }
          ],
         
          mission_camera:[
            { required: true, message: '请选择组别', trigger: 'blur' }
          ],

          dropFrameInterval:[
            { required: true }
          ]
          
          
        },
        props: { multiple: true },
        options: [
          {
            cameraGroupId:'实验室1',
            cameraGroupName:'实验室1',
              cameraList:[
                {cameraId:'摄像头1',cameraName:'摄像头1'},
                {cameraId:'摄像头2',cameraName:'摄像头2'}
              ],
            
          },
           
        {
          cameraGroupId:'机房1',
          cameraGroupName:'机房1',
          cameraList:[
            {cameraId:'机位1',cameraName:'机位1'},
            {cameraId:'机位2',cameraName:'机位2'}
          ]
        },
        {
          cameraGroupId:'机房2',
          cameraGroupName:'机房2',
          cameraList:[
            {cameraId:'机位3',cameraName:'机位3'},
            {cameraId:'机位4',cameraName:'机位4'}
          ]
        }],
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {

            this.ruleForm.cameraId = this.cameraId.split(',')
            console.log(this.ruleForm.cameraId)
            ajax('/api/task/add',this.ruleForm,'Post').then(res=>{
            //   if(res.status==200){
            //     alert('submit!');
            // console.log(this.ruleForm)
            
            // this.$emit("changeTable")
            //   }else{alert('添加失败')}
            console.log(res)
              alert('submit!');
            console.log(this.ruleForm)
            
            this.$emit("changeTable")
            }).catch(err=>{
              alert(err.response.data.message)
            })
            
            
            
            
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    },
    computed:{
      cameraId:{
        get:function(){
          const newid = []
        for(let i=0;i<this.ruleForm.mission_camera.length;i++){
          
          newid.push(this.ruleForm.mission_camera[i][this.ruleForm.mission_camera[i].length-1])
        }
        
        return newid.toString()
        },
        
        }
        
      
    },
    created(){
      //接口请求摄像头组
      ajax('/api/cameragroup/getlist').then(res=>{
        console.log(res)
        console.log('qian',this.options)
        this.options = res.data
        this.options = this.options.map(v=>{return {value: v.cameraGroupId,label:v.cameraGroupName,children: v.cameraList}})
        this.options = this.options.map(v=> { v.children = v.children.map(x=>{return {value: x.cameraId,label: x.cameraName}})
        return v})
        
        console.log('hou',this.options)
      })

      //接口请求任务类型和显卡号
    },
  }
</script>

<style>
.demo-ruleForm{
    position: fixed;
    top: 15vh;
    z-index: 300;
    background-color: aliceblue;
    left: 0;
    padding: 50px 50px 50px 50px;
    
    border-radius: 2%;
}

</style>