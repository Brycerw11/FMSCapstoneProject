/* 
	Exercise 1 Description: Follow movements and line up items.
*/

// the diameter within which the user can continue drawing if they accidentally lift their mouse (and the line will trail from last drawn point)
const drawingToleranceR = 40;

let currentOutlineTarget = null;

function setup() {
	const gameWidth = document.body.offsetWidth;
	const gameHeight = document.body.offsetHeight;

	createCanvas(gameWidth, gameHeight);

	background(220);

	currentOutlineTarget = {
		type: "circle",
		diameter: 250,
		x: gameWidth/2,
		y: gameHeight/2,
		userPoints: []
	};
}

function draw() {
	background(220);

	if (currentOutlineTarget) {
		drawTargetShape();
		drawUserOutline();
	}
}

let drawing = false;

function mousePressed() {
	handlePointerDown();
}

function touchStarted() {
	handlePointerDown();
}

function mouseDragged() {
	handlePointerDrag();
}

function mouseReleased() {
	handlePointerUp();
}

function touchEnded() {
	handlePointerUp();
}

function getLastDrawnPoint() {
	if (!currentOutlineTarget) return null;
	const userPoints = currentOutlineTarget.userPoints;
	if (userPoints.length >= 1)
		return userPoints[userPoints.length-1];
	else
		return null;
}

function handlePointerDown() {
	console.log("mouse pressed");
	
	// if (currentOutlineTarget) drawing = true;

	const lastDrawingPoint = getLastDrawnPoint();
	const userDidStartDrawing = !!lastDrawingPoint;
	
	if (
		userDidStartDrawing &&
		dist(
			lastDrawingPoint.x,
			lastDrawingPoint.y,
			mouseX,
			mouseY
		) > drawingToleranceR
	) {
		drawing = false;
	} else {
		drawing = true;
	}
}

function handlePointerDrag() {
	if (drawing) {
		// const lastDrawnPoint = getLastDrawnPoint();
		// if (lastDrawnPoint) line(lastDrawnPoint.x, lastDrawnPoint.y, mouseX, mouseY);
		currentOutlineTarget.userPoints.push({ x: mouseX, y: mouseY });
	}
}

function handlePointerUp() {
	console.log("mouse released");
}

function drawTargetShape() {
	// TODO: make this a dotted stroke
	stroke(0);
	strokeWeight(1);
	noFill();

	if (currentOutlineTarget.type === "circle") {
		circle(
			currentOutlineTarget.x,
			currentOutlineTarget.y,
			currentOutlineTarget.diameter
		);
	}
}

function drawUserOutline() {
	const userPoints = currentOutlineTarget.userPoints;
	strokeWeight(4);
	stroke(0);
	for (let i = 1; i < userPoints.length; i++) {
		const fromPoint = userPoints[i-1];
		const toPoint = userPoints[i];
		line(fromPoint.x, fromPoint.y, toPoint.x, toPoint.y);
		// TODO: green glowing trail
	}

	const lastDrawnPoint = getLastDrawnPoint();
	if (lastDrawnPoint) {
		noStroke();
		fill(0, 255, 0, 128);
		circle(lastDrawnPoint.x, lastDrawnPoint.y, drawingToleranceR*0.8);
	}
}