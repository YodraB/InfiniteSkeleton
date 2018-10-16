//JavasScript

function randomInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

//dipslays array
function showArray(array) {
  var output = '';
  for (var i = 0; i < array.length; i++){
    output += array + '<br>';
  }
}

//helper function to make a two dimentional array that takes a number and the dimentions of the array
function createArray(token, x, y) {
    var array = [];
    for (var i = 0; i < y; i++) {
      array.push([]);
      for (var j = 0; j < x; j++) {
        array[i].push(token);
      }
    }
    return array;
  }

//lets create a randomly generated map for our dungeon crawler
function createMap(x, y, maxTunnel, maxLength, token) {
let map = createArray(4, x, y), // create a 2d array full of tokens
    currentRow = randomInterval(3,y - 4), // our current row - start at a random spot
    currentColumn = randomInterval(3,x - 4), // our current column - start at a random spot
    directions = [[-1, 0], [1, 0], [0, -1], [0, 1]], // array to get a random direction from (left,right,up,down)
    lastDirection = [], // save the last direction we went
    randomDirection; // next turn/direction - holds a value from directions

    // lets create some tunnels - while maxTunnel, dimentions, and maxLength  is greater than 0.
    while (maxTunnel && x && y && maxLength) {

      // lets get a random direction - until it is a perpendicular to our lastDirection
      // if the last direction = left or right,
      // then our new direction has to be up or down,
      // and vice versa
      do {
         randomDirection = directions[Math.floor(Math.random() * directions.length)];
      } while ((randomDirection[0] === -lastDirection[0] && randomDirection[1] === -lastDirection[1]) || (randomDirection[0] === lastDirection[0] && randomDirection[1] === lastDirection[1]));

      var randomLength = Math.ceil(Math.random() * maxLength), //length the next tunnel will be (max of maxLength)
        tunnelLength = 0; //current length of tunnel being created

		  // lets loop until our tunnel is long enough or until we hit an edge
      while (tunnelLength < randomLength) {

        //break the loop if it is going out of the map
        if (((currentRow <= 3) && (randomDirection[0] === -1)) ||
            ((currentColumn <= 3) && (randomDirection[1] === -1)) ||
            ((currentRow >= y - 4) && (randomDirection[0] === 1)) ||
            ((currentColumn >= x - 4) && (randomDirection[1] === 1))) {
          break;
        } else {
          map[currentRow][currentColumn] = 0; //set the value of the index in map to 0 (a tunnel, making it one longer)
          currentRow += randomDirection[0]; //add the value from randomDirection to row and col (-1, 0, or 1) to update our location
          currentColumn += randomDirection[1];
          tunnelLength++; //the tunnel is now one longer, so lets increment that variable
        }
      }

      if (tunnelLength) { // update our variables unless our last loop broke before we made any part of a tunnel
        lastDirection = randomDirection; //set lastDirection, so we can remember what way we went
        maxTunnel--; // we created a whole tunnel so lets decrement how many we have left to create
      }
    }
    map = styleMap(map, 2)
    return map; // all our tunnels have been created and our map is complete, so lets return it to our render()
  };

function styleMap(map, token){
  var directionArray = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, 1], [1, -1], [-1, 1]];
  for (var y = 0; y < map.length; y++){
    for (var x = 0; x < map[y].length; x++){
      var neighbors = []
      for (var i = 0; i < directionArray.length; i++){
        if (y > 0 && y < map.length - 1 && x > 0 && x < map[y].length - 1){
          if (map[y + directionArray[i][0]][x + directionArray[i][1]] == 0 && map[y][x] != 0){
            map[y][x] = token
          }
        }
      }
    }
  }
  return map
}

function htmlShow(array){ //shows an array straight in the demo paragraph
  output = ''
  for (var i = 0; i < array.length; i++){
    output += array[i] + '<br>';
    console.log(array[i].length)
  }
  document.getElementById("demo").innerHTML = output;
}

function dungeOn(x, y, maxTunnel, maxLength){ //main dungeon generation function
  var map = createMap(x, y, maxTunnel, maxLength, 2);
  //htmlShow(map);
  return map
}