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
          <router-link tag="li" to="/leagues/pl/2017-18"><a>Premier League</a></router-link>
          <router-link tag="li" to="/leagues/pl/2015-16"><a>Premier League</a></router-link>
          <router-link tag="li" to="/leagues/allsvenskan/17-18"><a>Allsvenskan</a></router-link>
          <li class="dropdown">
            <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Dropdown <span class="caret"></span></a>
            <ul class="dropdown-menu">
              <li><a href="#">Action</a></li>
              <li><a href="#">Another action</a></li>
              <li><a href="#">Something else here</a></li>
              <li role="separator" class="divider"></li>
              <li><a href="#">Separated link</a></li>
              <li role="separator" class="divider"></li>
              <li><a href="#">One more separated link</a></li>
            </ul>
          </li>
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
