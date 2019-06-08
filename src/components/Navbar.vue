<template>
  <nav>
    <v-toolbar flat app color="blue">
      <v-toolbar-items>
        <router-link to="/">
          <img
            class="img-responsive"
            src="../assets/final.png"
            alt="Vertas News"
          />
        </router-link>
        <v-btn flat>
          <router-link to="/about">
            About us
          </router-link>
        </v-btn>
      </v-toolbar-items>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-xs-and-down">
        <Popup v-if="isLoggedIn && popup" />
        <v-btn v-if="isLoggedIn" flat>
          <router-link to="/new_article">
            Add article
          </router-link>
        </v-btn>
        <v-btn v-if="isLoggedIn" flat
          ><span class="email">{{ currentUser }}</span></v-btn
        >
        <v-btn v-if="!isLoggedIn" flat
          ><router-link to="/login">Login</router-link></v-btn
        >
        <v-btn v-if="!isLoggedIn" flat
          ><router-link to="/register">Register</router-link></v-btn
        >
        <v-btn v-if="isLoggedIn" flat @click.native="logout">Logout</v-btn>
      </v-toolbar-items>
      <v-menu class="hidden-sm-and-up">
        <v-toolbar-side-icon slot="activator"></v-toolbar-side-icon>
        <v-list>
          <v-list-tile v-if="isLoggedIn">
            <router-link to="/new_article">
              Add article
            </router-link>
          </v-list-tile>
          <v-list-tile v-if="isLoggedIn">
            <span class="email">{{ currentUser }}</span>
          </v-list-tile>
          <v-list-tile v-if="!isLoggedIn">
            <router-link to="/login">
              Login
            </router-link>
          </v-list-tile>
          <v-list-tile v-if="!isLoggedIn">
            <router-link to="/register">
              Register
            </router-link>
          </v-list-tile>
          <v-list-tile v-if="isLoggedIn">
            <v-btn @click.native="logout">Logout</v-btn>
          </v-list-tile>
        </v-list>
      </v-menu>
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
.img-responsive {
  height: auto;
  width: auto;
  padding-top: 10px;
  max-height: 50px;
}
</style>
