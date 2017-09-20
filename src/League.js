import Team from './Team';
import Fixture from './Fixture';

export default class League {
  constructor (name, id, season) {
    this.name = name;
    this.identifier = id;
    this.season = season;

    // this.startDate = new Date(2013, 8, 7);
    // var endDate = new Date(2014, 4, 23);

    // this.seasonLengthInDays = this.startDate.daysTo(endDate);
    this.seasonLengthInDays = 80;

    this.teamLookup = {};
    this.teams = [];
    this.fixtures = [];
  };

  addTeam (name, id) {
    if(!id) {
      id = name;
    }
    var team = new Team(name, id);
    this.teams.push(team);
    this.teamLookup[name.replace(' ', '')] = team;
  };

  setStartPositionOfTeams () {
    this.calculateTable();
    var sortedTeamsByPoints = this.teams.slice(0).sort((a, b) => { return b.sortValue() - a.sortValue(); });
    for(var i = 0; i < sortedTeamsByPoints.length; i++) {
      sortedTeamsByPoints[i].startPosition = i + 1;
    }
  };

  addFixture (fixture) {
    var homeTeam = this.teamLookup[fixture.home.replace(' ', '')];
    var awayTeam = this.teamLookup[fixture.away.replace(' ', '')];

    this.fixtures.push(new Fixture(homeTeam, awayTeam, new Date(fixture.date), [fixture.score.home, fixture.score.away]));
  };

  calculateTable () {
    for(var i = 0; i < this.fixtures.length; i++) {
      this.fixtures[i].calculate();
    }
  };

  shuffle (shuffleData) {
    for(var i = 0; i < shuffleData.length; i++) {
      var currentShuffle = shuffleData[i];
      var matchingFixture = this.fixtures.find(fixture => fixture.away.name === currentShuffle.away && fixture.home.name === currentShuffle.home);
      if(!matchingFixture) {
        console.log('No match!');
        continue;
      }

      matchingFixture.setScore(currentShuffle.score.home, currentShuffle.score.away);
    }

    this.calculateTable();
  }
};
