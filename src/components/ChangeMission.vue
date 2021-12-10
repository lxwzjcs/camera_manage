<template>

<el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
    <el-form-item label="任务号" prop="taskId">
    <el-input v-model="ruleForm.taskId" disabled></el-input>
  </el-form-item>
  <el-form-item label="任务类别" prop="taskType">
    <el-select v-model="ruleForm.taskType" placeholder="请选择任务类别" disabled>
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
    v-model="mission_camera"></el-cascader>
  </el-form-item>
  <el-form-item label="摄像头号">
    <el-input v-model="cameraId" disabled></el-input>
  </el-form-item>
  
  <el-form-item>
    <el-button type="primary" @click="submitForm('ruleForm')">立即修改</el-button>
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
        ruleForm: this.changerow,
        mission_camera:[],//[['实验室1', '云台1', '摄像头1']],//请求
        
        props: { multiple: true },
        options: [
          {
            value:'实验室1',
            label:'实验室1',
            children:[{
              value:'云台1',
              label:'云台1',
              children:[
                {value:'摄像头1',label:'摄像头1'},
                {value:'摄像头2',label:'摄像头2'}
              ]
            },
            ],
          },
           
        {
          value:'机房1',
          label:'机房1',
          children:[
            {value:'机位1',label:'机位1'},
            {value:'机位2',label:'机位2'}
          ]
        },
        {
          value:'机房2',
          label:'机房2',
          children:[
            {value:'机位3',label:'机位3'},
            {value:'机位4',label:'机位4'}
          ]
        }],
      };
    },
    props: ["changerow"],
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            
            console.log(this.mission_camera)
            this.ruleForm.cameraId = this.cameraId.split(',')
            console.log(this.ruleForm)
            ajax('/api/task/update',this.ruleForm,'Post').then(res=>{
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
              console.log(err.response)
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
        // this.mission_camera = 原先摄像头
      }
    },
    computed:{
      cameraId:{
        get:function(){
          const newid = []
             if(this.mission_camera){
              for(let i=0;i<this.mission_camera.length;i++){
          
          newid.push(this.mission_camera[i][this.mission_camera[i].length-1])
        }
        
        return newid.toString()
          }else{
              return '无'
          }

        
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

      //接口请求任务类型和显卡号并且显示原摄像头组
      ajax('/api/camera/searchByTask',{taskId:this.changerow.taskId},'Post').then(res=>{
        console.log(res)
        for(let i=0;i<res.data.length;i++){
          let acamera = []
          acamera.push(res.data[i].cameraGroupId)
          acamera.push(res.data[i].cameraId)
          this.mission_camera.push(acamera)
          // this.mission_camera[i]=[res.data[i].cameraGroupId,res.data[i].cameraId]
          
        }
        // this.mission_camera = [[3,1],[6,8]]
        console.log('mission_camera',this.mission_camera)
        
      })
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
    margin-left: 40%;
    border-radius: 2%;
}

</style>