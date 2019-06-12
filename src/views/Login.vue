<template>
  <div id="login">
    <div class="container">
      <div class="row">
        <div class="col s12 m8 offset-m2">
          <div class="login card-panel blue white-text center">
            <h3>Login</h3>
            <form action="index.html">
              <div class="input-field">
                <i class="material-icons prefix">email</i>
                <input type="email" id="email" v-model="email" />
                <label class="white-text" for="email">Email Address</label>
              </div>
              <div class="input-field">
                <i class="material-icons prefix">lock</i>
                <input type="password" id="password" v-model="password" />
                <label class="white-text" for="password">Password</label>
              </div>
              <v-btn color="grey"
                ><router-link to="/" class="black--text"
                  >Continue as guest</router-link
                ></v-btn
              >
              <v-btn color="white" @click="login">Login</v-btn>
              <p>
                <br />or Login with <br />
                <button @click="socialLogin('g')">
                  Google <i class="fab fa-google"></i>
                </button>
                <br />
                <button @click="socialLogin('f')">
                  Facebook <i class="fab fa-facebook"></i>
                </button>
              </p>
              <p>
                New to Vertas?
                <router-link
                  to="/register"
                  class="black--text font-weight-medium"
                  >Register</router-link
                >
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase';

export default {
  name: 'Login',
  data: function() {
    return {
      email: null,
      password: null
    };
  },
  methods: {
    login: function(e) {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(
          () => {
            this.$router.push('/');
          },
          err => {
            alert(err.message);
          }
        );
      e.preventDefault();
    },
    socialLogin: function(key) {
      var provider;
      switch (key) {
        case 'g':
          provider = new firebase.auth.GoogleAuthProvider();
          break;
        case 'f':
          provider = new firebase.auth.FacebookAuthProvider();
          break;
        default:
          break;
      }

      firebase
        .auth()
        .signInWithPopup(provider)
        .then(result => {
          this.$router.push('/');
        })
        .catch(err => {
          alert('Oops. ' + err.message);
        });
    }
  }
};
</script>
