<template>
  <nav class="navbar navbar-inverse navbar-fixed-top" role="navigation">
    <div class="container">
      <div class="navbar-header">
        <button type="button" class="navbar-toggle collapsed" v-on:click="navbar.toggle()">
          <span class="sr-only">Show menu</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <a class="navbar-brand" href="#">TableShuffle.se</a>
      </div>
      <div class="collapse navbar-collapse" v-bind:class="{ 'show': navbar.collapsed }">
        <ul class="nav navbar-nav">
          <router-link tag="li" to="/leagues"><a>Leagues</a></router-link>
          <router-link tag="li" to="/sell"><a>League</a></router-link>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import NavbarStore from '@/NavbarStore';

export default {
  name: 'navbar',
  data () {
    return {
      navbar: NavbarStore
    };
  }
};
</script>
