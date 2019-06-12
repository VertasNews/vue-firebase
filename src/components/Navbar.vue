<template>
  <nav style="height: 60px;"> <!-- So that it doesn't collide with the content"-->
    <v-toolbar flat app color="#F8F5F5" height="90px" style="border-bottom: 1px solid #707070;">
      <v-toolbar-items id="toolbar-1">

        <router-link to="/">
          <img
            class="img-responsive"
            src="../assets/final_logo.jpg"
            alt="Vertas News"
          />
        </router-link>
        <div id="search-bar"> 
          <input type="text" placeholder="Search for news, article, author.." class="search-txt" name="search">
          <a class="search-btn">
          <i class="fas fa-search"></i>
          </a>
          </div>
        <div id="about">
          <router-link to="/about">
            About VERTAS
          </router-link>
        </div>
       
       
    
      </v-toolbar-items> 
      <v-spacer> </v-spacer>
<div id="loginsignup">
        <Popup v-if="isLoggedIn && popup" />
        <button class="navbutton" v-if="!isLoggedIn"
          > <router-link to="/login"><span>Log In</span></router-link></button>
        >
        <button class="navbutton" v-if="!isLoggedIn"
          > <router-link to="/register"><span> Sign Up</span></router-link></button    
        >
    </div>
    <div id="usericon">
       <v-menu v-if="isLoggedIn"
      v-model="menu"
      :close-on-content-click="false"
      offset-x
      :nudge-bottom = "10"
      :nudge-left = "130"
      
      transition="slide-y-transition"
     
    >
      <template v-slot:activator="{ on }">
        <span style="cursor: pointer;" v-on="on">
       <v-icon color = "#438007" >
          fas fa-user
        </v-icon>
      <v-icon color = "#438007" small id="user-caret-down"> fas fa-caret-down</v-icon>
      </span>

      </template>

      <v-card min-width="100px" max-width="240px" height = "69px" >
 
        
          <div style="height: 32px; padding: 4px 4px 4px 4px">
             {{currentUser}} 
             </div>
           
           
          <v-divider></v-divider>
          <v-btn flat color="#438007" block id="logout" @click.native="logout">Log Out</v-btn> 
      </v-card>
    </v-menu>
       </div>
        
        
        <!-- -->
     
    </v-toolbar>
    
  </nav>
</template>

<script>
import db from '../fb';
import firebase from 'firebase';
import Popup from './Popup';

export default {
  name: 'Navbar',
  components: { Popup },
  data() {
    return {
      isLoggedIn: false,
      currentUser: null,
      popup: false
    };
  },
  created() {
    var user = firebase.auth().currentUser;
    if (user) {
      this.isLoggedIn = true;
      this.currentUser = user.email;
    }

    db.collection('applied')
      .doc(user.uid)
      .get()
      .then(doc => {
        if (!doc.exists) {
          this.popup = true;
        }
      })
      .catch(function(error) {
        console.log('Error getting document:', error);
      });
  },
  methods: {
    logout: function() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.push('/login');
        });
    }
  }
};
</script>

<style scoped>
#toolbar-1 {
  position: relative;
  left: 22.4%;
}
.img-responsive {
  height: auto;
  width: auto;
  max-height: 80px;
}
.v-toolbar input {
  width: 500px;
  border: 1px solid white;
  background-color: white;
  margin-top: 10px;
  margin-left: 20px;
  height: 20px;
}

#search-bar {
  background: white;
  border: 1px  black;
  height: 40px;
  margin-top: 12px;
  margin-left: 10px;
  border-radius: 5px;
}
.search-btn {
  float: right;
  width: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: 0.4s;
}
.search-txt {
  float: left;
}
.search-btn > i {
  position: relative;
  top: 7px;
  color: #707070;
  justify-content: center;
  align-items: center;
}
.navbutton {
  height: 36px;
  width: 80px;
  line-height: normal;
  background: white;
  border-radius: 5px;
  border: 1px solid #B7B1B1;
  font-family: Helvetica,Arial,sans-serif;
  font-size: 16px;
  margin-left: 5px;
}
#loginsignup {
  position: relative;
  right: 23%;
  bottom: 18px;
}
button a {
  color: #438007;
  display: inline-block;
  width: 100%;
  height: 100%;
}
button a > span {
  position: relative;
  top: 10px;
}
#about > a {
  color: black;
  font-family: Helvetica,Arial,sans-serif;
  font-size: 14px;
  position: relative;
  top: 7px;
}
#about {
  margin-left: 10px;
}
nav input:focus {
  border-bottom: none;
  -webkit-box-shadow: none;
  box-shadow: none;
}
#usericon {
  position: absolute;
  right: 23%;
  top: 10%;
}
#user-caret-down {
  position: relative;
  top: 7px;
  left: 1px;
}

#logout {
  margin: 0;
}
div > div.v-list__tile {
  padding: 0px;
}






.v-btn:hover :active {
  color: green;
}
</style>
