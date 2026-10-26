/* 
	Exercise 4 Description: 
		A game where the user tries to press and hold on as many shapes as possible
*/

// #region game canvas setup
let gameWidth = window.innerWidth;
let gameHeight = window.innerHeight;

var gameCanvasHTML;

window.addEventListener("resize", function(){
	gameWidth = window.innerWidth;
	gameHeight = window.innerHeight;

	gameCanvasHTML.style.width = gameWidth + "px";
	gameCanvasHTML.style.height = gameHeight + "px";
})

function setup() {
	createCanvas(gameWidth, gameHeight);

	gameCanvasHTML = document.getElementById("defaultCanvas0");

	generateShapeList(3, 150);
}

// #endregion


// #region Game Loop
let shapeList = [];

function generateShapeList(numShapes, sizeInPx){
	// Reset shape list
	shapeList = [];

	// Check to see if a new shape intersects with any existing shapes
	function checkIntersections(xPos, yPos){
		// false means there is no intersection
		// true means there is an intersection
		if(shapeList.length == 0){
			return false;
		}

		// Loop through each shape to check for intersections
		for(let shape of shapeList){
			// Check for intersection with the shape by finding the distance between their centers squared
			// and checking to see whether is is less than the sum of the radii squared
			let distanceSquared = ((xPos - shape.x) * (xPos - shape.x)) + ((yPos - shape.y) * (yPos - shape.y));
			let radiiSum = (shape.size + sizeInPx) / 2;

			if(distanceSquared <= radiiSum * radiiSum){
				return true;
			}
		}

		return false;
	}


	for(let i = 0; i < numShapes; i++){
		// Determine properties for this shape
		let shapeClass = "circle";

		// Find a position that does not intersect with other shapes
		var xPos;
		var yPos;
		let iterations = 0;

		do{
			// Find an xPos within the range: [sizeInPx, gameWidth - sizeInPx]
			xPos = sizeInPx + ((gameWidth -  2 * sizeInPx) * Math.random());
			// Find a yPos within the range: [sizeInPx, gameHeight - sizeInPx]
			yPos = sizeInPx + ((gameHeight -  2 * sizeInPx) * Math.random());

			iterations++;

			// If we cannot find a shape that doesn't intersect, make the shapes smaller and try again
			if(iterations > 20){
				// If the shapes would be too smaller after making smaller just don't add any more shapes
				if(sizeInPx - 50 < 25){
					return;
				}
				
				generateShapeList(numShapes, sizeInPx - 50);
				return;
			}
		}
		while(checkIntersections(xPos, yPos))

		// Find a value between 0 and 360 degrees to rotate the shape by 
		let shapeRotation = Number( (360 * Math.random()).toFixed(2) );

		// Add this shape to the list
		shapeList.push({
			class: shapeClass,
			x: xPos,
			y: yPos,
			size: sizeInPx,
			rotation: shapeRotation,
		});
	}
}

function drawShapeList(){
	// draw each shape
	for(const shape of shapeList){
		// Each shape class has its own drawing method
		fill("#FFFFFF");
		stroke("#000000");
		strokeWeight(3);

		switch(shape.class){
			case "circle":
				circle(shape.x, shape.y, shape.size);
				break;
			default:
				console.log("Unknown shape class; cannot draw shape");
				break;
		}
	}
}

function draw() {
	background(220);
	drawShapeList();
}
// #endregion


// #region Helper functions
function percentToPx(percentNum){

}

// #endregion
