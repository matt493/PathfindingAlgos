const BOARD_WIDTH = 30;
const BOARD_HEIGHT = 30;
const GRID_SIZE = 20;
const BACKGROUND = 240;

var select;
var canvas;
var runBtn;
var resetButton;


var board;
var x_last, y_last;	//init x and y of last frame
var x_curr, y_curr;	//init x and y of this frame
var mouseLock;	//init mouseLock as false
var heldCell;
var found;

var START;
var END;

class Board
{
	constructor(x, y)
	{
		this.top = null;
		this.bottom = null;
		this.left = null;
		this.right = null;

		this.parent = null;

		this.x = x;
		this.y = y;

		this.color = 'white';
		this.status = 'clear';
	}

	drawCell()
	{
		fill(this.color);
		
		rectMode(CORNERS);
		stroke('black');
		strokeWeight(0.5);
		rect(this.x , this.y, this.x + GRID_SIZE, this.y + GRID_SIZE);

		// stroke('white');
		// strokeWeight(0.5);
		// circle(this.x + GRID_SIZE/2, this.y + GRID_SIZE/2, GRID_SIZE);
	}

	setStatus(status)
	{
		if(status == 'wall') this.setWall();
		else if(status == 'clear') this.setClear();
		else if(status == 'start') this.setStart();
		else if(status == 'end') this.setEnd();
		else if(status == 'traversed') this.setTraversed();
		else if(status == 'path') this.setPath();
	}
	setPath()
	{
		this.status = 'path';
		this.color = 'yellow';
		this.drawCell();
	}
	isPath()
	{
		if (this.status == 'path') return true;
		else return false;
	}

	setTraversed()
	{
		if(!this.isStart() && !this.isEnd())
		this.color = 'lime';

		this.status = 'traversed';
		// this.color = 'gray';
		this.drawCell();
	}
	isTraversed()
	{
		if (this.status == 'traversed') return true;
		else return false;
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
		// this.setTraversed();
		START = this;
		this.status = 'start';
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
		END = this;
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
	frameRate(60);
	background(BACKGROUND);
	
	initGUI();
	initStartParams();
	drawGrid();
}

function draw()
{
	// normalizing the mouseX and mouseY to be within range of grid size
	x_curr = Math.floor(mouseX / BOARD_WIDTH * (BOARD_WIDTH/GRID_SIZE));
	y_curr = Math.floor(mouseY / BOARD_HEIGHT * (BOARD_HEIGHT/GRID_SIZE));

	// clear();
	// drawGrid();
}


function mouseDragged()
{
	dragNode();
	handleInput();
}


function mousePressed()
{
	pickupNode();

	x_last = y_last = null;		//need to be before handleInput()
	handleInput();
}

function mouseReleased()
{
	releaseNode();
}


//#region UtilFuncs
//==============================================================================================================================================================================
function initStartParams()
{
	// clear();

	board = [];

	x_last = null, y_last = null;	//init x and y of last frame
	x_curr = -1, y_curr = -1;	//init x and y of this frame
	mouseLock = false;	//init mouseLock as false
	heldCell = null;
	found = false;

	START = null;
	END = null;

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

	//init graph adjacency list
	for (let x = 0; x < board.length; x++)
		for (let y = 0; y < board[x].length; y++)
		{
			if(y-1 >= 0)				board[x][y].top = board[x][y-1];
			if(y+1 <= BOARD_HEIGHT-1)	board[x][y].bottom = board[x][y+1];
			if(x-1 >= 0)				board[x][y].left = board[x-1][y];
			if(x+1 <= BOARD_WIDTH-1)	board[x][y].right = board[x+1][y];
		}


	board[0][0].setStart();		//init start node at top left
	board[BOARD_WIDTH - 1][BOARD_HEIGHT - 1].setEnd();	//init end node at bottom right
}
//==============================================================================================================================================================================
function run()
{
	print(select.value());

	for (let x = 0; x < board.length; x++)
	{
		for (let y = 0; y < board[x].length; y++)
		{
			if(board[x][y].isWall() || board[x][y].isStart() || board[x][y].isEnd()){}
			else board[x][y].setClear();
		}
	}

	if(select.value() == 'dfs')
	{
		dfs(START);
		START.setStart();
	}
	found = false;	//keep at bottom of run()
}
//==============================================================================================================================================================================
function reset()
{
	// clear();
	// initStartParams();
	// drawGrid();
	setup();
}
//==============================================================================================================================================================================



//==============================================================================================================================================================================
function dfs(node)
{
	// setTimeout(function()
	// {
		if(!found)
		{
			if(node.isTraversed() || node.isWall())
			{
				return;
			}
				
			else if(!node.isEnd())
			{
				node.setTraversed();
	
				if(node.top != null)
				{
					node.top.parent = node;
					dfs(node.top);
				}
				if(node.right != null)
				{
					node.right.parent = node;
					dfs(node.right);
				}
				if(node.bottom != null)
				{
					node.bottom.parent = node;
					dfs(node.bottom);
				}
				if(node.left != null)
				{
					node.left.parent = node;
					dfs(node.left);
				}
			}
			else
			{
				print('end reached');
				found = true;
				START.setStart();
				return;
			}
		}
		else
		{
			if(!node.isStart()) node.setPath();
		}
	// }, 100 + iterVal);
	// iterVal++;
}
//==============================================================================================================================================================================
function initGUI()
{
	select = createSelect();
	select.position(5, 10);

	select.option("Select an algorithm", 'null');
	select.option('A* Algorithm', 'astar');
	select.option('Depth First Search', 'dfs');
	select.option('Bredth First Search', 'bfs');
	select.option("Dijkstra's Algorithm", 'dijkstra');
	select.option('Greedy Bredth First Search', 'greedybfs');

	select.disable("null");
	select.selected("null");

	runBtn = createButton('RUN');
	runBtn.mousePressed(run);
	runBtn.position(200, 10);

	resetButton = createButton('RESET');
	resetButton.mousePressed(reset);
	resetButton.position(255, 10);

	canvas = createCanvas(BOARD_WIDTH * GRID_SIZE, BOARD_HEIGHT * GRID_SIZE);
	canvas.position(5,40);
}
//==============================================================================================================================================================================
function dragNode()
{
	if (x_curr >= 0 && x_curr < BOARD_WIDTH && y_curr >= 0 && y_curr < BOARD_HEIGHT) //checking if within boundary
	{
		if (mouseLock && (x_curr != x_last || y_curr != y_last)) //mouse locked and not at same pos
		{
			if (heldCell != null) 
			{
				// console.clear();
				// print('lastcell:',board[x_last][y_last].status);
				// print('currcell:',board[x_curr][y_curr].status);
				if (board[x_last][y_last].isStart() || board[x_last][y_last].isEnd()) 
				{
					if (!board[x_curr][y_curr].isWall()) 
					{
						if (board[x_curr][y_curr].isStart() && heldNode == 'end') { } //MIRACLE CODE
						else if (board[x_curr][y_curr].isEnd() && heldNode == 'start') { } //MIRACLE CODE

						else 
						{
							board[x_curr][y_curr].setStatus(heldCell);
							board[x_last][y_last].setClear();
						}
					}
				}
				else if (board[x_last][y_last].isWall())
				{
					// mouseLock = false;
					heldCell = null;
				}
			}
		}
	}
	else
	{
		mouseLock = false;
		heldCell = null;
	}
}
//==============================================================================================================================================================================
function releaseNode() 
{
	if (x_curr >= 0 && x_curr < BOARD_WIDTH && y_curr >= 0 && y_curr < BOARD_HEIGHT) //checking if within boundary
	{
		mouseLock = false;
		heldCell = null;
	}
}
//==============================================================================================================================================================================
function handleInput()
{
	//DRAWING WALL AND CLEARING WALL
	if (x_curr >= 0 && x_curr < BOARD_WIDTH && y_curr >= 0 && y_curr < BOARD_HEIGHT)	//checking if within boundary
	{
		if(!mouseLock)	//if mouse not locked
		{
			if (x_curr != x_last || y_curr != y_last)	//if (x,y) not at same grid as last frame do things
			{
				if(!board[x_curr][y_curr].isStart() || !board[x_curr][y_curr].isEnd())
				{
					if(board[x_curr][y_curr].isWall())
						board[x_curr][y_curr].setClear();
					else if(!board[x_curr][y_curr].isStart() && !board[x_curr][y_curr].isEnd())
						board[x_curr][y_curr].setWall();
				}
			}
		}
	}

	//needs to be at bottom
	x_last = x_curr;
	y_last = y_curr;
}
//==============================================================================================================================================================================
function pickupNode()
{
	if (x_curr >= 0 && x_curr < BOARD_WIDTH && y_curr >= 0 && y_curr < BOARD_HEIGHT) //checking if within boundary
	{
		if (board[x_curr][y_curr].isStart() || board[x_curr][y_curr].isEnd()) //see if current cell is start or end
		{
			mouseLock = true; //if yes, lock the mouse
			heldCell = board[x_curr][y_curr].status;
		}
	}
}
//==============================================================================================================================================================================
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
//==============================================================================================================================================================================
//#endregion