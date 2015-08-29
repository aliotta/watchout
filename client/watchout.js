// start slingin' some d3 here.

// Scoreboard 

d3.select(".scoreboard")
  .style({"border": "1px solid black", "border-radius": "5px", "float": "right", "clear" :"right", "padding": "10px"});
var scoreboard = d3.select(".scoreboard");

d3.select("body")
  .selectAll("div")
  .style({"font-size": "26"})
  .style({"background-color": "skyblue"})
  .selectAll("span")
  .data([0,0,0])
  .text(function(d){ return d;})
  .style({"color": "red"})
  .style({"font-size": "30px"})

// Gameboard
var gameboard = d3.select("body")
  .append("svg")
  .style("width", window.innerWidth - 180)
  .style("height", window.innerHeight - 20)
  .style("border", "dashed 1px skyblue")
  .style("border-radius", "10px");

// Asteroid placement function
var placePolarBears = function(num){
  var output = [];
  var xCord;
  var yCord;
  var heightWidth;
  for (var i = 0; i < num; i++) {
    xCord = Math.random()* window.innerWidth-180;
    yCord = Math.random()* window.innerHeight;
    heightWidth = Math.random()*(100 - 60 +1)+60;
    output.push({"xCord":xCord, "yCord" : yCord, "heightWidth":heightWidth});
  };
  return output;
}
// Initialize asteroids on board
var polarBears = placePolarBears(Math.floor(window.innerWidth/75));

// Append asteroids to the DOM
d3.select("svg")
  .selectAll("image")
  .data(polarBears)
  .enter()
  .append("image")
  .classed("pbear", true)
  .attr("x", function (d) {return d.xCord})
  .attr("y", function (d) {return d.yCord})
  .attr("height", function (d) {return d.heightWidth})
  .attr("width", function (d) {return d.heightWidth})
  .attr("collision", "false")
  .attr("xlink:href", "PBear.png");

// Add player to the DOM when the mouse enters the gameboard
d3.select("svg").on("mouseenter", function() {
  if (!playerSet)  {
    var player = d3.select("svg")
      .append("image")
      .classed("player", true)
      .attr("x", "450")
      .attr("y", "450")
      .attr("r", "20")
      .attr("collision", "false")
      .attr("height", "60")
      .attr("width", "60")
      .attr("xlink:href", "penguin.png");

    // Flip the 'player has entered the play field' boolean
    playerSet = true;
    // Set the collision detection
    d3.timer(distanceFromBears, 50);
  }
})

//mouse listener to update player location
d3.select("svg").on("mousemove",function(){
  var svg = d3.select("svg")[0][0];
  var coords = d3.mouse(svg);
  d3.select(".player")
    .attr("x", function (d){return coords[0]-30})
    .attr("y", function (d){return coords[1]-30});
})


// Generate new asteroid trajectory
placePolarBears.transition = function () {
  vertMove = Math.random() * window.innerHeight - 20 + 1;
  horizMove = Math.random() * window.innerWidth-180  + 1;
  return [''+horizMove, ''+vertMove];
}

// Timeout for sending asteroids to new locations
placePolarBears.polarBearCycle = function (element) {
  d3.select("svg")
  .selectAll(".pbear")
  .transition()
  .attr("x", function (d){return placePolarBears.transition()[0]})
  .attr("y", function (d){return placePolarBears.transition()[1]})
  .duration(2500).each("end", function(){
    placePolarBears.polarBearCycle(d3.select(this))
  });
}

// Initialize asteroid movement
placePolarBears.polarBearCycle(polarBears);

// Define counters
var collisionCount = 0;
var scoreCount = 0;
var millisecondCount = 0;
var highScore = 0;
var playerSet = false;

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
  // saving polarBear coordinate and size values, adjusted for image offsets
    polarBearX = polarBears[i].x.baseVal.value;
    polarBearY = polarBears[i].y.baseVal.value;
    // iterating collision count if player and polarBear have moved apart, adjusting scoreboard
    if(polarBears[i].collision === true && distance(playerX, polarBearX, playerY,polarBearY) > polarBears[i].width.animVal.value/2 + 25){
      collisionCount++;
      polarBears[i].collision = false;
      // remove any previous audio call
      d3.selectAll("audio")
        .exit()
        .remove()
      // play audio
      d3.select("body")
        .append("embed")
        .attr("src", "bear.wav")
        .attr("autostart", "true")
        .attr("hidden", "true")
        .attr("loop", "false");
      
    }
    // updating collision and score data
    if (distance(playerX, polarBearX, playerY,polarBearY) < polarBears[i].width.animVal.value/2 + 25) {
      polarBears[i].collision = true;
      scoreCount = 0;
    }
  }
  // updating the scoreboard
  scoreboard.selectAll('span')
  .data([highScore, scoreCount, collisionCount])
  .text(function(d){return d})
}   
