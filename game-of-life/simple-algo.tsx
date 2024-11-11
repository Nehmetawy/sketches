import p5 from 'p5';
import { shouldRun } from '@/code/modules/p5/sketch';

export function Manager() {}
var CX: number;
var CY: number;
var P5: p5;
var CANVAS_CENTER: p5.Vector;

Manager.initiate = (p: p5) => {
  P5 = p;
  CX = window.innerWidth / 2;
  CY = window.innerHeight / 2;
  CANVAS_CENTER = P5.createVector(CX, CY);
  GameGrid();
};
var frames = 0;

Manager.draw = () => {
  DrawBoard();
  FillGame();
  frames++;
  if (frames > 10) {
    shouldRun ? RunGame() : '';
    frames = 0;
  }
};

// cretae a grid
const cellSize = 20;
var rows: number = 0;
var cols: number = 0;

// set game grid
function GameGrid() {
  rows = P5.floor((CY * 2) / cellSize);
  cols = P5.floor((CX * 2) / cellSize);
}

var activeCell = new Set<string>();
var nextGen = new Set<string>();

function FillGame() {
  if (P5.mouseIsPressed) {
    const x = P5.mouseX;
    const y = P5.mouseY;
    //
    const rowNum = P5.floor(y / cellSize);
    const colNum = P5.floor(x / cellSize);
    //
    const index = `${rowNum}-${colNum}`;
    activeCell.add(index);
  }
}
function RunGame() {
  // clear next gen
  nextGen.clear();
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const indexToCheck = `${r}-${c}`;
      CheckLife(indexToCheck);
    }
  }
  activeCell.clear();
  nextGen.forEach((index) => {
    activeCell.add(index);
  });
  nextGen.clear();
}

function DrawBoard() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const indexToCheck = `${r}-${c}`;
      const isLive = activeCell.has(indexToCheck);
      const topX = c * cellSize;
      const topY = r * cellSize;
      P5.translate(topX, topY);
      if (isLive) {
        P5.fill(0);
      } else {
        P5.fill(1000);
      }
      P5.square(0, 0, cellSize);
      P5.resetMatrix();
    }
  }
}

function CheckLife(index: string) {
  var array = index.split('-');
  var row = Number(array[0]);
  var col = Number(array[1]);
  // find 6 neighbour
  const cell1 = `${row - 1}-${col - 1}`;
  const cell2 = `${row - 1}-${col}`;
  const cell3 = `${row - 1}-${col + 1}`;
  const cell4 = `${row}-${col - 1}`;
  //
  const cell6 = `${row}-${col + 1}`;
  const cell7 = `${row + 1}-${col - 1}`;
  const cell8 = `${row + 1}-${col}`;
  const cell9 = `${row + 1}-${col + 1}`;
  // remove invalids
  var aliveNeighbours = 0;
  if (activeCell.has(cell1)) {
    aliveNeighbours++;
  }
  if (activeCell.has(cell2)) {
    aliveNeighbours++;
  }
  if (activeCell.has(cell3)) {
    aliveNeighbours++;
  }
  if (activeCell.has(cell4)) {
    aliveNeighbours++;
  }
  if (activeCell.has(cell6)) {
    aliveNeighbours++;
  }
  if (activeCell.has(cell7)) {
    aliveNeighbours++;
  }
  if (activeCell.has(cell8)) {
    aliveNeighbours++;
  }
  if (activeCell.has(cell9)) {
    aliveNeighbours++;
  }
  const wasAlive = activeCell.has(index);
  if (wasAlive && (aliveNeighbours === 2 || aliveNeighbours === 3)) {
    nextGen.add(index);
  }
  if (!wasAlive && aliveNeighbours === 3) {
    nextGen.add(index);
  }
}
/**
Rules : 
1. dead is born if exactly 3 live neighbour
2. live ones live if 2/3 live neighbour
3. else cell dies
 */
