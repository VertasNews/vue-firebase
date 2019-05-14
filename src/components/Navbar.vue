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
      <v-toolbar-items>
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
    </v-toolbar>
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
