<template>
  <div id="app">
    <Navbar :key="$route.fullPath"/>
    <div class="container">
      <router-view/>
    </div>
  </div>
</template>

<script>
import Navbar from './components/Navbar';
// import NewUser from './components/NewUser';

export default {
  name: 'app',
  components: {
    Navbar
    // NewUser
  }
};
</script>

<style>
nav {
  margin-bottom: 10px;
}
</style>
