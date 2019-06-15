<template>
  <v-dialog max-width="600px" v-model="dialog">
    <button id="criticApply" slot="activator">APPLY AS CRITIC!</button>
    <v-card>
      <v-card-title>
        <h5>Verify your critic status with your work email</h5>
      </v-card-title>
      <v-card-text>
        <p>
          Your email address will be encrypted and protected
        </p>
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
import firebase from 'firebase';
import db from '../fb';

export default {
  data() {
    return {
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
  font-family: Helvetica,Arial,sans-serif;
  font-size: 16px;
  font-weight: bold;
  position: relative;
  right: 30px;
  top: 12px;

}
#criticApply:hover {
  color: #438007;
}  
#criticApply:focus:active {
  background-color: transparent;
}    

</style>
