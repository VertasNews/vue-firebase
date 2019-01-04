<template>
    <div id="edit-user">
        <h3>Edit User</h3>
        <div class="row">
          <form @submit.prevent="updateUser" class="col s12">
            <div class="row">
              <div class="input-field col s12">
                <input disabled type="text" v-model="user_id" required>
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
  name: 'edit-user',
  data() {
    return {
      user_id: null,
      first_name: null,
      last_name: null,
      email: null
    };
  },
  beforeRouteEnter(to, from, next) {
    db.collection('users')
      .where('user_id', '==', to.params.user_id)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          next(vm => {
            vm.user_id = doc.data().user_id;
            vm.first_name = doc.data().first_name;
            vm.last_name = doc.data().last_name;
            vm.email = doc.data().email;
          });
        });
      });
  },
  watch: {
    $route: 'fetchData'
  },
  methods: {
    fetchData() {
      db.collection('users')
        .where('user_id', '==', this.$route.params.user_id)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            this.user_id = doc.data().user_id;
            this.first_name = doc.data().first_name;
            this.last_name = doc.data().last_name;
            this.email = doc.data().email;
          });
        });
    },
    updateUser() {
      db.collection('users')
        .where('user_id', '==', this.$route.params.user_id)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            doc.ref
              .update({
                user_id: this.user_id,
                first_name: this.first_name,
                last_name: this.last_name,
                email: this.email
              })
              .then(() => {
                this.$router.push({
                  name: 'view-user',
                  params: { user_id: this.user_id }
                });
              });
          });
        });
    }
  }
};
</script>
