<template>
  <div id="login">
    <div class="container">
      <div class="row">
        <div class="col s12 m8 offset-m2">
          <div class="login card-panel grey white-text center">
            <h3>Login</h3>
            <div action="index.html">
              <div class="input-field">
                <i class="material-icons prefix">email</i>
                <input
                  type="email"
                  id="email"
                  @click="autofill()"
                  v-model="email"
                />
                <label class="white-text" for="email">Email Address</label>
              </div>
              <div class="input-field">
                <i class="material-icons prefix">lock</i>
                <input type="password" id="password" v-model="password" />
                <label class="white-text" for="password">Password</label>
              </div>
              <v-btn color="grey" @click="$router.go(-1)" class="black-text">
                Continue as guest
              </v-btn>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/auth';

export default {
  name: 'Login',
  data: function() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    login: function(e) {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(
          () => {
            this.$router.go('-1');
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
        .signInWithPopup(provider) // eslint-disable-next-line
        .then(result => {
          this.$router.go('-1');
        })
        .catch(error => {
          // Account exists with different credential. To recover both accounts
          // have to be linked but the user must prove ownership of the original
          // account.
          if (error.code == 'auth/account-exists-with-different-credential') {
            var existingEmail = error.email;
            var pendingCred = error.credential;
            // Lookup existing account’s provider ID.
            return firebase
              .auth()
              .fetchSignInMethodsForEmail(existingEmail)
              .then(providers => {
                if (providers[0] === 'password') {
                  // Password account already exists with the same email.
                  // Ask user to provide password associated with that account.
                  var password = window.prompt(
                    'Please provide the password for ' + existingEmail
                  );
                  return firebase
                    .auth()
                    .signInWithEmailAndPassword(existingEmail, password);
                } else if (providers.indexOf('google.com') != -1) {
                  console.log(existingEmail);
                  var googProvider = new firebase.auth.GoogleAuthProvider();
                  // Sign in user to Google with same account.
                  googProvider.setCustomParameters({
                    login_hint: existingEmail
                  });
                  return firebase
                    .auth()
                    .signInWithPopup(googProvider)
                    .then(function(result) {
                      return result.user;
                    });
                }
              })
              .then(user => {
                // Existing email/password or Google user signed in.
                // Link Facebook OAuth credential to existing account.
                return user.linkWithCredential(pendingCred);
              });
          }
          throw error;
        });
    }
  }
};
</script>
