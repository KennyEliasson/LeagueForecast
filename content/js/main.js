var forecastApp = angular.module("forecastApp", ['ui.router']);

forecastApp.config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
  
	$urlRouterProvider.otherwise("/");
	$stateProvider
    .state('league', {
      url: "/league/:leagueName",
      templateUrl: "pl.html",
	  controller: 'PremierLeagueController'
    }).state('league.team', {
      url: "/team/:team/:teamId",
      templateUrl: "fixtures.html",
      controller: 'FixtureController'
    }).state('index', {
      url: "/",
      templateUrl: "chooseleague.html",
      controller: 'StartController'
    });
  
}]);

forecastApp.controller("StartController", ['$scope', '$location', function ($scope, $location) {
	console.log('hej');
}]);


forecastApp.controller("FixtureController",  ['$scope', '$http', '$stateParams', function ($scope, $http, $stateParams) {
	
	var teamId = $stateParams.teamId;
	
	var fixtures = [];
	for(var i = 0;i<league.fixtures.length;i++) {
		if(league.fixtures[i].teamPlaying(teamId)) {
			fixtures.push(league.fixtures[i]);
		}
	}
	
	$scope.fixtures = fixtures;
}]);

forecastApp.controller("PremierLeagueController", ['$scope', '$http', function ($scope, $http) {

	league = new League("Premier League");
	$scope.teams = league.teams;
	$scope.fixtures = league.fixtures;
	
	$scope.points = function(team){
		return team.points;
	}
}]);


var Fixture = function(home, away) {
 this.home = home;
 this.away = away;
 this.predicted = false;
 this.homeScore = '';
 this.awayScore = '';
 
 this.scoreState = 0;
}

Fixture.prototype.teamPlaying = function(team){
	var teamId = team;
	if(team.id) {
		teamId = team.id;
	}
	
	return teamId == this.home.id || teamId == this.away.id;
};

Fixture.prototype.calculate = function(){
	
	//Simpel kod? :)
	if(this.scoreState == 1) {
		this.home.wins--;
		this.away.defeats--;
	} else if(this.scoreState == 2) {
		this.home.defeats--;
		this.away.wins--;
	} else if(this.scoreState == "X") {
		this.home.draws--;
		this.away.draws--;
	}
	
	if(this.homeScore > this.awayScore) {
		this.home.wins++;
		this.away.defeats++;
		this.scoreState = 1;
	} else if(this.homeScore < this.awayScore) {
		this.home.defeats++;
		this.away.wins++;
		this.scoreState = 2;
	} else {
		this.home.draws++;
		this.away.draws++;
		this.scoreState = 'X';
	}
	
	this.home.calculatePoints();
	this.away.calculatePoints();
};

var Team = function(name, id) {
	this.name = name;
	this.id = id;
	this.points = 0;
	this.wins = 0;
	this.draws = 0;
	this.defeats = 0;
	
	this.calculatePoints = function(){
		this.points = (this.wins*3)+(this.draws*1);
		return this.points;
	};
}

var League = function(name) {
	this.name = name;
	
	this.teams = [
		new Team("Tottenham", 1),
		new Team("Arsenal", 2),
		new Team("Liverpool", 3),
		new Team("Manchester Utd", 4)
	];
	
	this.fixtures = [
		new Fixture(this.teams[0], this.teams[1]),
		new Fixture(this.teams[0], this.teams[2]),
		new Fixture(this.teams[0], this.teams[3]),
		new Fixture(this.teams[1], this.teams[2]),
		new Fixture(this.teams[1], this.teams[3]),
		new Fixture(this.teams[2], this.teams[3])
	];
 
	
};


