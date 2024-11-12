/**
```````````````````````````````````````````````````````````
`                                                         ` 
`                   @REACT IMPORT 
`                                                         `
```````````````````````````````````````````````````````````
*/

import p5 from "p5";
/**
```````````````````````````````````````````````````````````
`                                                         ` 
`                   @SHOULD game run
`                                                         `
```````````````````````````````````````````````````````````
a boolean variable that decides whether game run/not
*/

import { shouldRun } from "@/code/modules/p5/sketch";
/**
```````````````````````````````````````````````````````````
`                                                         ` 
`                   @MAIN MANAGER
`                                                         `
```````````````````````````````````````````````````````````
*/

var CX: number;
var CY: number;
var P5: p5;
var CANVAS_CENTER: p5.Vector;

export function Manager() {}
Manager.initiate = (p: p5) => {
	P5 = p;
	CX = window.innerWidth / 2;
	CY = window.innerHeight / 2;
	CANVAS_CENTER = P5.createVector(CX, CY);
	GameGrid();
};
Manager.draw = () => {
	DrawBoard();
	FillGame();
	shouldRun ? RunGame() : "";
};
/**
```````````````````````````````````````````````````````````
`                                                         ` 
`                   @Important varianbles
`                                                         `
```````````````````````````````````````````````````````````
*/
const cellSize = 10;
var rows: number = 0;
var cols: number = 0;

function GameGrid() {
	rows = P5.floor((CY * 2) / cellSize);
	cols = P5.floor((CX * 2) / cellSize);
}
/**
```````````````````````````````````````````````````````````
`                                                         ` 
`                   @GENERTIONS
`                                                         `
```````````````````````````````````````````````````````````
manages 
	active: current geenration
	next: next generation and cells to check
	tocheck : check which cells to check for next gen
		-> 8 cells around active ones
*/
var activeCell = new Set<string>();
var nextGen = new Set<string>();
var tocheck = new Set<string>();
/**
```````````````````````````````````````````````````````````
`                                                         ` 
`                   @FILL_game
`                                                         `
```````````````````````````````````````````````````````````
fill cells using mouse
*/
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
/**
```````````````````````````````````````````````````````````
`                                                         ` 
`                   @Run_game
`                                                         `
```````````````````````````````````````````````````````````
*/
function RunGame() {
	nextGen.clear();
	tocheck.clear();

	FindCellsToCheck();
	tocheck.forEach((index) => {
		CheckLife(index);
	});
	activeCell = new Set(nextGen);
}
/**
```````````````````````````````````````````````````````````
`                                                         ` 
`                   @Draws
`                                                         `
```````````````````````````````````````````````````````````
draws game of life
*/
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
/**
```````````````````````````````````````````````````````````
`                                                         ` 
`                   @find cells to check 
`                                                         `
```````````````````````````````````````````````````````````
9 cells around active ones
just calculation optimization, instead of check all grid cells
*/
function FindCellsToCheck() {
	activeCell.forEach((index) => {
		const [row, col] = index.split("-").map(Number);
		// find 9 neighbour
		tocheck.add(`${row - 1}-${col - 1}`);
		tocheck.add(`${row - 1}-${col}`);
		tocheck.add(`${row - 1}-${col + 1}`);
		tocheck.add(`${row}-${col - 1}`);
		tocheck.add(`${row}-${col + 1}`);
		tocheck.add(`${row}-${col}`);
		tocheck.add(`${row + 1}-${col - 1}`);
		tocheck.add(`${row + 1}-${col}`);
		tocheck.add(`${row + 1}-${col + 1}`);
	});
}
/**
```````````````````````````````````````````````````````````
`                                                         ` 
`                   @Check_Life
`                                                         `
```````````````````````````````````````````````````````````
rules 
	1. dead cell is born if exactly 3 live neighbour
	2. live cell doesn't die if 2/3 live neighbour
	3. rest cases all die
*/
function CheckLife(index: string) {
	const [row, col] = index.split("-").map(Number);
	var aliveNeighbours = 0;
	if (activeCell.has(`${row - 1}-${col - 1}`)) {
		aliveNeighbours++;
	}
	if (activeCell.has(`${row - 1}-${col}`)) {
		aliveNeighbours++;
	}
	if (activeCell.has(`${row - 1}-${col + 1}`)) {
		aliveNeighbours++;
	}
	if (activeCell.has(`${row}-${col - 1}`)) {
		aliveNeighbours++;
	}
	if (activeCell.has(`${row}-${col + 1}`)) {
		aliveNeighbours++;
	}
	if (activeCell.has(`${row + 1}-${col - 1}`)) {
		aliveNeighbours++;
	}
	if (activeCell.has(`${row + 1}-${col}`)) {
		aliveNeighbours++;
	}
	if (activeCell.has(`${row + 1}-${col + 1}`)) {
		aliveNeighbours++;
	}
	// rule 1
	const wasAlive = activeCell.has(index);
	if (wasAlive && (aliveNeighbours === 2 || aliveNeighbours === 3)) {
		nextGen.add(index);
	}
	// rule 2
	if (!wasAlive && aliveNeighbours === 3) {
		nextGen.add(index);
	}
}
