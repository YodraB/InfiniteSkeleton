//JavasScript

// Settings
var constant = {
  roomSizeRange: {
    min: 2,
    max: 6
  }
}

function randomInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

function gridMake(x,y){
  let grid = [];
	for (let i = 0; i < y; i++) {
		grid.push([]);
		for (let j = 0; j < x; j++) {
			grid[i].push(63);
		}
	}
  return grid;
}

function roomGen(wide, tall){
  var xNum = randomInterval(1, wide - constant.roomSizeRange.max)
  var yNum = randomInterval(1, tall - constant.roomSizeRange.max)
  var heightNum = randomInterval(constant.roomSizeRange.min, constant.roomSizeRange.max)
  var widthNum = randomInterval(constant.roomSizeRange.min, constant.roomSizeRange.max)
  return {
    x: xNum,
    y: yNum,
    height: heightNum,
    width: widthNum
  }
}

function placeCells(grid, {x, y, width, height, value}){
  for (var yVar = 0; yVar < height; yVar++){
    for (var xVar = 0; xVar < width; x++){
      if (y == 0 || y == height - 1 || x == 0 || x == width - 1) {
        grid[xVar][yVar] = 2;
      } else {
        grid[0][0] = 14; //test
        grid[xVar][yVar] = 0;
      }
    }
  }
  return grid;
}

function validRoom(grid, {x, y, width, height}){
  if (y < 1 || y + height > grid.length - 1){
    return false;
  }
  if (x < 1 || x + width > grid[0].length - 1){
    return false;
  }
  for (let i = y - 1; i < y + height + 1; i++) {
			for (let j = x - 1; j < x + width + 1; j++) {
				if (grid[i][j] === 0) {
					return false;
				}
			}
		}
}

function dungeon(x,y){
  var grid = gridMake(x,y)
  var roomAmount = 10 //randomInterval(1, 3)
  for (var i = 0; i < roomAmount; i++){
    var room = roomGen(x,y)
    if (validRoom(grid, room) != false){
      grid = placeCells(grid, room)
    }
  }
  return grid;
}

export { randomInterval, dungeon };
