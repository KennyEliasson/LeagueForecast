var forecastApp = angular.module("forecastApp", ['ui.router', 'ui-rangeSlider']);

forecastApp.config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
  
	$urlRouterProvider.otherwise("/");
	$stateProvider
    .state('league', {
      url: "/league/:leagueName",
      templateUrl: "pl.html",
	  controller: 'LeagueController',
	  resolve: {
		league: function($stateParams, $http, $q){
			var deferred = $q.defer();
			
			var leagueName = $stateParams.leagueName;
		
			$http.get("content/data/" + leagueName + "/league.json").success(function(data) {
				var league = new League(data.name);
				for(var i = 0;i<data.teams.length;i++) {
					league.addTeam(data.teams[i].name, data.teams[i].id);
				}
				$http.get("content/data/" + leagueName + "/fixures.json").success(function(fixtures){
					for(var i = 0;i<fixtures.length;i++) {
						league.addFixture(fixtures[i]);
					}
					
					deferred.resolve(league);
				});
			});
			
			return deferred.promise;
		}
	  }
    }).state('league.team', {
      url: "/team/:team/:teamId",
      controller: 'FixtureController'
	}).state('index', {
      url: "/",
      templateUrl: "chooseleague.html",
      controller: 'StartController'
    });
  
}]);

forecastApp.filter('toReadableDate', function(){
	return function(input, startDate) {
		if (!(startDate instanceof Date)) {
			startDate = new Date(parseInt(startDate));
		}
		return startDate.addDays(input).toReadableDate();
	};
});

forecastApp.controller("StartController", ['$scope', '$location', function ($scope, $location) {
	
}]);

forecastApp.controller("FixtureController",  ['$scope', '$http', '$stateParams', function ($scope, $http, $stateParams) {
	$scope.setAllSelected(false);
	
	for(var i = 0;i<$scope.teams.length;i++) {
		$scope.teams[i].selected = $scope.teams[i].id == $stateParams.teamId;
	}
	
	$scope.updateFixtures();
}]);


forecastApp.controller("LeagueController", ['$scope', '$stateParams', '$http', 'league', function ($scope, $stateParams, $http, league) {

	league.calculateTable();

	$scope.teams = league.teams;
	$scope.fixtures = league.fixtures;
	$scope.dateRange = {
		startDate: +league.startDate, //To Epoch
		max: league.seasonLengthInDays,
		from: 0,
		to: league.seasonLengthInDays
	};

	$scope.points = function(team){
		return team.sortValue();
	}
	
	$scope.allSelected = false;
	$scope.setAllSelected = function(state){
		$scope.allSelected = state;
	};
	
	$scope.selectAll = function(){
		for(var i = 0;i<league.teams.length;i++) {
			league.teams[i].selected = $scope.allSelected;
		}
		
		$scope.updateFixtures();
	};
	
	$scope.updateFixtures = function() {
		
		var selectedTeams = $scope.teams.filter(function(n) { return n.selected; });
		if(!(selectedTeams == 0 || selectedTeams.length == $scope.teams.length)) {
			$scope.allSelected = false;
		}
		
		var fixtures = [];
		for(var i = 0;i<league.fixtures.length;i++) {
			if(league.fixtures[i].teamsPlaying(selectedTeams)) {
				league.fixtures[i].visible = true;
				fixtures.push(league.fixtures[i]);
			}
		}
		
		$scope.fixtures = fixtures;
	
	};
	
	$scope.hasFixtures = function() {
		for(var i = 0;i<$scope.fixtures.length;i++) {
			if($scope.fixtures[i].visible)
				return true;
		}
		
		return false;
	}
	
	$scope.filterFixturesByDate = function(){
		var start = league.startDate.addDays($scope.dateRange.from);
		var end = league.startDate.addDays($scope.dateRange.to);
		for(var i = 0;i<$scope.fixtures.length;i++) {
			var fixture = $scope.fixtures[i];
			fixture.visible = fixture.isPlayedBetween(start, end);
		}
		$scope.$apply($scope.fixtures);
	};
	
}]);


var Fixture = function(home, away, date, scores) {

	this.date = date;
	this.home = home;
	this.away = away;
	
	if(scores) {
		this.homeScore = scores[0];
		this.awayScore = scores[1];
	} else {
		this.homeScore = '';
		this.awayScore = '';
	}

	this.visible = false;
 
	this.state = {
		awayScore: 0,
		homeScore: 0,
		result: ""
	};
 
	this.scoreState = 0;
 
	this.incrementScore = function(homeTeam){
		if(homeTeam) {
			this.homeScore++;
		} else {
			this.awayScore++;
		}

		this.calculate();
	};
	
	this.teamsPlaying = function(teams){
		
		for(var i = 0;i<teams.length;i++) {
			var hit = this.teamPlaying(teams[i]);
			if(hit) return true;
		}
	};
 
	this.teamPlaying = function(team){
		var teamId = team;
		if(team.id) {
			teamId = team.id;
		}
		
		return teamId == this.home.id || teamId == this.away.id;
	};
 
	this.calculate = function(){
	
		if(!this.homeScore && !this.awayScore) {
			return;
		}
		
		//Simpel kod? :)
		if(this.state.result == 1) {
			this.home.wins--;
			this.away.defeats--;
		} else if(this.state.result == 2) {
			this.home.defeats--;
			this.away.wins--;
		} else if(this.state.result == "X") {
			this.home.draws--;
			this.away.draws--;
		}
		
		if(!this.homeScore) {
			this.homeScore = 0;
		}
		
		if(!this.awayScore) {
			this.awayScore = 0;
		}
		
		this.home.calculateScoreDiff(-(this.state.homeScore-this.state.awayScore));
		this.away.calculateScoreDiff(-(this.state.awayScore-this.state.homeScore));

		if(this.homeScore > this.awayScore) {
			this.home.wins++;
			this.away.defeats++;
			this.state.result = 1;
			this.state.homeScore = this.homeScore;
		} else if(this.homeScore < this.awayScore) {
			this.home.defeats++;
			this.away.wins++;
			this.state.result = 2;
		} else {
			this.home.draws++;
			this.away.draws++;
			this.state.result = 'X';
		}
		
		this.state.homeScore = this.homeScore;
		this.state.awayScore = this.awayScore;
		
		this.home.calculateScoreDiff(this.homeScore-this.awayScore);
		this.away.calculateScoreDiff(this.awayScore-this.homeScore);
		
		this.home.calculatePoints();
		this.away.calculatePoints();
	};
 
	this.isPlayedBetween = function(start, end) {
		if(!start) {
			return;
		}
		return this.date.between(start,end);
	};
}


var Team = function(name, id) {
	this.name = name;
	this.id = id;
	this.points = 0;
	this.wins = 0;
	this.draws = 0;
	this.defeats = 0;
	
	this.selected = false;
	
	this.scoreDiff = 0;
	
	this.calculateScoreDiff = function(diff){
		this.scoreDiff += diff;
	};
	
	this.calculatePoints = function() {
		this.points = (this.wins*3)+(this.draws*1);
		return this.points;
	};
	
	this.sortValue = function(){
		return (this.points * 1000) + this.scoreDiff;
	};
}

var League = function(name) {
	this.name = name;
	
	this.startDate = new Date(2013, 8, 7);
	var endDate = new Date(2014, 4, 23);

	
	this.seasonLengthInDays = this.startDate.daysTo(endDate);
	
	this.teamLookup = {};
	this.teams = [];
	this.fixtures = [];
	
	this.addTeam = function(name, id){
		var team = new Team(name, id);
		this.teams.push(team);
		this.teamLookup[name.replace(" ", "")] = team;
	};
	
	this.addFixture = function(fixture) {
	
		var homeTeam = this.teamLookup[fixture.home.replace(" ", "")];
		var awayTeam = this.teamLookup[fixture.away.replace(" ", "")];
		
		this.fixtures.push(new Fixture(homeTeam, awayTeam, new Date(fixture.date), [fixture.score.home, fixture.score.away]));
	};
	
	this.calculateTable = function(){
		for(var i = 0;i<this.fixtures.length;i++) {
			this.fixtures[i].calculate();
		}
	};
};


Date.prototype.daysTo = function(endDate) {
	var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
	var diffDays = Math.round(Math.abs((this.getTime() - endDate.getTime())/(oneDay)));
	return diffDays;
};

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

Date.prototype.toReadableDate = function(){
	var d = this.getDate();
    var m = this.getMonth() + 1;
    var y = this.getFullYear();
    return '' + y + '-' + (m<=9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
};

Date.prototype.between = function(start, end){
	return this.getTime() >= start.getTime() && this.getTime() <= end.getTime();
};
