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
		const targetShapeAlpha = (
			currentOutlineTarget.closedAt ?
			Math.max(1-((Date.now()-currentOutlineTarget.closedAt)/50)) :
			1
		);
		if (targetShapeAlpha > 0) drawTargetShape(targetShapeAlpha);
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

	if (!currentOutlineTarget.closedAt) {
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
}

function handlePointerDrag() {
	if (drawing && !currentOutlineTarget.closedAt) {
		// const lastDrawnPoint = getLastDrawnPoint();
		// if (lastDrawnPoint) line(lastDrawnPoint.x, lastDrawnPoint.y, mouseX, mouseY);
		currentOutlineTarget.userPoints.push({ x: mouseX, y: mouseY });
	
		const firstPoint = currentOutlineTarget.userPoints[0];
		
		const distance = dist(
			firstPoint.x,
			firstPoint.y,
			mouseX,
			mouseY
		);

		if (
			distance <= drawingToleranceR*0.8 &&
			!currentOutlineTarget.almostClosedAt
			// currentOutlineTarget.userPoints.length > 50
		) {
			currentOutlineTarget.almostClosedAt = Date.now();
		} else if (distance > (drawingToleranceR)) {
			currentOutlineTarget.almostClosedAt = null;
		}
	}
}

function handlePointerUp() {
	console.log("mouse released");

	if (!currentOutlineTarget.closedAt) {
		console.log(currentOutlineTarget.almostClosedAt)

		if (currentOutlineTarget.almostClosedAt) {
			currentOutlineTarget.closedAt = Date.now();
		}
	}
}

function drawTargetShape(alpha) {
	console.log(alpha);
	stroke(0, 0, 0, alpha*255);
	strokeWeight(1);
	drawingContext.setLineDash([10, 15]);
	noFill();

	if (currentOutlineTarget.type === "circle") {
		circle(
			currentOutlineTarget.x,
			currentOutlineTarget.y,
			currentOutlineTarget.diameter
		);
	}

	drawingContext.setLineDash([]);
}

function drawUserOutline() {
	const userPoints = currentOutlineTarget.userPoints;
	strokeWeight(4);
	stroke(0);
	console.log("draw outline");
	console.log(currentOutlineTarget.closedAt);
	if (currentOutlineTarget.almostClosedAt) {
		fill(0, 255, 0, Math.min(30, (Date.now()-currentOutlineTarget.almostClosedAt)/3));
	}
	if (currentOutlineTarget.closedAt) {
		console.log("other")
		fill(0, 255, 0, 30+Math.min(60, (Date.now()-currentOutlineTarget.closedAt)/3));
	}
	beginShape();
	for (let i = 0; i < userPoints.length; i++) {
		// const fromPoint = userPoints[i-1];
		// const toPoint = userPoints[i];
		const point = userPoints[i];
		// line(fromPoint.x, fromPoint.y, toPoint.x, toPoint.y);
		// TODO: green glowing trail
		vertex(point.x, point.y);
		// vertex(300, 400);
		// vertex(200, 400);
	}
	// endShape(CLOSE);
	endShape();

	if (!currentOutlineTarget.closedAt) {
		const lastDrawnPoint = getLastDrawnPoint();
		if (lastDrawnPoint) {
			noStroke();
			fill(0, 255, 0, 128);
			circle(lastDrawnPoint.x, lastDrawnPoint.y, drawingToleranceR*0.8);
		}
	}
}