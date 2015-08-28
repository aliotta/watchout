// start slingin' some d3 here.

// Scoreboard 
var scoreboard = d3.select(".scoreboard")
  .style({"border": "1px solid black", "border-radius": "5px", "float": "right", "clear" :"right", "padding": "10px"})
d3.select("body")
  .selectAll("span")
  .data([10,20,26])
  .style({"color" : "red"});

// Gameboard
var gameboard = d3.select("body")
  .append("svg")
  .style("width", "900")
  .style("height", "900")
  .style("background-color", "lightgray");

// Asteroid placement function
var placeAsteroids = function(num){
  var output = [];
  var xCord;
  var yCord;
  var radius;
  for (var i = 0; i < num; i++) {
    xCord = Math.random()*900;
    yCord = Math.random()*900;
    radius = Math.random()*(30 - 10 +1)+10;
    output.push({"xCord":xCord, "yCord" : yCord, "radius":radius});
  };
  return output;
}
// Initialize asteroids on board
var asteroids = placeAsteroids(2);

// Append asteroids to the DOM
var asteroid = d3.select("svg")
  .selectAll("circle")
  .data(asteroids)
  .enter()
  .append("circle")
  .classed("asteroid", true)
  .attr("cx", function (d) {return d.xCord})
  .attr("cy", function (d) {return d.yCord})
  .attr("r", function (d) {return d.radius})
  .attr("stroke", "maroon")
  .attr("stroke-width", "4")
  .attr("fill", "grey");

// Add player to the DOM
var player = d3.select("svg")
  .append("circle")
  .classed("player", true)
  .attr("cx", "450")
  .attr("cy", "450")
  .attr("r", "20")
  .attr("stroke", "pink")
  .attr("stroke-width", "4")
  .attr("fill", "purple");

d3.select(".player").on("mousedown", function(){
  var coords = d3.mouse(this);
  console.log(coords);
});

// Generate new asteroid trajectory
placeAsteroids.transition = function () {
  vertMove = Math.random() * 900 + 1;
  horizMove = Math.random() * 900 + 1;
  return [''+horizMove, ''+vertMove];
}

// Timeout for sending asteroids to new locations
placeAsteroids.callTransition = function () {
  d3.select("svg")
  .selectAll(".asteroid")
  .transition()
  .attr("cx", function (d){return placeAsteroids.transition()[0]})
  .attr("cy", function (d){return placeAsteroids.transition()[1]})
  .duration(1500);

  setTimeout(this.callTransition.bind(this), 1500);
}

// Initialize asteroid movement
placeAsteroids.callTransition();
