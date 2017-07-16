export default class Team {
  constructor (name, id) {
    this.name = name;
    this.id = id;

    this.points = this.wins = this.draws = this.defeats = this.startPosition = this.scoreDiff = 0;
  };

  calculateScoreDiff (diff) {
    this.scoreDiff += diff;
  };

  calculatePoints () {
    this.points = (this.wins * 3) + (this.draws * 1);
    return this.points;
  };

  sortValue () {
    return (this.points * 1000) + this.scoreDiff;
  };

  hasBetterPosition (position) {
    return this.startPosition > position;
  };

  hasWorsePosition (position) {
    return this.startPosition < position;
  };
};
