const BOARD_SIZE = 30;
const GRID_SIZE = 20;

let board = [];
class Board
{
	constructor(x, y)
	{
		this.top = null;
		this.bottom = null;
		this.left = null;
		this.right = null;

		this.x = x;
		this.y = y;

		this. color = 'white';
		this.status = 'clear';
	}

	drawCell()
	{
		rectMode(CORNERS);
		fill(this.color);
		stroke('black');
		strokeWeight(0.5);
		rect(this.x , this.y, this.x + GRID_SIZE, this.y + GRID_SIZE);
	}

	setWall()
	{
		this.status = 'wall'
		this.color = 60;
	}

	setClear()
	{
		this.status = 'clear'
		this.color = 'white';
	}
}

function setup()
{
	// createCanvas(displayWidth *  0.999, displayHeight *  0.875);
	createCanvas((BOARD_SIZE * GRID_SIZE) + 1, (BOARD_SIZE * GRID_SIZE) + 1);
	// frameRate(5);

	//DISABLE CONTEXT MENU
	for (let element of document.getElementsByClassName("p5Canvas"))
		element.addEventListener("contextmenu", (e) => e.preventDefault());
	
	// construct grid matrix
	for (let x = 0; x < BOARD_SIZE * GRID_SIZE; x += 20)
	{
		let row = [];
		for (let y = 0; y < BOARD_SIZE * GRID_SIZE; y += 20)
		{
			var cell = new Board(x, y);
			row.push(cell);
		}
		board.push(row)
	}

	//draw grid on sketch start
	background(0);
	for (let x = 0; x < board.length; x++)
	{
		for (let y = 0; y < board[x].length; y++)
		{
			board[x][y].drawCell();
		}
	}
}
	
function draw()
{

}

function mouseDragged()
{
	handleUI();
}


function mousePressed()
{
	handleUI();
}

function handleUI()
{
	var x = Math.floor(mouseX / BOARD_SIZE * 1.5);
	var y = Math.floor(mouseY / BOARD_SIZE * 1.5);

	console.info("NDC: ", x, ":", y);
	if (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE)
	{
		if (mouseButton == LEFT)
			board[x][y].setWall();
		else
			board[x][y].setClear();

		board[x][y].drawCell();
	}
}