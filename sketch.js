const BOARD_WIDTH = 25;
const BOARD_HEIGHT = 25;
const GRID_SIZE = 20;

let board = [];

let x_last = null, y_last = null;	//init x and y of last frame
let x_curr = null, y_curr = null;	//init x and y of this frame
let mouseLock = false;	//init mouseLock as false
let heldNode = null;
let lastCell = null;


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
		strokeWeight(0.2);
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
		this.status = 'clear';
		this.color = 'white';
		this.drawCell();
	}

	isClear()
	{
		if (this.status == 'clear') return true;
		else return false;
	}

	setStart()
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

	setEnd()
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
	var canvas = createCanvas(BOARD_WIDTH * GRID_SIZE, BOARD_HEIGHT * GRID_SIZE);
	frameRate(60);

	//disable context menu within p5Canvas
	// for (let element of document.getElementsByClassName("p5Canvas"))
	// 	element.addEventListener("contextmenu", (e) => e.preventDefault());
	
	// init and construct grid matrix
	for (let x = 0; x < BOARD_WIDTH * GRID_SIZE; x += GRID_SIZE)
	{
		let row = [];
		for (let y = 0; y < BOARD_HEIGHT * GRID_SIZE; y += GRID_SIZE)
		{
			var cell = new Board(x, y);
			row.push(cell);
		}
		board.push(row)
	}

	background(0);	//set background color

	drawGrid();		//draw grid on sketch start

	board[0][0].setStart();		//init start node at top left
	board[BOARD_WIDTH - 1][BOARD_HEIGHT - 1].setEnd();	//init end node at bottom right

	// noLoop();
}

function draw()
{
	// normalizing the mouseX and mouseY to be within range of grid size
	x_curr = Math.floor(mouseX / BOARD_WIDTH * (BOARD_WIDTH/GRID_SIZE));
	y_curr = Math.floor(mouseY / BOARD_HEIGHT * (BOARD_HEIGHT/GRID_SIZE));
}

function test()
{
	// loop();
}

function mouseDragged()
{
	if (x_curr >= 0 && x_curr < BOARD_WIDTH && y_curr >= 0 && y_curr < BOARD_HEIGHT && mouseButton == LEFT)	//checking if within boundary
	{
		if (mouseLock && (x_curr != x_last || y_curr != y_last))
		{
			lastCell = board[x_last][y_last].status;
			print('lastCell',lastCell);
			print('currCell',board[x_curr][y_curr].status);

			if(heldNode == 'start' && !board[x_curr][y_curr].isEnd())
			{
				board[x_curr][y_curr].setStart();
			}
			else if(heldNode == 'end' && !board[x_curr][y_curr].isStart())
			{
				board[x_curr][y_curr].setEnd();
			}
			else
			{
				mouseLock = false;
				// heldNode = null;
				// print('idk');
			}

			if(board[x_curr][y_curr].isStart() && heldNode == 'end')
			{
				// board[x_last][y_last].setEnd();
			}
			else if(board[x_curr][y_curr].isEnd() && heldNode == 'start')
			{
				// board[x_last][y_last].setStart();
			} 
			else
			{
				board[x_last][y_last].setClear();
			} 
			// else if(!board[x_curr][y_curr].isEnd() || !board[x_curr][y_curr].isStart()) board[x_last][y_last].setClear();


			// if(board[x_curr][y_curr].isStart() || board[x_curr][y_curr].isEnd())	//see if curr cell is start or end
			// {
			// 	board[x_last][y_last].setClear();
			// }
			// else
			// {
			// 	board[x_last][y_last].setClear();
			// }
			
			// print('curr',board[x_curr][y_curr].status);
			// print('last',board[x_last][y_last].status);
		}
	}
	else
	{
		mouseLock = false;
		heldNode = null;
	}

	handleInput();
}

function mousePressed()
{
	pickupNode();
	handleInput();
	// x_last = y_last = null; // resetting in case mouse
}

function mouseReleased()
{
	releaseNode();
}

//#region UtilFuncs
function releaseNode() 
{
	if (x_curr >= 0 && x_curr < BOARD_WIDTH && y_curr >= 0 && y_curr < BOARD_HEIGHT && mouseButton == LEFT) //checking if within boundary
	{
		if (board[x_curr][y_curr].isStart() || board[x_curr][y_curr].isEnd()) //see if current cell is start or end
		{
			mouseLock = false; //if yes, lock = false
			heldNode = null;
			// print('mouse unlocked');
		}
	}
}

function handleInput()
{
	//DRAWING WALL AND CLEARING WALL
	if (x_curr >= 0 && x_curr < BOARD_WIDTH && y_curr >= 0 && y_curr < BOARD_HEIGHT && mouseButton == LEFT)	//checking if within boundary
	{
		if(!mouseLock)	//if mouse not locked
		{
			if (x_curr != x_last || y_curr != y_last)	//if (x,y) not at same grid as last frame do things
			{
				if(!board[x_curr][y_curr].isStart() || !board[x_curr][y_curr].isEnd())
				{
					if(board[x_curr][y_curr].isClear())
						board[x_curr][y_curr].setWall();
					else if(board[x_curr][y_curr].isWall())
						board[x_curr][y_curr].setClear();
				}	
			}
		}
	}
	x_last = x_curr;
	y_last = y_curr;
}

function pickupNode() 
{
	if (x_curr >= 0 && x_curr < BOARD_WIDTH && y_curr >= 0 && y_curr < BOARD_HEIGHT && mouseButton == LEFT) //checking if within boundary
	{
		if (board[x_curr][y_curr].isStart() || board[x_curr][y_curr].isEnd()) //see if current cell is start or end
		{
			mouseLock = true; //if yes, lock = true
			heldNode = board[x_curr][y_curr].status;
			// print('mouse locked holding:', heldNode);
		}
	}
	// else
	// {
	// 	mouseLock = false;
	// 	heldNode = null;
	// }
}

function drawGrid()
{
	for (let x = 0; x < board.length; x++)
	{
		for (let y = 0; y < board[x].length; y++)
		{
			board[x][y].drawCell();
		}
	}
}
//#endregion