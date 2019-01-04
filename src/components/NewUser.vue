<template>
    <div id="new-user">
        <h3>New User</h3>
        <div class="row">
          <form @submit.prevent="saveUser" class="col s12">
            <div class="row">
              <div class="input-field col s12">
                <input type="text" v-model="user_id" required>
                <label class="active">User ID</label>
              </div>
            </div>
            <div class="row">
              <div class="input-field col s12">
                <input type="text" v-model="first_name" required>
                <label class="active">First Name</label>
              </div>
            </div>
            <div class="row">
              <div class="input-field col s12">
                <input type="text" v-model="last_name" required>
                <label class="active">Last Name</label>
              </div>
            </div>
            <div class="row">
              <div class="input-field col s12">
                <input type="text" v-model="email" required>
                <label class="active">Email</label>
              </div>
            </div>
            <button type="submit" class="btn">Submit</button>
            <router-link to="/" class="btn grey">Cancel</router-link>
          </form>
        </div>
    </div>
</template>

<script>
import db from './firebaseInit';
export default {
  name: 'new-user',
  data() {
    return {
      user_id: null,
      first_name: null,
      last_name: null,
      email: null
    };
  },
  methods: {
    saveUser() {
      db.collection('users')
        .add({
          user_id: this.user_id,
          email: this.email,
          first_name: this.first_name,
          last_name: this.last_name
        })
        // eslint-disable-next-line
        .then(docRef => this.$router.push('/'))
        .catch(error => console.log(error));
    }
  }
};
</script>
