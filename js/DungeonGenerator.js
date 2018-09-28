//JavasScript

function randomInterval(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
}

function replaceArray(array, startValue, endValue){
  for (var j = 0; j < array.length; j++){
    for(var i = 0; i < array[j].length; i++){
       if(array[j][i] === startValue){
         array[j].splice(i, 1, endValue)
        }
    }
  }
  return array
}

// Settings
var constant = {
  roomSizeRange: {
    min: 4,
    max: 8
  }
}

function gridMake(x,y){
  let grid = [];
	for (let yVar = 0; yVar < y; yVar++) {
		grid.push([]);
		for (let xVar = 0; xVar < x; xVar++) {
			grid[yVar].push(27);
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
  for (var xVar = x; xVar < width + x; xVar++){
    for (var yVar = y; yVar < height + y; yVar++){
      if (yVar == y || yVar == height + y - 1 || xVar == x || xVar == width + x - 1) {
        grid[yVar][xVar] = 2;
      } else {
        grid[yVar][xVar] = 0;
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

function ratio(grid){
  var tileCount = 0
  var total = (grid.length - 1) * (grid[0].length - 1)
  for (let yVar = 0; yVar < grid.length - 1; yVar++) {
		for (let xVar = 0; xVar < grid[0].length - 1; xVar++) {
      if (grid[yVar][xVar] != 27){
        tileCount += 1
      }
    }
  }
  var ratioTiles = tileCount/total * 100
  return ratioTiles
}

function dungeon(x,y){
  var grid = gridMake(x,y)
  var roomRatio = ratio(grid)
  var i = 0
  while (roomRatio < 30 && i < 999){
    i++
    var room = roomGen(x,y)
    if (validRoom(grid, room) != false){
      grid = placeCells(grid, room)
    }
    roomRatio = ratio(grid)
  }
  grid = replaceArray(grid, 0, 63)
  return grid;
}

export { randomInterval, dungeon };
