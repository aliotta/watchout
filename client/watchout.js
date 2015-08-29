// start slingin' some d3 here.

// Scoreboard 
d3.select(".scoreboard")
  .style({"border": "1px solid black", "border-radius": "5px", "float": "right", "clear" :"right", "padding": "10px"});
var scoreboard = d3.select(".scoreboard");

d3.select("body")
  .selectAll("span")
  .data([0,0,0])
  .text(function(d){ return d;})
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
var asteroids = placeAsteroids(15);

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
  .attr("fill", "purple")
  .attr("collision", "false");

// Function to direct movement of player
var playerCycle = function (coords) {
  var svg = d3.select("svg")[0][0];
  var coords = d3.mouse(svg);
  d3.select("svg")
  .selectAll(".player")
  .attr("cx", function (d){return coords[0]})
  .attr("cy", function (d){return coords[1]});
  // distanceFromAsteroids();
  setTimeout(this.playerCycle.bind(this), 350);
}

d3.select("svg").on("mousemove", function (){
  playerCycle();
});

// Generate new asteroid trajectory
placeAsteroids.transition = function () {
  vertMove = Math.random() * 900 + 1;
  horizMove = Math.random() * 900 + 1;
  return [''+horizMove, ''+vertMove];
}

// Timeout for sending asteroids to new locations
placeAsteroids.asteroidCycle = function () {
  d3.select("svg")
  .selectAll(".asteroid")
  .transition()
  .attr("cx", function (d){return placeAsteroids.transition()[0]})
  .attr("cy", function (d){return placeAsteroids.transition()[1]})
  .duration(1500);

  setTimeout(this.asteroidCycle.bind(this), 1500);
}

// Initialize asteroid movement
placeAsteroids.asteroidCycle();

// Collision instance counter
var counter = 0;

// Collision event handler
var distanceFromAsteroids = function(){
  var asteroidX;
  var asteroidY;
  var asteroidR;
  var asteroids = d3.selectAll('.asteroid')[0];
  var playerX = d3.select('.player')[0][0].cx.baseVal.value;
  var playerY = d3.select('.player')[0][0].cy.baseVal.value;
  var playerR = d3.select('.player')[0][0].r.baseVal.value;




  // Function using pythag to measure distance between player and each asteroid object
  var distance = function(x1, x2, y1, y2){
    return Math.sqrt((Math.abs(x2-x1) * Math.abs(x2-x1)) + (Math.abs(y2-y1) * Math.abs(y2-y1)));
  }


  for (var i = 0; i<asteroids.length; i++){ 
    asteroidX = asteroids[i].cx.baseVal.value;
    asteroidY = asteroids[i].cy.baseVal.value;
    asteroidR = asteroids[i].r.baseVal.value;

    if(asteroids[i].collision === true && distance(playerX, asteroidX, playerY,asteroidY) > asteroidR + playerR){
      counter++;
      asteroids[i].collision = false;
    }

    if (distance(playerX, asteroidX, playerY,asteroidY) < asteroidR + playerR) {
      asteroids[i].collision = true;
      scoreboard.selectAll('span')
      .data([0,0, counter])
      .text(function(d){return d})
    }
  }
}   

//Set the collision detection
setInterval(distanceFromAsteroids, 50);  
