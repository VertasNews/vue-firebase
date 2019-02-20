<template>
  <nav>
      <div class="nav-wrapper blue">
        <div class="container">
          <router-link to="/" class="brand-logo"><img class="img-responsive" src="../assets/final.png" alt="Vertas News"></router-link>    
          <!-- <a href="#" data-activates="mobile-demo" class="button-collapse"><i class="material-icons">menu</i></a> -->
          <ul class="right">
            <li v-if="isLoggedIn"><span class="email black-text">{{currentUser}}</span></li>
            <li v-if="isLoggedIn"><router-link to="/">Dashboard</router-link></li>
            <li v-if="!isLoggedIn"><router-link to="/login">Login</router-link></li>
            <li v-if="!isLoggedIn"><router-link to="/register">Register</router-link></li>
            <li v-if="isLoggedIn"><button @click="logout" class="btn black">Logout</button></li>
             
          </ul>
          <!-- <ul class="side-nav" id="mobile-demo">
            <li v-if="isLoggedIn"><router-link to="/">Dashboard</router-link></li>
            <li v-if="!isLoggedIn"><router-link to="/login">Login</router-link></li>
            <li v-if="!isLoggedIn"><router-link to="/register">Register</router-link></li>
            <li><a href="#" class="divider"></a></li>
             <li v-if="isLoggedIn"><button v-on:click="logout" class="btn">Logout</button></li>
           
          </ul> -->
        </div>
      </div>
    </nav>
  </template>

<script>
import firebase from 'firebase';
export default {
  name: 'Navbar',
  data() {
    return {
      isLoggedIn: false,
      currentUser: false
    };
  },
  created() {
    if (firebase.auth().currentUser) {
      this.isLoggedIn = true;
      this.currentUser = firebase.auth().currentUser.email;
    }
  },
  methods: {
    logout: function() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.go({ path: this.$router.path });
        });
    }
  }
};
</script>

<style scoped>
.email {
  padding-right: 10px;
}
.img-responsive {
  height: auto;
  width: auto;
  padding-top: 15px;
  max-height: 50px;
}
</style>
