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

export default {
  name: 'App',
  components: {
    Navbar
  }
};
</script>

<style>
nav {
  margin-bottom: 10px;
}
</style>
