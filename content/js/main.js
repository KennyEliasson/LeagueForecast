var forecastApp = angular.module("forecastApp", ['ui.router', 'ui-rangeSlider']);

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



forecastApp.filter('kny', function(){
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
	var teamId = $stateParams.teamId;
	
	var fixtures = [];
	for(var i = 0;i<league.fixtures.length;i++) {
		if(league.fixtures[i].teamPlaying(teamId)) {
			fixtures.push(league.fixtures[i]);
		}
	}
	
	$scope.dateRange = {
		startDate: +league.startDate, //To Epoch
		max: league.seasonLengthInDays,
		from: 0,
		to: league.seasonLengthInDays
	};
	
	$scope.fixtures = fixtures;
	
	$scope.visibleFixtures = function(){
		console.log('hello');
		return $scope.fixtures.filter(function(n){
			return n.visible;
		});
	};
	
	$scope.$watch("dateRange.from + dateRange.to", function() {
		for(var i = 0;i<$scope.fixtures.length;i++) {
			var fixture = $scope.fixtures[i];
			
			var start = league.startDate.addDays($scope.dateRange.from);
			var end = league.startDate.addDays($scope.dateRange.to);
			
			fixture.visible = fixture.isPlayedBetween(start, end);
		}
	});
	
	
}]);

forecastApp.controller("PremierLeagueController", ['$scope', '$http', function ($scope, $http) {

	league = new League("Premier League");
	$scope.teams = league.teams;
	$scope.fixtures = league.fixtures;
	
	$scope.points = function(team){
		return team.sortValue();
	}
}]);


var Fixture = function(home, away, date) {

 this.date = date;
 this.home = home;
 this.away = away;
 this.homeScore = '';
 this.awayScore = '';
 this.visible = true;
 
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
 
 this.teamPlaying = function(team){
	var teamId = team;
	if(team.id) {
		teamId = team.id;
	}
	
	return teamId == this.home.id || teamId == this.away.id;
 };
 
 this.calculate = function(){
	
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
	
	this.teams = [
		new Team("Tottenham", 1),
		new Team("Arsenal", 2),
		new Team("Liverpool", 3),
		new Team("Manchester Utd", 4)
	];
	
	this.fixtures = [
		new Fixture(this.teams[0], this.teams[1], new Date(2013,12,11)),
		new Fixture(this.teams[0], this.teams[2], new Date(2014,2,9)),
		new Fixture(this.teams[0], this.teams[3], new Date(2013,10,21)),
		new Fixture(this.teams[1], this.teams[2], new Date(2014,3,24)),
		new Fixture(this.teams[1], this.teams[3], new Date(2013,2,19)),
		new Fixture(this.teams[2], this.teams[3], new Date(2013,11,30))
	];
};


Date.prototype.daysTo = function(endDate) {
	var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
	var diffDays = Math.round(Math.abs((this.getTime() - endDate.getTime())/(oneDay)));
	return diffDays;
};

Date.prototype.addDays = function(days)
{
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
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
