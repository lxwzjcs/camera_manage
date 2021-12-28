<template>
  <div id="app" v-cloak>
    <Header v-if="this.$store.state.islogin" />
    <Fixed v-if="this.$store.state.islogin" />
    <Login v-if="!this.$store.state.islogin" />
    <router-view v-if="this.$store.state.islogin"></router-view>
  </div>
</template>

<script>
import Fixed from "./components/Fixed.vue";
import Login from "./components/Login.vue";
import Header from "./components/Header.vue";
// import ajax from './utils/ajax'

export default {
  name: "App",

  components: {
    Fixed,
    Login,
    Header,
  },
  // created(){
  //   ajax('http://localhost:3000/personalized',{limit:2}).then(res=>{
  //     console.log(res)
  //   })

  // },
};
</script>

<style>
[v-cloak] {
  display: none;
}
</style>