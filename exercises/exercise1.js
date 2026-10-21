/* 
	Exercise 1 Description: Follow movements and line up items.
*/

let currentOutline = null;

function setup() {
	const gameWidth = document.body.offsetWidth;
	const gameHeight = document.body.offsetHeight;

	createCanvas(gameWidth, gameHeight);

	background(220);

	currentOutline = {
		type: "circle",
		diameter: 100,
		x: gameWidth/2,
		y: gameHeight/2,
		userPoints: []
	};
}

function draw() {
	// background(220);
}

let lastMouseX = 0;
let lastMouseY = 0;

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

function handlePointerDown() {
	console.log("mouse pressed");
	lastMouseX = null;
	lastMouseY = null;
}

function handlePointerDrag() {
	console.table({lastMouseX,lastMouseY})
	if (
		currentOutline &&
		lastMouseX !== null &&
		lastMouseY !== null
	) {
		line(lastMouseX, lastMouseY, mouseX, mouseY);
		currentOutline.userPoints.push(mouseX, mouseY);
	}

	lastMouseX = mouseX;
	lastMouseY = mouseY;
}

function handlePointerUp() {
	console.log("mouse released");
	lastMouseX = null;
	lastMouseY = null;
}