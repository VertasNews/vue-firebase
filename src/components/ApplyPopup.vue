<template>
  <v-dialog max-width="600px" v-model="dialog">
    <button id="criticApply" slot="activator">APPLY AS CRITIC!</button>
    <v-card>
      <v-card-title>
        <h5>Verify your critic status with your work email</h5>
      </v-card-title>
      <v-card-text>
        <v-alert :value="applied" type="warning">
          You have already applied. Submit again if you want to apply with
          another email
        </v-alert>
        <v-form ref="form">
          <v-textarea
            v-model="workEmail"
            label="Work email"
            prepend-icon="mail"
            :rules="inputRules"
          ></v-textarea>
          <v-btn flat @click="submit" class="success" :loading="loading"
            >Submit</v-btn
          >
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import db from '../fb';

export default {
  name: 'ApplyPopup',
  data() {
    return {
      applied: false,
      workEmail: '',
      inputRules: [
        v => !!v || 'This field is required',
        v => v.length >= 3 || 'Minimum length is 3 characters',
        v => /.+@.+/.test(v) || 'E-mail must be valid'
      ],
      loading: false,
      dialog: false
    };
  },
  created() {
    var userId = firebase.auth().currentUser.uid;
    db.collection('applied')
      .doc(userId)
      .get()
      .then(doc => {
        if (doc.exists) {
          this.applied = true;
        }
      })
      .catch(function(error) {
        console.log('Error getting document:', error);
      });
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        this.loading = true;
        db.collection('applied')
          .doc(firebase.auth().currentUser.uid)
          .set({
            workEmail: this.workEmail
          })
          .then(() => {
            this.applied = true;
            this.loading = false;
            this.dialog = false;
            // this.$emit('applied');
          });
      }
    }
  }
};
</script>

<style scoped>
#criticApply {
  font-family: Helvetica, Arial, sans-serif;
  font-size: 14px;
  font-weight: bold;
  color: black;
}
#criticApply:hover {
  color: #438007;
}
#criticApply:focus:active {
  background-color: transparent;
}

@media screen and (max-width: 1100px) {
  #criticApply {
    font-weight: 400;
    margin-left: 4px;
    height: 32px;
  }
}
</style>
