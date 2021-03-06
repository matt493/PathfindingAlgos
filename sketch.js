//#region BOARD SIZE params declarations
// const BOARD_WIDTH = 20;	//experimental
// const BOARD_HEIGHT = 25;	//experimental
// const GRID_SIZE = 20;	//experimental
var BOARD_WIDTH;
var BOARD_HEIGHT;
const GRID_SIZE = 20;
const BACKGROUND = 240;
//#endregion

//#region UI elements declaration
var select;
var canvas;
var runBtn;
var resetButton;
//#endregion

//#region FLAGs and MARKERs declaration
var board;
var x_last, y_last;	//init x and y of last frame
var x_curr, y_curr;	//init x and y of this frame
var mouseLock;	//init mouseLock as false
var heldCell;
var found;
var locked;
var running;	//set to true to collapse recursion stacks when the reset button is clicked

var START;
var END;

//#endregion

//#region BOARD class declaration
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

		this.fCost = 0;
		this.gCost = 0;
		this.hCost = 0;

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
		if(!this.isStart() && !this.isEnd())	//if curr node is not START or END
		this.color = 'gray';

		this.status = 'traversed';
		this.drawCell();
	}
	isTraversed()
	{
		if (this.status == 'traversed') return true;
		else return false;
	}

	setWall()
	{
		this.status = 'wall';
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
//#endregion

//#region p5.js structure funcs 
async function setup()
{
	frameRate(60);
	background(BACKGROUND);
	
	initGUI();
	await initStartParams();
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
	if(!running)
	{
		pickupNode();

		x_last = y_last = null;		//need to be before handleInput()
		handleInput();
	}
}

function mouseReleased()
{
	releaseNode();
}
//#endregion

//#region Algorithm Implementations

async function dfs(node)
{
	if(!found)
	{
		await delay(10);
		if(node.isTraversed() || node.isWall())
		{
			return;
		}
		else if(node.isEnd())
		{
			print('END FOUND');
			found = true;
			START.setStart();
		}
		else
		{
			node.setTraversed();

			if(node.right != null && !node.right.isTraversed())
			{
				node.right.parent = node;
				await dfs(node.right);
			}
			if(node.bottom != null && !node.bottom.isTraversed())
			{
				node.bottom.parent = node;
				await dfs(node.bottom);
			}
			if(node.left != null && !node.left.isTraversed())
			{
				node.left.parent = node;
				await dfs(node.left);
			}
			if(node.top != null && !node.top.isTraversed())
			{
				node.top.parent = node;
				await dfs(node.top);
			}
		}
	}

	if(!node.isStart() && found && node.parent != null)
	{
		await delay(15);
		if(!node.parent.isStart())node.parent.setPath();
	}
}

async function bfs()
{
	let Q = [];
	let visited = new Set();

	Q.push(START);
	visited.add(START);

	while(Q.length > 0 && !found)
	{
		let curr_node = Q.pop();
		if(curr_node.isWall()) continue;

		if(curr_node.isEnd())
		{
			found = true;
			print("END FOUND!");
			for (let node = END.parent; node != null && node != START; node = node.parent)
			{
				await delay(20);
				node.setPath();
			}
			break;
		}

		curr_node.setTraversed();
		await delay(10);

		let neighbors = [];
		neighbors.push(curr_node.top);
		neighbors.push(curr_node.bottom);
		neighbors.push(curr_node.left);
		neighbors.push(curr_node.right);

		for (let i = 0; i < neighbors.length; i++)
		{
			if(neighbors[i] == null || visited.has(neighbors[i]) || neighbors[i].isWall()) continue;
			neighbors[i].parent = curr_node;
			Q.unshift(neighbors[i]);
			visited.add(neighbors[i]);
		}
	}
	print('DONE');
}

async function primsMaze(start)
{
	
}

/* generateMaze
async function generateMaze(start)	//tryin to implement recursive backtracker maze generation
{
	let dirs = shuffle(['T', 'B', 'L', 'R']);	//randomized dirs array to remove bias
	let nxt;

	for (let i = 0; i < dirs.length; i++)
	{
			 if(dirs[i] == 'T') nxt = start.top;
		else if(dirs[i] == 'B') nxt = start.bottom;
		else if(dirs[i] == 'L') nxt = start.left;
		else if(dirs[i] == 'R') nxt = start.right;

		if(nxt != null && nxt.isWall())	//see if nxt is within bounds and isWall = true
		{
			if(dirs[i] == 'T' || dirs[i] == 'B')
			{
				if(start.left != null) start.left.setClear();
				if(start.right != null) start.right.setClear();
			}
			else if(dirs[i] == 'L' || dirs[i] == 'R')
			{
				if(start.top != null) start.top.setClear();
				if(start.bottom != null) start.bottom.setClear();
			}
			start.setWall();
			await delay(0);
			await generateMaze(nxt);
		}
	}
}
*/

//#endregion

//#region Utility functions

function shuffle(array)
{
	let curId = array.length;
	// There remain elements to shuffle
	while (0 !== curId)
	{
	  // Pick a remaining element
	  let randId = Math.floor(Math.random() * curId);
	  curId -= 1;
	  // Swap it with the current element.
	  let tmp = array[curId];
	  array[curId] = array[randId];
	  array[randId] = tmp;
	}
	return array;
}

async function initStartParams()
{
	// clear();

	board = [];

	x_last = null, y_last = null;	//init x and y of last frame
	x_curr = -1, y_curr = -1;	//init x and y of this frame
	mouseLock = false;	//init mouseLock as false
	heldCell = null;
	found = false;
	locked = true;

	START = null;
	END = null;

	// init and construct grid matrix
	for (let x = 0; x < BOARD_WIDTH * GRID_SIZE; x += GRID_SIZE)
	{
		let row = [];
		for (let y = 0; y < BOARD_HEIGHT * GRID_SIZE; y += GRID_SIZE)
		{
			var cell = new Board(x, y);
			if(random([0,1,2]) == 0) cell.setWall();	// DEBUG MAZE GEN
			// cell.setWall();		//init every cell as wall
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
	
	// await primsMaze(board[0][0]);	//not working

	board[0][0].setStart();		//init start node at top left
	board[BOARD_WIDTH - 1][BOARD_HEIGHT - 1].setEnd();	//init end node at bottom right
}

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

function initGUI()
{
	BOARD_WIDTH = Math.floor((windowWidth-5) / GRID_SIZE);		//experimental
	BOARD_HEIGHT = Math.floor((windowHeight-40) / GRID_SIZE);	//experimental

	select = createSelect();
	select.position(5, 10);

	select.option("Select an algorithm", 'null');
	// select.option('A* Algorithm', 'astar');
	select.option('Depth First Search', 'dfs');
	select.option('Bredth First Search', 'bfs');
	// select.option("Dijkstra's Algorithm", 'dijkstra');
	// select.option('Greedy Bredth First Search', 'greedybfs');

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

function dragNode()
{
	if (x_curr >= 0 && x_curr < BOARD_WIDTH && y_curr >= 0 && y_curr < BOARD_HEIGHT) //checking if within boundary
	{
		if (mouseLock && (x_curr != x_last || y_curr != y_last)) //mouse locked and not at same pos
		{
			if (heldCell != null) 
			{
				if (board[x_last][y_last].isStart() || board[x_last][y_last].isEnd() || board[x_last][y_last].isWall()) 
				{
					// if (board[x_curr][y_curr].isWall()) 	//experimental
					{
						// if (board[x_curr][y_curr].isStart() && heldNode == 'end') { } //MIRACLE CODE
						// else if (board[x_curr][y_curr].isEnd() && heldNode == 'start') { } //MIRACLE CODE
						// else 
						// {
						// 	if(heldCell == 'start')
						// 	{
						// 		board[x_curr][y_curr].setStart();
						// 	}
						// 	else
						// 	{
						// 		board[x_curr][y_curr].setEnd();
						// 	}
						// 	board[x_last][y_last].setClear();
						// }
					}
					// else
					{
						if (board[x_curr][y_curr].isStart() && heldNode == 'magic') { } 		//MIRACLE CODE
						else if (board[x_curr][y_curr].isEnd() && heldNode == 'magic') { } 		//MIRACLE CODE
						else if(board[x_curr][y_curr].isWall() && heldNode == 'magic'){ }	//MIRACLE CODE
						else
						{
							if(heldCell == 'start')
							{
								board[x_curr][y_curr].setStart();
							}
							else
							{
								board[x_curr][y_curr].setEnd();
							}
							// if(board[x_last][y_last].isStart() || board[x_last][y_last].isEnd()) board[x_last][y_last].setClear();
							board[x_last][y_last].setClear();
						}
					}
				}
			}
		}
	}
	else
	{
		heldCell = null;
	}
}

function releaseNode() 
{
	if (x_curr >= 0 && x_curr < BOARD_WIDTH && y_curr >= 0 && y_curr < BOARD_HEIGHT) //checking if within boundary
	{
		mouseLock = false;
		heldCell = null;
	}
}

function handleInput()
{
	if(!running)
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
}

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

function clearBoard()
{
	for (let x = 0; x < board.length; x++) 
	{
		for (let y = 0; y < board[x].length; y++) 
		{
			//if wall, start or end, do nothing; else clear canvas
			if (board[x][y].isWall() || board[x][y].isStart() || board[x][y].isEnd()) { }
			else board[x][y].setClear();
		}
	}
}
//#endregion

//#region UI Control funcs
async function run()
{
	if(!running)
	{
		found = false;
		print('algo:',select.value());

		clearBoard();
		running = true;

		if(select.value() == 'dfs')
		{
			await dfs(START);
		}
		else if(select.value() == 'bfs')
		{
			await bfs();
		}
		START.setStart();	//resetting start pos
		running = false;
		found = false;	//resetting found; keep at bottom of run()
	}
}

function reset()
{
	if(!running)
	{
		setup();
	}
}
//#endregion