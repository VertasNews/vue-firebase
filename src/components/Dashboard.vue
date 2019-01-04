<template>
    <div id="dashboard">
        <ul class="collection with-header">
            <li class="collection-header"><h4>Users</h4>
            </li>
            <li v-for="user in users" v-bind:key="user.id" class="collection-item">
                <div class="chip">{{user.user_id}}</div>
                {{user.first_name}} {{user.last_name}}: {{user.email}}

                <router-link class="secondary-content" v-bind:to="{name: 'view-user', params: {user_id: user.user_id}}">
                    <i class="fa fa-eye"></i>
                </router-link>
            </li>
        </ul>

        <div class="fixed-action-btn">
            <router-link to="/new" class="btn-floating btn-large red">
                <i class="fa fa-plus"></i>
            </router-link>
        </div>
    </div>
</template>

<script>
import db from './firebaseInit';
export default {
  name: 'dashboard',
  data() {
    return {
      users: []
    };
  },
  created() {
    db.collection('users')
      .orderBy('user_id')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const data = {
            id: doc.id,
            user_id: doc.data().user_id,
            email: doc.data().email,
            first_name: doc.data().first_name,
            last_name: doc.data().last_name
          };
          this.users.push(data);
        });
      });
  }
};
</script>
