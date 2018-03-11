var ROWS = 14;
var COLS = 14;
var MAX_MOVES = 25;
var table = new Array(ROWS);
for(var row = 0; row < ROWS; row++) {
  table[row] = new Array(COLS);
  for(var col = 0; col < COLS; col++) {
    table[row][col] = new Object();
  }
}
var colors = "red yellow green blue purple pink".split(" ", 6);
var moves = -1;
var finished;

function getElement(id) {
  var element = document.getElementById(id);
  return element;
}

function createNode(type, parent) {
  var newNode = document.createElement(type);
  parent.appendChild(newNode);
  return newNode;
}

function appendText(parent, text) {
  var textNode = document.createTextNode(text);
  clear(parent);
  parent.appendChild(textNode);
}

function clear(element) {
  while(element.lastChild) {
    element.removeChild(element.lastChild);
  }
}

function floodElement(row, col, color) {
  table[row][col].color = color;
  table[row][col].element.className = "piece "+color;
}

function colorFlood(row, col, color) {
  if(table[row][col].flooded) {
    return;
  }
  if(table[row][col].color == color) {
    table[row][col].flooded = true;
    floodNeighbors(row, col, color);
  }
}

function floodNeighbors(row, col, color) {
  if(row > 0) {
    colorFlood(row - 1, col, color);
  }
  if(row < ROWS - 1) {
    colorFlood(row + 1, col, color);
  }
  if(col > 0) {
    colorFlood(row, col - 1, color);
  }
  if(col < COLS - 1) {
    colorFlood(row, col + 1, color);
  }
}

// check if game over
function allFlooded() {
  for(var row = 0; row < ROWS; row++) {
    for(var col = 0; col < COLS; col++) {
      if(!table[row][col].flooded) {
        return false;
      }
    }
  }
  return true;
}

function flood(color, initial=false) {
  // do nothing if game ended
  if(finished) {
    return;
  }

  // do nothing if color clicked is already the corner color
  var prevColor = table[0][0].color;
  if(!initial && color == prevColor) {
    return;
  }
  moves++;
  appendText(getElement("moves"), moves);

  // change all currently flooded pieces
  for(var row = 0; row < ROWS; row++) {
    for(var col = 0; col < COLS; col++) {
      if(table[row][col].flooded) {
        floodElement(row, col, color);
      }
    }
  }
  // flood all connected pieces
  for(var row = 0; row < ROWS; row++) {
    for(var col = 0; col < COLS; col++) {
      if(table[row][col].flooded) {
        floodNeighbors(row, col, color);
      }
    }
  }

  // game is over
  if(allFlooded()) {
    finished = true;
    if(moves <= MAX_MOVES) {
      alert("You win!");
    } else {
      alert("Finished, at last!");
    }
  } else if(moves == max_moves) {
    alert("you lost.");
  }
}

// help button (instructions)
function help() {
  alert("Click on the squares on the left to change the top left corner "+
        "to the color you choose. All tiles connected to it by the same "+
        "will also change to that color. Change all tiles to the same color "+
        "to win the game!");
}

// pick a random color for each tile
function randomColor() {
  var c = Math.floor(Math.random()*6);
  return colors[c];
}

// initialize and dynamically create the grid of color tiles
function createTable() {
  moves = -1;
  finished = false;
  var tableElement = getElement("game-table-tbody");
  for(var row = 0; row < ROWS; row++) {
    var tr = createNode("tr", tableElement);
    for(var col = 0; col < COLS; col++) {
      var td = createNode("td", tr);
      var color = randomColor();
      td.className = "piece " + color;
      table[row][col].color = color;
      table[row][col].element = td;
      table[row][col].flooded = false;
    }
  }
  table[0][0].flooded = true;
  flood(table[0][0].color, true);
}

// reset, new game
function newGame(size) {
  if(size == 10) {
    ROWS = COLS = 10;
    MAX_MOVES = 17;
  } else if (size == 14) {
    ROWS = COLS = 14;
    MAX_MOVES = 25;
  } else if (size == 18) {
    ROWS = COLS = 18;
    MAX_MOVES = 32;
  }
  table = new Array(ROWS);
  for(var row = 0; row < ROWS; row++) {
    table[row] = new Array(COLS);
    for(var col = 0; col < COLS; col++) {
      table[row][col] = new Object();
    }
  }
  appendText(getElement("moves"), moves);
  appendText(getElement("max-moves"), MAX_MOVES);
  clear(getElement("game-table-tbody"));
  createTable();
}
