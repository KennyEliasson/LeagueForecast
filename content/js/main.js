var forecastApp = angular.module("forecastApp", ['ngRoute']);

forecastApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/pl', {
        templateUrl: 'pl.html',
        controller: 'PremierLeagueController'
      }).
      when('/', {
        templateUrl: 'chooseleague.html',
        controller: 'StartController'
      }).
	  otherwise({
        redirectTo: '/'
      });
	  
}]);

forecastApp.controller("StartController", ['$scope', '$location', function ($scope, $location) {

}]);


forecastApp.controller("PremierLeagueController", ['$scope', '$http', '$route', function ($scope, $http, $route) {


	var league;
	
	$scope.$on('$routeChangeSuccess', function() {
	
		league = new League("Premier League");
		$scope.teams = league.teams;
		
	});
	
	$scope.showFixtures = function(team) {
		
		var fixtures = [];
		console.log(league);
		for(var i = 0;i<league.fixtures.length;i++) {
			if(league.fixtures[i].teamPlaying(team)) {
				fixtures.push(league.fixtures[i]);
			}
		}
		
		$scope.fixtures = fixtures;
		var viewFixtures = true;	
	};
	
}]);


var Fixture = function(home, away) {
 this.home = home;
 this.away = away;
 this.predicted = false;
 this.homeScore = '';
 this.awayScore = '';
}

Fixture.prototype.teamPlaying = function(team){
	return team === this.home.id || team === this.away.id;
};

Fixture.prototype.calculate = function(){
	console.log('running!');
	
	if(this.homeScore > this.awayScore) {
		this.home.wins++;
		this.away.defeats++;
	} else if(this.homeScore < this.awayScore) {
		this.home.defeats++;
		this.away.wins++;
	} else {
		this.home.draws++;
		this.away.draws++;
	}
	
	console.log(this.home);
	
};

var Team = function(name, id) {
	this.name = name;
	this.id = id;
	this.points = 0;
	this.wins = 0;
	this.draws = 0;
	this.defeats = 0;
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


