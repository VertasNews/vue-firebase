<template>
    <div id="view-user">
      <ul class="collection with-header">
          <li class="collection-header"><h4>{{first_name}} {{last_name}} </h4></li>
          <li class="collection-item">User ID: {{user_id}} </li>
          <li class="collection-item">Email: {{email}} </li>
      </ul>
      <router-link to="/" class="btn grey">Back</router-link>
      <button @click="deleteUser" class="btn red">Delete</button>
      <div class="fixed-action-btn">
        <router-link v-bind:to="{name: 'edit-user', 
        params: {user_id: user_id}}" 
        class="btn-floating btn-large blue">
          <i class="fa fa-pencil"></i>
        </router-link>
      </div>
    </div>
</template>

<script>
import db from './firebaseInit';
export default {
  name: 'view-user',
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
    deleteUser() {
      if (confirm('You sure?')) {
        db.collection('users')
          .where('user_id', '==', this.$route.params.user_id)
          .get()
          .then(querySnapshot => {
            querySnapshot.forEach(doc => {
              doc.ref.delete();
              this.$router.push('/');
            });
          });
      }
    }
  }
};
</script>
