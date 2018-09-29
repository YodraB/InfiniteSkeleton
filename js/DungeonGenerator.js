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
  maxRooms: 10,
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
			grid[yVar].push(8);
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

function roomFromSeed(mapx, mapy, {x, y, width, height}){
  var direction = 1 //randomInterval(1, 4)
  switch(direction) {
    case 1:
      y -= height - 1;
      if (y < 1){
        y = 1
      }
      break;
    case 2:
      y += 1
      if (y > mapy){
        y = mapy - 2
      }
      break;
    case 3:
      x -= 1 + width
      break;
    case 4:
      x -= 1
      break;
    default:
      y = 3;
  }
  return {
    x: x,
    y: y,
    height: height,
    width: width
  }
}

function placeCells(grid, {x, y, width, height}){
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
      if (grid[yVar][xVar] != 8){
        tileCount += 1
      }
    }
  }
  var ratioTiles = tileCount/total * 100
  return ratioTiles
}

function dungeon(x,y){
  var grid = gridMake(x,y)
  grid[0][0] = 7
  var roomRatio = ratio(grid)
  var i = 0
  var room = roomGen(x,y)
  var newRoom = roomFromSeed(x, y, room)
  while (roomRatio < 30 && i < 999){
    i++
    newRoom = roomFromSeed(x, y, grow)
    if (validRoom(grid, grow) != false){
      grid = placeCells(grid, grow)
    }
    roomRatio = ratio(grid)
  }
  return grid;
}

// empty = 8

export { randomInterval, dungeon };
