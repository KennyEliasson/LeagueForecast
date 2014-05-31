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
	}).state('league.team.fixtureDates', {
      url: "/dates/:startDate",
      templateUrl: "fixtures.html",
      controller: 'FixtureControlleraa'
    
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
	console.log('just waiting');
}]);

forecastApp.controller("PremierLeagueController", ['$scope', '$http', function ($scope, $http) {

	league = new League("Premier League");
	$scope.teams = league.teams;
	$scope.fixtures = league.fixtures;
	
	$scope.points = function(team){
		return team.sortValue();
	}
	
	$scope.allSelected = true;
	
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
				fixtures.push(league.fixtures[i]);
			}
		}
		
		$scope.fixtures = fixtures;
	
	};
	
	$scope.dateRange = {
		startDate: +league.startDate, //To Epoch
		max: league.seasonLengthInDays,
		from: 0,
		to: league.seasonLengthInDays
	};
	
	$scope.visibleFixtures = function(){
		return $scope.fixtures.filter(function(n){
			return n.visible;
		});
	};
	
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
		new Fixture(this.teams[3], this.teams[2], new Date(2014,3,24)),
		new Fixture(this.teams[1], this.teams[3], new Date(2013,2,19)),
		new Fixture(this.teams[2], this.teams[3], new Date(2013,11,30))
	];
};


Date.prototype.daysTo = function(endDate) {
	var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
	var diffDays = Math.round(Math.abs((this.getTime() - endDate.getTime())/(oneDay)));
	return diffDays;
};

Date.prototype.addDays = function(days) {
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
