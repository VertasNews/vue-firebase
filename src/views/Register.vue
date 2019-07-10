<template>
  <div id="register">
    <div class="container">
      <div class="row">
        <div class="col s12 m8 xl6 offset-m2 offset-xl3">
          <div class="register card-panel black-text center">
            <h3>Register</h3>
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
              <v-btn outline color="success" @click="$router.go(-1)">
                Continue as guest
              </v-btn>
              <v-btn color="white" @click="register">Register</v-btn>
              <p>
                Already a member?
                <router-link to="/login" class="green--text font-weight-medium"
                  >Login</router-link
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
  name: 'Register',
  data: function() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    register: function(e) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(
          () => {
            this.$router.go('-1');
          },
          err => {
            alert(err.message);
          }
        );
      e.preventDefault();
    }
  }
};
</script>

<style>
.input-field .prefix.active {
  color: #4caf50;
}
.register {
  border: 1px solid green;
}
input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 1000px white inset !important;
  box-shadow: 0 0 0 1000px white inset !important;
}
input[type='email']:not(.browser-default):focus:not([readonly]){
  border-bottom: 1px solid #4caf50;
  -webkit-box-shadow: 0 1px 0 0 #4caf50;
  box-shadow: 0 1px 0 0 #4caf50;
}
input[type='email']:not(.browser-default):focus:not([readonly])+label {
  color: #4caf50;
}
input[type='password']:not(.browser-default):focus:not([readonly]){
  border-bottom: 1px solid #4caf50;
  -webkit-box-shadow: 0 1px 0 0 #4caf50;
  box-shadow: 0 1px 0 0 #4caf50;
}
input[type='password']:not(.browser-default):focus:not([readonly])+label {
  color: #4caf50;
}
</style>
