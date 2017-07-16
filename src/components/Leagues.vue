<template>
  <div class="row">

    <div class="col-sm-12">

<div class="panel panel-default" v-for="league in leagues" v-bind:key="league.id">
  <!-- Default panel contents -->
  <div class="panel-heading">{{league.name}}</div>
  <div class="panel-body">
    <p>{{league.description}}</p>

    <div class="list-group">
      <router-link :to="{ name: 'League', params: { name: league.id, season: season.id }}" class="list-group-item" v-for="season in league.seasons">
        <h4 class="list-group-item-heading">{{season.name}}</h4>
        <p class="list-group-item-text">{{season.description}}</p>
      </router-link>
    </div>
  </div>
</div>
</div>
</div>

</template>

<script>

import leagues from '@/data/leagues.json';

export default {
  name: 'leagues',
  created () {

  },
  data () {
    return {
      leagues: leagues.leagues
    };
  }
};
</script>
