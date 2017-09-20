<template>
<div class="container">
  <!--<h3>{{league.name}}</h3>-->
  <div class="row">

    <div class="col-md-6">
      <div class="panel panel-default">
        <div class="panel-heading">
          {{ league.name }} {{league.season}}
        </div>
        <div class="panel-body">

          <table class="table table-condensed">
            <thead>
              <tr>
                <th>#</th>
                <th></th>
                <th></th>
                <th>W</th>
                <th>D</th>
                <th>L</th>
                <th>+/-</th>
                <th>PTS</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(team, index) in sortedTeamsByPoint">
                <td>{{index+1}}</td>
                <td><span class="label" v-bind:class="{'label-success': team.hasBetterPosition(index+1), 'label-danger': team.hasWorsePosition(index+1) }">{{team.startPosition-(index+1)}}</span></td>
                <td><button class="btn btn-link btn-sm" v-on:click="chooseTeam(team)"><strong v-if="selectedTeams.indexOf(team) >= 0">{{team.name}}</strong><span v-else>{{team.name}}</span></button></td>
                <td>{{team.wins}}</td>
                <td>{{team.draws}}</td>
                <td>{{team.defeats}}</td>
                <td>{{team.scoreDiff}}</td>
                <td>{{team.points}}</td>
              </tr>
            </tbody>
          </table>

        </div>
      </div>
    </div>

    <div class="col-md-6">
      <FixtureList :fixtures="visibleFixtures" :can-save="false" title="Selected fixtures" no-fixtures-text="Click on a team to show fixtures"></FixtureList>
      <FixtureList :fixtures="changedFixtures" :can-save="true" v-show="changedFixtures.length > 0" title="Changed fixtures" no-fixtures-text="No changed matches"></FixtureList>
    </div>

  </div>
</div>
</template>

<script>

import League from '@/League';
import FixtureList from '@/Components/FixtureList';
import axios from 'axios';

export default {
  name: 'league',
  components: {FixtureList},
  created () {
    this.loadLeague();
  },
  watch: {
    '$route': function () {
      this.loadLeague();
    }
  },
  data () {
    return {
      selectedTeams: [],
      league: { season: '', teams: [], fixtures: [] }
    };
  },
  methods: {
    loadLeague () {
      let leagueId = this.$route.params.name;
      let seasonId = this.$route.params.season;
      let shuffleId = this.$route.query.shuffle;

      this.selectedTeams.length = 0;

      Promise.all([
        axios.get('https://s3-eu-west-1.amazonaws.com/tableshuffle-prod/premierleague-' + seasonId + '-fixtures.json'),
        axios.get('https://s3-eu-west-1.amazonaws.com/tableshuffle-prod/premierleague-' + seasonId + '.json')
      ])
      .then(([fixtures, leagueData]) => {
        fixtures = fixtures.data;
        leagueData = leagueData.data;
        var league = new League(leagueId, leagueId, seasonId);
        var leagueDataTeams = leagueData;
        for(var i = 0; i < leagueDataTeams.length; i++) {
          league.addTeam(leagueDataTeams[i].name, leagueDataTeams[i].id);
        }

        for(i = 0; i < fixtures.length; i++) {
          league.addFixture(fixtures[i]);
        }

        league.setStartPositionOfTeams();

        this.league = league;

        if(shuffleId) {
          console.log('Has shuffle id');
          Promise.all([
            import('@/data/shuffles/' + shuffleId + '.json')
          ])
          .then(([shuffleData]) => {
            league.shuffle(shuffleData);
          });
        }
      });
    },
    chooseTeam (team) {
      if(this.selectedTeams.indexOf(team) >= 0) {
        this.selectedTeams.splice(this.selectedTeams.indexOf(team), 1);
      } else {
        this.selectedTeams.push(team);
      }
    }
  },
  computed: {
    changedFixtures () {
      return this.league.fixtures.filter((fixture) => {
        return fixture.changed;
      });
    },
    visibleFixtures () {
      if(this.selectedTeams == null || this.selectedTeams.length === 0) {
        return [];
      }

      if(this.selectedTeams.length === 1) {
        return this.league.fixtures.filter((fixture) => {
          return fixture.teamPlaying(this.selectedTeams[0]);
        });
      }

      return this.league.fixtures.filter((fixture) => {
        return fixture.teamsPlayingAgainstEachOther(this.selectedTeams);
      });
    },
    sortedTeamsByPoint () {
      return this.league.teams.slice(0).sort((a, b) => { return b.sortValue() - a.sortValue(); });
    }
  }
};
</script>


<<style scoped>
.btn-xs .glyphicon {
  font-size: 8px;
}

.clickable {
  cursor:pointer;
}
</style>
