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
var placePolarBears = function(num){
  var output = [];
  var xCord;
  var yCord;
  var heightWidth;
  for (var i = 0; i < num; i++) {
    xCord = Math.random()*900;
    yCord = Math.random()*900;
    heightWidth = Math.random()*(30 - 10 +1)+10;
    output.push({"xCord":xCord, "yCord" : yCord, "heightWidth":heightWidth});
  };
  return output;
}
// Initialize asteroids on board
var polarBears = placePolarBears(15);

// Append asteroids to the DOM
d3.select("svg")
  .selectAll("imgage")
  .data(polarBears)
  .enter()
  .append("svg:image")
  .classed("pbear", true)
  .attr("x", function (d) {return d.xCord})
  .attr("y", function (d) {return d.yCord})
  .attr("height", function (d) {return d.heightWidth})
  .attr("width", function (d) {return d.heightWidth})
  .attr("collision", "false")
  .attr("xlink:href", "PBear.png");

// Add player to the DOM
var player = d3.select("svg")
  .append("svg:image")
  .classed("player", true)
  .attr("x", "450")
  .attr("y", "450")
  .attr("r", "20")
  .attr("collision", "false")
  .attr("height", "60")
  .attr("width", "60")
  .attr("xlink:href", "penguin.png")
  // .attr("background-imgage", "xlink:href", "http://rlv.zcache.com/penguin_face_birthday_party_invitation-r8338e73e5dae4a2abad360fee79f2f49_zk91c_512.jpg?rlvnet=1")



// var player = d3.select("svg")


// <svg width="640" height="480" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
//  <g>
//   <title>Layer 1</title>
//   <image xlink:href="http://rlv.zcache.com/penguin_face_birthday_party_invitation-r8338e73e5dae4a2abad360fee79f2f49_zk91c_512.jpg?rlvnet=1" id="svg_1" height="438" width="455" y="29" x="82"/>
//  </g>
// </svg>

// Function to direct movement of player
var playerCycle = function (coords) {
  var svg = d3.select("svg")[0][0];
  var coords = d3.mouse(svg);
  d3.select("svg")
  .selectAll(".player")
  .attr("x", function (d){return coords[0]-30})
  .attr("y", function (d){return coords[1]-30});
  // distanceFromAsteroids();
  setTimeout(this.playerCycle.bind(this), 350);
}

d3.select("svg").on("mousemove", function (){
  playerCycle();
});

// Generate new asteroid trajectory
placePolarBears.transition = function () {
  vertMove = Math.random() * 900 + 1;
  horizMove = Math.random() * 900 + 1;
  return [''+horizMove, ''+vertMove];
}

// Timeout for sending asteroids to new locations
placePolarBears.polarBearCycle = function () {
  d3.select("svg")
  .selectAll(".pbear")
  .transition()
  .attr("x", function (d){return placePolarBears.transition()[0]})
  .attr("y", function (d){return placePolarBears.transition()[1]})
  .duration(1500);

  setTimeout(this.polarBearCycle.bind(this), 1500);
}

// Initialize asteroid movement
placePolarBears.polarBearCycle();

// Define counters
var collisionCount = 0;
var scoreCount = 0;
var millisecondCount = 0;
var highScore = 0;

// Collision event handler
var distanceFromBears = function(){
  // defining variables to use when calculating distance
  var polarBearX;
  var polarBearY;
  var polarBearR;
  var polarBears = d3.selectAll('.pbear')[0];
  var playerX = d3.select('.player')[0][0].x.baseVal.value;
  var playerY = d3.select('.player')[0][0].y.baseVal.value;

  // update scoreCount each second
  if (millisecondCount > 20) {
    millisecondCount = 0;
    scoreCount++;
    // updating high score
    if (scoreCount > highScore) {
      highScore = scoreCount;
    }
  }
  // iterate millisecondCount
  millisecondCount++;


  // Function using pythag to measure distance between player and each polarBear object
  var distance = function(x1, x2, y1, y2){
    return Math.sqrt((Math.abs(x2-x1) * Math.abs(x2-x1)) + (Math.abs(y2-y1) * Math.abs(y2-y1)));
  }

  for (var i = 0; i<polarBears.length; i++){ 
  // saving polarBear coordinate and size values
    polarBearX = polarBears[i].x.baseVal.value;
    polarBearY = polarBears[i].y.baseVal.value;
    // iterating collision count if player and polarBear have moved apart, adjusting scoreboard
    
    if(polarBears[i].collision === true && distance(playerX, polarBearX, playerY,polarBearY) > 40){//playerR){
      collisionCount++;
      polarBears[i].collision = false;
      
    }
    // updating collision and score data
    if (distance(playerX, polarBearX, playerY,polarBearY) < 40) {
      polarBears[i].collision = true;
      scoreCount = 0;
    }
  }
  // updating the scoreboard
  scoreboard.selectAll('span')
  .data([highScore,scoreCount, collisionCount])
  .text(function(d){return d})
}   

// Set the collision detection
setInterval(distanceFromBears, 50);
