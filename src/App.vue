<template>
  <div id="app">
    <Header v-if="this.$store.state.islogin"/>
    <Fixed  v-if="this.$store.state.islogin"/>
    <Login v-if="!this.$store.state.islogin"/>
    <router-view v-else></router-view>
  </div>
</template>

<script>
import Fixed from "./components/Fixed.vue";
import Login from './components/Login.vue';
import Header from './components/Header.vue'
// import ajax from './utils/ajax'

export default {
  name: "App",
  
  components: {
    Fixed,
    Login,
    Header
    
  },
  // created(){
  //   ajax('http://localhost:3000/personalized',{limit:2}).then(res=>{
  //     console.log(res)
  //   })
    
    
  // },
  computed: {
    ismanager () {
      return this.$store.state.ismanager
    }
  }
};
</script>

<style>
</style>