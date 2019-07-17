<template>
  <div id="login">
    <div class="container">
      <div class="row">
        <div class="col s12 m8 xl6 offset-m2 offset-xl3">
          <div class="login card-panel black-text center">
            <h3>Log In</h3>
            <div action="index.html">
              <div class="input-field">
                <i class="material-icons prefix">email</i>
                <input type="email" id="email" v-model="email" />
                <label for="email">Email Address</label>
              </div>
              <div class="input-field">
                <i class="material-icons prefix">lock</i>
                <input type="password" id="password" v-model="password" />
                <label for="password">Password</label>
              </div>
              <v-btn color="success" outline @click="$router.push('/')">
                Continue as guest
              </v-btn>
              <v-btn color="white" @click="login">LOG IN</v-btn>
              <p>
                <br />or Log in with <br />
                <button @click="socialLogin('g')">
                  Google <v-icon small> fab fa-google </v-icon>
                </button>
                <br />
                <button @click="socialLogin('f')">
                  Facebook <v-icon small> fab fa-facebook </v-icon>
                </button>
              </p>
              <p>
                New to Vertas?
                <router-link to="/register" class="green--text font-weight-bold"
                  >Sign Up</router-link
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
        .signInWithPopup(provider)
        .then(() => {
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
                    .signInWithEmailAndPassword(existingEmail, password)
                    .then(() => {
                      this.$router.go('-1');
                    });
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

<style>
.input-field .prefix.active {
  color: #4caf50;
}
.login {
  border: 1px solid green;
  background: #fffff9;
}
input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 1000px #fffff9 inset !important;
  box-shadow: 0 0 0 1000px #fffff9 inset !important;
}
input[type='email']:not(.browser-default):focus:not([readonly]) {
  border-bottom: 1px solid #4caf50;
  -webkit-box-shadow: 0 1px 0 0 #4caf50;
  box-shadow: 0 1px 0 0 #4caf50;
}
input[type='email']:not(.browser-default):focus:not([readonly]) + label {
  color: #4caf50;
}
input[type='password']:not(.browser-default):focus:not([readonly]) {
  border-bottom: 1px solid #4caf50;
  -webkit-box-shadow: 0 1px 0 0 #4caf50;
  box-shadow: 0 1px 0 0 #4caf50;
}
input[type='password']:not(.browser-default):focus:not([readonly]) + label {
  color: #4caf50;
}
</style>
