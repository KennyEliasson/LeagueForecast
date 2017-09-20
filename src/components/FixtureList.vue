<template>
  <div class="panel panel-default">
    <div class="panel-heading">
      {{ title }}
      <button v-if="canSave" class="btn btn-xs btn-primary pull-right">Save</button>
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
            <td>
              <button class="btn btn-link" v-on:click="fixture.incrementScoreByTeam(fixture.home)">
                <strong v-if="fixture.home == selectedTeam">
                  {{fixture.home.name}}
                </strong>
                <span v-else>
                  {{fixture.home.name}}
                </span>
              </button>
            </td>
            <td>
              <button class="btn btn-xs" v-on:click="fixture.incrementScoreByTeam(fixture.home, -1)">-</button> 
              {{drawScore(fixture.homeScore)}}
              <button class="btn btn-xs" v-on:click="fixture.incrementScoreByTeam(fixture.home)">+</button>
            </td>
            <td>
              <button class="btn btn-xs" v-on:click="fixture.incrementScoreByTeam(fixture.away, -1)">-</button> 
              {{drawScore(fixture.awayScore)}}
              <button class="btn btn-xs" v-on:click="fixture.incrementScoreByTeam(fixture.away)">+</button>
            </td>
            <td>
              <button class="btn btn-link"  v-on:click="fixture.incrementScoreByTeam(fixture.away)">
                <strong v-if="fixture.away == selectedTeam">
                  {{fixture.away.name}}
                </strong>
                <span v-else>
                  {{fixture.away.name}}
                </span>
              </button>
            </td>
            <td><a v-show="fixture.changed" v-on:click="fixture.reset()" class="btn btn-xs btn-danger">X</a></td>
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
    title: String,
    selectedTeam: Object,
    canSave: Boolean
  },
  methods: {
    drawScore (score) {
      if(score === null) {
        return '-';
      }

      return score;
    }
  }
};
</script>
