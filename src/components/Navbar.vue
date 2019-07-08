<template>
  <nav>
    <div
      class="row"
      :style="{ marginLeft: marginL + 'px', width: containerWidth + 'px' }"
    >
      <div class="col m9 xl8" id="imgnSearch">
        <div id="imgSpace" class="col m2">
          <router-link to="/">
            <img class="img" src="../assets/final_logo.jpg" alt="Vertas News" />
          </router-link>
        </div>
        <div id="search-bar" class="col m10">
          <Search />
          <!-- <input
            type="text"
            :placeholder="searchText"
            class="search-txt"
            name="search"
          />
          <v-icon id="searchIcon"> fas fa-search </v-icon> -->
        </div>
      </div>
      <div id="userSpace" class="col m3 xl4">
        <div class="about col s5.5">
          <router-link to="/about">
            About Vertas
          </router-link>
        </div>
        <div id="popup" class="col s5.5">
          <ApplyPopup v-if="isLoggedIn && isDesktop()" />
        </div>
        <div v-if="!isLoggedIn && windowWidth > 1200" class="col s7">
          <div class="col s6">
            <button class="navbutton">
              <router-link to="/login"> <span> Log In </span> </router-link>
            </button>
          </div>
          <div class="col s6">
            <button class="navbutton">
              <router-link to="/register"> <span> Sign Up </span> </router-link>
            </button>
          </div>
        </div>
        <div id="hamburger" class="col s5.5">
          <v-menu
            v-if="windowWidth < 1200 && !isLoggedIn"
            :close-on-content-click="false"
            offset-x
            :nudge-bottom="15"
            :nudge-left="100"
            transition="slide-y-transition"
          >
            <template v-slot:activator="{ on }">
              <span class="hoverab" v-on="on">
                <v-icon :small="!isMobile()" color="#438007">
                  fas fa-bars
                </v-icon>
              </span>
            </template>
            <v-card min-width="100px" max-width="240px" height="73px">
              <router-link to="/login">
                <v-btn class="menuButton" flat color="#438007" block
                  >Log In</v-btn
                >
              </router-link>
              <v-divider> </v-divider>
              <router-link to="/register">
                <v-btn class="menuButton" flat color="#438007" block
                  >Sign Up</v-btn
                >
              </router-link>
            </v-card>
          </v-menu>
        </div>
        <div id="user" class="col s5.5">
          <v-menu
            v-if="isLoggedIn"
            :close-on-content-click="false"
            offset-x
            :nudge-bottom="15"
            :nudge-left="130"
            transition="slide-y-transition"
          >
            <template v-slot:activator="{ on }">
              <span class="hoverab" v-on="on">
                <v-icon color="#438007">
                  fas fa-user
                </v-icon>
                <v-icon color="#438007" small id="user-caret-down">
                  fas fa-caret-down</v-icon
                >
              </span>
            </template>
            <v-card min-width="100px" max-width="240px" :height="menuHeight">
              <div id="userEmail">
                {{ currentUser }}
              </div>
              <v-divider v-if="isLoggedIn && !isDesktop()"></v-divider>
              <ApplyPopup v-if="isLoggedIn && !isDesktop()" />
              <v-divider></v-divider>
              <v-btn
                flat
                color="#438007"
                block
                class="menuButton"
                @click.native="logout"
                >Log Out</v-btn
              >
            </v-card>
          </v-menu>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/auth';
import ApplyPopup from './ApplyPopup';
import Search from './Search';

export default {
  name: 'Navbar',
  components: {
    ApplyPopup,
    Search
  },
  data() {
    return {
      isLoggedIn: false,
      currentUser: null,
      marginL: null,
      containerWidth: null,
      windowWidth: null
    };
  },
  created() {
    var user = firebase.auth().currentUser;
    if (user) {
      this.isLoggedIn = true;
      this.currentUser = user.email;
    }
<<<<<<< HEAD
    /* db.collection('applied')
      .doc(user.uid)
      .get()
      .then(doc => {
        if (!doc.exists) {
          this.popup = true;
          console.log(this.popup)
        }
      })
      .catch(function(error) {
        console.log('Error getting document:', error);
      }); */
=======

>>>>>>> 3b2bbe62e250cd0fef60386086cbca91501476ce
    if (this.isDesktop()) this.containerWidth = 1050;
    else if (this.isLap()) this.containerWidth = 900;
    else if (this.isTablet()) this.containerWidth = 700;
    else this.containerWidth = this.windowWidth;
    this.marginL = (window.innerWidth - this.containerWidth) / 2;
  },
  computed: {
    menuHeight() {
      if (this.isDesktop()) return '69px';
<<<<<<< HEAD
      else if (this.isLap()) return '102px';
=======
      else return '102px';
>>>>>>> 3b2bbe62e250cd0fef60386086cbca91501476ce
    },
    searchText() {
      if (this.isMobile()) return 'Search function unavailable ...';
      else return 'Search function is still underconstruction ...';
    }
  },
  mounted() {
    window.addEventListener('resize', () => {
      if (this.isDesktop()) this.containerWidth = 1050;
      else if (this.isLap()) this.containerWidth = 900;
      else if (this.isTablet()) this.containerWidth = 700;
      else this.containerWidth = this.windowWidth;
      this.marginL = (this.windowWidth - this.containerWidth) / 2;
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
    },
    isLap() {
      return this.windowWidth <= 1100 && this.windowWidth > 800;
    },
    isDesktop() {
      this.windowWidth = window.innerWidth;
      return this.windowWidth > 1100;
    },
    isTablet() {
      return this.windowWidth <= 800 && this.windowWidth > 760;
    },
    isMobile() {
      return this.windowWidth <= 760;
    }
  }
};
</script>

<style scoped>
nav {
  height: 60px;
  z-index: 3;
}
a {
  width: 100%;
}
nav {
  background-color: #f8f5f5;
  font-family: Helvetica, Arial, sans-serif;
}
.hoverab {
  cursor: pointer;
}
input[type='text'] {
  border-bottom: none;
  width: 93%;
}
input[type='text']:not(.browser-default):focus:not([readonly]) {
  border-bottom: none;
  box-shadow: none;
}
#searchIcon {
  float: right;
  cursor: pointer;
}
.v-icon {
  height: 42px;
}
::placeholder {
  opacity: 0.3;
  color: black;
}
#popup {
  position: relative;
  top: 6px;
}
#user {
  position: relative;
  top: 12px;
}
#hamburger {
  position: relative;
  top: 18px;
  padding-left: 30px;
}
.img {
  max-height: 80px;
}
#userEmail {
  height: 32px;
  padding: 4px 4px 4px 4px;
}
#search-bar {
  background: white;
  border: 1px solid #b7b1b1;
  border-radius: 5px;
  height: 44px;
  margin-top: 9px;
}
.search-txt {
  color: black;
  float: left;
}
.navbutton {
  height: 36px;
  width: 80px;
  line-height: normal;
  background: white;
  border-radius: 5px;
  border: 1px solid #4caf50;
  font-size: 16px;
  margin-left: 5px;
  position: relative;
  bottom: 5px;
}
button a {
  color: #4caf50;
  display: inline-block;
  width: 100%;
  height: 100%;
}
a > span {
  position: relative;
  top: 9px;
}
.about > a {
  color: black;
  font-size: 14px;
  position: relative;
  top: 7px;
}
.about {
  padding-left: 0px;
  margin-right: 26px;
}
#user-caret-down {
  position: relative;
  top: 7px;
  left: 1px;
}
div > div.v-list__tile {
  padding: 0px;
}
button > div {
  height: 50px;
}
.menuButton {
  margin-bottom: 0px;
  margin-top: 0px;
  height: 36px;
}
@media screen and (max-width: 1200px) and (min-width: 1100px) {
  #userSpace {
    padding: 0px;
    width: 29%;
  }
  #imgnSearch {
    width: 71%;
  }
  .about {
    margin-right: 10px;
  }
  #user {
    padding: 0px;
  }
  #popup {
    padding-left: 5px;
    padding-right: 10px;
  }
}
@media screen and (max-width: 800px) {
  .about {
    margin-right: 21px;
    padding-left: 0px;
  }
  #search-bar {
    width: 75%;
  }
  #imgnSearch {
    padding-right: 0px;
  }
  #imgSpace {
    width: 23.3%;
  }
  #userSpace {
    padding: 0px;
  }
  #hamburger {
    padding-left: 30px;
  }
}
@media screen and (max-width: 760px) {
  #user {
    padding: 0px;
    width: 100%;
  }
  #hamburger {
    padding: 0px;
    width: 100%;
    top: 15px;
  }
  .about {
    display: none;
  }
  #imgnSearch {
    padding-right: 0px;
    padding-left: 0px;
    width: 92%;
  }
  #userSpace {
    padding: 0px;
    width: 8%;
  }
  #imgSpace {
    width: 18.5%;
  }
}
@media screen and (max-width: 600px) {
  input[type='text'] {
    width: 85%;
  }
  .img {
    width: 75px;
  }
  #user {
    padding-left: 20px;
  }
  #hamburger {
    padding-left: 20px;
  }
  #search-bar {
    width: 79%;
  }
  #imgnSearch {
    width: 87%;
  }
  #userSpace {
    width: 13%;
  }
  #imgSpace {
    width: 21%;
    padding-right: 0px;
  }
}
@media screen and (max-width: 490px) {
  .img {
    width: 73px;
  }
  #search-bar {
    width: 78%;
  }
  #imgnSearch {
    width: 86%;
  }
  #userSpace {
    width: 14%;
  }
  #imgSpace {
    width: 22%;
    padding-left: 2px;
  }
}
@media screen and (max-width: 440px) {
  #search-bar {
    display: none;
  }
  #user {
    width: 22%;
    padding: 0px;
  }
  #hamburger {
    width: 22%;
    padding: 0px;
  }
  #imgnSearch {
    width: 40%;
  }
  #userSpace {
    width: 60%;
    padding: 0px;
  }
  #imgSpace {
    width: 22%;
    padding-right: 0px;
    padding-left: 2px;
  }
  .about {
    display: inline-block;
    width: 78%;
    margin-right: 0px;
    padding-left: 30%;
    padding-right: 0px;
  }
  .about > a {
    font-size: 18px;
    top: 12px;
  }
}
@media screen and (max-width: 380px) {
  .about {
    padding-left: 23%;
  }
}
@media screen and (max-width: 320px) {
  .img {
    width: 73px;
  }
  .about > a {
    font-size: 16px;
  }
}
</style>
