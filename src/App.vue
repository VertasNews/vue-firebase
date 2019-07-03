<template>
  <v-app>
    <Navbar :key="$route.fullPath" />
    <div class="contain">
      <router-view />
    </div>
  </v-app>
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
.contain {
  background: white;
  margin: 0;
  padding-top: 50px;
}
</style>
