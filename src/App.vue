<template>
  <div id="app">
    <Navbar />
    <div class="container">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar';
export default {
  components: {Navbar},
  name: 'app'
};
</script>

<style>
#app {
  margin-top: 60px;
}
</style>
