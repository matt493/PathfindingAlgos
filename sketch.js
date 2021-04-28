const BOARD_SIZE = 120;
const GRID_SIZE = 5;

let board = [];

//init x and y of last frame
let x_last_frame = null, y_last_frame = null;

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

		this.color = 'white';
		this.status = 'clear';
	}

	drawCell()
	{
		rectMode(CORNERS);
		fill(this.color);
		stroke('black');
		strokeWeight(0.1);
		rect(this.x , this.y, this.x + GRID_SIZE, this.y + GRID_SIZE);
	}

	setWall()
	{
		this.status = 'wall'
		this.color = 60;
		this.drawCell();
	}

	isWall()
	{
		if (this.status == 'wall') return true;
		else return false;
	}

	setClear()
	{
		this.status = 'clear'
		this.color = 'white';
		this.drawCell();
	}

	isClear()
	{
		if (this.status == 'clear') return true;
		else return false;
	}

	setStartNode()
	{
		this.status = 'start'
		this.color = 'blue';
		this.drawCell();
	}
	isStart()
	{
		if (this.status == 'start') return true;
		else return false;
	}

	setEndNode()
	{
		this.status = 'end'
		this.color = 'red';
		this.drawCell();
	}
	isEnd()
	{
		if (this.status == 'end') return true;
		else return false;
	}
}

function setup()
{
	// createCanvas(displayWidth *  0.999, displayHeight *  0.875);
	createCanvas(BOARD_SIZE * GRID_SIZE + 1, BOARD_SIZE * GRID_SIZE + 1);
	frameRate(5);

	//disable context menu within p5Canvas
	// for (let element of document.getElementsByClassName("p5Canvas"))
	// 	element.addEventListener("contextmenu", (e) => e.preventDefault());
	
	// init and construct grid matrix
	for (let x = 0; x < BOARD_SIZE * GRID_SIZE; x += GRID_SIZE)
	{
		let row = [];
		for (let y = 0; y < BOARD_SIZE * GRID_SIZE; y += GRID_SIZE)
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
	handleInput();
	// print(frameRate());
}

function mousePressed()
{
	handleInput();

	//x_last_frame = y_last_frame = null; // resetting in case mouse
}

function handleInput()
{
	// normalizing the mouseX and mouseY to be within range of grid size
	var x_this_frame = Math.floor(mouseX / BOARD_SIZE * (BOARD_SIZE/GRID_SIZE));
	var y_this_frame = Math.floor(mouseY / BOARD_SIZE * (BOARD_SIZE/GRID_SIZE));


	//DRAWING WALL AND CLEARING WALL 
	if (x_this_frame >= 0 && x_this_frame < BOARD_SIZE && y_this_frame >= 0 && y_this_frame < BOARD_SIZE && mouseButton == LEFT)	//checking if within boundary
	{
		if (x_this_frame != x_last_frame || y_this_frame != y_last_frame)	//if (x,y) not at same grid as last frame do things
		{
			if(board[x_this_frame][y_this_frame].isClear())
				board[x_this_frame][y_this_frame].setWall();
			else
				board[x_this_frame][y_this_frame].setClear();
		}
	}
	x_last_frame = x_this_frame;
	y_last_frame = y_this_frame;
}