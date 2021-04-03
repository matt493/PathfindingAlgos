function setup() {
	createCanvas(displayWidth, displayHeight);
}

function draw() {
	if (mouseIsPressed) {
		background(255,0,0);
	}
	else {
		background(0,0,255);
	}
}
