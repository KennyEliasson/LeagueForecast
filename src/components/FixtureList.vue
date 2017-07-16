<template>
  <div class="panel panel-default">
    <div class="panel-heading">
      {{ title }}
    </div>
    <div class="panel-body">
      <div v-show="fixtures.length < 1">
        {{ noFixturesText }}
      </div>

      <table class="table table-condensed table-striped" v-show="fixtures.length > 0">
        <thead>
        <tr>
          <th>Home</th>
          <th></th>
          <th></th>
          <th>Away</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
          <tr v-for="fixture in fixtures">
            <td><a v-on:click="fixture.incrementScoreByTeam(fixture.home)">{{fixture.home.name}}</a></td>
            <td>
              <button class="btn btn-xs" v-on:click="fixture.incrementScoreByTeam(fixture.home, -1)"><span class="glyphicon glyphicon-minus"></span></button> 
              {{fixture.homeScore}}
              <button class="btn btn-xs" v-on:click="fixture.incrementScoreByTeam(fixture.home)"><span class="glyphicon glyphicon-plus"></span></button>
            </td>
            <td>
              <button class="btn btn-xs" v-on:click="fixture.incrementScoreByTeam(fixture.away, -1)"><span class="glyphicon glyphicon-minus"></span></button> 
              {{fixture.awayScore}}
              <button class="btn btn-xs" v-on:click="fixture.incrementScoreByTeam(fixture.away)"><span class="glyphicon glyphicon-plus"></span></button>
            </td>
            <td><a v-on:click="fixture.incrementScoreByTeam(fixture.away)">{{fixture.away.name}}</a></td>
            <td><a v-show="fixture.changed" v-on:click="fixture.reset()" class="btn btn-xs btn-danger">Reset</a></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FixtureList',
  props: {
    fixtures: Array,
    noFixturesText: String,
    title: String
  }
};
</script>
